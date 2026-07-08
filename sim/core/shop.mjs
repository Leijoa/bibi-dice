// sim/core/shop.mjs
// 商店生成 / 三選一購買 / 遺物融合，移植自 js/main.js（註記來源行號）。
// 商店為「三選一免費取一件」制，無金錢系統（main.js:3142-3212 buyItem 不扣費）。

import { RELIC_DB, CONSUMABLES_DB, FUSION_RECIPES } from './adapter.mjs';
import {
    getWeightedRandomRelics, getRelicRarityWeights, getFusionCompassWeight,
    getMythicRelicLimit, getShopRerollLimit, getMaxHp,
    getActiveFusionMaterials, getShackleCandidatesForStage, rollShackleIdForStage
} from './rules.mjs';

// main.js:2785-2841 checkRelicFusion ＋ 2843-2893 triggerFusionReplace（合併為同步版）
// 神話上限爆滿時由 persona.decideFusionDiscard 決定捨棄哪件（等同遊戲中的選擇視窗）
export function checkRelicFusion(ctx) {
    const { player, collection, persona } = ctx;
    let keepChecking = true;
    let guard = 0;
    while (keepChecking) {
        if (++guard > 50) throw new Error('fusion loop stuck');
        keepChecking = false;
        for (const fid of Object.keys(FUSION_RECIPES)) {
            const rec = FUSION_RECIPES[fid];
            if (player.dismantledFusions.includes(fid)) continue;
            if (player.relics.includes(rec.mat1) && player.relics.includes(rec.mat2) && !player.relics.includes(fid)) {
                const currentRarity5 = player.relics.filter(rId => {
                    const rDef = RELIC_DB.find(x => x.id === rId);
                    return rDef && rDef.rarity === 5;
                });
                const maxMythic = getMythicRelicLimit(ctx.metaData.upgrades);

                if (currentRarity5.length >= maxMythic) {
                    // 上限爆滿：先移除素材，請 persona 在（既有神話們＋新融合）中挑一件捨棄
                    player.relics = player.relics.filter(r => r !== rec.mat1 && r !== rec.mat2);
                    const discardedId = persona.decideFusionDiscard([...currentRarity5], fid, ctx.personaRng);
                    player.dismantledFusions.push(discardedId);
                    if (discardedId === fid) {
                        // 捨棄新的：素材退回（main.js:2850-2855）
                        player.relics.push(rec.mat1, rec.mat2);
                    } else {
                        // 捨棄舊的：退回舊素材、移除舊融合、加入新融合（main.js:2856-2875）
                        const oldRec = FUSION_RECIPES[discardedId];
                        if (oldRec) player.relics.push(oldRec.mat1, oldRec.mat2);
                        player.relics = player.relics.filter(r => r !== discardedId);
                        player.relics.push(fid);
                        collection.relics.add(fid);
                    }
                    keepChecking = true;
                    break;
                }

                // 正常融合（main.js:2817-2828）
                player.relics = player.relics.filter(r => r !== rec.mat1 && r !== rec.mat2);
                player.relics.push(fid);
                collection.relics.add(fid);
                keepChecking = true;
                break;
            }
        }
    }
}

// main.js:3026-3128 rerollShop 的商品生成段（isInitial 與手動刷新共用）
export function makeShopOffer(ctx, currentItemIds = []) {
    const { player, metaData, rng } = ctx;
    const sealedRelics = new Set(player.sealedRelics || []);
    let available = RELIC_DB.filter(r => !player.relics.includes(r.id) && r.rarity !== 5 && !sealedRelics.has(r.id));

    const fusedMaterials = getActiveFusionMaterials(player);
    available = available.filter(r => !fusedMaterials.includes(r.id));

    // 夠多替代品時排除「上一輪已顯示」的商品（main.js:3076-3079）
    const nonDuplicateAvailable = available.filter(r => !currentItemIds.includes(r.id));
    if (nonDuplicateAvailable.length >= 3 || nonDuplicateAvailable.length > available.length / 2) {
        available = nonDuplicateAvailable;
    }

    let selectedItems = getWeightedRandomRelics(
        rng, available, 3,
        getRelicRarityWeights(metaData.upgrades),
        (relic) => getFusionCompassWeight(metaData.upgrades, player, relic)
    );

    // 不足 3 件或無限塔：以消耗品補位，且每間商店最多 1 張幸運草（main.js:3084-3121）
    if (selectedItems.length < 3 || player.isInfiniteMode) {
        let cons = [...CONSUMABLES_DB];
        const nonDuplicateCons = cons.filter(c => !currentItemIds.includes(c.id));
        if (nonDuplicateCons.length >= (3 - selectedItems.length)) cons = nonDuplicateCons;
        const itemsNeeded = 3 - selectedItems.length;
        for (const c of getWeightedRandomRelics(rng, cons, itemsNeeded)) selectedItems.push(c);

        let cloverCount = 0;
        const filtered = [];
        for (const item of selectedItems) {
            if (item.id.startsWith('cons_clover_')) {
                cloverCount++;
                if (cloverCount <= 1) filtered.push(item);
            } else {
                filtered.push(item);
            }
        }
        selectedItems = filtered;

        if (selectedItems.length < 3) {
            const newlyNeeded = 3 - selectedItems.length;
            const currentShopItemIds = selectedItems.map(i => i.id);
            const refillCons = cons.filter(c => !currentShopItemIds.includes(c.id) && !c.id.startsWith('cons_clover_'));
            for (const c of getWeightedRandomRelics(rng, refillCons, newlyNeeded)) selectedItems.push(c);
        }
    }
    return selectedItems;
}

// main.js:3163-3197 buyItem 的效果段（消耗品即時效果 / 遺物入包＋融合檢查）
export function applyPurchase(ctx, item) {
    const { player, collection } = ctx;
    if (item.id.startsWith('cons_')) {
        if (item.id === 'cons_power') {
            player.nextDamageMulti = (player.nextDamageMulti || 1.0) * 1.5;
        } else if (item.id === 'cons_potential') {
            player.bonusBasePoints = (player.bonusBasePoints || 0) + 50;
        } else if (item.id === 'cons_hp') {
            player.hp = Math.min(getMaxHp(ctx.metaData.upgrades, player), player.hp + 1);
        } else {
            player.relics.push(item.id);
        }
    } else {
        player.relics.push(item.id);
        collection.relics.add(item.id);
        checkRelicFusion(ctx);
    }
}

// main.js:1895-1915 ensureShackleForecast（預兆之瞳：商店預告下一關枷鎖）
export function ensureShackleForecast(ctx, levelIndex) {
    const { player, metaData, rng } = ctx;
    if ((metaData.upgrades.omenEye || 0) < 1) { player.shackleForecast = null; return; }
    const candidates = getShackleCandidatesForStage(levelIndex);
    if (candidates.length === 0) { player.shackleForecast = null; return; }
    const current = player.shackleForecast;
    const currentIsValid = current && current.level === levelIndex && candidates.some(s => s.id === current.id);
    if (!currentIsValid) {
        player.shackleForecast = { level: levelIndex, id: rollShackleIdForStage(rng, levelIndex) };
    }
}

// main.js:3010-3024 openShop ＋ 刷新／購買決策迴圈
export function runShop(ctx, runLog) {
    const { player, metaData, persona } = ctx;
    ensureShackleForecast(ctx, ctx.stage.level + 1);

    let rerollsUsed = 0;
    const rerollLimit = getShopRerollLimit(metaData.upgrades);
    let items = makeShopOffer(ctx);
    items.forEach(i => runLog.relicsOffered.push(i.id));

    let guard = 0;
    while (true) {
        if (++guard > 10) break;
        const view = {
            items: items.map(i => ({ id: i.id, rarity: i.rarity, isConsumable: i.id.startsWith('cons_') })),
            rerollsLeft: rerollLimit - rerollsUsed,
            relics: [...player.relics],
            playerHp: player.hp,
            maxHp: getMaxHp(metaData.upgrades, player),
            nextStageLevel: ctx.stage.level + 1,
            shackleForecast: player.shackleForecast ? player.shackleForecast.id : null
        };
        const choice = persona.decideShop(view, ctx.personaRng);
        if (choice.type === 'reroll' && rerollsUsed < rerollLimit) {
            rerollsUsed++;
            items = makeShopOffer(ctx, items.map(i => i.id));
            items.forEach(i => runLog.relicsOffered.push(i.id));
            continue;
        }
        const idx = Math.max(0, Math.min(items.length - 1, choice.index || 0));
        const item = items[idx];
        runLog.relicsPicked.push(item.id);
        applyPurchase(ctx, item);
        break;
    }
}
