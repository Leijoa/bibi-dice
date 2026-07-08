// sim/core/run.mjs
// 一整局（本篇 1~10 關）的無頭模擬：開局設定 → 關卡載入（枷鎖）→ 戰鬥 →
// 擊殺獎勵（靈魂/掉落）→ 商店 → 下一關 → 通關/死亡。
// 流程移植自 js/main.js（註記來源行號）。

import { RELIC_DB, ENEMY_DB, SOUL_UPGRADE_BY_ID, isElite, isBoss } from './adapter.mjs';
import {
    getEnemyWithMeta, getStarterRelicPool, getActiveFusionMaterials,
    getWeightedRandomRelics, getRelicRarityWeights, assignShackleForStage, getMaxHp
} from './rules.mjs';
import { simulateBattle } from './battle.mjs';
import { runShop, checkRelicFusion } from './shop.mjs';
import { createRng, hashSeed } from './rng.mjs';

// 局外升級的兩組基準帳號（Phase 1 報表用；契約皆 0，契約階梯屬 Phase 3）
export const COHORTS = {
    zero: {
        hp: 0, rerolls: 0, startRelic: 0, fateSelection: 0, finalDamage: 0,
        soulBurst: 0, relicSense: 0, mythicVessel: 0, fusionCompass: 0,
        shopReconsider: 0, omenEye: 0, blankLedger: 0
    },
    full: {
        hp: 2, rerolls: 2, startRelic: 1, fateSelection: 1, finalDamage: 5,
        soulBurst: 10, relicSense: 3, mythicVessel: 4, fusionCompass: 3,
        shopReconsider: 1, omenEye: 1, blankLedger: 2
    }
};

function makeCollection(cohortName) {
    // 收集冊影響引擎 env.unlockedHands 與遺物封存資格。
    // zero＝新帳號空冊；full＝老手視為全牌型已解鎖。
    const hands = new Set();
    if (cohortName === 'full') {
        // RULE_DB 共 39 個牌型 id，直接以數量近似（引擎只吃 unlockedHands 數字）
        for (let i = 0; i < 39; i++) hands.add(`known_${i}`);
    }
    return { hands, relics: new Set(), shackles: new Set() };
}

// main.js:2895-3008 enemyDefeated（去 UI/成就；回傳 earnedSouls 與掉落）
function handleEnemyDefeated(ctx, runLog, stageRec) {
    const { player, stage, metaData, rng, collection } = ctx;

    // 戰鬥型消耗品戰後清除（main.js:2896-2899）
    ['cons_strike_a', 'cons_fever_b', 'cons_combo_c', 'cons_science_d', 'cons_bomb', 'cons_loaded_dice'].forEach(consId => {
        const idx = player.relics.indexOf(consId);
        if (idx !== -1) player.relics.splice(idx, 1);
    });

    // 急救包：每 3 關觸發（main.js:2901-2905）
    if (player.relics.includes('firstaid') && (stage.level + 1) % 3 === 0 && player.hp < getMaxHp(metaData.upgrades, player)) {
        player.hp++;
    }

    // 枯萎解除後恢復原 HP（main.js:2907-2909）
    if (stage.activeShackle === 'wither' && stage.shackleMeta && stage.shackleMeta.originalHp) {
        player.hp = stage.shackleMeta.originalHp;
    }

    const getAvailableForDrop = () => RELIC_DB.filter(r =>
        !player.relics.includes(r.id) && r.rarity !== 5 && !getActiveFusionMaterials(player).includes(r.id));

    let availableForDrop = getAvailableForDrop();
    const isEliteOrBossDrop = isElite(stage.level) || isBoss(stage.level);
    const burstLevel = player.contractLevel || 0;
    let earnedSouls = 0;

    if (isEliteOrBossDrop && availableForDrop.length > 0) {
        // 菁英/Boss 掉落（main.js:2934-2941）
        const dropWeights = getRelicRarityWeights(metaData.upgrades, { 1: 20, 2: 40, 3: 30, 4: 10 });
        const randomRelic = getWeightedRandomRelics(rng, availableForDrop, 1, dropWeights)[0];
        player.relics.push(randomRelic.id);
        collection.relics.add(randomRelic.id);
        stageRec.drop = randomRelic.id;
        runLog.relicsDropped.push(randomRelic.id);
        checkRelicFusion(ctx);

        // 靈魂（main.js:2958-2963）
        earnedSouls = isBoss(stage.level) && !player.isInfiniteMode ? 2 : 1;
        if (player.isInfiniteMode || stage.level >= ENEMY_DB.length) earnedSouls = 1;
        earnedSouls += burstLevel * SOUL_UPGRADE_BY_ID.soulBurst.soulBonusPerLevel;
    } else {
        // 無掉落分支（main.js:2973-3005）：一般關 0 靈魂，但契約 >0 時仍給契約加成
        if (isBoss(stage.level) && !player.isInfiniteMode) earnedSouls = 2;
        else if (player.isInfiniteMode || stage.level >= ENEMY_DB.length) earnedSouls = 1;
        else if (isElite(stage.level)) earnedSouls = 1;
        if (earnedSouls > 0 || burstLevel > 0) {
            earnedSouls += burstLevel * SOUL_UPGRADE_BY_ID.soulBurst.soulBonusPerLevel;
        }
    }

    metaData.souls += earnedSouls;
    runLog.soulsEarned += earnedSouls;
    stageRec.souls = earnedSouls;
}

// main.js:1939-2024 loadStage 的規則段（枷鎖指派 / 破壞鉗 / 時間壓縮 / 枯萎 / 藥劑 buff）
function loadStage(ctx, levelIndex) {
    const { player, rng } = ctx;
    const enemy = getEnemyWithMeta(levelIndex, player.contractLevel);
    const stage = {
        level: levelIndex,
        enemyMaxHp: enemy.hp,
        enemyHp: enemy.hp,
        turnsLeft: enemy.turns,
        activeShackle: null,
        shackleMeta: null,
        hasAttackedThisStage: false,
        damageBuffMulti: 1.0
    };

    const forecastId = player.shackleForecast && player.shackleForecast.level === levelIndex
        ? player.shackleForecast.id : null;
    const assignment = assignShackleForStage(rng, levelIndex, player, forecastId);
    stage.activeShackle = assignment.id;
    stage.shackleMeta = assignment.meta;
    if (forecastId) player.shackleForecast = null;

    // 力量藥劑等「下場戰鬥」buff 消耗（main.js:1992-1993）
    stage.damageBuffMulti = player.nextDamageMulti || 1.0;
    player.nextDamageMulti = 1.0;

    // 重型破壞鉗：直接拆掉本關枷鎖（main.js:1995-2000）
    if (stage.activeShackle && player.relics.includes('cons_pliers')) {
        stage.activeShackle = null;
        stage.shackleMeta = null;
        player.relics.splice(player.relics.indexOf('cons_pliers'), 1);
    }

    if (stage.activeShackle === 'timecompress') stage.turnsLeft = 2;
    if (stage.activeShackle === 'wither') player.hp = 1; // main.js:2006-2008

    if (stage.activeShackle) ctx.collection.shackles.add(stage.activeShackle);
    return stage;
}

// main.js:1798-1830 initNewGame ＋ 1747-1776 命運鑑選
function initPlayer(ctx, contractLevel = 0) {
    const { metaData, rng, persona } = ctx;
    const contractLimit = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.soulBurst.max, Number(metaData.upgrades.soulBurst) || 0));
    const player = {
        hp: 3 + (metaData.upgrades.hp * 1),
        relics: [],
        maxRolls: 0,
        highestDamage: 0,
        isInfiniteMode: false,
        bonusBasePoints: 0,
        nextDamageMulti: 1.0,
        dismantledFusions: [],
        fivesRolled: 0,
        sealedRelics: [], // 不封存（封存策略影響極小，維持簡化）
        shackleForecast: null,
        contractLevel: Math.max(0, Math.min(contractLimit, contractLevel)), // main.js:1802
        berserkerBonus: 0
    };

    if (metaData.upgrades.startRelic > 0) {
        const pool = getStarterRelicPool(player.sealedRelics);
        if (pool.length > 0) {
            let picked;
            if (metaData.upgrades.fateSelection > 0) {
                // 命運鑑選：3 選 1（main.js:1754-1766）
                const choices = rng.shuffle(pool).slice(0, SOUL_UPGRADE_BY_ID.fateSelection.choiceCount);
                const chosenId = persona.decideFate(choices.map(r => r.id), ctx.personaRng);
                picked = choices.find(r => r.id === chosenId) || choices[0];
            } else {
                picked = rng.pick(pool);
            }
            player.relics.push(picked.id);
            ctx.collection.relics.add(picked.id);
        }
    }
    return player;
}

// 跑一整局（可帶入既有 metaData/collection 供生涯模式跨局累積）。
// enterInfinite：通關後是否進無限塔的決策函式（null = 不進）。
export function simulateRunWithState({ seedKey, persona, metaData, collection, contractLevel = 0, enterInfinite = null, infiniteFloorCap = 60 }) {
    const worldRng = createRng(hashSeed(`${seedKey}:world`));
    const personaRng = createRng(hashSeed(`${seedKey}:${persona.name}`));

    const ctx = {
        rng: worldRng,
        personaRng,
        metaData,
        collection,
        persona,
        player: null,
        stage: null,
        battle: null
    };

    const runLog = {
        seed: seedKey, persona: persona.name, cohort: '',
        win: false, diedAtStage: null,
        infiniteFloor: 0, // 無限塔擊破的最高樓層（0 = 未進塔或一層未破）
        contractLevel: 0,
        soulsEarned: 0,
        stages: [],
        relicsOffered: [], relicsPicked: [], relicsDropped: [],
        relicsEnd: [],
        highestDamage: 0
    };

    ctx.player = initPlayer(ctx, contractLevel);
    runLog.contractLevel = ctx.player.contractLevel;

    // --- 本篇 1~10 關 ---
    for (let level = 0; level < ENEMY_DB.length; level++) {
        ctx.stage = loadStage(ctx, level);
        const rec = simulateBattle(ctx);
        rec.hpEnd = ctx.player.hp;
        runLog.stages.push(rec);

        if (rec.outcome === 'died') {
            runLog.diedAtStage = level;
            break;
        }

        handleEnemyDefeated(ctx, runLog, rec);

        if (isBoss(level)) {
            // 最終 Boss 擊破 → 通關（main.js:2946-2948）
            runLog.win = true;
            break;
        }

        runShop(ctx, runLog);
    }

    // --- 無限塔（main.js:1413-1424：通關後由玩家選擇進塔，先開商店再上樓）---
    if (runLog.win && enterInfinite && enterInfinite(ctx.player, metaData)) {
        ctx.player.isInfiniteMode = true;
        runShop(ctx, runLog);
        for (let level = ENEMY_DB.length; level < ENEMY_DB.length + infiniteFloorCap; level++) {
            ctx.stage = loadStage(ctx, level);
            const rec = simulateBattle(ctx);
            rec.hpEnd = ctx.player.hp;
            runLog.stages.push(rec);
            if (rec.outcome === 'died') break;
            runLog.infiniteFloor = level - ENEMY_DB.length + 1;
            handleEnemyDefeated(ctx, runLog, rec);
            runShop(ctx, runLog);
        }
    }

    runLog.relicsEnd = [...ctx.player.relics];
    runLog.highestDamage = ctx.player.highestDamage;
    return runLog;
}

// Phase 1 相容介面：固定局外帳號（zero/full）、契約 0、不進無限塔
export function simulateRun({ seed, persona, cohortName }) {
    const metaData = { souls: 0, upgrades: { ...COHORTS[cohortName] } };
    const collection = makeCollection(cohortName);
    const runLog = simulateRunWithState({ seedKey: seed, persona, metaData, collection });
    runLog.cohort = cohortName;
    return runLog;
}

export { makeCollection };
