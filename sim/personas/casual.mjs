// sim/personas/casual.mjs
// 「休閒玩家」人格：基本啟發式 —— 留最大同數群、重骰其他，
// 骰面看起來夠好或次數用完就攻擊；帶少量隨手失誤。
// 只讀 view（畫面可見資訊）：被枷鎖遮蔽時判斷自然變差。

import { biggestGroup, clampLocks } from './heuristics.mjs';

export function createCasual() {
    return {
        name: 'casual',

        decideAction(view, evaluator, rng) {
            // 看得到預估傷害且已足以擊殺 → 直接攻擊
            if (view.damagePreview !== null && view.damagePreview >= view.enemyHp) {
                return { type: 'attack' };
            }
            if (view.rollsLeft <= 0) return { type: 'attack' };

            const group = biggestGroup(view);

            // 盤面「看起來很棒」就滿足了：6 顆同數以上直接打
            if (group && group.indices.length >= 6) return { type: 'attack' };

            // 沒有預估傷害可看（虛張聲勢等）時更保守：5 顆同數就收手
            if (view.damagePreview === null && group && group.indices.length >= 5) {
                return { type: 'attack' };
            }

            // 鎖住最大同數群重骰；全未知（幻象/盲眼蓋住）就亂骰
            let locks = group ? [...group.indices] : [];

            // 隨手失誤：10% 多鎖一顆不相干的骰子
            if (rng.chance(0.10)) {
                const extras = view.dice.filter(d => !locks.includes(d.index)).map(d => d.index);
                if (extras.length > 0) locks.push(rng.pick(extras));
            }

            return { type: 'reroll', locks: clampLocks(view, locks) };
        },

        decideShop(view, rng) {
            // 品味：看稀有度發光程度挑，偶爾憑感覺
            if (rng.chance(0.15)) return { type: 'buy', index: rng.int(view.items.length) };
            let best = 0;
            for (let i = 1; i < view.items.length; i++) {
                if (view.items[i].rarity > view.items[best].rarity) best = i;
            }
            // 全是普通貨時 30% 會刷新一次碰運氣
            if (view.items[best].rarity <= 1 && view.rerollsLeft > 0 && rng.chance(0.30)) {
                return { type: 'reroll' };
            }
            return { type: 'buy', index: best };
        },

        decideFate(choiceIds, rng) {
            return rng.pick(choiceIds);
        },

        decideFusionDiscard(currentFusionIds, newFusionId, rng) {
            // 隨便丟一件舊的（休閒玩家通常想要新東西）
            return rng.pick(currentFusionIds);
        }
    };
}
