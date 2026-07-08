// sim/personas/theorist.mjs
// 「理論派」人格（平衡上限基準）：枚舉候選鎖法，用真引擎取樣估期望值，
// 期望值增幅或擊殺率有感才重骰，否則收手攻擊。
// 理論派熟背規則，可自行心算分數；但被遮蔽的骰面（盲眼/幻象）一樣只能當未知取樣。

import { candidateLockSets } from './heuristics.mjs';
import { rankItem } from './relic-rank.mjs';

export function createTheorist(options = {}) {
    const samples = options.samples ?? 24;   // 每個候選鎖法的取樣次數（--quality 可調）
    const evGainThreshold = 1.06;            // 重骰所需的期望值增幅門檻
    const pKillGainThreshold = 0.08;         // 或擊殺率增幅門檻

    return {
        name: 'theorist',

        decideAction(view, evaluator) {
            if (view.rollsLeft <= 0) return { type: 'attack' };

            const stand = evaluator.evaluateStand(samples);

            // 現在就能穩殺 → 攻擊
            if (stand.pKill >= 0.999) return { type: 'attack' };

            let best = null;
            for (const cand of candidateLockSets(view)) {
                const res = evaluator.evaluateReroll(new Set(cand.indices), samples);
                if (!best || res.ev > best.res.ev) best = { cand, res };
            }
            if (!best) return { type: 'attack' };

            // 擊殺率有感提升，或期望值增幅超過門檻 → 重骰
            if (best.res.pKill > stand.pKill + pKillGainThreshold) {
                return { type: 'reroll', locks: best.cand.indices };
            }
            if (best.res.ev > stand.ev * evGainThreshold) {
                return { type: 'reroll', locks: best.cand.indices };
            }
            return { type: 'attack' };
        },

        decideShop(view) {
            const score = (item) => rankItem(item.id, view.relics);
            let bestIdx = 0;
            for (let i = 1; i < view.items.length; i++) {
                if (score(view.items[i]) > score(view.items[bestIdx])) bestIdx = i;
            }
            // 最佳選項也不怎麼樣時用掉刷新
            if (score(view.items[bestIdx]) < 45 && view.rerollsLeft > 0) {
                return { type: 'reroll' };
            }
            return { type: 'buy', index: bestIdx };
        },

        decideFate(choiceIds) {
            let best = choiceIds[0];
            for (const id of choiceIds) {
                if (rankItem(id, []) > rankItem(best, [])) best = id;
            }
            return best;
        },

        decideFusionDiscard(currentFusionIds, newFusionId) {
            // 比較新舊神話價值，丟掉最弱的一件
            const all = [...currentFusionIds, newFusionId];
            let worst = all[0];
            for (const id of all) {
                if (rankItem(id, []) < rankItem(worst, [])) worst = id;
            }
            return worst;
        }
    };
}
