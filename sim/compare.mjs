// sim/compare.mjs
// A/B 數值對比：比較兩份批量模擬快照（snapshot.json）。
// 流程：改數值前跑 `npm.cmd run sim -- --out sim/output/baseline`，
//       改完 data.js / engine.js 後跑 `npm.cmd run sim -- --out sim/output/after`，
//       再 `npm.cmd run sim:compare sim/output/baseline/snapshot.json sim/output/after/snapshot.json`。
// 同 seed 下差異 100% 來自數值改動，不是運氣。

import { readFileSync } from 'node:fs';

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (args.length < 2) {
    console.error('用法：node sim/compare.mjs <基準 snapshot.json> <對照 snapshot.json>');
    process.exit(1);
}

const A = JSON.parse(readFileSync(args[0], 'utf8'));
const B = JSON.parse(readFileSync(args[1], 'utf8'));

const pct = (x) => (x * 100).toFixed(1) + '%';
const delta = (x) => (x >= 0 ? '+' : '') + (x * 100).toFixed(1) + 'pp';

if (String(A.meta?.seed) !== String(B.meta?.seed)) {
    console.warn(`注意：兩份快照 seed 不同（${A.meta?.seed} vs ${B.meta?.seed}），差異含運氣成分\n`);
}

console.log(`=== A/B 對比 ===`);
console.log(`A（基準）：${A.meta?.createdAt ?? '?'}  每組 ${A.meta?.runs ?? '?'} 局  seed ${A.meta?.seed ?? '?'}`);
console.log(`B（對照）：${B.meta?.createdAt ?? '?'}  每組 ${B.meta?.runs ?? '?'} 局  seed ${B.meta?.seed ?? '?'}`);

// --- 通關率 ---
console.log('\n--- 通關率變化 ---');
for (const b of B.agg.soulsRows) {
    const a = A.agg.soulsRows.find(r => r.persona === b.persona && r.cohort === b.cohort);
    if (!a) continue;
    const d = b.winRate - a.winRate;
    const flag = Math.abs(d) >= 0.05 ? '  ←' : '';
    console.log(`  ${b.persona} × ${b.cohort}: ${pct(a.winRate)} → ${pct(b.winRate)}（${delta(d)}）${flag}`);
}

// --- 關卡通過率最大變動 ---
console.log('\n--- 關卡通過率變動（|差| ≥ 3pp）---');
const stageMoves = [];
for (const b of B.agg.difficulty) {
    const a = A.agg.difficulty.find(r => r.persona === b.persona && r.cohort === b.cohort && r.stage === b.stage);
    if (!a) continue;
    const d = b.clearRate - a.clearRate;
    if (Math.abs(d) >= 0.03) stageMoves.push({ ...b, d, before: a.clearRate });
}
stageMoves.sort((x, y) => Math.abs(y.d) - Math.abs(x.d));
if (stageMoves.length === 0) console.log('  無明顯變動');
stageMoves.slice(0, 12).forEach(m => {
    console.log(`  第${m.stage}關 ${m.enemy}（${m.persona}×${m.cohort}）: ${pct(m.before)} → ${pct(m.clearRate)}（${delta(m.d)}）`);
});

// --- 遺物勝率增益變動 ---
console.log('\n--- 遺物勝率增益變動（|差| ≥ 5pp、兩邊持有 ≥20 局）---');
const relicMoves = [];
for (const b of B.agg.relicRows) {
    const a = A.agg.relicRows.find(r => r.persona === b.persona && r.cohort === b.cohort && r.id === b.id);
    if (!a || a.runsWith < 20 || b.runsWith < 20) continue;
    const d = b.winRateDelta - a.winRateDelta;
    if (Math.abs(d) >= 0.05) relicMoves.push({ name: b.name, persona: b.persona, cohort: b.cohort, d, before: a.winRateDelta, after: b.winRateDelta });
}
relicMoves.sort((x, y) => Math.abs(y.d) - Math.abs(x.d));
if (relicMoves.length === 0) console.log('  無明顯變動');
relicMoves.slice(0, 12).forEach(m => {
    console.log(`  ${m.name}（${m.persona}×${m.cohort}）: ${delta(m.before)} → ${delta(m.after)}（Δ ${delta(m.d)}）`);
});

// --- 枷鎖通過率變動 ---
console.log('\n--- 枷鎖通過率變動（|差| ≥ 5pp、兩邊遭遇 ≥10 次）---');
const shackleMoves = [];
for (const b of B.agg.shackleRows) {
    const a = A.agg.shackleRows.find(r => r.persona === b.persona && r.cohort === b.cohort && r.id === b.id);
    if (!a || a.encounters < 10 || b.encounters < 10) continue;
    const d = b.clearRate - a.clearRate;
    if (Math.abs(d) >= 0.05) shackleMoves.push({ name: b.name, persona: b.persona, cohort: b.cohort, d, before: a.clearRate, after: b.clearRate });
}
shackleMoves.sort((x, y) => Math.abs(y.d) - Math.abs(x.d));
if (shackleMoves.length === 0) console.log('  無明顯變動');
shackleMoves.slice(0, 12).forEach(m => {
    console.log(`  ${m.name}（${m.persona}×${m.cohort}）: ${pct(m.before)} → ${pct(m.after)}（${delta(m.d)}）`);
});
