// sim/personas/heuristics.mjs
// 人格共用的啟發式工具：只吃 view（畫面可見資訊），不碰真實盤面。

// 依「已知」骰子分組：{ val: [index...] }
export function groupKnownByValue(view) {
    const groups = {};
    view.dice.forEach(d => {
        if (!d.known) return;
        (groups[d.displayVal] = groups[d.displayVal] || []).push(d.index);
    });
    return groups;
}

// 已知骰中最大的同數群（優先數量、再比點數大小）
export function biggestGroup(view) {
    const groups = groupKnownByValue(view);
    let best = null;
    for (const [val, idxs] of Object.entries(groups)) {
        if (!best || idxs.length > best.indices.length
            || (idxs.length === best.indices.length && Number(val) > best.val)) {
            best = { val: Number(val), indices: idxs };
        }
    }
    return best; // 可能為 null（全部未知）
}

// 依約束修剪想鎖的集合（人看得到禁位與上限；詛咒骰的不可解鎖由 battle.applyLockRequest 保護）
export function clampLocks(view, indices) {
    const cons = view.lockConstraints;
    if (cons.lockingDisabled) return [];
    const out = [];
    for (const i of indices) {
        if (cons.forbiddenIndices.includes(i)) continue;
        if (out.length >= cons.maxLocks) break;
        out.push(i);
    }
    return out;
}

// 共用失誤模型：以 epsilon 機率把鎖定集合弄糟一點（多鎖/漏鎖一顆），模擬手滑與分心
export function applyMistake(view, locks, epsilon, rng) {
    if (!rng.chance(epsilon)) return locks;
    const out = [...locks];
    if (out.length > 0 && rng.chance(0.5)) {
        out.splice(rng.int(out.length), 1); // 漏鎖一顆
    } else {
        const extras = view.dice.map(d => d.index).filter(i => !out.includes(i));
        if (extras.length > 0) out.push(rng.pick(extras)); // 多鎖一顆不相干的
    }
    return out;
}

// 產生理論派的候選鎖法（依 view 已知資訊）
export function candidateLockSets(view) {
    const sets = [];
    const push = (indices) => {
        const key = [...indices].sort((a, b) => a - b).join(',');
        if (!sets.some(s => s.key === key)) sets.push({ key, indices: clampLocks(view, indices) });
    };

    const currentLocked = view.dice.filter(d => d.locked).map(d => d.index);
    push([]);                 // 全重骰
    push(currentLocked);      // 維持現狀

    // 各同數群（數量 >= 2），取前 4 大群
    const groups = Object.entries(groupKnownByValue(view))
        .map(([val, idxs]) => ({ val: Number(val), idxs }))
        .filter(g => g.idxs.length >= 2)
        .sort((a, b) => b.idxs.length - a.idxs.length || b.val - a.val)
        .slice(0, 4);
    groups.forEach(g => push(g.idxs));

    // 前兩大群聯集（追 C 區複合牌型）
    if (groups.length >= 2) push([...groups[0].idxs, ...groups[1].idxs]);

    // 已配對牌型的骰全鎖（穩住現有牌型）
    const matched = view.dice.filter(d => d.matched && (d.matched.A || d.matched.B || d.matched.C || d.matched.D)).map(d => d.index);
    if (matched.length > 0) push(matched);

    // 每種數字留一顆（追全異/彗星/順子）
    const seen = new Set();
    const distinct = [];
    view.dice.forEach(d => {
        if (d.known && !seen.has(d.displayVal)) { seen.add(d.displayVal); distinct.push(d.index); }
    });
    if (distinct.length >= 5) push(distinct);

    return sets;
}
