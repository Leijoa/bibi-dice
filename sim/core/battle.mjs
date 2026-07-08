// sim/core/battle.mjs
// 單關戰鬥的無頭模擬。回合結構、重骰、鎖定限制、攻擊結算與枷鎖效果
// 全數移植自 js/main.js（各段註記來源行號），計分一律呼叫真引擎。

import { calculateEngineScore, isElite, isBoss } from './adapter.mjs';
import { buildShackleConfig, getMaxHp, getRuleMetaByName, getScoredRules, getEnemyWithMeta } from './rules.mjs';

function makeDice() {
    return Array(8).fill().map((_, i) => ({ val: 1, locked: false, id: i, matchedGroups: { A: false, B: false, C: false, D: false } }));
}

// main.js:2418 / 2496 / 2516 引擎 env 組裝（三處相同）
function buildEnv(ctx) {
    const { player, stage, metaData, collection } = ctx;
    return {
        level: stage.level,
        relics: player.relics,
        unlockedHands: collection.hands.size,
        playerHp: player.hp,
        maxHp: getMaxHp(metaData.upgrades, player),
        fivesRolled: player.fivesRolled,
        finalDamageUpgrade: metaData.upgrades.finalDamage || 0,
        damageBuffMulti: stage.damageBuffMulti || 1.0,
        isEliteOrBoss: isElite(stage.level) || isBoss(stage.level),
        bonusBasePoints: (player.bonusBasePoints || 0)
    };
}

// main.js:2413-2416 / 2492-2495 遺物封印：被封印的遺物不進引擎
function getActiveRelics(ctx) {
    const { player, stage } = ctx;
    if (stage.activeShackle === 'relicseal' && stage.shackleMeta && stage.shackleMeta.ignoredRelics) {
        return player.relics.filter(r => !stage.shackleMeta.ignoredRelics.includes(r));
    }
    return player.relics;
}

function score(ctx) {
    const { battle, player, stage } = ctx;
    const shackleConfig = buildShackleConfig(stage.activeShackle, stage.shackleMeta);
    battle.scoreResult = calculateEngineScore(
        battle.dice, getActiveRelics(ctx), battle.rollsLeft, player.hp,
        shackleConfig ? [shackleConfig] : [], stage.turnsLeft, buildEnv(ctx)
    );
    applyMatchTags(ctx);
}

// main.js:2426-2443 把牌型佔用標回骰子（黑洞下 8 視為 1 配對）
function applyMatchTags(ctx) {
    const { battle, stage } = ctx;
    battle.dice.forEach(d => { d.matchedGroups = { A: false, B: false, C: false, D: false }; });
    const matchVal = (die) => (stage.activeShackle === 'blackhole' && die.val === 8) ? 1 : die.val;
    const applyMatch = (usedVals, groupName) => {
        if (!usedVals || usedVals.length === 0) return;
        let available = battle.dice.filter(d => !d.matchedGroups[groupName]);
        usedVals.forEach(v => {
            const idx = available.findIndex(die => matchVal(die) === v);
            if (idx !== -1) {
                available[idx].matchedGroups[groupName] = true;
                available.splice(idx, 1);
            }
        });
    };
    applyMatch(battle.scoreResult.tagA.used, 'A');
    applyMatch(battle.scoreResult.tagB.used, 'B');
    applyMatch(battle.scoreResult.tagC.used, 'C');
    applyMatch(battle.scoreResult.tagD.used, 'D');
}

// main.js:2074-2109 startTurn
function startTurn(ctx) {
    const { player, stage, battle, metaData, rng } = ctx;

    // 貪吃：回合開始敵人回 3% 最大 HP（main.js:2081-2088）
    if (stage.activeShackle === 'gluttony' && stage.enemyHp < stage.enemyMaxHp) {
        const healAmount = Math.floor(stage.enemyMaxHp * 0.03);
        stage.enemyHp = Math.min(stage.enemyMaxHp, stage.enemyHp + healAmount);
    }

    // main.js:2090-2102 重骰次數：2 + 局外升級 + 刷新幣*2 + 越戰越勇 + 巧手指南 + 灌鉛骰*2
    let baseMaxRolls = 2
        + (metaData.upgrades.rerolls || 0)
        + (player.relics.filter(id => id === 'refresh').length * 2)
        + (player.berserkerBonus || 0)
        + player.relics.filter(id => id === 'cons_guide').length
        + (player.relics.filter(id => id === 'cons_loaded_dice').length * 2);
    if (stage.activeShackle === 'fatigue') baseMaxRolls = 1;
    if (stage.activeShackle === 'destinychain') baseMaxRolls = 1;

    player.maxRolls = baseMaxRolls;
    battle.rollsLeft = player.maxRolls;
    battle.balanceUsedThisTurn = false;
    battle.dice = makeDice();
    battle.scoreResult = null;

    executeRoll(ctx, true);
}

// main.js:2317-2467 executeRoll（去動畫版；世界隨機全走 ctx.rng）
function executeRoll(ctx, isInitial = false) {
    const { battle, player, stage, rng } = ctx;
    if (!isInitial && battle.rollsLeft <= 0) return false;

    if (!isInitial) {
        // 叛逆：已鎖骰 15% 掙脫（main.js:2328-2337）
        if (stage.activeShackle === 'rebel') {
            battle.dice.forEach(d => { if (d.locked && rng.chance(0.15)) d.locked = false; });
        }
        // 動態平衡：每回合第一次重骰免費（main.js:2339-2344）
        if (player.relics.includes('balance') && battle.rollsLeft === player.maxRolls && !battle.balanceUsedThisTurn) {
            battle.balanceUsedThisTurn = true;
        } else {
            battle.rollsLeft--;
        }
    }

    // 擲骰（main.js:2356）
    battle.dice = battle.dice.map(d => d.locked ? d : { ...d, val: rng.die() });

    // 幸運草：開局把前 3 顆未鎖骰設為 N 並消耗（main.js:2376-2388）
    if (isInitial) {
        [3, 4, 5, 6].forEach(num => {
            const cloverId = `cons_clover_${num}`;
            if (player.relics.includes(cloverId)) {
                const unlocked = battle.dice.filter(d => !d.locked);
                for (let i = 0; i < Math.min(3, unlocked.length); i++) unlocked[i].val = num;
                player.relics = player.relics.filter(r => r !== cloverId);
            }
        });
    }

    battle.dice.sort((a, b) => a.val - b.val);
    player.fivesRolled += battle.dice.filter(d => d.val === 5).length;

    // 強制轉換：重骰後隨機改 1 顆已鎖骰（main.js:2394-2402）
    if (!isInitial && stage.activeShackle === 'forcedshift') {
        const lockedDice = battle.dice.filter(d => d.locked);
        if (lockedDice.length > 0) {
            const target = rng.pick(lockedDice);
            target.val = rng.die();
            battle.dice.sort((a, b) => a.val - b.val);
        }
    }

    // 詛咒之鎖：開局強制鎖定點數最小的骰（main.js:2404-2409）
    if (isInitial && stage.activeShackle === 'cursedlock' && stage.shackleMeta) {
        const minVal = Math.min(...battle.dice.map(d => d.val));
        const cursedDie = battle.dice.find(d => d.val === minVal);
        cursedDie.locked = true;
        stage.shackleMeta.cursedId = cursedDie.id;
    }

    score(ctx);

    // 盲眼：每次擲骰後隨機遮 2 顆未鎖骰（main.js:2420-2424）
    if (stage.activeShackle === 'blind' && stage.shackleMeta) {
        const unlockedIndices = battle.dice.map((d, i) => !d.locked ? i : -1).filter(i => i !== -1);
        stage.shackleMeta.blindIndices = rng.shuffle(unlockedIndices).slice(0, 2);
    }
    return true;
}

// main.js:2121-2207 toggleLock 的限制規則（模擬器改為「可否鎖定 / 可否解鎖」判定）
export function getLockConstraints(ctx) {
    const { stage, battle } = ctx;
    return {
        lockingDisabled: stage.activeShackle === 'fragile',
        maxLocks: stage.activeShackle === 'hardcap' ? 4 : (stage.activeShackle === 'rusty' ? 6 : 8),
        // 終極封鎖：盤面（排序後）第 1,2,5,6 位無法鎖定（main.js:2137）
        forbiddenIndices: stage.activeShackle === 'ultimatelock' ? [1, 2, 5, 6] : [],
        // 詛咒之鎖：該骰無法解鎖（main.js:2127）
        cursedId: (stage.activeShackle === 'cursedlock' && stage.shackleMeta) ? stage.shackleMeta.cursedId : null
    };
}

// 把 persona 想要的鎖定集合（依目前排序後的索引）套進盤面，違規的要求靜默忽略（等同 UI 擋下）
function applyLockRequest(ctx, wantLockedIndices) {
    const { battle } = ctx;
    const cons = getLockConstraints(ctx);
    if (cons.lockingDisabled) {
        battle.dice.forEach(d => { d.locked = false; });
        return;
    }
    const want = new Set(wantLockedIndices || []);
    // 先處理解鎖（詛咒骰不可解）
    battle.dice.forEach((d, i) => {
        if (d.locked && !want.has(i)) {
            if (cons.cursedId !== null && d.id === cons.cursedId) return;
            d.locked = false;
        }
    });
    // 再處理鎖定（禁位、上限）
    battle.dice.forEach((d, i) => {
        if (!d.locked && want.has(i)) {
            if (cons.forbiddenIndices.includes(i)) return;
            if (battle.dice.filter(x => x.locked).length >= cons.maxLocks) return;
            d.locked = true;
        }
    });
}

// 給 persona 的觀察視圖：只暴露「畫面上看得到」的資訊（擬人核心）
export function buildView(ctx) {
    const { battle, player, stage, rng } = ctx;
    const meta = stage.shackleMeta || {};
    const sh = stage.activeShackle;

    const dice = battle.dice.map((d, i) => {
        let known = true;
        let displayVal = d.val;
        if (sh === 'blind' && (meta.blindIndices || []).includes(i)) { known = false; displayVal = null; }
        // 幻象：未鎖骰顯示同一個假數字（main.js/data.js illusion）
        if (sh === 'illusion' && !d.locked) { known = false; displayVal = meta.fakeNumber; }
        return {
            index: i, known, displayVal,
            locked: d.locked,
            matched: sh === 'amnesia' ? null : { ...d.matchedGroups } // 健忘：看不到牌型標記
        };
    });

    // 傷害預估的可視性（虛張聲勢/煙霧/酒醉/假象）
    let damagePreview = battle.scoreResult ? Math.floor(battle.scoreResult.finalScore) : null;
    if (sh === 'bluff' || sh === 'amnesia') damagePreview = null;
    else if (sh === 'shackle_drunk' && damagePreview !== null) {
        damagePreview = Math.floor(damagePreview * (1 + (rng.next() * 0.4 - 0.2)));
    } else if (sh === 'illusionary' && damagePreview !== null) {
        damagePreview = Math.floor(damagePreview * (meta.fakeRatio || 0.15));
    }

    return {
        dice,
        rollsLeft: battle.rollsLeft,
        maxRolls: player.maxRolls,
        turnsLeft: stage.turnsLeft,
        playerHp: player.hp,
        enemyHp: stage.enemyHp,
        enemyMaxHp: stage.enemyMaxHp,
        stageLevel: stage.level,
        isEliteOrBoss: isElite(stage.level) || isBoss(stage.level),
        shackleId: sh,
        shackleMetaPublic: sh === 'parityfear' ? { fearType: meta.fearType }
            : sh === 'numberplunder' ? { targetNumber: meta.targetNumber } : {},
        relics: [...player.relics],
        damagePreview,
        lockConstraints: getLockConstraints(ctx)
    };
}

// 給理論派的取樣器：以指定鎖定集合重骰一次的期望值（未知骰值一律均勻取樣）
// 注意：取樣使用 persona 專用 rng，不動世界 rng。
export function makeEvaluator(ctx) {
    const { battle, player, stage, personaRng } = ctx;
    const shackleConfig = buildShackleConfig(stage.activeShackle, stage.shackleMeta);
    const activeRelics = getActiveRelics(ctx);
    const env = buildEnv(ctx);
    const meta = stage.shackleMeta || {};
    const sh = stage.activeShackle;
    const unknown = (d, i) => (sh === 'blind' && (meta.blindIndices || []).includes(i))
        || (sh === 'illusion' && !d.locked);

    return {
        // 評估「以 lockedSet 鎖定後重骰一次」：回傳平均傷害與擊殺率
        evaluateReroll(lockedSet, samples) {
            const rollsAfter = Math.max(0, battle.rollsLeft - 1);
            let sum = 0, kills = 0;
            for (let s = 0; s < samples; s++) {
                const trial = battle.dice.map((d, i) => ({
                    val: (lockedSet.has(i) && !unknown(d, i)) ? d.val : personaRng.die(),
                    locked: lockedSet.has(i), id: d.id,
                    matchedGroups: { A: false, B: false, C: false, D: false }
                }));
                trial.sort((a, b) => a.val - b.val);
                const r = calculateEngineScore(trial, activeRelics, rollsAfter, player.hp,
                    shackleConfig ? [shackleConfig] : [], stage.turnsLeft, env);
                const dmg = Math.floor(r.finalScore);
                sum += dmg;
                if (dmg >= stage.enemyHp) kills++;
            }
            return { ev: sum / samples, pKill: kills / samples };
        },
        // 評估「現在直接攻擊」：全知骰面下是精確值；有未知骰時取樣
        evaluateStand(samples) {
            const anyUnknown = battle.dice.some((d, i) => unknown(d, i));
            if (!anyUnknown) {
                const dmg = Math.floor(battle.scoreResult.finalScore);
                return { ev: dmg, pKill: dmg >= stage.enemyHp ? 1 : 0 };
            }
            let sum = 0, kills = 0;
            for (let s = 0; s < samples; s++) {
                const trial = battle.dice.map((d, i) => ({
                    val: unknown(d, i) ? personaRng.die() : d.val,
                    locked: d.locked, id: d.id,
                    matchedGroups: { A: false, B: false, C: false, D: false }
                }));
                trial.sort((a, b) => a.val - b.val);
                const r = calculateEngineScore(trial, activeRelics, battle.rollsLeft, player.hp,
                    shackleConfig ? [shackleConfig] : [], stage.turnsLeft, env);
                const dmg = Math.floor(r.finalScore);
                sum += dmg;
                if (dmg >= stage.enemyHp) kills++;
            }
            return { ev: sum / samples, pKill: kills / samples };
        }
    };
}

// main.js:874-920 applyCombatShackles（反傷裝甲 / 同歸於盡；替身草人可擋）
function applyCombatShackles(ctx, dmg) {
    const { player, stage } = ctx;
    if (!stage.activeShackle) return;

    if (stage.activeShackle === 'thornarmor') {
        const threshold = stage.enemyMaxHp * 0.10;
        if (dmg < threshold) {
            if (player.relics.includes('cons_doll')) {
                player.relics.splice(player.relics.indexOf('cons_doll'), 1);
            } else {
                player.hp--;
                if (player.hp > 0 && player.relics.includes('berserker')) {
                    player.berserkerBonus = (player.berserkerBonus || 0) + 1;
                }
            }
        }
    }

    if (stage.activeShackle === 'mutualdestruction') {
        const recoil = Math.floor(dmg * 0.05);
        if (recoil > 0) {
            if (player.relics.includes('cons_doll')) {
                player.relics.splice(player.relics.indexOf('cons_doll'), 1);
            } else {
                player.hp -= recoil;
                if (player.hp <= 0) player.hp = 1; // 同歸於盡不會殺死玩家（main.js:910-914）
            }
        }
    }
}

// main.js:2470-2726 fireAttack → doAttack（去動畫、去成就/收藏 UI）
// 回傳 'died' | 'cleared' | 'continue'
function resolveAttack(ctx, rec) {
    const { battle, player, stage, rng, collection, metaData } = ctx;

    // 手抖：10% 強制重骰 1 顆未鎖骰並重新計分（main.js:2484-2499）
    if (stage.activeShackle === 'tremor' && rng.chance(0.10)) {
        const unlockedDice = battle.dice.filter(d => !d.locked);
        if (unlockedDice.length > 0) {
            const target = rng.pick(unlockedDice);
            target.val = rng.die();
            battle.dice.sort((a, b) => a.val - b.val);
            score(ctx);
        }
    }

    const finalDamage = Math.floor(battle.scoreResult.finalScore);
    let dmg = finalDamage;

    // 鐵壁：-20%（main.js:2542-2545）
    if (stage.activeShackle === 'ironwall') dmg = Math.floor(dmg * 0.8);

    // 絕對屏障：本關第一次攻擊無效（main.js:2547-2553）
    if (stage.activeShackle === 'absolutebarrier' && !stage.hasAttackedThisStage) {
        dmg = 0;
        stage.hasAttackedThisStage = true;
    } else {
        stage.hasAttackedThisStage = true;
    }

    // 深淵凝視：低於 20% 最大 HP 的攻擊轉為治療（main.js:2555-2560）
    if (stage.activeShackle === 'abyssgaze' && dmg > 0 && dmg < stage.enemyMaxHp * 0.20) {
        const healAmount = dmg;
        dmg = 0;
        stage.enemyHp = Math.min(stage.enemyMaxHp, stage.enemyHp + healAmount);
    }

    stage.enemyHp -= dmg;

    // 治癒之骰：每顆 2 回敵 3%（main.js:2565-2572）
    if (stage.activeShackle === 'healingdice') {
        const count2 = battle.dice.filter(d => d.val === 2).length;
        if (count2 > 0) {
            const healAmount = Math.floor(count2 * stage.enemyMaxHp * 0.03);
            stage.enemyHp = Math.min(stage.enemyMaxHp, stage.enemyHp + healAmount);
        }
    }

    // 天譴：觸發 rarity>=4 牌型扣 1 HP（main.js:2587-2603，L2 裁定含 rarity 5）
    if (stage.activeShackle === 'wrath') {
        const hasLegendary = getScoredRules(battle.scoreResult).some(({ rule }) => rule && rule.rarity >= 4);
        if (hasLegendary) player.hp -= 1;
    }

    // 統計 + 收集冊（牌型解鎖影響引擎 env.unlockedHands）
    rec.attacks++;
    rec.totalDamage += dmg;
    if (dmg > rec.maxAttack) rec.maxAttack = dmg;
    if (dmg > (player.highestDamage || 0)) player.highestDamage = dmg;
    getScoredRules(battle.scoreResult).forEach(({ rule, tag }) => {
        collection.hands.add(rule ? rule.id : tag.name);
        rec.scoredRules.push(rule ? rule.id : tag.name);
    });

    const isDefeated = stage.enemyHp <= 0;
    applyCombatShackles(ctx, dmg);

    // 玩家死亡判定優先於敵人死亡（main.js:2679-2685）
    if (player.hp <= 0) return 'died';
    if (isDefeated) return 'cleared';

    stage.turnsLeft--;
    if (stage.turnsLeft <= 0) {
        // 回合耗盡：替身草人可擋，否則扣 1 HP 後重置回合續戰（main.js:2691-2723）
        if (player.relics.includes('cons_doll')) {
            player.relics.splice(player.relics.indexOf('cons_doll'), 1);
        } else {
            player.hp--;
            if (player.hp > 0 && player.relics.includes('berserker')) {
                player.berserkerBonus = (player.berserkerBonus || 0) + 1;
            }
            if (player.hp <= 0) return 'died';
            rec.hpLostToTimeout++;
        }
        stage.turnsLeft = getEnemyWithMeta(stage.level, player.contractLevel).turns;
        if (stage.activeShackle === 'timecompress') stage.turnsLeft = 2;
    }
    return 'continue';
}

// 跑完一整關戰鬥。ctx 需求：{ rng, personaRng, player, stage, battle, metaData, collection, persona }
// 回傳戰鬥紀錄 rec 與 outcome
export function simulateBattle(ctx) {
    const { player, stage, persona } = ctx;
    ctx.battle = { dice: makeDice(), rollsLeft: 0, scoreResult: null, balanceUsedThisTurn: false };

    const rec = {
        level: stage.level,
        shackle: stage.activeShackle,
        hpStart: player.hp,
        attacks: 0, rerolls: 0, turns: 0,
        totalDamage: 0, maxAttack: 0,
        hpLostToTimeout: 0,
        scoredRules: [],
        outcome: null
    };

    let guard = 0;
    while (true) {
        if (++guard > 2000) throw new Error(`battle stuck at level ${stage.level} (shackle=${stage.activeShackle})`);
        startTurn(ctx);
        rec.turns++;

        // 行動迴圈：persona 決定重骰或攻擊
        let attacked = false;
        while (!attacked) {
            if (++guard > 2000) throw new Error(`action loop stuck at level ${stage.level}`);
            let action = { type: 'attack' };
            if (ctx.battle.rollsLeft > 0) {
                action = persona.decideAction(buildView(ctx), makeEvaluator(ctx), ctx.personaRng);
            }
            if (action.type === 'reroll' && ctx.battle.rollsLeft > 0) {
                applyLockRequest(ctx, action.locks);
                executeRoll(ctx, false);
                rec.rerolls++;
            } else {
                const result = resolveAttack(ctx, rec);
                attacked = true;
                if (result === 'died' || result === 'cleared') {
                    rec.outcome = result;
                    rec.hpEnd = player.hp;
                    return rec;
                }
            }
        }
    }
}
