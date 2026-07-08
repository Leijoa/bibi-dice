// sim/personas/novice.mjs
// 「新手小白」人格：只認得同數牌、常提早攻擊浪費重骰、失誤率高、
// 完全相信畫面上顯示的數字（會被假象枷鎖的假傷害騙）。

import { biggestGroup, clampLocks, applyMistake } from './heuristics.mjs';

export function createNovice() {
    return {
        name: 'novice',

        decideAction(view, evaluator, rng) {
            // 新手相信畫面上的預估傷害（假象/酒醉的假數字照單全收）
            if (view.damagePreview !== null && view.damagePreview >= view.enemyHp) {
                return { type: 'attack' };
            }
            if (view.rollsLeft <= 0) return { type: 'attack' };

            const group = biggestGroup(view);

            // 有三顆同數就覺得「不錯了」，30% 提早收手
            if (group && group.indices.length >= 3 && rng.chance(0.30)) {
                return { type: 'attack' };
            }
            // 五顆同數以上：太棒了，直接打
            if (group && group.indices.length >= 5) return { type: 'attack' };

            // 15% 忘記調整鎖定，直接按重骰
            if (rng.chance(0.15)) {
                return { type: 'reroll', locks: view.dice.filter(d => d.locked).map(d => d.index) };
            }

            let locks = (group && group.indices.length >= 2) ? [...group.indices] : [];
            locks = applyMistake(view, locks, 0.25, rng); // 高失誤率
            return { type: 'reroll', locks: clampLocks(view, locks) };
        },

        decideShop(view, rng) {
            // 看不懂效果，隨便挑（永遠不刷新）
            return { type: 'buy', index: rng.int(view.items.length) };
        },

        decideFate(choiceIds, rng) {
            return rng.pick(choiceIds);
        },

        decideFusionDiscard(currentFusionIds, newFusionId, rng) {
            // 慌了，隨便丟（有可能把剛合成的新神話丟掉）
            return rng.pick([...currentFusionIds, newFusionId]);
        }
    };
}
