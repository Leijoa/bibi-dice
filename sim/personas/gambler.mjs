// sim/personas/gambler.mjs
// 「賭徒」人格：追大牌成癮——四顆同數就想拚七同、比比丟八，
// 六種數字就想拚彗星；高估低機率（人類經典偏誤）、商店只梭哈高稀有度。

import { biggestGroup, groupKnownByValue, clampLocks, applyMistake } from './heuristics.mjs';

export function createGambler() {
    return {
        name: 'gambler',

        decideAction(view, evaluator, rng) {
            // 能殺就殺（贏比刺激重要一點點）
            if (view.damagePreview !== null && view.damagePreview >= view.enemyHp) {
                return { type: 'attack' };
            }
            if (view.rollsLeft <= 0) return { type: 'attack' };

            const group = biggestGroup(view);
            const groupSize = group ? group.indices.length : 0;

            // 七顆以上同數：中大獎了，打！
            if (groupSize >= 7) return { type: 'attack' };

            // 彗星夢：已有 6 種以上不同數字 → 每種留一顆繼續拚
            const distinctVals = Object.keys(groupKnownByValue(view));
            if (distinctVals.length >= 6 && groupSize <= 3) {
                const seen = new Set();
                const distinct = [];
                view.dice.forEach(d => {
                    if (d.known && !seen.has(d.displayVal)) { seen.add(d.displayVal); distinct.push(d.index); }
                });
                const locks = applyMistake(view, distinct, 0.10, rng);
                return { type: 'reroll', locks: clampLocks(view, locks) };
            }

            // 大牌夢：四顆以上同數 → 鎖住繼續拚更多顆（即使期望值不划算）
            if (groupSize >= 2) {
                const locks = applyMistake(view, [...group.indices], 0.10, rng);
                return { type: 'reroll', locks: clampLocks(view, locks) };
            }

            // 什麼都沒有：全重骰賭一把
            return { type: 'reroll', locks: [] };
        },

        decideShop(view, rng) {
            // 只看稀有度，全是便宜貨就刷新賭傳說
            let best = 0;
            for (let i = 1; i < view.items.length; i++) {
                if (view.items[i].rarity > view.items[best].rarity) best = i;
            }
            if (view.items[best].rarity < 3 && view.rerollsLeft > 0) return { type: 'reroll' };
            return { type: 'buy', index: best };
        },

        decideFate(choiceIds, rng) {
            return rng.pick(choiceIds);
        },

        decideFusionDiscard(currentFusionIds) {
            // 新的最香，丟舊的第一件
            return currentFusionIds[0];
        }
    };
}
