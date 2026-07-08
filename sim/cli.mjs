// sim/cli.mjs
// 擬人模擬遊玩 CLI。
// 用法：
//   npm.cmd run sim                                     # 預設：兩人格 × 兩帳號 × 各 200 局
//   npm.cmd run sim -- --runs 500 --seed 42
//   npm.cmd run sim -- --personas theorist --cohorts full --quality fast
// 輸出：sim/output/*.csv（UTF-8 BOM，Excel 可直接開）＋ 終端摘要

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { simulateRun } from './core/run.mjs';
import { simulateCareer } from './core/career.mjs';
import { writeDashboard } from './report/dashboard.mjs';
import { createPersona, AVAILABLE_PERSONAS } from './personas/index.mjs';
import { aggregate } from './report/aggregate.mjs';
import { writeAllReports, writeCsv } from './report/csv.mjs';
import { createRng, hashSeed } from './core/rng.mjs';

function parseArgs(argv) {
    const args = {
        mode: 'batch', runs: 200, seed: 42,
        personas: AVAILABLE_PERSONAS, cohorts: ['zero', 'full'],
        quality: 'std', out: 'sim/output',
        careers: 10, maxRuns: 150
    };
    for (let i = 2; i < argv.length; i++) {
        const key = argv[i];
        const val = argv[i + 1];
        if (key === '--mode') { args.mode = val; i++; }
        else if (key === '--runs') { args.runs = parseInt(val, 10); i++; }
        else if (key === '--seed') { args.seed = val; i++; }
        else if (key === '--personas') { args.personas = val.split(','); i++; }
        else if (key === '--cohorts') { args.cohorts = val.split(','); i++; }
        else if (key === '--quality') { args.quality = val; i++; }
        else if (key === '--out') { args.out = val; i++; }
        else if (key === '--careers') { args.careers = parseInt(val, 10); i++; }
        else if (key === '--max-runs') { args.maxRuns = parseInt(val, 10); i++; }
        else if (key === '--help') {
            console.log('批量模式：--runs N | --seed S | --personas a,b | --cohorts zero,full | --quality fast|std|high | --out dir');
            console.log('生涯模式：--mode career | --careers N（每人格生涯條數）| --max-runs N（每生涯上限局數）');
            process.exit(0);
        }
    }
    return args;
}

const QUALITY_SAMPLES = { fast: 12, std: 24, high: 48 };

function pct(x) { return (x * 100).toFixed(1) + '%'; }

// --- 生涯模式：連續多局＋局間升級購買＋契約自適應＋無限塔 ---
function runCareerMode(args, samples) {
    const t0 = Date.now();
    const allRows = [];
    const summaries = [];

    console.log(`比比丟八 擬人模擬遊玩（生涯模式）`);
    console.log(`生涯條數/人格=${args.careers}  每生涯上限=${args.maxRuns} 局  人格=${args.personas.join(',')}  seed=${args.seed}`);

    for (const personaName of args.personas) {
        const tGroup = Date.now();
        const groupSummaries = [];
        for (let c = 0; c < args.careers; c++) {
            const persona = createPersona(personaName, { samples });
            const careerRng = createRng(hashSeed(`${args.seed}:career:${personaName}:${c}`));
            const { rows, summary } = simulateCareer({
                seed: `${args.seed}:career:${personaName}:${c}`,
                persona, maxRuns: args.maxRuns, careerRng
            });
            rows.forEach(r => { r.career = c + 1; allRows.push(r); });
            summaries.push({ career: c + 1, ...summary });
            groupSummaries.push(summary);
        }
        const secs = ((Date.now() - tGroup) / 1000).toFixed(1);
        const unlocks = groupSummaries.map(s => s.unlockAllAtRun).filter(x => x !== '');
        const med = unlocks.length ? unlocks.sort((a, b) => a - b)[Math.floor(unlocks.length / 2)] : null;
        const avgWin = groupSummaries.reduce((s, x) => s + x.winRate, 0) / groupSummaries.length;
        const maxInf = Math.max(...groupSummaries.map(s => s.maxInfiniteFloor));
        console.log(`  ${personaName}: 全解鎖中位數 ${med ?? `>${args.maxRuns}`} 局、整體通關率 ${pct(avgWin)}、無限塔最深 ${maxInf} 層（${args.careers} 條生涯，${secs}s）`);
    }

    const paths = [];
    paths.push(writeCsv(args.out, 'career_progression.csv', {
        persona: '人格', career: '生涯', run: '局數', contractLevel: '契約層', win: '通關',
        diedAtStage: '死亡關卡', infiniteFloor: '無限塔樓層', soulsEarned: '靈魂收入',
        spentThisRun: '本局花費', soulsBalance: '靈魂餘額', upgradesOwnedLevels: '累積升級等級', highestDamage: '最高傷害'
    }, allRows));
    paths.push(writeCsv(args.out, 'career_summary.csv', {
        persona: '人格', career: '生涯', runsPlayed: '總局數', unlockAllAtRun: '全解鎖於第幾局',
        totalUpgradeCost: '全升級總價', winRate: '整體通關率', winRateFirst10: '前10局通關率',
        maxInfiniteFloor: '無限塔最深', avgContract: '平均契約層', maxContract: '最高契約層'
    }, summaries));

    console.log('\n報表輸出：');
    for (const p of paths) console.log('  ' + p);
    console.log(`\n總耗時 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

async function main() {
    const args = parseArgs(process.argv);
    const samples = QUALITY_SAMPLES[args.quality] ?? 24;

    if (args.mode === 'career') {
        runCareerMode(args, samples);
        return;
    }

    const t0 = Date.now();
    const runLogs = [];

    console.log(`比比丟八 擬人模擬遊玩`);
    console.log(`局數/組合=${args.runs}  人格=${args.personas.join(',')}  帳號=${args.cohorts.join(',')}  seed=${args.seed}  取樣品質=${args.quality}(${samples})`);

    for (const personaName of args.personas) {
        for (const cohortName of args.cohorts) {
            const persona = createPersona(personaName, { samples });
            let wins = 0;
            const tGroup = Date.now();
            for (let i = 0; i < args.runs; i++) {
                const log = simulateRun({ seed: `${args.seed}:${cohortName}:${i}`, persona, cohortName });
                runLogs.push(log);
                if (log.win) wins++;
            }
            const secs = ((Date.now() - tGroup) / 1000).toFixed(1);
            console.log(`  ${personaName} × ${cohortName}: 通關率 ${pct(wins / args.runs)}（${args.runs} 局，${secs}s）`);
        }
    }

    const agg = aggregate(runLogs);
    const paths = writeAllReports(args.out, agg);

    // 快照（供 sim:compare A/B 對比）與 HTML 儀表板
    const meta = { createdAt: new Date().toISOString(), runs: args.runs, seed: args.seed, quality: args.quality };
    mkdirSync(args.out, { recursive: true });
    writeFileSync(join(args.out, 'snapshot.json'), JSON.stringify({ meta, agg }), 'utf8');
    paths.push(join(args.out, 'snapshot.json'));
    paths.push(writeDashboard(args.out, agg, meta));

    // 終端重點摘要
    console.log('\n=== 死亡熱點（前 3）===');
    for (const personaName of args.personas) {
        for (const cohortName of args.cohorts) {
            const rows = agg.difficulty
                .filter(d => d.persona === personaName && d.cohort === cohortName && d.deaths > 0)
                .sort((a, b) => b.deaths - a.deaths)
                .slice(0, 3);
            const desc = rows.length
                ? rows.map(r => `第${r.stage}關 ${r.enemy}（死 ${r.deaths} 局，通過率 ${pct(r.clearRate)}）`).join('；')
                : '無死亡';
            console.log(`  ${personaName} × ${cohortName}: ${desc}`);
        }
    }

    console.log('\n=== 枷鎖難度（通過率差最劇烈前 5，彙總全組）===');
    const shackleWorst = [...agg.shackleRows].sort((a, b) => a.clearRateDelta - b.clearRateDelta).slice(0, 5);
    for (const s of shackleWorst) {
        console.log(`  ${s.name}（${s.type}）${s.persona}×${s.cohort}: 通過率 ${pct(s.clearRate)}（基準 ${pct(s.baseClearRate)}，差 ${pct(s.clearRateDelta)}，遇 ${s.encounters} 次）`);
    }

    console.log('\n報表輸出：');
    for (const p of paths) console.log('  ' + p);
    console.log(`\n總耗時 ${((Date.now() - t0) / 1000).toFixed(1)}s，共 ${runLogs.length} 局`);
}

main().catch(err => { console.error(err); process.exit(1); });
