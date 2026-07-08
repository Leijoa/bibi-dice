// sim/report/csv.mjs
// CSV 輸出（含 UTF-8 BOM，讓 Excel 直接開繁中不亂碼；沿用 alldamege.csv 的表格習慣）

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

function esc(v) {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'number' && !Number.isInteger(v) ? v.toFixed(4) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function writeCsv(outDir, filename, headerMap, rows) {
    mkdirSync(outDir, { recursive: true });
    const keys = Object.keys(headerMap);
    const lines = [keys.map(k => headerMap[k]).join(',')];
    for (const row of rows) lines.push(keys.map(k => esc(row[k])).join(','));
    const path = join(outDir, filename);
    writeFileSync(path, '﻿' + lines.join('\n') + '\n', 'utf8');
    return path;
}

export function writeAllReports(outDir, agg) {
    const paths = [];
    paths.push(writeCsv(outDir, 'difficulty_curve.csv', {
        persona: '人格', cohort: '局外帳號', stage: '關卡', enemy: '敵人', enemyHp: '敵人HP',
        reachedRuns: '抵達局數', reachRate: '抵達率', clearRate: '通過率',
        deaths: '死亡數', deathShare: '死亡占比',
        avgHpLost: '平均損血', avgTurns: '平均回合數', avgRerolls: '平均重骰數',
        avgAttackDamage: '平均單次攻擊傷害', avgMaxAttack: '平均最高攻擊'
    }, agg.difficulty));

    paths.push(writeCsv(outDir, 'relic_strength.csv', {
        persona: '人格', cohort: '局外帳號', id: 'ID', name: '名稱', rarity: '稀有度',
        offered: '商店出現次數', picked: '被選次數', pickRate: '被選率', dropped: '掉落次數',
        runsWith: '持有局數', winRateWith: '持有勝率', winRateBase: '基準勝率', winRateDelta: '勝率增益'
    }, agg.relicRows.sort((a, b) => b.winRateDelta - a.winRateDelta)));

    paths.push(writeCsv(outDir, 'shackle_difficulty.csv', {
        persona: '人格', cohort: '局外帳號', id: 'ID', name: '名稱', type: '輕重',
        encounters: '遭遇次數', clearRate: '通過率', baseClearRate: '枷鎖關基準通過率',
        clearRateDelta: '通過率差', avgHpLost: '平均損血', avgTurns: '平均回合數', avgRerolls: '平均重骰數'
    }, agg.shackleRows.sort((a, b) => a.clearRateDelta - b.clearRateDelta)));

    paths.push(writeCsv(outDir, 'souls_rhythm.csv', {
        persona: '人格', cohort: '局外帳號', runs: '模擬局數', winRate: '通關率',
        avgSoulsPerRun: '平均每局靈魂', avgSoulsWin: '通關局平均靈魂', avgSoulsLoss: '失敗局平均靈魂',
        totalUpgradeCost: '全升級總價', estRunsToUnlockAll: '估計全解鎖局數', avgHighestDamage: '平均最高傷害'
    }, agg.soulsRows));

    paths.push(writeCsv(outDir, 'run_summary.csv', {
        persona: '人格', cohort: '局外帳號', seed: 'Seed', win: '通關',
        diedAtStage: '死亡關卡', soulsEarned: '靈魂收入', highestDamage: '最高傷害', relicsEnd: '結束時遺物'
    }, agg.runRows));

    return paths;
}
