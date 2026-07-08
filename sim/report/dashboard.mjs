// sim/report/dashboard.mjs
// 把批量模擬的聚合結果輸出成單檔 dashboard.html（零外部依賴、離線可開、深淺色自適應）。
// 圖表為產生時算好的靜態 SVG。

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const PERSONA_LABEL = { novice: '新手', casual: '休閒', veteran: '老手', gambler: '賭徒', theorist: '理論派' };
const COHORT_LABEL = { zero: '零升級', full: '全升級' };
const PERSONA_COLORS = { novice: '#e05c5c', casual: '#e0a04c', veteran: '#4c9de0', gambler: '#b04ce0', theorist: '#3dbd7d' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pct = (x) => (x * 100).toFixed(1) + '%';

// 折線圖：每人格一條「分關卡通過率」
function stageClearChart(difficulty, cohort, personas) {
    const W = 720, H = 260, PAD = 44;
    const stages = [...new Set(difficulty.filter(d => d.cohort === cohort).map(d => d.stage))].sort((a, b) => a - b);
    if (stages.length === 0) return '';
    const x = (stage) => PAD + (stage - 1) / (Math.max(...stages) - 1 || 1) * (W - PAD * 2);
    const yy = (rate) => (H - PAD) - rate * (H - PAD * 2);

    let grid = '';
    for (let g = 0; g <= 4; g++) {
        const gy = yy(g / 4);
        grid += `<line x1="${PAD}" y1="${gy}" x2="${W - PAD}" y2="${gy}" class="grid"/>`
            + `<text x="${PAD - 6}" y="${gy + 4}" class="tick" text-anchor="end">${g * 25}%</text>`;
    }
    let xTicks = '';
    stages.forEach(s => {
        xTicks += `<text x="${x(s)}" y="${H - PAD + 16}" class="tick" text-anchor="middle">${s}</text>`;
    });

    let lines = '';
    let legend = '';
    personas.forEach((p, i) => {
        const rows = difficulty.filter(d => d.cohort === cohort && d.persona === p).sort((a, b) => a.stage - b.stage);
        if (rows.length === 0) return;
        const pts = rows.map(r => `${x(r.stage).toFixed(1)},${yy(r.clearRate).toFixed(1)}`).join(' ');
        lines += `<polyline points="${pts}" fill="none" stroke="${PERSONA_COLORS[p] || '#888'}" stroke-width="2.5"/>`;
        rows.forEach(r => {
            lines += `<circle cx="${x(r.stage).toFixed(1)}" cy="${yy(r.clearRate).toFixed(1)}" r="3" fill="${PERSONA_COLORS[p] || '#888'}"><title>${esc(PERSONA_LABEL[p] || p)} 第${r.stage}關 ${esc(r.enemy)}：通過率 ${pct(r.clearRate)}（死 ${r.deaths} 局）</title></circle>`;
        });
        legend += `<span class="lg"><i style="background:${PERSONA_COLORS[p] || '#888'}"></i>${esc(PERSONA_LABEL[p] || p)}</span>`;
    });

    return `<div class="legend">${legend}</div>
<div class="scroll"><svg viewBox="0 0 ${W} ${H}" role="img">
${grid}${xTicks}
<text x="${W / 2}" y="${H - 8}" class="tick" text-anchor="middle">關卡</text>
${lines}
</svg></div>`;
}

// 橫向長條：帶正負色
function hbar(items, valueKey, labelFn, titleFn, fmt = pct) {
    const maxAbs = Math.max(0.001, ...items.map(i => Math.abs(i[valueKey])));
    let rows = '';
    for (const it of items) {
        const v = it[valueKey];
        const w = Math.abs(v) / maxAbs * 50;
        const pos = v >= 0;
        rows += `<div class="hb" title="${esc(titleFn(it))}">
<span class="hb-label">${esc(labelFn(it))}</span>
<span class="hb-track"><span class="hb-fill ${pos ? 'pos' : 'neg'}" style="margin-left:${pos ? 50 : 50 - w}%;width:${w}%"></span></span>
<span class="hb-val ${pos ? 'pos' : 'neg'}">${fmt(v)}</span>
</div>`;
    }
    return rows;
}

// 遺物榜跨人格合併（同 cohort）：以持有局數加權
function mergeRelics(relicRows, cohort) {
    const map = new Map();
    for (const r of relicRows.filter(r => r.cohort === cohort)) {
        if (!map.has(r.id)) map.set(r.id, { id: r.id, name: r.name, rarity: r.rarity, offered: 0, picked: 0, runsWith: 0, winsWith: 0, baseWinsWeighted: 0 });
        const m = map.get(r.id);
        m.offered += r.offered;
        m.picked += r.picked;
        m.runsWith += r.runsWith;
        m.winsWith += r.winRateWith * r.runsWith;
        m.baseWinsWeighted += r.winRateBase * r.runsWith;
    }
    return [...map.values()]
        .filter(m => m.runsWith >= 20) // 樣本太小的不進榜
        .map(m => ({
            ...m,
            pickRate: m.offered ? m.picked / m.offered : 0,
            winRateDelta: m.runsWith ? (m.winsWith - m.baseWinsWeighted) / m.runsWith : 0
        }))
        .sort((a, b) => b.winRateDelta - a.winRateDelta);
}

function mergeShackles(shackleRows, cohort) {
    const map = new Map();
    for (const r of shackleRows.filter(r => r.cohort === cohort)) {
        if (!map.has(r.id)) map.set(r.id, { id: r.id, name: r.name, type: r.type, encounters: 0, clears: 0, baseWeighted: 0 });
        const m = map.get(r.id);
        m.encounters += r.encounters;
        m.clears += r.clearRate * r.encounters;
        m.baseWeighted += r.baseClearRate * r.encounters;
    }
    return [...map.values()]
        .map(m => ({
            ...m,
            clearRate: m.encounters ? m.clears / m.encounters : 0,
            clearRateDelta: m.encounters ? (m.clears - m.baseWeighted) / m.encounters : 0
        }))
        .sort((a, b) => a.clearRateDelta - b.clearRateDelta);
}

export function writeDashboard(outDir, agg, meta = {}) {
    mkdirSync(outDir, { recursive: true });
    const personas = [...new Set(agg.soulsRows.map(r => r.persona))];
    const cohorts = [...new Set(agg.soulsRows.map(r => r.cohort))];

    // 通關率總表
    let winGrid = '<table><tr><th>人格</th>' + cohorts.map(c => `<th>${esc(COHORT_LABEL[c] || c)}</th>`).join('') + '</tr>';
    for (const p of personas) {
        winGrid += `<tr><td>${esc(PERSONA_LABEL[p] || p)}</td>`;
        for (const c of cohorts) {
            const row = agg.soulsRows.find(r => r.persona === p && r.cohort === c);
            winGrid += `<td class="num">${row ? pct(row.winRate) : '–'}</td>`;
        }
        winGrid += '</tr>';
    }
    winGrid += '</table>';

    // 靈魂節奏表
    let soulsTable = '<table><tr><th>人格</th><th>帳號</th><th>通關率</th><th>平均每局靈魂</th><th>估計全解鎖局數</th><th>平均最高傷害</th></tr>';
    for (const r of agg.soulsRows) {
        soulsTable += `<tr><td>${esc(PERSONA_LABEL[r.persona] || r.persona)}</td><td>${esc(COHORT_LABEL[r.cohort] || r.cohort)}</td>`
            + `<td class="num">${pct(r.winRate)}</td><td class="num">${r.avgSoulsPerRun.toFixed(2)}</td>`
            + `<td class="num">${r.estRunsToUnlockAll === Infinity ? '∞' : r.estRunsToUnlockAll}</td>`
            + `<td class="num">${Math.round(r.avgHighestDamage).toLocaleString()}</td></tr>`;
    }
    soulsTable += '</table>';

    let stageSections = '';
    for (const c of cohorts) {
        stageSections += `<h3>${esc(COHORT_LABEL[c] || c)}帳號</h3>` + stageClearChart(agg.difficulty, c, personas);
    }

    const relicsZero = mergeRelics(agg.relicRows, cohorts.includes('zero') ? 'zero' : cohorts[0]);
    const relicTop = hbar(relicsZero.slice(0, 10), 'winRateDelta',
        (r) => r.name, (r) => `持有 ${r.runsWith} 局`);
    const relicBottom = hbar(relicsZero.slice(-10).reverse(), 'winRateDelta',
        (r) => r.name, (r) => `持有 ${r.runsWith} 局`);

    const shacklesZero = mergeShackles(agg.shackleRows, cohorts.includes('zero') ? 'zero' : cohorts[0]);
    const shackleBars = hbar(shacklesZero, 'clearRateDelta',
        (s) => `${s.name}（${s.type === 'heavy' ? '重' : '輕'}）`,
        (s) => `遭遇 ${s.encounters} 次，通過率 ${pct(s.clearRate)}`);

    const html = `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>比比丟八 擬人模擬平衡儀表板</title>
<style>
:root { color-scheme: light dark; --fg:#1c2430; --bg:#f5f6f8; --card:#fff; --muted:#6b7686; --line:#d8dde5; --pos:#3dbd7d; --neg:#e05c5c; }
@media (prefers-color-scheme: dark) { :root { --fg:#e5e9f0; --bg:#12161d; --card:#1b212b; --muted:#8b96a8; --line:#2c3442; } }
* { box-sizing:border-box; }
body { margin:0; padding:24px; background:var(--bg); color:var(--fg); font:15px/1.6 "Noto Sans TC",system-ui,sans-serif; }
h1 { font-size:22px; margin:0 0 4px; } h2 { font-size:17px; margin:28px 0 10px; } h3 { font-size:14px; color:var(--muted); margin:16px 0 6px; }
.meta { color:var(--muted); font-size:13px; }
.card { background:var(--card); border:1px solid var(--line); border-radius:10px; padding:16px 18px; margin-top:10px; }
table { border-collapse:collapse; width:100%; } th,td { padding:6px 10px; border-bottom:1px solid var(--line); text-align:left; font-size:14px; } .num { text-align:right; font-variant-numeric:tabular-nums; }
.scroll { overflow-x:auto; } svg { min-width:560px; width:100%; height:auto; }
.grid { stroke:var(--line); stroke-width:1; } .tick { fill:var(--muted); font-size:11px; }
.legend { display:flex; gap:14px; flex-wrap:wrap; font-size:13px; margin-bottom:4px; }
.lg i { display:inline-block; width:10px; height:10px; border-radius:2px; margin-right:5px; }
.hb { display:flex; align-items:center; gap:8px; margin:3px 0; font-size:13px; }
.hb-label { flex:0 0 190px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.hb-track { flex:1; height:12px; background:color-mix(in srgb, var(--line) 45%, transparent); border-radius:6px; overflow:hidden; }
.hb-fill { display:block; height:100%; } .hb-fill.pos { background:var(--pos); } .hb-fill.neg { background:var(--neg); }
.hb-val { flex:0 0 64px; text-align:right; font-variant-numeric:tabular-nums; } .hb-val.pos { color:var(--pos); } .hb-val.neg { color:var(--neg); }
.note { color:var(--muted); font-size:12.5px; }
</style>
</head>
<body>
<h1>比比丟八 擬人模擬平衡儀表板</h1>
<p class="meta">產生時間 ${esc(meta.createdAt || new Date().toISOString())} ｜ 每組 ${esc(meta.runs ?? '?')} 局 ｜ seed ${esc(meta.seed ?? '?')} ｜ 取樣品質 ${esc(meta.quality ?? '?')}</p>

<h2>通關率總表</h2>
<div class="card">${winGrid}</div>

<h2>難度曲線（分關卡通過率）</h2>
<div class="card">${stageSections}<p class="note">點越低代表該關卡越卡人；理論派曲線是平衡上限參照。</p></div>

<h2>遺物強度榜（零升級帳號、全人格合併、持有 ≥20 局）</h2>
<div class="card"><h3>勝率增益最高 10 件</h3>${relicTop}<h3>勝率增益最低 10 件</h3>${relicBottom}
<p class="note">「勝率增益」＝持有該遺物的局的勝率 − 同組基準勝率；負值代表拿了反而更容易輸（弱卡或陷阱卡訊號）。</p></div>

<h2>枷鎖難度實測（零升級帳號、全人格合併）</h2>
<div class="card">${shackleBars}
<p class="note">「通過率差」＝掛該枷鎖的關卡通過率 − 所有枷鎖關的平均通過率；越負越兇。可對照輕／重分類是否名實相符。</p></div>

<h2>靈魂節奏</h2>
<div class="card">${soulsTable}
<p class="note">估計全解鎖局數＝全升級總價 ÷ 平均每局靈魂（未計契約加成；精算請看生涯模式 career_summary.csv）。</p></div>
</body>
</html>`;

    const path = join(outDir, 'dashboard.html');
    writeFileSync(path, html, 'utf8');
    return path;
}
