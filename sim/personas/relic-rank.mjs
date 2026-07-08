// sim/personas/relic-rank.mjs
// 理論派用的遺物靜態價值表（0-100，純啟發式，非引擎數據）。
// 之後跑出「遺物強度榜」報表後，可回頭校準這張表，讓理論派更貼近真實高手。

export const RELIC_RANK = {
    // 普通（大 N 系列：點數墊高 + 融合素材）
    b1: 40, b2: 40, b3: 42, b4: 42, b5: 42, b6: 44, b7: 46, b8: 48,
    // 稀有
    small: 45, mid: 42, big: 50,
    flicker: 30, laststand: 48, highlow: 46, hodgepodge: 40,
    doubles: 44, fivebless: 42, mediocre: 52, arithmetic: 44,
    // 史詩
    doubleedge: 35, odd: 58, even: 58, sixsmooth: 55, order: 60,
    allin: 30, brink: 38, straightfan: 45, fourdeath: 35,
    extremist: 50, luckyseven: 48, rebel: 46,
    // 傳說
    refresh: 85, balance: 82, pansy: 75, pongo: 75,
    firstaid: 60, royalflush: 55, berserker: 62, dragonslayer: 70,
    // 神話（融合成品，商店不出現，但捨棄決策會用到）
    fusion_source: 80, fusion_pillar: 78, fusion_nebula: 72, fusion_samsara: 76,
    fusion_fortune: 70, fusion_death_sequence: 74, fusion_blood_crusade: 82, fusion_scale_apex: 80,
    // 消耗品
    cons_bomb: 20, cons_clover_3: 25, cons_clover_4: 25, cons_clover_5: 28, cons_clover_6: 30,
    cons_strike_a: 30, cons_fever_b: 28, cons_combo_c: 30, cons_science_d: 28,
    cons_power: 45, cons_loaded_dice: 40, cons_pliers: 50, cons_doll: 48,
    cons_potential: 55, cons_hp: 50, cons_fruit: 58, cons_guide: 40
};

// 融合夥伴加成：持有配方另一半時，素材價值大幅上調
import { FUSION_MATERIAL_LOOKUP } from '../core/adapter.mjs';

export function rankItem(id, ownedRelics, dismantledFusions = []) {
    let rank = RELIC_RANK[id] ?? 35;
    const partner = FUSION_MATERIAL_LOOKUP[id];
    if (partner && ownedRelics.includes(partner.mat) && !dismantledFusions.includes(partner.fid)) {
        rank += 40; // 湊齊即融合出神話遺物
    }
    return rank;
}
