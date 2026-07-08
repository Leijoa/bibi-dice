// sim/core/rules.mjs
// 從 js/main.js 忠實移植的「純規則」函式（不含 DOM）。
// 每段都註記來源行號；main.js 對應邏輯改動時，這裡必須同步。

import {
    RELIC_DB, RULE_DB, ENEMY_DB, SHACKLE_DB,
    SOUL_UPGRADE_BY_ID, FUSION_RECIPES, FUSION_MATERIAL_LOOKUP,
    getEnemy
} from './adapter.mjs';

// main.js:733-741 ruleNameToId 依賴 i18n；模擬器只需中文原名比對。
// main.js:955-964 getRuleMetaByName：精確比對或「名稱(後綴)」前綴比對（如 比比丟八(ビビデバ)）
export function getRuleMetaByName(name) {
    if (typeof name !== 'string' || !name || name === '無') return null;
    for (const group of Object.values(RULE_DB)) {
        const hit = group.find(rule => rule.name === name || name.startsWith(rule.name + '('));
        if (hit) return hit;
    }
    return null;
}

export function getScoredRules(scoreResult) {
    if (!scoreResult) return [];
    return [scoreResult.tagA, scoreResult.tagB, scoreResult.tagC, scoreResult.tagD]
        .filter(tag => tag && tag.name && tag.name !== '無')
        .map(tag => ({ tag, rule: getRuleMetaByName(tag.name) }));
}

// main.js:13-45 getWeightedRandomRelics（改吃注入的 rng）
export function getWeightedRandomRelics(rng, availableList, count, customWeights = null, itemWeight = null) {
    const weights = customWeights || { 1: 50, 2: 30, 3: 15, 4: 5 };
    const result = [];
    const pool = [...availableList];
    for (let i = 0; i < count; i++) {
        if (pool.length === 0) break;
        const getItemWeight = (item) => {
            const multiplier = itemWeight ? Math.max(0, Number(itemWeight(item)) || 0) : 1;
            return (weights[item.rarity] || 10) * multiplier;
        };
        const totalWeight = pool.reduce((sum, item) => sum + getItemWeight(item), 0);
        const rand = rng.next() * totalWeight;
        let cumulative = 0;
        let selectedIdx = -1;
        for (let j = 0; j < pool.length; j++) {
            cumulative += getItemWeight(pool[j]);
            if (rand <= cumulative) { selectedIdx = j; break; }
        }
        if (selectedIdx !== -1) {
            result.push(pool[selectedIdx]);
            pool.splice(selectedIdx, 1);
        }
    }
    return result;
}

// main.js:2743-2753 遺珍感應影響稀有度權重
export function getRelicRarityWeights(upgrades, baseWeights = { 1: 50, 2: 30, 3: 15, 4: 5 }) {
    const level = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.relicSense.max, Number(upgrades.relicSense) || 0));
    const commonShift = SOUL_UPGRADE_BY_ID.relicSense.commonWeightShiftPerLevel * level;
    const higherShift = SOUL_UPGRADE_BY_ID.relicSense.higherWeightShiftPerLevel * level;
    return {
        1: Math.max(1, baseWeights[1] - commonShift),
        2: baseWeights[2] + higherShift,
        3: baseWeights[3] + higherShift,
        4: baseWeights[4] + higherShift
    };
}

// main.js:2755-2761 融合羅盤：持有素材時提升夥伴素材權重
export function getFusionCompassWeight(upgrades, player, relic) {
    const level = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.fusionCompass.max, Number(upgrades.fusionCompass) || 0));
    if (level === 0) return 1;
    const material = FUSION_MATERIAL_LOOKUP[relic.id];
    if (!material || !player.relics.includes(material.mat) || player.dismantledFusions.includes(material.fid)) return 1;
    return SOUL_UPGRADE_BY_ID.fusionCompass.partnerWeightMultipliers[level - 1];
}

// main.js:2763-2766 神話遺物上限
export function getMythicRelicLimit(upgrades) {
    const level = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.mythicVessel.max, Number(upgrades.mythicVessel) || 0));
    return 2 + (level * SOUL_UPGRADE_BY_ID.mythicVessel.extraLimitPerLevel);
}

// main.js:2768-2771 商店刷新上限
export function getShopRerollLimit(upgrades) {
    const level = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.shopReconsider.max, Number(upgrades.shopReconsider) || 0));
    return 1 + (level * SOUL_UPGRADE_BY_ID.shopReconsider.extraRerollsPerLevel);
}

// main.js:47-61 契約（輪迴契約）敵人 HP 加成
export function getEnemyWithMeta(levelIndex, contractLevel) {
    const baseEnemy = getEnemy(levelIndex);
    const burstLevel = contractLevel || 0;
    if (burstLevel > 0) {
        return {
            ...baseEnemy,
            hp: baseEnemy.hp * (1 + (burstLevel * SOUL_UPGRADE_BY_ID.soulBurst.hpMultiplierPerLevel))
        };
    }
    return baseEnemy;
}

// main.js:831 最大 HP（生命果實 cons_fruit 每個 +1）
export function getMaxHp(upgrades, player) {
    return 3 + ((upgrades.hp || 0) * 1) + player.relics.filter(r => r === 'cons_fruit').length;
}

// main.js:1832-1842 各關卡枷鎖型別：本篇 2/8 輕、5/9 重；無限塔 m==3 重、其餘輕
export function getShackleTypeForStage(levelIndex) {
    if (levelIndex < ENEMY_DB.length) {
        if (levelIndex === 2 || levelIndex === 8) return 'light';
        if (levelIndex === 5 || levelIndex === 9) return 'heavy';
        return null;
    }
    const infiniteLevel = levelIndex - ENEMY_DB.length + 1;
    const cycleStep = ((infiniteLevel - 1) % 3) + 1;
    return cycleStep === 3 ? 'heavy' : 'light';
}

export function getShackleCandidatesForStage(levelIndex) {
    const shackleType = getShackleTypeForStage(levelIndex);
    return shackleType ? SHACKLE_DB.filter(shackle => shackle.type === shackleType) : [];
}

// main.js:1849-1853
export function rollShackleIdForStage(rng, levelIndex) {
    const candidates = getShackleCandidatesForStage(levelIndex);
    if (candidates.length === 0) return null;
    return rng.pick(candidates).id;
}

// main.js:1855-1893 指派枷鎖與 meta（略去純視覺 meta：inversion colorMap / dizziness displayOrder）
export function assignShackleForStage(rng, levelIndex, player, forecastId = null) {
    const candidates = getShackleCandidatesForStage(levelIndex);
    const shackleType = getShackleTypeForStage(levelIndex);
    if (!shackleType) return { id: null, meta: null };

    const selected = candidates.find(shackle => shackle.id === forecastId) || rng.pick(candidates);
    let meta = null;
    if (selected.id === 'parityfear') {
        meta = { fearType: rng.next() > 0.5 ? 'odd' : 'even' };
    } else if (selected.id === 'numberplunder') {
        meta = { targetNumber: rng.die() };
    } else if (selected.id === 'illusion') {
        meta = { fakeNumber: rng.die() };
    } else if (selected.id === 'blind') {
        meta = { blindIndices: [] };
    } else if (selected.id === 'wither') {
        meta = { originalHp: player.hp };
    } else if (selected.id === 'cursedlock') {
        meta = { cursedId: null };
    } else if (selected.id === 'relicseal') {
        meta = { ignoredRelics: rng.shuffle(player.relics).slice(0, 2) };
    } else if (selected.id === 'illusionary') {
        meta = { fakeRatio: rng.next() * 0.25 + 0.05 };
    }
    return { id: selected.id, meta };
}

// main.js:1625-1633 組出傳給引擎的枷鎖設定（完整定義 + meta 展開）
export function buildShackleConfig(activeShackle, shackleMeta) {
    if (!activeShackle) return null;
    const definition = SHACKLE_DB.find(shackle => shackle.id === activeShackle);
    return { ...(definition || {}), id: activeShackle, ...(shackleMeta || {}) };
}

// main.js:1725-1728 初始遺物池（普通、price>0、未封存）
export function getStarterRelicPool(sealedRelics = []) {
    const sealed = new Set(sealedRelics);
    return RELIC_DB.filter(relic => relic.price > 0 && relic.rarity === 1 && !sealed.has(relic.id));
}

// main.js:2921-2927 目前生效融合的素材（掉落/商店都要排除）
export function getActiveFusionMaterials(player) {
    const mats = [];
    player.relics.forEach(rId => {
        if (FUSION_RECIPES[rId]) { mats.push(FUSION_RECIPES[rId].mat1, FUSION_RECIPES[rId].mat2); }
    });
    return mats;
}
