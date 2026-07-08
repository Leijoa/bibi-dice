// sim/core/rng.mjs
// 可重現的偽隨機數產生器（mulberry32）。
// 模擬器分成兩條 RNG 流：world（骰子/枷鎖/商店）與 persona（決策取樣/失誤），
// 讓「換人格重跑同 seed」時世界事件序盡量一致，A/B 對比更乾淨。

export function createRng(seed) {
    let a = seed >>> 0;
    const next = () => {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
        next,
        // 0 .. n-1
        int(n) { return Math.floor(next() * n); },
        // 1 .. 8（骰面）
        die() { return Math.floor(next() * 8) + 1; },
        pick(arr) { return arr[Math.floor(next() * arr.length)]; },
        chance(p) { return next() < p; },
        shuffle(arr) {
            const out = [...arr];
            for (let i = out.length - 1; i > 0; i--) {
                const j = Math.floor(next() * (i + 1));
                [out[i], out[j]] = [out[j], out[i]];
            }
            return out;
        }
    };
}

// 由字串產生 32-bit seed（讓 --seed 也能吃文字）
export function hashSeed(str) {
    let h = 2166136261 >>> 0;
    const s = String(str);
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}
