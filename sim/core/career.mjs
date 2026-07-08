// sim/core/career.mjs
// 生涯模擬（Phase 3）：從零帳號連續打多局，局間購買靈魂升級、
// 自適應選擇契約層數、通關後依人格決定是否進無限塔。
// 用來精算：局外成長節奏（全解鎖要幾局）、契約階梯難度、無限塔深度。

import { SOUL_UPGRADE_DB, SOUL_UPGRADE_BY_ID } from './adapter.mjs';
import { simulateRunWithState, makeCollection } from './run.mjs';

// 各人格的靈魂升級購買優先序（前面的先買滿才買後面）
const UPGRADE_PRIORITY = {
    // 新手：衝動購物，哪個便宜買哪個（動態處理）
    novice: null,
    casual: ['hp', 'rerolls', 'startRelic', 'finalDamage', 'firstCheapest'],
    veteran: ['rerolls', 'hp', 'startRelic', 'finalDamage', 'relicSense', 'shopReconsider', 'omenEye', 'fateSelection', 'fusionCompass', 'mythicVessel', 'blankLedger', 'soulBurst'],
    gambler: ['soulBurst', 'finalDamage', 'rerolls', 'hp', 'relicSense', 'startRelic', 'mythicVessel', 'fusionCompass', 'shopReconsider', 'fateSelection', 'omenEye', 'blankLedger'],
    theorist: ['rerolls', 'hp', 'startRelic', 'finalDamage', 'relicSense', 'shopReconsider', 'omenEye', 'fateSelection', 'fusionCompass', 'mythicVessel', 'blankLedger', 'soulBurst']
};

// 通關後進無限塔的意願
const INFINITE_POLICY = {
    novice: (player) => false,                       // 不敢
    casual: (player, meta, rng) => rng.chance(0.5),  // 一半一半
    veteran: (player) => player.hp >= 2,             // 有餘裕就刷靈魂
    gambler: () => true,                             // 永遠上
    theorist: (player) => player.hp >= 2
};

function canBuy(metaData, id) {
    const def = SOUL_UPGRADE_BY_ID[id];
    const level = metaData.upgrades[id] || 0;
    if (level >= def.max) return false;
    // 命運鑑選需要先有初始裝備（ui.js:2484）
    if (id === 'fateSelection' && (metaData.upgrades.startRelic || 0) < 1) return false;
    const cost = def.costs[level];
    return metaData.souls >= cost;
}

function buy(metaData, id) {
    const def = SOUL_UPGRADE_BY_ID[id];
    const level = metaData.upgrades[id] || 0;
    metaData.souls -= def.costs[level];
    metaData.upgrades[id] = level + 1;
    return def.costs[level];
}

// 局間購物：依人格優先序把買得起的都買掉，回傳本次花費
function shopUpgrades(personaName, metaData) {
    let spent = 0;
    const priority = UPGRADE_PRIORITY[personaName];
    let guard = 0;
    while (guard++ < 100) {
        let target = null;
        if (priority === null) {
            // 新手：全體升級中挑「下一級最便宜」的
            let cheapest = Infinity;
            for (const def of SOUL_UPGRADE_DB) {
                if (!canBuy(metaData, def.id)) continue;
                const cost = def.costs[metaData.upgrades[def.id] || 0];
                if (cost < cheapest) { cheapest = cost; target = def.id; }
            }
        } else {
            for (const id of priority) {
                if (id === 'firstCheapest') {
                    for (const def of SOUL_UPGRADE_DB) {
                        if (canBuy(metaData, def.id)) { target = def.id; break; }
                    }
                } else if (canBuy(metaData, id)) {
                    target = id;
                }
                if (target) break;
                // 尚未買滿但買不起最優先項時：存錢，不亂花（老手/理論派紀律）
                const def = SOUL_UPGRADE_BY_ID[id];
                if (def && (metaData.upgrades[id] || 0) < def.max
                    && !(id === 'fateSelection' && (metaData.upgrades.startRelic || 0) < 1)) {
                    break;
                }
            }
        }
        if (!target) break;
        spent += buy(metaData, target);
    }
    return spent;
}

// 契約層數選擇：自適應（贏了敢加、輸了退縮）；賭徒永遠拉滿
function chooseContract(personaName, metaData, lastContract, lastWin, rng) {
    const limit = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.soulBurst.max, metaData.upgrades.soulBurst || 0));
    if (limit === 0) return 0;
    if (personaName === 'gambler') return limit;
    if (personaName === 'novice') return 0;
    let next = lastContract + (lastWin ? 1 : -1);
    if (personaName === 'casual' && !lastWin) next = Math.max(0, lastContract - 2); // 休閒玩家輸了會大幅退縮
    return Math.max(0, Math.min(limit, next));
}

const TOTAL_UPGRADE_COST = SOUL_UPGRADE_DB.reduce((sum, u) => sum + u.costs.reduce((a, b) => a + b, 0), 0);

function allUnlocked(metaData) {
    return SOUL_UPGRADE_DB.every(def => (metaData.upgrades[def.id] || 0) >= def.max);
}

// 跑一條生涯：回傳每局紀錄與摘要
export function simulateCareer({ seed, persona, maxRuns = 150, infiniteFloorCap = 60, careerRng }) {
    const metaData = {
        souls: 0,
        upgrades: {
            hp: 0, rerolls: 0, startRelic: 0, fateSelection: 0, finalDamage: 0,
            soulBurst: 0, relicSense: 0, mythicVessel: 0, fusionCompass: 0,
            shopReconsider: 0, omenEye: 0, blankLedger: 0
        }
    };
    const collection = makeCollection('zero'); // 跨局累積（牌型解鎖影響引擎 env）

    const rows = [];
    let lastContract = 0;
    let lastWin = false;
    let unlockAllAtRun = null;

    for (let runIdx = 0; runIdx < maxRuns; runIdx++) {
        const contractLevel = chooseContract(persona.name, metaData, lastContract, lastWin, careerRng);
        const log = simulateRunWithState({
            seedKey: `${seed}:run${runIdx}`,
            persona, metaData, collection,
            contractLevel,
            enterInfinite: (player, meta) => INFINITE_POLICY[persona.name](player, meta, careerRng),
            infiniteFloorCap
        });

        const spent = shopUpgrades(persona.name, metaData);
        const upgradesOwned = SOUL_UPGRADE_DB.reduce((sum, def) => sum + (metaData.upgrades[def.id] || 0), 0);

        rows.push({
            persona: persona.name, run: runIdx + 1,
            contractLevel: log.contractLevel,
            win: log.win ? 1 : 0,
            diedAtStage: log.diedAtStage === null ? '' : log.diedAtStage + 1,
            infiniteFloor: log.infiniteFloor,
            soulsEarned: log.soulsEarned,
            spentThisRun: spent,
            soulsBalance: metaData.souls,
            upgradesOwnedLevels: upgradesOwned,
            highestDamage: log.highestDamage
        });

        lastContract = log.contractLevel;
        lastWin = log.win;

        if (unlockAllAtRun === null && allUnlocked(metaData)) {
            unlockAllAtRun = runIdx + 1;
            break; // 全解鎖即結束這條生涯（節奏已量到）
        }
    }

    const wins = rows.filter(r => r.win).length;
    return {
        rows,
        summary: {
            persona: persona.name,
            runsPlayed: rows.length,
            unlockAllAtRun: unlockAllAtRun ?? '',
            totalUpgradeCost: TOTAL_UPGRADE_COST,
            winRate: wins / rows.length,
            winRateFirst10: rows.slice(0, 10).filter(r => r.win).length / Math.min(10, rows.length),
            maxInfiniteFloor: Math.max(0, ...rows.map(r => r.infiniteFloor)),
            avgContract: rows.reduce((s, r) => s + r.contractLevel, 0) / rows.length,
            maxContract: Math.max(0, ...rows.map(r => r.contractLevel))
        }
    };
}
