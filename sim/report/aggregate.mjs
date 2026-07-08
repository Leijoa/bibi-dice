// sim/report/aggregate.mjs
// 把多局 runLog 聚合成四份報表資料：
// 1) 難度曲線與死亡熱點 2) 遺物強度榜 3) 枷鎖難度實測 4) 靈魂節奏

import { RELIC_DB, CONSUMABLES_DB, SHACKLE_DB, ENEMY_DB, SOUL_UPGRADE_DB } from '../core/adapter.mjs';

const ALL_ITEMS = [...RELIC_DB, ...CONSUMABLES_DB];

function itemName(id) {
    return ALL_ITEMS.find(x => x.id === id)?.name || id;
}

export function aggregate(runLogs) {
    const byGroup = new Map(); // persona|cohort → runs
    for (const log of runLogs) {
        const key = `${log.persona}|${log.cohort}`;
        if (!byGroup.has(key)) byGroup.set(key, []);
        byGroup.get(key).push(log);
    }

    // --- 1) 難度曲線與死亡熱點 ---
    const difficulty = [];
    for (const [key, runs] of byGroup) {
        const [persona, cohort] = key.split('|');
        for (let level = 0; level < ENEMY_DB.length; level++) {
            const reached = runs.filter(r => r.stages.some(s => s.level === level));
            if (reached.length === 0) continue;
            const recs = reached.map(r => r.stages.find(s => s.level === level));
            const cleared = recs.filter(s => s.outcome === 'cleared');
            const died = recs.filter(s => s.outcome === 'died');
            const avg = (arr, f) => arr.length ? arr.reduce((s, x) => s + f(x), 0) / arr.length : 0;
            difficulty.push({
                persona, cohort, stage: level + 1,
                enemy: ENEMY_DB[level].name,
                enemyHp: ENEMY_DB[level].hp,
                reachedRuns: reached.length,
                reachRate: reached.length / runs.length,
                clearRate: recs.length ? cleared.length / recs.length : 0,
                deaths: died.length,
                deathShare: 0, // 填在下方（該關死亡數 / 全部死亡數）
                avgHpLost: avg(recs, s => s.hpStart - (s.hpEnd ?? s.hpStart)),
                avgTurns: avg(recs, s => s.turns),
                avgRerolls: avg(recs, s => s.rerolls),
                avgAttackDamage: avg(recs.filter(s => s.attacks > 0), s => s.totalDamage / s.attacks),
                avgMaxAttack: avg(recs, s => s.maxAttack)
            });
        }
        const totalDeaths = runs.filter(r => !r.win).length || 1;
        difficulty.filter(d => d.persona === persona && d.cohort === cohort)
            .forEach(d => { d.deathShare = d.deaths / totalDeaths; });
    }

    // --- 2) 遺物強度榜（出現率/被選率/持有勝率增益）---
    const relicRows = [];
    for (const [key, runs] of byGroup) {
        const [persona, cohort] = key.split('|');
        const winRateBase = runs.filter(r => r.win).length / runs.length;
        const counter = new Map();
        const ensure = (id) => {
            if (!counter.has(id)) counter.set(id, { offered: 0, picked: 0, dropped: 0, runsWith: 0, winsWith: 0 });
            return counter.get(id);
        };
        for (const r of runs) {
            r.relicsOffered.forEach(id => { ensure(id).offered++; });
            r.relicsPicked.forEach(id => { ensure(id).picked++; });
            r.relicsDropped.forEach(id => { ensure(id).dropped++; });
            // 「持有」以局中曾取得計（含最終背包與融合前素材）
            const held = new Set([...r.relicsEnd, ...r.relicsPicked, ...r.relicsDropped]);
            for (const id of held) {
                const c = ensure(id);
                c.runsWith++;
                if (r.win) c.winsWith++;
            }
        }
        for (const [id, c] of counter) {
            if (c.offered === 0 && c.runsWith === 0) continue;
            relicRows.push({
                persona, cohort, id, name: itemName(id),
                rarity: ALL_ITEMS.find(x => x.id === id)?.rarity ?? '',
                offered: c.offered, picked: c.picked,
                pickRate: c.offered ? c.picked / c.offered : 0,
                dropped: c.dropped,
                runsWith: c.runsWith,
                winRateWith: c.runsWith ? c.winsWith / c.runsWith : 0,
                winRateBase,
                winRateDelta: c.runsWith ? (c.winsWith / c.runsWith) - winRateBase : 0
            });
        }
    }

    // --- 3) 枷鎖難度實測 ---
    const shackleRows = [];
    for (const [key, runs] of byGroup) {
        const [persona, cohort] = key.split('|');
        // 基準：同一批局中「有枷鎖關卡」的整體通過率（枷鎖只出現在 3/6/9/10 關）
        const shackleStageRecs = runs.flatMap(r => r.stages.filter(s => s.shackle));
        const baseClear = shackleStageRecs.length
            ? shackleStageRecs.filter(s => s.outcome === 'cleared').length / shackleStageRecs.length : 0;
        const byShackle = new Map();
        for (const s of shackleStageRecs) {
            if (!byShackle.has(s.shackle)) byShackle.set(s.shackle, []);
            byShackle.get(s.shackle).push(s);
        }
        for (const [id, recs] of byShackle) {
            const def = SHACKLE_DB.find(x => x.id === id);
            const cleared = recs.filter(s => s.outcome === 'cleared').length;
            const avg = (f) => recs.reduce((sum, x) => sum + f(x), 0) / recs.length;
            shackleRows.push({
                persona, cohort, id,
                name: def?.name || id,
                type: def?.type || '',
                encounters: recs.length,
                clearRate: cleared / recs.length,
                baseClearRate: baseClear,
                clearRateDelta: cleared / recs.length - baseClear,
                avgHpLost: avg(s => s.hpStart - (s.hpEnd ?? s.hpStart)),
                avgTurns: avg(s => s.turns),
                avgRerolls: avg(s => s.rerolls)
            });
        }
    }

    // --- 4) 靈魂節奏 ---
    const soulsRows = [];
    const totalUpgradeCost = SOUL_UPGRADE_DB.reduce((sum, u) => sum + u.costs.reduce((a, b) => a + b, 0), 0);
    for (const [key, runs] of byGroup) {
        const [persona, cohort] = key.split('|');
        const wins = runs.filter(r => r.win);
        const losses = runs.filter(r => !r.win);
        const avg = (arr, f) => arr.length ? arr.reduce((s, x) => s + f(x), 0) / arr.length : 0;
        const avgSouls = avg(runs, r => r.soulsEarned);
        soulsRows.push({
            persona, cohort,
            runs: runs.length,
            winRate: wins.length / runs.length,
            avgSoulsPerRun: avgSouls,
            avgSoulsWin: avg(wins, r => r.soulsEarned),
            avgSoulsLoss: avg(losses, r => r.soulsEarned),
            totalUpgradeCost,
            estRunsToUnlockAll: avgSouls > 0 ? Math.ceil(totalUpgradeCost / avgSouls) : Infinity,
            avgHighestDamage: avg(runs, r => r.highestDamage)
        });
    }

    // --- 每局摘要 ---
    const runRows = runLogs.map(r => ({
        persona: r.persona, cohort: r.cohort, seed: r.seed,
        win: r.win ? 1 : 0,
        diedAtStage: r.diedAtStage === null ? '' : r.diedAtStage + 1,
        soulsEarned: r.soulsEarned,
        highestDamage: r.highestDamage,
        relicsEnd: r.relicsEnd.join(' ')
    }));

    return { difficulty, relicRows, shackleRows, soulsRows, runRows };
}
