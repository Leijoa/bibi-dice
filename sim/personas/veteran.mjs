// sim/personas/veteran.mjs
// 「老手」人格：會做粗略的心算期望值（低取樣版理論派），認得融合線與遺物綜效，
// 判斷帶雜訊、偶有小失誤——介於休閒與理論派之間的真實高手近似。

import { candidateLockSets, applyMistake, clampLocks } from './heuristics.mjs';
import { rankItem } from './relic-rank.mjs';

export function createVeteran(options = {}) {
    // 老手心算：取樣少（粗估）、比較時帶 ±12% 雜訊
    const samples = Math.max(6, Math.floor((options.samples ?? 24) / 3));

    return {
        name: 'veteran',

        decideAction(view, evaluator, rng) {
            if (view.rollsLeft <= 0) return { type: 'attack' };

            const noisy = (x) => x * (1 + (rng.next() * 0.24 - 0.12));

            const stand = evaluator.evaluateStand(samples);
            if (stand.pKill >= 0.999) return { type: 'attack' };

            let best = null;
            for (const cand of candidateLockSets(view)) {
                const res = evaluator.evaluateReroll(new Set(cand.indices), samples);
                const perceived = noisy(res.ev);
                if (!best || perceived > best.perceived) best = { cand, res, perceived };
            }
            if (!best) return { type: 'attack' };

            if (best.res.pKill > stand.pKill + 0.10 || best.perceived > noisy(stand.ev) * 1.08) {
                const locks = applyMistake(view, best.cand.indices, 0.05, rng);
                return { type: 'reroll', locks: clampLocks(view, locks) };
            }
            return { type: 'attack' };
        },

        decideShop(view, rng) {
            const score = (item) => rankItem(item.id, view.relics) * (1 + (rng.next() * 0.2 - 0.1));
            let bestIdx = 0;
            let bestScore = score(view.items[0]);
            for (let i = 1; i < view.items.length; i++) {
                const s = score(view.items[i]);
                if (s > bestScore) { bestIdx = i; bestScore = s; }
            }
            if (bestScore < 42 && view.rerollsLeft > 0) return { type: 'reroll' };
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
            const all = [...currentFusionIds, newFusionId];
            let worst = all[0];
            for (const id of all) {
                if (rankItem(id, []) < rankItem(worst, [])) worst = id;
            }
            return worst;
        }
    };
}
