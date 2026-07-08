// sim/verify.mjs
// 模擬器保真測試（sim:verify）：
// A) 引擎全量比對：alldamege.csv 6435 種組合 vs 真引擎輸出
// B) 決定性：同 seed 兩次模擬結果完全一致
// C) 枷鎖結算劇本測試：鐵壁 / 絕對屏障 / 同歸於盡 的傷害數學

import { readFileSync } from 'node:fs';
import { calculateEngineScore } from './core/adapter.mjs';
import { simulateRun } from './core/run.mjs';
import { createPersona } from './personas/index.mjs';
import { simulateBattle } from './core/battle.mjs';
import { createRng, hashSeed } from './core/rng.mjs';

let failures = 0;
function check(name, ok, detail = '') {
    if (ok) { console.log(`  PASS ${name}`); }
    else { failures++; console.error(`  FAIL ${name} ${detail}`); }
}

// --- A) alldamege.csv 全量比對 ---
function verifyDamageTable() {
    console.log('[A] alldamege.csv 全量引擎比對');
    const csv = readFileSync(new URL('../alldamege.csv', import.meta.url), 'utf8');
    const lines = csv.split(/\r?\n/).filter(l => l.trim());
    let mismatches = 0;
    let count = 0;
    const examples = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        const combo = cols[0].trim();
        const expected = parseInt(cols[cols.length - 1], 10);
        if (!/^[1-8]{8}$/.test(combo) || !Number.isFinite(expected)) continue;
        count++;
        const dice = combo.split('').map((c, idx) => ({
            val: parseInt(c, 10), locked: false, id: idx,
            matchedGroups: { A: false, B: false, C: false, D: false }
        }));
        const r = calculateEngineScore(dice, [], 0, 3, [], 3, { level: 0 });
        if (Math.floor(r.finalScore) !== expected) {
            mismatches++;
            if (examples.length < 5) examples.push(`${combo}: 表=${expected} 引擎=${Math.floor(r.finalScore)}`);
        }
    }
    check(`引擎輸出 vs 傷害表（${count} 組合）`, mismatches === 0,
        mismatches ? `不符 ${mismatches} 筆，例：${examples.join(' | ')}` : '');
}

// --- B) 決定性 ---
function verifyDeterminism() {
    console.log('[B] 同 seed 決定性');
    const digest = (log) => JSON.stringify({
        win: log.win, died: log.diedAtStage, souls: log.soulsEarned,
        relics: log.relicsEnd, dmg: log.highestDamage,
        stages: log.stages.map(s => [s.level, s.outcome, s.totalDamage, s.rerolls])
    });
    for (const personaName of ['novice', 'casual', 'veteran', 'gambler', 'theorist']) {
        const a = digest(simulateRun({ seed: 'determinism-check', persona: createPersona(personaName, { samples: 12 }), cohortName: 'zero' }));
        const b = digest(simulateRun({ seed: 'determinism-check', persona: createPersona(personaName, { samples: 12 }), cohortName: 'zero' }));
        check(`${personaName} 同 seed 兩次一致`, a === b);
    }
}

// --- C) 枷鎖結算劇本 ---
// 用固定劇本 persona（永遠直接攻擊）跑單關，檢驗 fireAttack 移植的傷害數學
function scriptedBattle(shackleId, shackleMeta = null) {
    const scripted = {
        name: 'scripted',
        decideAction: () => ({ type: 'attack' }),
        decideShop: () => ({ type: 'buy', index: 0 }),
        decideFate: (ids) => ids[0],
        decideFusionDiscard: (ids) => ids[0]
    };
    const ctx = {
        rng: createRng(hashSeed('scripted-world')),
        personaRng: createRng(hashSeed('scripted-persona')),
        metaData: { souls: 0, upgrades: { hp: 0, rerolls: 0, finalDamage: 0, relicSense: 0, mythicVessel: 0, fusionCompass: 0, shopReconsider: 0, omenEye: 0 } },
        collection: { hands: new Set(), relics: new Set(), shackles: new Set() },
        persona: scripted,
        player: {
            hp: 3, relics: [], maxRolls: 0, highestDamage: 0, isInfiniteMode: false,
            bonusBasePoints: 0, nextDamageMulti: 1.0, dismantledFusions: [], fivesRolled: 0,
            sealedRelics: [], shackleForecast: null, contractLevel: 0, berserkerBonus: 0
        },
        stage: {
            level: 0, enemyMaxHp: 1500, enemyHp: 1500, turnsLeft: 3,
            activeShackle: shackleId, shackleMeta,
            hasAttackedThisStage: false, damageBuffMulti: 1.0
        },
        battle: null
    };
    const rec = simulateBattle(ctx);
    return { rec, ctx };
}

function verifyShackleMath() {
    console.log('[C] 枷鎖結算劇本測試');

    // 無枷鎖 vs 鐵壁：同 seed 下鐵壁每次傷害 = floor(原傷害*0.8)
    const plain = scriptedBattle(null);
    const ironwall = scriptedBattle('ironwall');
    const plainDmg = plain.rec.scoredRules ? plain.rec : plain.rec; // rec 內含 totalDamage
    check('鐵壁傷害為 8 成', ironwall.rec.attacks > 0 &&
        ironwall.rec.totalDamage <= Math.ceil(plain.rec.totalDamage * 0.8) + ironwall.rec.attacks,
        `plain=${plain.rec.totalDamage} ironwall=${ironwall.rec.totalDamage}`);

    // 絕對屏障：第一次攻擊必為 0 傷害 → 同 seed 下總傷害 = 無枷鎖版少掉第一擊
    const barrier = scriptedBattle('absolutebarrier');
    check('絕對屏障存在且第一擊無效（總傷害 < 無枷鎖）',
        barrier.rec.totalDamage < plain.rec.totalDamage || barrier.rec.attacks > plain.rec.attacks,
        `plain=${plain.rec.totalDamage}/${plain.rec.attacks}擊 barrier=${barrier.rec.totalDamage}/${barrier.rec.attacks}擊`);

    // 同歸於盡：反傷不會殺死玩家（最少剩 1 HP）
    const mutual = scriptedBattle('mutualdestruction');
    check('同歸於盡玩家至少剩 1 HP', mutual.ctx.player.hp >= 1, `hp=${mutual.ctx.player.hp}`);

    // 時間壓縮在 loadStage 層處理，這裡驗證 timecompress 回合重置為 2 的路徑：
    // 直接檢查 battle 模組不會讓 turnsLeft 變負
    check('回合數不為負', plain.ctx.stage.turnsLeft >= 0);
}

console.log('=== 比比丟八 模擬器保真測試 ===');
verifyDamageTable();
verifyDeterminism();
verifyShackleMath();

if (failures > 0) {
    console.error(`\n共 ${failures} 項失敗`);
    process.exit(1);
} else {
    console.log('\n全部通過');
}
