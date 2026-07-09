// js/ui.js
import { RARITY, RELIC_DB, ENEMY_DB, RULE_DB, SHACKLE_DB, getEnemy, FUSION_RECIPES, FUSION_MATERIAL_LOOKUP, CONSUMABLES_DB, SOUL_UPGRADE_DB, SOUL_UPGRADE_BY_ID } from './data.js';
import { i18n } from './i18n.js';
import * as Audio from './audio.js';
import { getDiceImageFilter, getDiceImageUrl } from './diceSkin.js';
window.i18n = i18n;

// 開發者模式（比照 main.js 的 IS_DEV：localhost 或 Electron --bibi-dev 啟動）
const IS_DEV = window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1'
    || (window.location.protocol === 'bibi:' && new URLSearchParams(window.location.search).get('bibiDev') === '1');

const MYTHIC_CHARACTER_ASSETS = {
    lion: 'img/characters/thunderclaw-lion-cutout.png',
    pongo: 'img/characters/pongo-cutout.png'
};

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[char]));

const isRuleNameMatch = (rawName, ruleName) =>
    rawName === ruleName || rawName.startsWith(`${ruleName}(`);

const INVERSION_DICE_FILTERS = {
    slate: 'grayscale(0.85) brightness(1.15)',
    blue: 'hue-rotate(0deg)',
    pink: 'hue-rotate(78deg) saturate(1.3)',
    purple: 'hue-rotate(45deg) saturate(1.2)',
    teal: 'hue-rotate(300deg) saturate(1.15)',
    emerald: 'hue-rotate(270deg) saturate(1.25)',
    green: 'hue-rotate(270deg) saturate(1.25)',
    red: 'hue-rotate(120deg) saturate(1.45)',
    amber: 'hue-rotate(170deg) saturate(1.35) brightness(1.05)',
    yellow: 'hue-rotate(180deg) saturate(1.35) brightness(1.08)',
    orange: 'hue-rotate(150deg) saturate(1.4) brightness(1.04)'
};

const getInversionDiceFilter = (value, shackleMeta) => {
    if (!shackleMeta || !Array.isArray(shackleMeta.colorMap) || value < 1) return '';
    const colorToken = shackleMeta.colorMap[(value - 1) % shackleMeta.colorMap.length];
    const colorFamily = /^bg-([a-z]+)-\d+$/.exec(colorToken)?.[1];
    return INVERSION_DICE_FILTERS[colorFamily] || '';
};

// 緩存 DOM 元素
export const el = {
    stageInfo: document.getElementById('stage-info'),
    playerHp: document.getElementById('player-hp'),
    enemyName: document.getElementById('enemy-name'),
    enemyHpBar: document.getElementById('enemy-hp-bar'),
    enemyHpText: document.getElementById('enemy-hp-text'),
    turnsLeft: document.getElementById('turns-left'),
    diceContainer: document.getElementById('dice-container'),
    controlsContainer: document.getElementById('controls-container'),
    rollsBadge: document.getElementById('rolls-left-badge'),
    inventoryGrid: document.getElementById('inventory-grid'),
    scoreDisplay: document.getElementById('score-display'),
    finalScoreValue: document.getElementById('final-score-value'),
    battleArea: document.getElementById('battle-area'),
    rulesModal: document.getElementById('rules-modal'),
    rulesContent: document.getElementById('rules-content'),
    shopOverlay: document.getElementById('shop-overlay'),
    shopItemsContainer: document.getElementById('shop-items'),
    shopRerollBtn: document.getElementById('shop-reroll-btn'),
    shopForecast: document.getElementById('shop-omen-forecast'),
    endOverlay: document.getElementById('end-overlay'),
    endTitle: document.getElementById('end-title'),
    endDesc: document.getElementById('end-desc'),
    damageContainer: document.getElementById('damage-container'),
    hitFlash: document.getElementById('hit-flash'),
    titleScreen: document.getElementById('title-screen'),
    btnContinue: document.getElementById('btn-continue'),
    btnNewGame: document.getElementById('btn-new-game'),
    btnHistory: document.getElementById('btn-history'),
    historyModal: document.getElementById('history-modal'),
    historyContent: document.getElementById('history-content'),
    btnCloseHistory: document.getElementById('btn-close-history'),
    endStats: document.getElementById('end-stats'),
    btnCollection: document.getElementById('btn-collection'),
    collectionModal: document.getElementById('collection-modal'),
    collectionTotalProgress: document.getElementById('collection-total-progress'),
    btnCloseCollection: document.getElementById('btn-close-collection'),
    collectionContent: document.getElementById('collection-content'),
    tabHands: document.getElementById('tab-hands'),
    tabRelics: document.getElementById('tab-relics'),
    tabShackles: document.getElementById('tab-shackles'),
    btnSouls: document.getElementById('btn-souls'),
    soulsModal: document.getElementById('souls-modal'),
    btnCloseSouls: document.getElementById('btn-close-souls'),
    soulsContent: document.getElementById('souls-content'),
    soulsHeaderText: document.getElementById('souls-header-text'),
    runSetupModal: document.getElementById('run-setup-modal'),
    runSetupRelicSection: document.getElementById('run-setup-relic-section'),
    runSetupRelicList: document.getElementById('run-setup-relic-list'),
    runSetupRelicCount: document.getElementById('run-setup-relic-count'),
    runContractSection: document.getElementById('run-contract-section'),
    runContractRange: document.getElementById('run-contract-range'),
    runContractLevel: document.getElementById('run-contract-level'),
    runContractEffect: document.getElementById('run-contract-effect'),
    btnRunSetupConfirm: document.getElementById('btn-run-setup-confirm'),
    btnRunSetupCancel: document.getElementById('btn-run-setup-cancel'),
    btnCloseRunSetup: document.getElementById('btn-close-run-setup'),
    fateSelectionModal: document.getElementById('fate-selection-modal'),
    fateSelectionList: document.getElementById('fate-selection-list'),
    btnFateSelectionCancel: document.getElementById('btn-fate-selection-cancel'),
    btnCloseFateSelection: document.getElementById('btn-close-fate-selection'),
    devModal: document.getElementById('dev-modal'),
    settingsTitle: document.getElementById('settings-title'),
    devRelicSelect: document.getElementById('dev-relic-select'),
    devRelicCancel: document.getElementById('dev-relic-cancel'),
    devRelicConfirm: document.getElementById('dev-relic-confirm'),
    fusionReplaceModal: document.getElementById('fusion-replace-modal'),
    fusionReplaceTitle: document.getElementById('fusion-replace-title'),
    fusionReplaceContent: document.getElementById('fusion-replace-content'),
    damagePreviewBar: document.getElementById('damage-preview-bar'),
    finalDamagePreview: document.getElementById('final-damage-preview'),
    playerHeartHp: document.getElementById('player-heart-hp'),
    boardPanel: document.getElementById('board-panel')
};

function getGameViewportRect() {
    const container = document.getElementById('game-container');
    if (container) return container.getBoundingClientRect();
    return {
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        right: window.innerWidth,
        bottom: window.innerHeight
    };
}

if (document.getElementById('btn-rules')) {
    document.getElementById('btn-rules').innerHTML = i18n.t('ui.btn_rules') || "牌型表";
    document.getElementById('btn-rules').className = "btn-secondary text-xs md:text-sm font-black py-2 px-4 rounded-lg active:scale-95 flex items-center";
}

// --- 動畫與特效 ---
export function shootConfetti() {
    if (typeof confetti === 'function') {
        const rect = getGameViewportRect();
        const highlightCard = document.querySelector('.highlight-card');
        if (highlightCard) {
            const cardRect = highlightCard.getBoundingClientRect();
            const leftOrigin = {
                x: Math.max(0.04, (cardRect.left - 8) / window.innerWidth),
                y: Math.max(0.12, (cardRect.top + cardRect.height * 0.28) / window.innerHeight)
            };
            const rightOrigin = {
                x: Math.min(0.96, (cardRect.right + 8) / window.innerWidth),
                y: leftOrigin.y
            };
            const colors = ['#fbbf24', '#f87171', '#60a5fa', '#34d399'];
            confetti({ particleCount: 36, spread: 42, angle: 225, origin: leftOrigin, colors });
            confetti({ particleCount: 36, spread: 42, angle: 135, origin: rightOrigin, colors });
            return;
        }
        const origin = {
            x: (rect.left + rect.width * 0.5) / window.innerWidth,
            y: (rect.top + rect.height * 0.56) / window.innerHeight
        };
        confetti({ particleCount: 100, spread: 70, angle: 180, origin, colors: ['#fbbf24', '#f87171', '#60a5fa', '#34d399'] });
    }
}

// 更新：讓 Toast 提示更顯眼，支援多行文字
let activeToasts = [];
let activeInfoToast = null;

function repositionToasts() {
    const rect = getGameViewportRect();
    const spacing = Math.max(8, Math.min(12, rect.height * 0.012));
    let currentY = rect.top + rect.height * 0.42;

    for (let i = activeToasts.length - 1; i >= 0; i--) {
        let t = activeToasts[i].toast || activeToasts[i];
        t.style.left = `${rect.left + rect.width / 2}px`;
        t.style.maxWidth = `${Math.max(240, rect.width - 32)}px`;
        t.style.top = currentY + 'px';
        currentY += t.offsetHeight + spacing;
    }
}

export function clearToasts() {
    activeToasts.forEach(entry => {
        if (entry.timer) clearTimeout(entry.timer);
        entry.dismissed = true;
        if (entry.toast) entry.toast.remove();
    });
    activeToasts = [];
    activeInfoToast = null;
}

export function showToast(msg, callback, options = {}) {
    const duration = Number.isFinite(options.duration) ? options.duration : 2200;
    const closable = Boolean(options.closable);
    const zIndex = Number.isFinite(options.zIndex) ? options.zIndex : null;
    const toggleKey = typeof options.toggleKey === 'string' ? options.toggleKey : null;
    if (toggleKey && activeInfoToast) {
        const shouldCloseOnly = activeInfoToast.key === toggleKey;
        activeInfoToast.dismiss();
        if (shouldCloseOnly) return null;
    }

    let toast = document.createElement('div');
    toast.className = 'fixed bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_50px_rgba(122,59,245,0.4)] border-2 border-violet-500/60 z-[100] text-lg md:text-2xl text-center flex flex-col gap-2 toast-enter whitespace-pre-wrap leading-relaxed transition-all duration-300';
    // toast 為純通知，設 pointer-events:none，避免它蓋在 modal（如設定視窗）上時擋住下方控制項的點擊。
    // 成因：toast 掛在 body，而 modal 在有 transform 的 #game-container 內（獨立 stacking context），
    // body 層 toast 會疊在被困住的 modal 之上；設 none 即可讓點擊穿透，closable 的 × 另設 auto。
    toast.style.pointerEvents = 'none';
    if (closable) toast.style.paddingRight = '2.75rem';
    if (zIndex !== null) toast.style.zIndex = String(zIndex);

    if (msg instanceof Node) {
        toast.appendChild(msg);
    } else {
        toast.textContent = msg;
    }

    const toastEntry = {
        toast,
        timer: null,
        dismissed: false
    };
    const dismissToast = () => {
        if (toastEntry.dismissed) return;
        toastEntry.dismissed = true;
        if (toastEntry.timer) clearTimeout(toastEntry.timer);
        if (activeInfoToast && activeInfoToast.toast === toast) activeInfoToast = null;
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
            activeToasts = activeToasts.filter(entry => entry.toast !== toast);
            repositionToasts();
            if(callback) callback();
        }, 300);
    };

    if (closable) {
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'absolute top-1.5 right-2.5 text-slate-400 hover:text-white active:scale-95 transition-colors text-2xl leading-none font-black';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '6px';
        closeBtn.style.right = '10px';
        closeBtn.style.left = 'auto';
        closeBtn.style.pointerEvents = 'auto'; // toast 本體 pointer-events:none，但 × 需可點
        closeBtn.textContent = '×';
        closeBtn.setAttribute('aria-label', i18n.t('ui.toast_close') || 'Close');
        closeBtn.setAttribute('title', i18n.t('ui.toast_close') || 'Close');
        closeBtn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            dismissToast();
        };
        toast.appendChild(closeBtn);
    }

    document.body.appendChild(toast);
    activeToasts.push(toastEntry);
    if (toggleKey) activeInfoToast = { key: toggleKey, toast, dismiss: dismissToast };

    repositionToasts();
    toastEntry.timer = setTimeout(dismissToast, duration);
    return toast;
}
window.showToast = showToast;

export function playShackleSealAnimation(callback) {
    const oldOverlay = document.querySelector('.shackle-seal-overlay');
    if (oldOverlay) oldOverlay.remove();

    Audio.playShackleSealSound();

    const overlay = document.createElement('div');
    overlay.className = 'shackle-seal-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    const chainLinks = Array.from({ length: 9 }, (_, idx) =>
        `<span class="shackle-link ${idx % 2 === 0 ? 'shackle-link-long' : 'shackle-link-cross'}"></span>`
    ).join('');
    overlay.innerHTML = `
        <div class="shackle-seal-vignette"></div>
        <div class="shackle-chain shackle-chain-a">${chainLinks}</div>
        <div class="shackle-chain shackle-chain-b">${chainLinks}</div>
        <div class="shackle-seal-core"></div>
        <div class="shackle-seal-flash"></div>
    `;

    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.classList.add('shackle-seal-exit');
        setTimeout(() => {
            overlay.remove();
            if (callback) callback();
        }, 260);
    }, 1450);
}

// --- 動態生成牌型表 ---
// 牌型表範例骰：每個牌型以「子牌型分組」呈現（僅供圖示辨識，非實際計分盤面）。
// 複合牌型拆成多組並以「＋」串接，對應說明文字的結構，一眼看懂牌型組成。
const RULE_EXAMPLE_DICE = {
    // A 區：同數（單組）
    rule_a0: [[3, 3, 3, 3, 3, 3, 3, 3]],
    rule_a1: [[3, 3, 3, 3, 3, 3, 3]],
    rule_a2: [[3, 3, 3, 3, 3, 3]],
    rule_a3: [[3, 3, 3, 3, 3]],
    rule_a4: [[3, 3, 3, 3]],
    rule_a5: [[3, 3, 3]],
    rule_a6: [[3, 3]],
    // B 區：順子 / 彗星（單組連續）
    rule_b0: [[1, 2, 3, 4, 5, 6, 7, 8]],
    rule_b1: [[1, 2, 3, 4, 5, 6, 7]],
    rule_b2: [[1, 2, 3, 4, 5, 6]],
    rule_b3: [[2, 3, 4, 5, 6]],
    rule_b4: [[3, 4, 5, 6]],
    rule_b5: [[4, 5, 6]],
    // C 區：複合牌型（多組，對應「A + B」結構）
    rule_c0: [[2, 2, 2, 2], [6, 6, 6, 6]],
    rule_c1: [[3, 3, 3, 3, 3], [7, 7, 7]],
    rule_c2: [[2, 2, 2, 2], [5, 5], [7, 7]],
    rule_c3: [[1, 2, 3], [6, 7, 8], [4, 5]],
    rule_c4: [[1, 1], [3, 3], [5, 5], [7, 7]],
    rule_c5: [[1, 2, 3, 4], [5, 6, 7, 8]],
    rule_c6: [[2, 2, 2, 2], [6, 6, 6]],
    rule_c7: [[1, 2, 3], [5, 6, 7], [8, 8]],
    rule_c8: [[2, 2, 2], [5, 5, 5], [7, 7]],
    rule_c9: [[1, 2, 3], [6, 6, 6]],
    rule_c10: [[1, 2, 3], [6, 7, 8]],
    rule_c11: [[2, 2, 2], [6, 6, 6]],
    rule_c12: [[3, 3, 3], [7, 7]],
    rule_c13: [[1, 1], [4, 4], [7, 7]],
    rule_c14: [[2, 2], [6, 6]],
    // D 區：特殊盤面 / 數列（單組完整盤面）
    rule_d0: [[1, 1, 1, 8, 8, 8, 8, 8]],
    rule_d1: [[1, 1, 3, 3, 5, 5, 7, 7]],
    rule_d2: [[1, 2, 3, 4, 5, 6, 7, 8]],
    rule_d3: [[2, 3, 4, 5, 6, 7, 3, 6]],
    rule_d4: [[1, 1, 2, 3, 5, 8]],
    rule_d5: [[3, 1, 4, 1, 6]],
    rule_d6: [[2, 7, 1, 8, 2, 8]],
    rule_d7: [[1, 2, 4, 8]],
    rule_d8: [[1, 1, 2, 2, 4, 4, 8, 8]],
    rule_d9: [[2, 3, 5, 7]],
    rule_d10: [[2, 2, 3, 3, 5, 5, 7, 7]]
};

function renderRuleExampleDice(ruleId) {
    const groups = RULE_EXAMPLE_DICE[ruleId];
    if (!groups || !groups.length) return '';
    const groupsHtml = groups.map(vals => {
        const dice = vals.map(v =>
            `<img class="rule-dice-mini" src="${getDiceImageUrl(v)}" style="filter:${getDiceImageFilter(v)} drop-shadow(0 1px 1.5px rgba(0,0,0,0.55));" alt="${v}">`
        ).join('');
        return `<span class="rule-dice-group">${dice}</span>`;
    }).join('<span class="rule-dice-plus">+</span>');
    return `<div class="rule-card__dice" aria-hidden="true">${groupsHtml}</div>`;
}

export function renderRulesDB() {
    let html = '';
    const groups = [
        { key: 'groupA', titleKey: 'rules.groupA_desc' },
        { key: 'groupB', titleKey: 'rules.groupB_desc' },
        { key: 'groupC', titleKey: 'rules.groupC_desc' },
        { key: 'groupD', titleKey: 'rules.groupD_desc' }
    ];
    
    groups.forEach(g => {
        html += `<h3 class="rules-group-title text-base md:text-lg font-black text-slate-300 mt-4 mb-2 border-b border-slate-700 pb-1">${i18n.t(g.titleKey)}</h3>`;
        html += `<div class="rules-grid grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">`;
        RULE_DB[g.key].slice().sort((a, b) => b.rarity - a.rarity).forEach((rule, rIdx) => {
            const origIdx = RULE_DB[g.key].indexOf(rule);
            let rStyle = RARITY[rule.rarity] || RARITY[1];
            let letter = g.key.replace('group', '').toLowerCase();
            let ruleName = i18n.t(`rules.rule_${letter}${origIdx}.name`) || rule.name;
            let ruleDesc = i18n.t(`rules.rule_${letter}${origIdx}.desc`) || rule.desc;

            html += `
            <div class="rule-card flex justify-between items-start gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700">
                <div class="rule-card__copy min-w-0">
                    <div class="rule-card__name font-bold ${rStyle.color}">${ruleName}</div>
                    <div class="rule-card__desc text-slate-400">${ruleDesc}</div>
                    ${renderRuleExampleDice(rule.id)}
                </div>
                <div class="rule-card__multi font-black text-violet-300 shrink-0">${rule.multi}</div>
            </div>`;
        });
        html += `</div>`;
    });
    el.rulesContent.innerHTML = html;
}

function syncLowHealthVignette(isDanger) {
    const ID = 'low-health-vignette';
    let overlay = document.getElementById(ID);
    if (isDanger) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = ID;
            overlay.className = 'low-health-vignette';
            document.body.appendChild(overlay);
        }
        overlay.classList.remove('hidden');
    } else {
        if (overlay) overlay.classList.add('hidden');
    }
}

// --- 更新 UI 狀態 ---
export function updateHeaderUI(player, stage) {
    // Check if the shop is visible
    const shopOverlay = document.getElementById('shop-overlay');
    const isShopOpen = shopOverlay && !shopOverlay.classList.contains('hidden');

    // Determine which level index to display
    const targetLevel = isShopOpen ? stage.level + 1 : stage.level;

    let stageStr = "";
    if (targetLevel < ENEMY_DB.length) {
        stageStr = `${targetLevel + 1} / ${ENEMY_DB.length}`;
    } else {
        let infiniteLevel = targetLevel - ENEMY_DB.length + 1;
        let n = Math.floor((infiniteLevel - 1) / 3) + 1;
        let m = ((infiniteLevel - 1) % 3) + 1;
        stageStr = `∞ ${n}-${m}`;
    }

    const i18nKey = isShopOpen ? 'ui.next_stage' : 'ui.stage';

    if (el.stageInfo) {
        el.stageInfo.setAttribute('data-i18n', i18nKey);
        el.stageInfo.setAttribute('data-i18n-args', stageStr);
        if (window.i18n) {
            el.stageInfo.innerText = window.i18n.t(i18nKey, stageStr);
        }
    }
    
    let maxHp = window.getMaxHp ? window.getMaxHp() : 3;
    if (window.getStageActiveShackle && window.getStageActiveShackle() === 'wither') {
        maxHp = 1;
    }
    
    if (el.playerHp) el.playerHp.innerText = `${player.hp}/${maxHp}`;
    if (el.playerHeartHp) {
        const hp = Math.max(0, Math.floor(player.hp || 0));
        const totalHearts = Math.max(hp, Math.max(0, Math.floor(maxHp || 0)));
        const hpLabel = `<span class="heart-hp__label">${i18n.t('ui.hp')}:</span>`;
        const heartHtml = Array.from({ length: totalHearts }, (_, idx) => {
            const isFull = idx < hp;
            const src = isFull ? 'img/Heart_full.png' : 'img/Heart_null.png';
            const cls = isFull ? 'heart-hp__icon' : 'heart-hp__icon heart-hp__icon--empty';
            return `<img class="${cls}" src="${src}" alt="" aria-hidden="true" data-heart-index="${idx}">`;
        }).join('');
        el.playerHeartHp.innerHTML = hpLabel + heartHtml;
        el.playerHeartHp.setAttribute('aria-label', `HP ${hp}/${maxHp}`);
        el.playerHeartHp.classList.toggle('heart-hp--state-danger', hp > 0 && hp <= 1);
        syncLowHealthVignette(hp > 0 && hp <= 1);
    }

    let recycleStatus = document.getElementById('recycle-status');
    if (recycleStatus) {
        recycleStatus.classList.add('hidden');
    }
    updateBoardBackground(stage.level, stage.activeShackle);
}

export function updateEnemyUI(stage) {
    let enemy = window.getEnemyWithMeta ? window.getEnemyWithMeta(stage.level) : getEnemy(stage.level);
    
    let shackleHtml = '';
    // legacy support if stage.shackles array exists
    if (stage.shackles && stage.shackles.length > 0) {
        shackleHtml += stage.shackles.map(sh => `<span onclick="window.showShackleInfo('${sh.id}')" class="ml-2 bg-red-900/80 hover:bg-red-800 text-[12px] md:text-xs text-red-300 px-1.5 py-0.5 rounded cursor-pointer border border-red-500/50 shadow-sm transition-colors active:scale-95 flex-shrink-0">${i18n.t('ui.dev_shackle_current')}</span>`).join('');
    }

    // new logic using activeShackle
    const activeShackleId = window.getStageActiveShackle && window.getStageActiveShackle();
    if (activeShackleId) {
        const _shackleDef = SHACKLE_DB.find(s => s.id === activeShackleId);
        const _shackleName = _shackleDef ? (i18n.t(`shackles.${activeShackleId}.name`) || _shackleDef.name) : '';
        const _shackleLabel = _shackleName.replace(/[【】\[\]]/g, '').trim();
        const _newBadge = window.isCurrentShackleNew && window.isCurrentShackleNew(activeShackleId)
            ? renderNewBadge('new-badge--shackle')
            : '';
        shackleHtml += `<span id="active-shackle-badge" onclick="window.showShackleInfo('${activeShackleId}')" class="relative ml-1.5 bg-red-900/80 hover:bg-red-800 text-[10px] md:text-[12px] text-red-300 px-1 py-0.5 rounded cursor-pointer border border-red-500/50 shadow-sm transition-colors active:scale-95 flex-shrink-0 overflow-visible inline-flex items-center" title="${_shackleLabel}"><span class="max-w-[100px] md:max-w-none truncate">${_shackleLabel}</span>${_newBadge}</span>`;
    }

    let localizedEnemyName = enemy.name;

    if (stage.level < ENEMY_DB.length) {
        localizedEnemyName = i18n.t(`enemies.enemy_${stage.level}`) || enemy.name;
    } else {
        // Handle Infinite Tower dynamically via i18n
        localizedEnemyName = i18n.t(`monsters.monster_${stage.infiniteMonsterId}`);
    }

    // Layer badge
    let layerBadgeText;
    if (stage.level < ENEMY_DB.length) {
        layerBadgeText = i18n.t('ui.stage', stage.level + 1);
    } else {
        const _inf = stage.level - ENEMY_DB.length + 1;
        const _n = Math.floor((_inf - 1) / 3) + 1;
        const _m = ((_inf - 1) % 3) + 1;
        layerBadgeText = `${_n}-${_m}`;
    }

    // Shackle title badge (brackets stripped)
    let shackleTitleHtml = '';
    if (activeShackleId) {
        const _sd = SHACKLE_DB.find(s => s.id === activeShackleId);
        const _rawName = _sd ? (i18n.t(`shackles.${activeShackleId}.name`) || _sd.name) : '';
        const _stripped = _rawName.replace(/[【】\[\]]/g, '').trim();
        if (_stripped) shackleTitleHtml = `<span class="shackle-title-badge">${_stripped}</span>`;
    }

    el.enemyName.innerHTML = `<span class="stage-layer-badge">${layerBadgeText}</span><span class="enemy-name-text">${localizedEnemyName}</span>${shackleHtml}`;

    el.enemyName.className = "text-xl font-bold flex-1 flex items-center min-w-0";
    if (stage.level >= ENEMY_DB.length) {
        el.enemyName.classList.add("text-fuchsia-400");
    } else if (stage.level === 4) {
        el.enemyName.classList.add("text-amber-400");
    } else if (stage.level === 3) {
        el.enemyName.classList.add("text-purple-400");
    } else if (stage.level === 2) {
        el.enemyName.classList.add("text-rose-400");
    } else {
        el.enemyName.classList.add("text-slate-200");
    }
    
    el.turnsLeft.innerText = i18n.t('ui.turns_left', stage.turnsLeft);
    el.turnsLeft.classList.add('enemy-countdown');
    el.turnsLeft.classList.toggle('countdown-urgent', stage.turnsLeft === 1);
    let pct = Math.max(0, (stage.enemyHp / stage.enemyMaxHp) * 100);
    el.enemyHpBar.style.width = `${pct}%`;
    el.enemyHpText.innerText = `${Math.floor(stage.enemyHp).toLocaleString()} / ${stage.enemyMaxHp.toLocaleString()}`;
    updateBoardBackground(stage.level, stage.activeShackle);
}

function updateBoardBackground(level, shackleId) {
    const panel = el.boardPanel;
    if (!panel) return;
    panel.classList.remove('board-shackled', 'board-shackled-boss');
    if (level >= ENEMY_DB.length) {
        const infiniteLevel = level - ENEMY_DB.length + 1;
        const m = ((infiniteLevel - 1) % 3) + 1;
        if (m === 3) panel.classList.add('board-shackled-boss');
    } else if (shackleId) {
        panel.classList.add('board-shackled');
    }
}

window.showShackleInfo = function(id) {
    let s = SHACKLE_DB.find(x => x.id === id);
    if(s) {
        // 使用 i18n 翻譯，若語系檔找不到則退回原本的中文 s.name / s.desc
        let sName = i18n.t(`shackles.${s.id}.name`) || s.name;
        let sDesc = i18n.t(`shackles.${s.id}.desc`) || s.desc;

        let container = document.createElement('div');
        let nameSpan = document.createElement('span');
        nameSpan.className = s.type === 'heavy' ? "text-red-400 font-black" : "text-amber-400 font-black";
        nameSpan.textContent = sName; // 使用翻譯後的名稱

        if (window.isCurrentShackleNew && window.isCurrentShackleNew(id)) {
            let badgeSpan = document.createElement('span');
            badgeSpan.className = "new-badge new-badge--inline";
            badgeSpan.textContent = i18n.t('ui.fusion_new_item');
            nameSpan.appendChild(badgeSpan);
        }

        let descSpan = document.createElement('span');
        descSpan.className = "text-sm md:text-lg text-slate-200 mt-2 block";
        descSpan.textContent = sDesc; // 使用翻譯後的描述

        container.appendChild(nameSpan);
        container.appendChild(descSpan);

        const infoToast = showToast(container, null, {
            duration: 10000,
            closable: true,
            zIndex: 220,
            toggleKey: `shackle:${id}`
        });
        if (infoToast && window.onTutorialShackleInfo) window.onTutorialShackleInfo(id);
    }
};

// --- 任務4：遺物點擊顯示說明 ---
export function renderInventory(player, battle) {
    el.inventoryGrid.className = "flex overflow-x-auto gap-1.5 pb-2 scroll-smooth items-center hide-scrollbar scrollable-row";
    const visibleRelics = (player.relics || []).filter(id => !id.startsWith('cons_'));
    if (visibleRelics.length === 0) {
        el.inventoryGrid.innerHTML = `<div class="text-[12px] text-slate-500 font-bold p-1">${i18n.t("ui.empty_inventory")}</div>`;
        return;
    }
    const itemMap = new Map([
        ...RELIC_DB.map(x => [x.id, x]),
        ...CONSUMABLES_DB.map(x => [x.id, x])
    ]);
    let sortedRelics = [...visibleRelics].sort((a, b) => {
        const rarityA = (itemMap.get(a) || {rarity: 1}).rarity;
        const rarityB = (itemMap.get(b) || {rarity: 1}).rarity;
        return rarityB - rarityA;
    });

    let isNoise = window.getStageActiveShackle && window.getStageActiveShackle() === 'noise';

    let playerRelicSet = (player && player.relics) ? new Set(player.relics) : null;

    el.inventoryGrid.innerHTML = sortedRelics.map(id => {
        if (isNoise) {
            return `
            <div onclick="window.showToast(i18n.t('messages.toast_noise_interfere'))" class="bg-slate-700/50 px-2 py-1 rounded-full border border-slate-500 shadow-sm flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform active:scale-95">
                <span class="text-[12px] md:text-xs font-black text-slate-400 whitespace-nowrap">????</span>
            </div>`;
        }

        let r = itemMap.get(id);
        let style = RARITY[r.rarity];
        let isFusionMaterial = false;
        let fusionResultId = null;

        if (playerRelicSet) {
            let lookup = FUSION_MATERIAL_LOOKUP[r.id];
            if (lookup && playerRelicSet.has(lookup.mat)) {
                isFusionMaterial = true;
                fusionResultId = lookup.fid;
            }
        }

        let rName = id.startsWith('cons_') ? i18n.t(`consumables.${id}.name`) : (i18n.t(`relics.${id}.name`) || r.name);
        return `
        <div data-relic-id="${r.id}" role="button" tabindex="0" onpointerdown="window._relicPressStart(event, '${r.id}')" onpointermove="window._relicPressMove(event)" onpointerup="window._relicPressEnd(event, '${r.id}')" onclick="window._relicPressClick(event, '${r.id}')" class="${style.bg} px-2 py-1 rounded-full border ${style.border} shadow-sm flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform active:scale-95">
            <span class="text-[12px] md:text-xs font-black ${style.color} whitespace-nowrap">${rName}</span>
        </div>`;
    }).join('');
}

// 註冊給 inventory 點擊用的全域函式
window.showRelicInfo = function(id) {
    let r = RELIC_DB.find(x => x.id === id) || CONSUMABLES_DB.find(x => x.id === id);
    if(r) {
        let rName = id.startsWith('cons_') ? i18n.t(`consumables.${id}.name`) : (i18n.t(`relics.${id}.name`) || r.name);
        let rDesc = id.startsWith('cons_') ? i18n.t(`consumables.${id}.desc`) : (i18n.t(`relics.${id}.desc`) || r.desc);

        let container = document.createElement('div');
        let nameSpan = document.createElement('span');
        nameSpan.className = "text-amber-400 font-black";
        nameSpan.textContent = rName;

        let descSpan = document.createElement('span');
        descSpan.className = "text-sm md:text-lg text-slate-200 mt-2 block";

        let fusionText = '';
        if (r.rarity === 5 && FUSION_RECIPES[r.id]) {
            let mat1Id = FUSION_RECIPES[r.id].mat1;
            let mat2Id = FUSION_RECIPES[r.id].mat2;
            let mat1Def = RELIC_DB.find(x => x.id === mat1Id);
            let mat2Def = RELIC_DB.find(x => x.id === mat2Id);
            let mat1Name = mat1Def ? (i18n.t(`relics.${mat1Id}.name`) || mat1Def.name) : mat1Id;
            let mat2Name = mat2Def ? (i18n.t(`relics.${mat2Id}.name`) || mat2Def.name) : mat2Id;
            fusionText = i18n.t('ui.fusion_condition', mat1Name, mat2Name);
        }

        descSpan.textContent = rDesc + fusionText;

        container.appendChild(nameSpan);
        container.appendChild(descSpan);

        showToast(container, null, {
            duration: 10000,
            closable: true,
            zIndex: 220,
            toggleKey: `relic:${id}`
        });
    }
};

// --- 巨型八邊形骰子渲染 ---
let relicDirectPress = null;
let relicDirectLastOpen = { id: null, at: 0 };

window._relicPressStart = function(e, id) {
    relicDirectPress = {
        id,
        x: e.clientX || 0,
        y: e.clientY || 0,
        moved: false
    };
};

window._relicPressMove = function(e) {
    if (!relicDirectPress) return;
    const dx = Math.abs((e.clientX || 0) - relicDirectPress.x);
    const dy = Math.abs((e.clientY || 0) - relicDirectPress.y);
    if (dx > 5 || dy > 5) relicDirectPress.moved = true;
};

window._relicPressEnd = function(e, id) {
    if (!relicDirectPress || relicDirectPress.id !== id) return;
    if (!relicDirectPress.moved) {
        e.preventDefault();
        e.stopPropagation();
        relicDirectLastOpen = { id, at: Date.now() };
        window.showRelicInfo(id);
    }
    relicDirectPress = null;
};

window._relicPressClick = function(e, id) {
    if (relicDirectLastOpen.id === id && Date.now() - relicDirectLastOpen.at < 500) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    if (relicDirectPress && relicDirectPress.id === id && relicDirectPress.moved) {
        relicDirectPress = null;
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    relicDirectLastOpen = { id, at: Date.now() };
    window.showRelicInfo(id);
};

export function renderDice(battle, activeHighlight, player) {
    let shackleId = window.getStageActiveShackle ? window.getStageActiveShackle() : null;
    let shackleMeta = window.getShackleMeta ? window.getShackleMeta() : null;
    const suppressMythic = Boolean(SHACKLE_DB.find(shackle => shackle.id === shackleId)?.suppressMythic);
    const activeRelics = player?.relics
        ? (suppressMythic ? player.relics.filter(id => !id.startsWith('fusion_')) : player.relics)
        : [];
    updateBoardBackground(window.getStageLevel ? window.getStageLevel() : 0, shackleId);

    el.diceContainer.innerHTML = battle.dice.map((d, idx) => {
        let wrapperClass = "w-[58px] h-[58px] md:w-[86px] md:h-[86px] relative mx-auto my-0.5 cursor-pointer dice-btn transition-transform duration-200";

        let outerColor = "bg-slate-600";
        let innerColor = "bg-slate-900";
        let innerHover = "hover:bg-slate-800";
        let textColor = "text-white";
        let extraClass = "";
        let displayOrderStyle = "";
        let inversionFilter = "";

        // UI Hook: dizziness - random visual grid order
        if (shackleId === 'dizziness' && shackleMeta && shackleMeta.displayOrder) {
            displayOrderStyle = `style="order: ${shackleMeta.displayOrder[idx]};"`;
        }

        if(battle.state !== 'IDLE'){
            if (battle.state === 'ROLLING' && !d.locked) {
                innerColor = "bg-slate-800"; outerColor = "bg-slate-600"; textColor = "text-slate-500"; extraClass = "animate-pulse"; innerHover = "";
            } else if (battle.state === 'WAIT_ACTION') {
                if (activeHighlight) {
                    if (d.matchedGroups[activeHighlight]) {
                        if (activeHighlight === 'A') { innerColor = "bg-blue-600"; outerColor = "bg-blue-300"; extraClass = "scale-110 z-20 dice-glow-A"; }
                        else if (activeHighlight === 'B') { innerColor = "bg-pink-600"; outerColor = "bg-pink-300"; extraClass = "scale-110 z-20 dice-glow-B"; }
                        else if (activeHighlight === 'C') { innerColor = "bg-purple-600"; outerColor = "bg-purple-300"; extraClass = "scale-110 z-20 dice-glow-C"; }
                        else if (activeHighlight === 'D') { innerColor = "bg-teal-600"; outerColor = "bg-teal-300"; extraClass = "scale-110 z-20 dice-glow-D"; }
                        innerHover = "";
                    } else {
                        innerColor = "bg-slate-800"; outerColor = "bg-slate-700"; textColor = "text-slate-600"; extraClass = "opacity-30"; innerHover = "";
                    }
                } else {
                    if (d.locked) {
                        innerColor = "bg-emerald-900"; outerColor = "bg-emerald-400"; textColor = "text-emerald-300"; extraClass = "dice-glow-locked"; innerHover = "";
                    } else {
                        if (d.matchedGroups['A'] || d.matchedGroups['B'] || d.matchedGroups['C'] || d.matchedGroups['D']) {
                            innerColor = "bg-blue-900"; outerColor = "bg-blue-400"; textColor = "text-blue-200"; extraClass = "dice-glow-A";
                        } else {
                            extraClass = "dice-glow-idle";
                        }
                    }
                }
            } else if (d.locked) {
                innerColor = "bg-emerald-900"; outerColor = "bg-emerald-400"; textColor = "text-emerald-300"; extraClass = "dice-glow-locked"; innerHover = "";
            }
        }

        // UI Hook: inversion - apply the saved color map to the PNG dice skin.
        if (shackleId === 'inversion' && shackleMeta && shackleMeta.colorMap && battle.state !== 'IDLE' && battle.state !== 'ROLLING') {
            inversionFilter = getInversionDiceFilter(d.val, shackleMeta);
        }

        let octagonClip = "[clip-path:polygon(29%_0%,71%_0%,100%_29%,100%_71%,71%_100%,29%_100%,0%_71%,0%_29%)]";
        
        let valDisplay = d.val;
        
        let baseVal = d.val;
        let isEnhanced = false;
        if (activeRelics.length > 0) {
            let val = d.val;
            let E = (window.getStageLevel ? window.getStageLevel() : 0) + 1;

            if (val === 1 || val === 2) {
                if (activeRelics.includes('fusion_source')) { baseVal = 15 + (E * 2.5); isEnhanced = true; }
            }
            if (val === 2 && activeRelics.includes('fusion_blood_crusade')) {
                baseVal = 30; isEnhanced = true;
            }

            if (!isEnhanced && activeRelics.includes('b' + val)) {
                if (val===1) baseVal=10; else if(val===2) baseVal=10; else if(val===3) baseVal=11; else if(val===4) baseVal=11; else if(val===5) baseVal=11; else if(val===6) baseVal=11; else if(val===7) baseVal=12; else if(val===8) baseVal=12;
                isEnhanced = true;
            }
            if (activeRelics.includes('fusion_blood_crusade')) {
                let maxHp = window.getMaxHp ? window.getMaxHp() : 3;
                let lostHp = maxHp - player.hp;
                if (lostHp > 0) { baseVal += lostHp * 10; isEnhanced = true; }
            }
        }

        // Apply shackle zeroing effects to badge display
        if (shackleId === 'drowning' && d.val === 5) { baseVal = 0; isEnhanced = false; }
        if (shackleId === 'parityfear' && shackleMeta) {
            if (shackleMeta.fearType === 'odd' && d.val % 2 !== 0) { baseVal = 0; isEnhanced = false; }
            if (shackleMeta.fearType === 'even' && d.val % 2 === 0) { baseVal = 0; isEnhanced = false; }
        }
        if (shackleId === 'numberplunder' && shackleMeta && d.val === shackleMeta.targetNumber) { baseVal = 0; isEnhanced = false; }

        let baseBadgeHtml = '';
        const isBlinded = shackleId === 'blind' && battle.state === 'WAIT_ACTION' && shackleMeta && shackleMeta.blindIndices && shackleMeta.blindIndices.includes(idx);
        const isIllusioned = shackleId === 'illusion' && !d.locked && battle.state !== 'IDLE' && battle.state !== 'ROLLING';
        if (battle.state !== 'IDLE' && battle.state !== 'ROLLING' && !isBlinded && !isIllusioned) {
             let badgeClass = isEnhanced ? "bg-amber-500 text-amber-950 shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-slate-700 text-slate-300 border border-slate-500";
             baseBadgeHtml = `<div class="absolute -top-2 -left-2 ${badgeClass} text-[12px] md:text-[12px] font-black px-1.5 py-0.5 rounded-full z-20">${Math.floor(baseVal)}</div>`;
        }


        // UI Hook: illusion - fake numbers
        if (shackleId === 'illusion' && !d.locked && battle.state !== 'IDLE' && battle.state !== 'ROLLING') {
            valDisplay = shackleMeta && shackleMeta.fakeNumber ? shackleMeta.fakeNumber : 8;
        }

        // UI Hook: blind - mask specific indices
        if (shackleId === 'blind' && battle.state === 'WAIT_ACTION' && shackleMeta && shackleMeta.blindIndices && shackleMeta.blindIndices.includes(idx)) {
            valDisplay = '?';
        }

        if (battle.state === 'IDLE') valDisplay = '-';
        if (battle.state === 'ROLLING' && !d.locked) valDisplay = '?';

        const imgVal = (valDisplay === '-' || valDisplay === '?') ? 0 : valDisplay;
        const skinFilter = getDiceImageFilter(imgVal);
        const diceImageFilter = inversionFilter || skinFilter;

        const isLockedVisible = d.locked && !activeHighlight;
        const lockedStateClass = isLockedVisible ? 'dice-locked-state' : '';
        const cursedLockedClass = isLockedVisible && shackleId === 'cursedlock' && shackleMeta && d.id === shackleMeta.cursedId ? ' dice-locked-cursed' : '';

        let lockIconHtml = '';
        if (isLockedVisible) {
            if (shackleId === 'cursedlock' && shackleMeta && d.id === shackleMeta.cursedId) {
                // Cursed lock UI: blue overlay + red SVG corner badge
                lockIconHtml = `<div class="dice-lock-overlay dice-lock-overlay-cursed"></div><div class="dice-lock-badge dice-lock-badge-cursed"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg><span>LOCK</span></div>`;
            } else {
                // Standard lock UI: blue overlay
                lockIconHtml = `<div class="dice-lock-overlay"></div><div class="dice-lock-badge"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg><span>LOCK</span></div>`;
            }
        }

        return `
        <div id="dice-element-${idx}" onclick="window.toggleLock(${idx})" class="${wrapperClass} ${extraClass} ${lockedStateClass}${cursedLockedClass}" ${displayOrderStyle}>
            <img src="${getDiceImageUrl(imgVal)}" style="width:100%;height:100%;object-fit:contain;pointer-events:none;display:block;${diceImageFilter ? `filter:${diceImageFilter};` : ''}" alt="${imgVal || ''}">
            ${lockIconHtml}
            ${baseBadgeHtml}
        </div>`;
    }).join('');

    el.rollsBadge.innerText = i18n.t('ui.rolls_left', battle.rollsLeft);
    el.rollsBadge.className = battle.rollsLeft === 0 ? "bg-slate-800 px-2 py-0.5 rounded-full text-[12px] md:text-sm font-bold text-slate-500 transition-colors" : "bg-slate-800 px-2 py-0.5 rounded-full text-[12px] md:text-sm font-bold text-violet-300 transition-colors";

    updateHandHintBanner(battle, activeHighlight);
}

// --- 牌型說明浮條（點 ABCD 區高光骰子時，於盤面頂部說明為何發動；不遮擋骰子）---
function updateHandHintBanner(battle, activeHighlight) {
    const banner = document.getElementById('hand-hint-banner');
    if (!banner) return;

    const zoneClasses = ['hand-hint-banner--A', 'hand-hint-banner--B', 'hand-hint-banner--C', 'hand-hint-banner--D'];
    const hide = () => {
        banner.classList.add('hidden');
        banner.classList.remove(...zoneClasses);
    };

    const isAmnesia = window.getStageActiveShackle && window.getStageActiveShackle() === 'amnesia';
    if (!activeHighlight || isAmnesia || !battle || !battle.scoreResult || battle.state !== 'WAIT_ACTION') {
        hide();
        return;
    }

    const tag = battle.scoreResult['tag' + activeHighlight];
    if (!tag || tag.name === '無' || tag.name === '???') {
        hide();
        return;
    }

    const ruleId = window.getRuleCollectionId ? window.getRuleCollectionId(tag.name) : null;
    let rule = null;
    for (const rules of Object.values(RULE_DB)) {
        rule = (ruleId ? rules.find(r => r.id === ruleId) : null) || rules.find(r => isRuleNameMatch(tag.name, r.name));
        if (rule) break;
    }
    if (!rule) {
        hide();
        return;
    }

    const nameText = window.i18n ? window.i18n.t(`rules.${rule.id}.name`) : rule.name;
    const descText = window.i18n ? window.i18n.t(`rules.${rule.id}.desc`) : rule.desc;
    const multiText = 'x' + tag.multi.toFixed(1);

    banner.innerHTML = `
        <span class="hand-hint-banner__name">${escapeHtml(nameText)}</span>
        <span class="hand-hint-banner__multi">${escapeHtml(multiText)}</span>
        <span class="hand-hint-banner__desc">${escapeHtml(descText)}</span>`;
    banner.classList.remove('hidden', ...zoneClasses);
    banner.classList.add(`hand-hint-banner--${activeHighlight}`);
    // 顯示牌型說明時，隱藏同位置的盤面提示避免重疊
    const notice = document.getElementById('board-notice-banner');
    if (notice) notice.classList.add('hidden');
}

// 盤面提示（遺物觸發等）：於盤面底部短暫顯示，位置與牌型浮條相同、不遮擋骰子
let _boardNoticeTimer = null;
export function showBoardNotice(msg, duration = 2200) {
    const banner = document.getElementById('board-notice-banner');
    if (!banner) return;
    banner.textContent = msg;
    banner.classList.remove('hidden');
    // 避免與牌型說明浮條同時出現於同位置
    const hint = document.getElementById('hand-hint-banner');
    if (hint) hint.classList.add('hidden');
    if (_boardNoticeTimer) clearTimeout(_boardNoticeTimer);
    _boardNoticeTimer = setTimeout(() => {
        banner.classList.add('hidden');
        _boardNoticeTimer = null;
    }, duration);
}
window.showBoardNotice = showBoardNotice;

// --- 重骰波浪動畫 ---
let _rerollAnimTimers = [];

export function startRerollAnimation(unlockedIndices, finalDice) {
    _rerollAnimTimers.forEach(({ interval, timeout }) => {
        if (interval !== null) clearInterval(interval);
        if (timeout !== null) clearTimeout(timeout);
    });
    _rerollAnimTimers = [];

    const shackleId = window.getStageActiveShackle ? window.getStageActiveShackle() : null;
    const shackleMeta = window.getShackleMeta ? window.getShackleMeta() : null;
    const isBlindMasked = (diceIdx) => (
        shackleId === 'blind'
        && shackleMeta
        && Array.isArray(shackleMeta.blindIndices)
        && shackleMeta.blindIndices.includes(diceIdx)
    );
    const getFinalDisplayValue = (die, diceIdx) => {
        if (isBlindMasked(diceIdx)) {
            return 0;
        }
        if (shackleId === 'illusion' && die && !die.locked) {
            return shackleMeta && shackleMeta.fakeNumber ? shackleMeta.fakeNumber : 8;
        }
        return die ? die.val : 0;
    };

    unlockedIndices.forEach((diceIdx, staggerPos) => {
        const dieEl = document.getElementById(`dice-element-${diceIdx}`);
        if (!dieEl) return;
        const img = dieEl.querySelector('img');
        if (!img) return;

        const finalVal = getFinalDisplayValue(finalDice[diceIdx], diceIdx);
        const staggerDelay = staggerPos * 35;
        const setAnimatedFace = (value) => {
            img.src = getDiceImageUrl(value);
            img.style.filter = shackleId === 'inversion'
                ? getInversionDiceFilter(value, shackleMeta)
                : getDiceImageFilter(value);
        };

        const startTimeout = setTimeout(() => {
            dieEl.classList.add('dice-rerolling');

            const scrambleInterval = setInterval(() => {
                setAnimatedFace(isBlindMasked(diceIdx) || shackleId === 'illusion' ? finalVal : Math.ceil(Math.random() * 8));
            }, 40);
            _rerollAnimTimers.push({ interval: scrambleInterval, timeout: null });

            const stopTimeout = setTimeout(() => {
                clearInterval(scrambleInterval);
                setAnimatedFace(finalVal);
                dieEl.classList.remove('dice-rerolling');
            }, 280);
            _rerollAnimTimers.push({ interval: null, timeout: stopTimeout });
        }, staggerDelay);

        _rerollAnimTimers.push({ interval: null, timeout: startTimeout });
    });
}

// --- 控制器渲染 ---
export function renderControls(battle, maxRolls) {
    if (battle.state === 'IDLE') { el.controlsContainer.innerHTML = ''; return; }
    let isRolling = battle.state === 'ROLLING', isAttacking = battle.state === 'ATTACKING';

    let isRollDisabled = (battle.rollsLeft <= 0 || isRolling || isAttacking);
    let rollClass = isRollDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-violet-600 active:border-b-0 active:translate-y-1 shadow-lg shadow-violet-950/60";

    const tutState = window.getTutorialState?.();
    const tutorialAttackUnlockStep = window.TUTORIAL_ATTACK_UNLOCK_STEP || 7;
    const isTutorialAttackLocked = tutState?.mode && tutState.step < tutorialAttackUnlockStep;
    let isScoreDisabled = (isRolling || isAttacking || isTutorialAttackLocked);
    let scoreClass = isScoreDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-red-500 active:border-b-0 active:translate-y-1 shadow-lg shadow-red-950/60";

    el.controlsContainer.innerHTML = `
    <button onclick="window.executeRoll(false)" ${isRollDisabled ? 'disabled="disabled"' : ''} class="w-full flex-1 bg-violet-700 text-violet-100 font-black rounded-lg md:rounded-xl transition-all flex flex-col items-center justify-center border-b-4 border-violet-900 btn-roll ${rollClass}">
        <span class="text-xs md:text-base leading-tight">${i18n.t('ui.btn_roll')}</span>
        <span class="text-[12px] md:text-[12px] opacity-60 mt-0.5 font-semibold">${battle.rollsLeft} / ${maxRolls}</span>
    </button>
    <button onclick="window.fireAttack()" ${isScoreDisabled ? 'disabled="disabled"' : ''} class="w-full flex-[1.5] bg-red-700 text-red-100 font-black rounded-lg md:rounded-xl transition-all flex flex-col items-center justify-center border-b-4 border-red-900 ${isScoreDisabled ? '' : 'btn-attack-ready'} ${scoreClass}">
        <span class="text-xs md:text-base leading-tight">${i18n.t('ui.btn_attack')}</span>
    </button>
    `;
}

// --- 牌型結算渲染 ---
function updateDamagePreviewBar(damage) {
    if (!el.damagePreviewBar) return;
    let currentHp = window.getStageEnemyHp ? window.getStageEnemyHp() : 0;
    let maxHp = window.getStageEnemyMaxHp ? window.getStageEnemyMaxHp() : 1;
    if (!currentHp || !maxHp || damage <= 0) {
        el.damagePreviewBar.classList.add('hidden');
        el.damagePreviewBar.classList.remove('damage-preview-bar--lethal');
        if (el.enemyHpBar) el.enemyHpBar.classList.remove('hp-bar-killshot');
        return;
    }
    let effectiveDamage = Math.min(damage, currentHp);
    let leftPct = Math.max(0, (currentHp - effectiveDamage) / maxHp * 100);
    let widthPct = effectiveDamage / maxHp * 100;
    el.damagePreviewBar.style.left = `${leftPct}%`;
    el.damagePreviewBar.style.width = `${widthPct}%`;
    el.damagePreviewBar.classList.remove('hidden');
    let isKillShot = damage >= currentHp;
    el.damagePreviewBar.classList.toggle('damage-preview-bar--lethal', isKillShot);
    if (el.enemyHpBar) el.enemyHpBar.classList.toggle('hp-bar-killshot', isKillShot);
}

function setFinalScoreText(text) {
    if (!el.finalScoreValue) return;

    const displayText = String(text);
    const digitCount = displayText.replace(/[^0-9]/g, '').length;
    el.finalScoreValue.textContent = displayText;
    el.finalScoreValue.classList.remove('damage-digits-long', 'damage-digits-xl', 'damage-digits-xxl');

    if (digitCount >= 14) {
        el.finalScoreValue.classList.add('damage-digits-xxl');
    } else if (digitCount >= 12) {
        el.finalScoreValue.classList.add('damage-digits-xl');
    } else if (digitCount >= 10) {
        el.finalScoreValue.classList.add('damage-digits-long');
    }
}

function setScoreText(targetEl, text) {
    if (targetEl === el.finalScoreValue) {
        setFinalScoreText(text);
        return;
    }
    targetEl.textContent = text;
}

export function renderScore(battle, activeHighlight) {
    if (!battle.scoreResult || battle.state === 'ROLLING') {
        el.scoreDisplay.innerHTML = `
        <div class="text-slate-500 text-center font-bold animate-pulse text-xs mb-1">
          ${typeof window !== 'undefined' && window.i18n ? window.i18n.t('ui.score_calculating') : '盤面結算中...'}
        </div>
        <div class="grid grid-cols-4 gap-1.5 mt-1">
          <div class="flex flex-col items-center justify-center py-2.5 md:py-3 rounded-lg border min-w-0 overflow-hidden border-slate-700 bg-slate-800/40 opacity-30">
            <div class="text-[12px] text-slate-500">-</div>
            <div class="text-base font-black text-slate-600">x-</div>
          </div>
          <div class="flex flex-col items-center justify-center py-2.5 md:py-3 rounded-lg border min-w-0 overflow-hidden border-slate-700 bg-slate-800/40 opacity-30">
            <div class="text-[12px] text-slate-500">-</div>
            <div class="text-base font-black text-slate-600">x-</div>
          </div>
          <div class="flex flex-col items-center justify-center py-2.5 md:py-3 rounded-lg border min-w-0 overflow-hidden border-slate-700 bg-slate-800/40 opacity-30">
            <div class="text-[12px] text-slate-500">-</div>
            <div class="text-base font-black text-slate-600">x-</div>
          </div>
          <div class="flex flex-col items-center justify-center py-2.5 md:py-3 rounded-lg border min-w-0 overflow-hidden border-slate-700 bg-slate-800/40 opacity-30">
            <div class="text-[12px] text-slate-500">-</div>
            <div class="text-base font-black text-slate-600">x-</div>
          </div>
        </div>`;
        setFinalScoreText('0');
        if (el.damagePreviewBar) el.damagePreviewBar.classList.add('hidden');
        if (el.enemyHpBar) el.enemyHpBar.classList.remove('hp-bar-killshot');
        return;
    }
    let res = battle.scoreResult;
    let isAmnesia = window.getStageActiveShackle && window.getStageActiveShackle() === 'amnesia';

    const sortedNotes = [...res.globalNotes].sort((a, b) => {
        if (a.type === 'shackle' && b.type !== 'shackle') return -1;
        if (a.type !== 'shackle' && b.type === 'shackle') return 1;
        return 0;
    });
    let notesHtml = sortedNotes.map((n, i) => {
        const isShackle = n.type === 'shackle';
        const colorClass = isShackle
            ? 'text-red-300 bg-red-950/50 border-red-800/50'
            : 'text-violet-300 bg-violet-950/50 border-violet-800/50';
        const displayText = isAmnesia ? '???' : n.text;
        return `<span id="note-${i}" class="text-[12px] ${colorClass} px-1.5 py-0.5 rounded border font-bold whitespace-nowrap transition-all duration-300 ease-in-out">${displayText}</span>`;
    }).join('');


    const getTagLocalName = (tagName) => {
        if (!tagName) return '';
        const map = {"無":"messages.none","undefined":"rules.groupD_desc.name","比比丟八(ビビデバ)":"rules.rule_a0.name","七同":"rules.rule_a1.name","六同":"rules.rule_a2.name","五同":"rules.rule_a3.name","四同":"rules.rule_a4.name","三同":"rules.rule_a5.name","對子":"rules.rule_a6.name","彗星":"rules.rule_b0.name","七連順":"rules.rule_b1.name","六連順":"rules.rule_b2.name","五連順":"rules.rule_b3.name","四連順":"rules.rule_b4.name","三連順":"rules.rule_b5.name","雙子星":"rules.rule_c0.name","南瓜馬車":"rules.rule_c1.name","豪華四對子":"rules.rule_c2.name","三龍會":"rules.rule_c3.name","經典四對子":"rules.rule_c4.name","雙四連順":"rules.rule_c5.name","白馬":"rules.rule_c6.name","平胡":"rules.rule_c7.name","碰碰胡":"rules.rule_c8.name","順碰交響曲":"rules.rule_c9.name","雙三連順":"rules.rule_c10.name","雙三同":"rules.rule_c11.name","南瓜":"rules.rule_c12.name","三對子":"rules.rule_c13.name","雙對子":"rules.rule_c14.name","兩極":"rules.rule_d0.name","絕對秩序":"rules.rule_d1.name","全異":"rules.rule_d2.name","中庸之道":"rules.rule_d3.name","斐波那契數列":"rules.rule_d4.name","圓周率":"rules.rule_d5.name","自然對數":"rules.rule_d6.name","二進位":"rules.rule_d7.name","絕對二進位":"rules.rule_d8.name","質數":"rules.rule_d9.name","絕對質數":"rules.rule_d10.name"};
        let key = map[tagName];
        if (key) {
            return window.i18n ? window.i18n.t(key) : tagName;
        }
        return tagName;
    };

    const isZoneActive = (tag) => {
        if (isAmnesia || !tag || tag.name === '無' || tag.name === '???') return false;
        return true;
    };

    const isZoneSelectable = (group, tag) => {
        if (!isZoneActive(tag)) return false;
        if (group === 'D') return true;
        return Array.isArray(battle.dice) && battle.dice.some(d => d.matchedGroups && d.matchedGroups[group]);
    };

    const getZoneAction = (group, tag) => {
        if (!isZoneSelectable(group, tag)) return 'aria-disabled="true"';
        return `onclick="window.setHighlight('${group}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.setHighlight('${group}')}" role="button" tabindex="0"`;
    };

    let getBoxStyle = (group, tag) => {
        if(!isZoneActive(tag)) return 'text-slate-500 border-slate-700/50 opacity-40 bg-slate-900/50 cursor-not-allowed select-none';
        let base = '';
        if(group === 'A') base = 'text-blue-300 border-blue-900/80 bg-blue-900/30 hover:border-blue-400 cursor-pointer transition-all active:scale-95';
        if(group === 'B') base = 'text-pink-300 border-pink-900/80 bg-pink-900/30 hover:border-pink-400 cursor-pointer transition-all active:scale-95';
        if(group === 'C') base = 'text-purple-300 border-purple-900/80 bg-purple-900/30 hover:border-purple-400 cursor-pointer transition-all active:scale-95';
        if(group === 'D') base = 'text-teal-300 border-teal-900/80 bg-teal-900/30 hover:border-teal-400 cursor-pointer transition-all active:scale-95';

        if(activeHighlight === group) base += ' ring-1 ring-white scale-105 shadow-md z-10';
        else if(activeHighlight && activeHighlight !== group) base += ' opacity-30 grayscale';
        return base;
    };

    const getRuleMetaForTag = (tag) => {
        if (isAmnesia || !tag || tag.name === '無' || tag.name === '???') return null;
        const ruleId = window.getRuleCollectionId ? window.getRuleCollectionId(tag.name) : null;
        for (const rules of Object.values(RULE_DB)) {
            const byId = ruleId ? rules.find(rule => rule.id === ruleId) : null;
            if (byId) return byId;
            const byName = rules.find(rule => isRuleNameMatch(tag.name, rule.name));
            if (byName) return byName;
        }
        return null;
    };

    const getTagEmphasisClass = (tag) => {
        const rule = getRuleMetaForTag(tag);
        return rule && rule.rarity >= 5 ? 'zone-legendary-hand' : '';
    };

    const zoneTags = [res.tagA, res.tagB, res.tagC, res.tagD];
    const hasZoneResonance = !isAmnesia && zoneTags.every(tag => tag && tag.name !== '無' && tag.name !== '???');
    const zoneGridClass = hasZoneResonance ? 'zone-resonance' : '';

    const getTagNewBadge = (tag) => {
        if (isAmnesia || !tag || tag.name === '無' || tag.name === '???') return '';
        const ruleId = window.getRuleCollectionId ? window.getRuleCollectionId(tag.name) : null;
        if (!ruleId) return '';
        return isUncollected('hand', ruleId) ? renderNewBadge('new-badge--zone') : '';
    };

    el.scoreDisplay.innerHTML = `
    <div class="flex flex-col gap-1 px-2 py-1.5 rounded-lg border mb-1.5" style="background:#0e0e10;border-color:#2a2a2c;">
        <div class="flex items-baseline gap-2 whitespace-nowrap">
            <span class="text-[12px] md:text-[12px] font-semibold tracking-widest uppercase text-slate-200">${i18n.t('ui.score_total_base')}</span>
            <span id="score-total-base-value" class="text-base md:text-lg font-black text-white">${res.totalBase.toFixed(1)}</span>
        </div>
        <div id="score-notes-row" class="scrollable-row flex overflow-x-auto gap-1 pb-0.5 scroll-smooth hide-scrollbar">${notesHtml}</div>
    </div>

    <div class="relative grid grid-cols-4 gap-1 mb-1 ${zoneGridClass}">
        <div id="zone-box-A" ${getZoneAction('A', res.tagA)} class="relative flex flex-col items-center justify-center py-2.5 md:py-3 rounded-lg border min-w-0 overflow-visible ${getBoxStyle('A', res.tagA)} ${getTagEmphasisClass(res.tagA)}">
            <span class="zone-corner-label" aria-hidden="true">A</span>
            ${getTagNewBadge(res.tagA)}
            <div class="text-[12px] md:text-[12px] font-bold zone-tag-name opacity-70 w-full px-1 text-center">${isAmnesia ? '???' : getTagLocalName(res.tagA.name)}</div>
            <div class="font-black text-xl md:text-2xl leading-none mt-1">${isAmnesia ? 'x???' : 'x' + res.tagA.multi.toFixed(1)}</div>
        </div>
        <div id="zone-box-B" ${getZoneAction('B', res.tagB)} class="relative flex flex-col items-center justify-center py-2.5 md:py-3 rounded-lg border min-w-0 overflow-visible ${getBoxStyle('B', res.tagB)} ${getTagEmphasisClass(res.tagB)}">
            <span class="zone-corner-label" aria-hidden="true">B</span>
            ${getTagNewBadge(res.tagB)}
            <div class="text-[12px] md:text-[12px] font-bold zone-tag-name opacity-70 w-full px-1 text-center">${isAmnesia ? '???' : getTagLocalName(res.tagB.name)}</div>
            <div class="font-black text-xl md:text-2xl leading-none mt-1">${isAmnesia ? 'x???' : 'x' + res.tagB.multi.toFixed(1)}</div>
        </div>
        <div id="zone-box-C" ${getZoneAction('C', res.tagC)} class="relative flex flex-col items-center justify-center py-2.5 md:py-3 rounded-lg border min-w-0 overflow-visible ${getBoxStyle('C', res.tagC)} ${getTagEmphasisClass(res.tagC)}">
            <span class="zone-corner-label" aria-hidden="true">C</span>
            ${getTagNewBadge(res.tagC)}
            <div class="text-[12px] md:text-[12px] font-bold zone-tag-name opacity-70 w-full px-1 text-center">${isAmnesia ? '???' : getTagLocalName(res.tagC.name)}</div>
            <div class="font-black text-xl md:text-2xl leading-none mt-1">${isAmnesia ? 'x???' : 'x' + res.tagC.multi.toFixed(1)}</div>
        </div>
        <div id="zone-box-D" ${getZoneAction('D', res.tagD)} class="relative flex flex-col items-center justify-center py-2.5 md:py-3 rounded-lg border min-w-0 overflow-visible ${getBoxStyle('D', res.tagD)} ${getTagEmphasisClass(res.tagD)}">
            <span class="zone-corner-label" aria-hidden="true">D</span>
            ${getTagNewBadge(res.tagD)}
            <div class="text-[12px] md:text-[12px] font-bold zone-tag-name opacity-70 w-full px-1 text-center">${isAmnesia ? '???' : getTagLocalName(res.tagD.name)}</div>
            <div class="font-black text-xl md:text-2xl leading-none mt-1">${isAmnesia ? 'x???' : 'x' + res.tagD.multi.toFixed(1)}</div>
        </div>
    </div>
    `;
    const notesRow = document.getElementById('score-notes-row');
    if (notesRow) enableDragScroll(notesRow);
    if (el.finalScoreValue) {
        const damageVisible = window.isDamageVisible ? window.isDamageVisible() : true;
        const previewVisible = window.isEnemyHpBarPreviewVisible ? window.isEnemyHpBarPreviewVisible() : true;
        const isDrunk = window.getStageActiveShackle && window.getStageActiveShackle() === 'shackle_drunk';

        if (!damageVisible) {
            setFinalScoreText('???');
            el.finalScoreValue.classList.add('score-normal');
            el.finalScoreValue.classList.remove('score-hot');
            el.finalScoreValue.classList.remove('damage-drunk');
            if (el.damagePreviewBar) el.damagePreviewBar.classList.add('hidden');
            if (el.enemyHpBar) el.enemyHpBar.classList.remove('hp-bar-killshot');
        } else {
            const displayScore = window.getDisplayedEstimatedDamage
                ? window.getDisplayedEstimatedDamage(res.finalScore)
                : res.finalScore;
            setFinalScoreText(Math.floor(displayScore).toLocaleString());
            let enemyHp = window.getStageEnemyHp ? window.getStageEnemyHp() : Infinity;
            if (displayScore >= enemyHp * 0.5) {
                el.finalScoreValue.classList.add('score-hot');
                el.finalScoreValue.classList.remove('score-normal');
            } else {
                el.finalScoreValue.classList.add('score-normal');
                el.finalScoreValue.classList.remove('score-hot');
            }
            if (isDrunk) {
                el.finalScoreValue.classList.add('damage-drunk');
            } else {
                el.finalScoreValue.classList.remove('damage-drunk');
            }

            if (!previewVisible) {
                if (el.damagePreviewBar) el.damagePreviewBar.classList.add('hidden');
                if (el.enemyHpBar) el.enemyHpBar.classList.remove('hp-bar-killshot');
            } else {
                if (el.damagePreviewBar) {
                    if (isDrunk) el.damagePreviewBar.classList.add('drunk');
                    else el.damagePreviewBar.classList.remove('drunk');
                }
                updateDamagePreviewBar(displayScore);
            }
        }
    }
}

export function refreshDamageDisplay(battle, activeHighlight) {
    if (battle && battle.scoreResult) renderScore(battle, activeHighlight);
}

// --- 遺物逐步結算演出 ---
function countUpTo(targetEl, targetValue, duration, onDone) {
    if (!targetEl) { if (onDone) onDone(); return; }
    const startValue = parseInt(targetEl.textContent.replace(/[^0-9]/g, '')) || 0;
    const diff = targetValue - startValue;
    const startTime = performance.now();
    const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        setScoreText(targetEl, Math.floor(startValue + diff * progress).toLocaleString());
        if (progress < 1) requestAnimationFrame(animate);
        else { setScoreText(targetEl, targetValue.toLocaleString()); if (onDone) onDone(); }
    };
    requestAnimationFrame(animate);
}

function playDiceSumFly(baseValue, onDone) {
    const sourceEl = document.getElementById('score-total-base-value');
    const targetEl = el.finalScoreValue;
    if (!sourceEl || !targetEl) { onDone(); return; }
    const srcRect = sourceEl.getBoundingClientRect();
    const tgtRect = targetEl.getBoundingClientRect();
    if (!srcRect.width || !tgtRect.width) { onDone(); return; }

    const fly = document.createElement('div');
    fly.className = 'dice-sum-fly';
    fly.textContent = baseValue.toLocaleString();
    fly.style.fontSize = window.getComputedStyle(sourceEl).fontSize;
    fly.style.left = `${srcRect.left + srcRect.width / 2}px`;
    fly.style.top = `${srcRect.top + srcRect.height / 2}px`;
    document.body.appendChild(fly);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            fly.style.left = `${tgtRect.left + tgtRect.width / 2}px`;
            fly.style.top = `${tgtRect.top + tgtRect.height / 2}px`;
            fly.style.transform = 'translate(-50%, -50%) scale(1.4)';
        });
    });

    setTimeout(() => {
        fly.classList.add('dice-sum-fly--arrive');
        setTimeout(() => {
            fly.remove();
            onDone();
        }, 150);
    }, 350);
}

function showHandNameFloat(rawName) {
    if (!rawName || rawName === '無') return;

    const groups = [
        { letter: 'a', rules: RULE_DB.groupA },
        { letter: 'b', rules: RULE_DB.groupB },
        { letter: 'c', rules: RULE_DB.groupC },
        { letter: 'd', rules: RULE_DB.groupD },
    ];

    let foundGroup = null, foundIndex = -1, foundRule = null;
    for (const g of groups) {
        const idx = g.rules.findIndex(r => isRuleNameMatch(rawName, r.name));
        if (idx !== -1) { foundGroup = g.letter; foundIndex = idx; foundRule = g.rules[idx]; break; }
    }

    const rarity = foundRule ? (foundRule.rarity || 1) : 1;
    const i18nKey = foundGroup !== null ? `rules.rule_${foundGroup}${foundIndex}.name` : null;
    const displayName = i18nKey ? (i18n.t(i18nKey) || rawName) : rawName;

    const rarityClasses = ['', 'hand-float-common', 'hand-float-rare', 'hand-float-epic', 'hand-float-legendary', 'hand-float-mythic'];
    const rarityClass = rarityClasses[rarity] || 'hand-float-common';
    const durations = [0, 700, 800, 900, 1000, 1100];
    const duration = durations[rarity] || 700;

    const div = document.createElement('div');
    div.className = `hand-float-base ${rarityClass}`;
    div.textContent = displayName;
    document.body.appendChild(div);
    setTimeout(() => { if (div.parentNode) div.parentNode.removeChild(div); }, duration);
}

export function showHandNamesPreview(scoreResult) {
    if (!scoreResult) return;
    const zones = [];
    const tags = [
        { tag: scoreResult.tagA, zone: 'A' },
        { tag: scoreResult.tagB, zone: 'B' },
        { tag: scoreResult.tagC, zone: 'C' },
        { tag: scoreResult.tagD, zone: 'D' },
    ];
    tags.forEach(({ tag, zone }) => {
        if (tag && tag.name && tag.name !== '無' && tag.multi > 1.0) {
            zones.push({ name: tag.name, zone, multi: tag.multi });
        }
    });
    if (zones.length === 0) return;

    const diceContainer = document.getElementById('dice-container');
    const rect = diceContainer
        ? diceContainer.getBoundingClientRect()
        : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const allRules = [
        ...(RULE_DB.groupA || []),
        ...(RULE_DB.groupB || []),
        ...(RULE_DB.groupC || []),
        ...(RULE_DB.groupD || []),
    ];

    zones.forEach(z => {
        const rule = allRules.find(r => isRuleNameMatch(z.name, r.name));
        z.handRarity = rule ? (rule.rarity || 1) : 1;
        z.ruleId = rule ? rule.id : null;
    });

    zones.sort((a, b) => {
        if (a.handRarity !== b.handRarity) return a.handRarity - b.handRarity;
        return (a.multi || 0) - (b.multi || 0);
    });

    zones.forEach((z, idx) => {
        const rarity = z.handRarity;
        let displayName = z.name;
        ['groupA', 'groupB', 'groupC', 'groupD'].forEach(gKey => {
            const letter = gKey.replace('group', '').toLowerCase();
            (RULE_DB[gKey] || []).forEach((r, rIdx) => {
                if (isRuleNameMatch(z.name, r.name)) {
                    const translated = i18n.t(`rules.rule_${letter}${rIdx}.name`);
                    if (translated && translated !== `rules.rule_${letter}${rIdx}.name`) {
                        displayName = translated;
                    }
                }
            });
        });

        setTimeout(() => {
            const isFinal = (idx === zones.length - 1);
            Audio.playHandRevealSound(rarity, isFinal);
            const floatEl = document.createElement('div');

            if (isFinal && rarity >= 5) {
                showMythicHandReveal(displayName, z);
                return;
            }

            if (isFinal) {
                floatEl.className = `hand-float-base hand-float-${getRarityClass(rarity)}`;
            } else {
                floatEl.className = `hand-float-base hand-float-${getRarityClass(rarity)} hand-float-away`;
                const offsetX = (Math.random() - 0.5) * 60;
                floatEl.style.setProperty('--float-x', offsetX + 'px');
            }

            floatEl.textContent = displayName;
            floatEl.style.left = `${centerX}px`;
            floatEl.style.top = `${centerY}px`;
            document.body.appendChild(floatEl);
            setTimeout(() => floatEl.remove(), 1300);
        }, idx * 380);
    });
}

function getMythicCharacterKey(hand) {
    if (hand?.ruleId === 'rule_a0' || hand?.zone === 'A') return 'lion';
    return 'pongo';
}

function showMythicHandReveal(handName, hand) {
    const oldOverlay = document.querySelector('.mythic-hand-reveal');
    if (oldOverlay) oldOverlay.remove();

    const characterKey = getMythicCharacterKey(hand);
    const titleLayoutClass = /^[\x00-\x7F\s-]+$/.test(handName || '') ? ' mythic-hand-reveal--latin' : '';
    const letters = Array.from(handName || '')
        .map((char, index) => `<span style="--i:${index};">${escapeHtml(char)}</span>`)
        .join('');
    const overlay = document.createElement('div');
    overlay.className = `mythic-hand-reveal mythic-hand-reveal--${characterKey}${titleLayoutClass}`;
    overlay.innerHTML = `
        <div class="mythic-hand-reveal__aura"></div>
        <div class="mythic-hand-reveal__slash mythic-hand-reveal__slash--top"></div>
        <div class="mythic-hand-reveal__slash mythic-hand-reveal__slash--bottom"></div>
        <img class="mythic-hand-reveal__character" src="${MYTHIC_CHARACTER_ASSETS[characterKey]}" alt="" aria-hidden="true">
        <div class="mythic-hand-reveal__text">
            <div class="mythic-hand-reveal__eyebrow">${escapeHtml(i18n.t('ui.highlight_mythic_hand'))}</div>
            <div class="mythic-hand-reveal__title" aria-label="${escapeHtml(handName)}">${letters}</div>
            <div class="mythic-hand-reveal__multi">x${Number(hand?.multi || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
        </div>
    `;
    document.body.appendChild(overlay);

    if (el.battleArea) {
        el.battleArea.classList.add('highlight-cinematic-hit', 'mythic-hand-hit');
        setTimeout(() => el.battleArea.classList.remove('highlight-cinematic-hit', 'mythic-hand-hit'), 2200);
    }

    const removeOverlay = () => {
        if (overlay.parentNode) overlay.remove();
    };
    overlay.addEventListener('animationend', event => {
        if (event.target === overlay) removeOverlay();
    }, { once: true });
    setTimeout(removeOverlay, 4300);
}

function getRarityClass(rarity) {
    if (rarity >= 5) return 'mythic';
    if (rarity >= 4) return 'legendary';
    if (rarity >= 3) return 'epic';
    if (rarity >= 2) return 'rare';
    return 'common';
}

function showHighlightBurst(highlight) {
    if (!highlight || !Array.isArray(highlight.tags) || highlight.tags.length === 0) return;
    if (highlight.tags.includes('damage_100m')) {
        showEpicHighlightBurst(highlight);
        return;
    }
    const rect = getGameViewportRect();
    const banner = document.createElement('div');
    banner.className = 'highlight-burst-banner';
    banner.style.left = `${rect.left + rect.width / 2}px`;
    banner.style.top = `${rect.top + rect.height * 0.34}px`;
    banner.innerHTML = `
        <div class="highlight-burst-banner__main">${getHighlightLabel(highlight.primaryTag || highlight.tags[0])}</div>
        <div class="highlight-burst-banner__sub">${highlight.tags.slice(1, 3).map(getHighlightLabel).join(' / ')}</div>
    `;
    document.body.appendChild(banner);
    if (el.battleArea) {
        el.battleArea.classList.add('highlight-cinematic-hit');
        setTimeout(() => el.battleArea.classList.remove('highlight-cinematic-hit'), 1400);
    }
    setTimeout(() => banner.remove(), 1500);
}

function showEpicHighlightBurst(highlight) {
    const oldOverlay = document.querySelector('.highlight-epic-overlay');
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement('div');
    const mainLabel = getHighlightLabel('damage_100m');
    const supportTags = highlight.tags
        .filter(id => id !== 'damage_100m')
        .slice(0, 3)
        .map(getHighlightLabel);

    overlay.className = 'highlight-epic-overlay';
    overlay.innerHTML = `
        <div class="highlight-epic-overlay__flare"></div>
        <div class="highlight-epic-overlay__shockwave"></div>
        <div class="highlight-epic-overlay__particles">
            ${Array.from({ length: 18 }, (_, index) => `<span style="--i:${index};"></span>`).join('')}
        </div>
        <div class="highlight-epic-overlay__content">
            <div class="highlight-epic-overlay__eyebrow">${i18n.t('ui.highlight_card_eyebrow')}</div>
            <div class="highlight-epic-overlay__title">${mainLabel}</div>
            <div class="highlight-epic-overlay__damage">${Number(highlight.damage || 0).toLocaleString()}</div>
            ${supportTags.length ? `<div class="highlight-epic-overlay__tags">${supportTags.map(label => `<span>${label}</span>`).join('')}</div>` : ''}
        </div>
    `;
    document.body.appendChild(overlay);

    if (el.battleArea) {
        el.battleArea.classList.add('highlight-cinematic-hit', 'highlight-epic-hit');
        setTimeout(() => el.battleArea.classList.remove('highlight-cinematic-hit', 'highlight-epic-hit'), 2200);
    }

    const removeOverlay = () => {
        if (overlay.parentNode) overlay.remove();
    };
    overlay.addEventListener('animationend', event => {
        if (event.target === overlay) removeOverlay();
    }, { once: true });
    setTimeout(removeOverlay, 5200);
}

export function playDamageStepsAnimation(steps, callback, options = {}) {
    // Sync mythic-suppressed visuals on relic cards (single pass)
    if (el.inventoryGrid) {
        const _asid = window.getStageActiveShackle && window.getStageActiveShackle();
        const _asd = _asid ? SHACKLE_DB.find(s => s.id === _asid) : null;
        const suppressMythic = !!(_asd && _asd.suppressMythic);
        el.inventoryGrid.querySelectorAll('[data-relic-id]').forEach(relEl => {
            relEl.classList.remove('mythic-suppressed');
            const oldIcon = relEl.querySelector('.mythic-suppress-icon');
            if (oldIcon) oldIcon.remove();
            if (suppressMythic && (relEl.dataset.relicId || '').startsWith('fusion_')) {
                relEl.classList.add('mythic-suppressed');
                const icon = document.createElement('span');
                icon.className = 'mythic-suppress-icon';
                icon.textContent = 'OFF';
                relEl.appendChild(icon);
            }
        });
    }

    if (!steps || steps.length === 0 || !el.finalScoreValue) { callback(); return; }

    // Pre-cache DOM elements to avoid repeated getElementById/querySelector inside animation loop
    const zoneElCache = {};
    const noteElCache = {};
    const relicElCache = {};
    steps.forEach(step => {
        if (step.zone && !(step.zone in zoneElCache)) {
            zoneElCache[step.zone] = document.getElementById('zone-box-' + step.zone);
        }
        if (step.noteIndex !== undefined && step.noteIndex !== null && !(step.noteIndex in noteElCache)) {
            noteElCache[step.noteIndex] = document.getElementById(`note-${step.noteIndex}`);
        }
        if (step.relicId && !(step.relicId in relicElCache)) {
            relicElCache[step.relicId] = el.inventoryGrid
                ? el.inventoryGrid.querySelector(`[data-relic-id="${step.relicId}"]`)
                : null;
        }
    });

    let currentDelay = 400;
    let i = 0;

    const playNext = () => {
        if (i >= steps.length) { callback(); return; }
        const step = steps[i++];
        currentDelay = Math.max(50, currentDelay * 0.8);
        const animDuration = Math.max(50, currentDelay * 0.4);

        Audio.playScoreStepSound(i, step.final);

        if (step.final) {
            Audio.playAttackImpactSound();
            showHighlightBurst(options.highlight);
            countUpTo(el.finalScoreValue, step.damageAfter, animDuration, callback);
            return;
        }

        if (step.zero) {
            setFinalScoreText('0');
            setTimeout(playNext, currentDelay);
            return;
        }

        if (step.base) {
            playDiceSumFly(step.damageAfter, () => {
                countUpTo(el.finalScoreValue, step.damageAfter, animDuration, () => {
                    setTimeout(playNext, currentDelay);
                });
            });
            return;
        }

        if (step.zone) {
            const zoneEl = zoneElCache[step.zone] || null;
            if (zoneEl) zoneEl.classList.add('zone-active');
            countUpTo(el.finalScoreValue, step.damageAfter, animDuration, () => {
                el.finalScoreValue.classList.remove('zone-multiply');
                void el.finalScoreValue.offsetWidth;
                el.finalScoreValue.classList.add('zone-multiply');
                setTimeout(() => {
                    if (zoneEl) zoneEl.classList.remove('zone-active');
                    el.finalScoreValue.classList.remove('zone-multiply');
                    playNext();
                }, currentDelay);
            });
            return;
        }

        const relicEl = relicElCache[step.relicId] || null;
        if (relicEl) relicEl.classList.add('relic-active');

        let noteEl = null;
        if (step.noteIndex !== undefined && step.noteIndex !== null) {
            noteEl = noteElCache[step.noteIndex] || null;
            if (noteEl) {
                noteEl.classList.add('multiplier-pop');
                noteEl.style.animationDuration = `${currentDelay}ms`;
            }
        }

        countUpTo(el.finalScoreValue, step.damageAfter, animDuration, () => {
            if (step.type === 'multiply') {
                el.finalScoreValue.classList.remove('damage-multiply');
                void el.finalScoreValue.offsetWidth;
                el.finalScoreValue.classList.add('damage-multiply');
            } else if (step.type === 'add' && step.bonus > 0 && el.finalDamagePreview) {
                const popup = document.createElement('div');
                popup.className = 'damage-bonus-popup';
                popup.textContent = `+${step.bonus.toLocaleString()}`;
                el.finalDamagePreview.style.position = 'relative';
                el.finalDamagePreview.appendChild(popup);
                setTimeout(() => popup.remove(), 400);
            }
            setTimeout(() => {
                if (relicEl) relicEl.classList.remove('relic-active');
                if (noteEl) { noteEl.classList.remove('multiplier-pop'); noteEl.style.animationDuration = ''; }
                el.finalScoreValue.classList.remove('damage-multiply');
                playNext();
            }, currentDelay);
        });
    };

    playNext();
}

// --- 商店渲染邏輯 ---
const RARITY_TOP_COLOR = {
    1: 'rgba(100,116,139,0.55)',
    2: 'rgba(59,130,246,0.7)',
    3: 'rgba(147,51,234,0.75)',
    4: 'rgba(245,158,11,0.8)',
    5: 'rgba(6,182,212,0.85)'
};
const RARITY_LEFT_COLOR = {
    1: 'rgba(100,116,139,0.3)',
    2: 'rgba(59,130,246,0.4)',
    3: 'rgba(147,51,234,0.45)',
    4: 'rgba(245,158,11,0.5)',
    5: 'rgba(6,182,212,0.55)'
};

function renderNewBadge(extraClass = '') {
    return `<span class="new-badge ${extraClass}">${i18n.t('ui.fusion_new_item')}</span>`;
}

function isUncollected(type, id) {
    if (typeof id !== 'string' || id === '') return false;
    return window.isCollectionUnlocked ? !window.isCollectionUnlocked(type, id) : false;
}

export function renderShopForecast(forecast) {
    if (!el.shopForecast) return;
    const shackle = forecast ? SHACKLE_DB.find(item => item.id === forecast.id) : null;
    if (!shackle) {
        el.shopForecast.innerHTML = '';
        el.shopForecast.classList.add('hidden');
        return;
    }

    const name = i18n.t(`shackles.${shackle.id}.name`) || shackle.name;
    const desc = i18n.t(`shackles.${shackle.id}.desc`) || shackle.desc;
    const typeClass = shackle.type === 'heavy' ? 'shop-omen-forecast--heavy' : 'shop-omen-forecast--light';
    el.shopForecast.className = `shop-omen-forecast ${typeClass}`;
    el.shopForecast.innerHTML = `
        <button type="button" class="shop-omen-forecast__button" onclick="window.showShackleInfo('${shackle.id}')">
            <span class="shop-omen-forecast__eyebrow">${i18n.t('ui.omen_forecast_title')}</span>
            <span class="shop-omen-forecast__name">${name}</span>
            <span class="shop-omen-forecast__desc">${desc}</span>
        </button>`;
}

export function renderShopItems(shopItems, player) {
    let playerRelicSet = (player && player.relics) ? new Set(player.relics) : null;

    el.shopItemsContainer.innerHTML = shopItems.map((r, idx) => {
        let style = RARITY[r.rarity];

        let isFusionMaterial = false;
        let fusionResultId = null;

        if (playerRelicSet) {
            let lookup = FUSION_MATERIAL_LOOKUP[r.id];
            if (lookup && playerRelicSet.has(lookup.mat)) {
                isFusionMaterial = true;
                fusionResultId = lookup.fid;
            }
        }

        let isConsumable = r.id.startsWith('cons_');
        let rName = isConsumable ? i18n.t(`consumables.${r.id}.name`) : (i18n.t(`relics.${r.id}.name`) || r.name);
        let rDesc = isConsumable ? i18n.t(`consumables.${r.id}.desc`) : (i18n.t(`relics.${r.id}.desc`) || r.desc);
        let cardBg = isConsumable ? 'linear-gradient(160deg,#1c1a14 0%,#19160e 100%)' : 'linear-gradient(160deg,#1c1b1d 0%,#161519 100%)';
        let consumableBadgeHtml = isConsumable ? `<span class="shop-choice-card__tag bg-amber-900/60 text-amber-300 border border-amber-600/60">${i18n.t('messages.consumable_tag')}</span>` : '';
        let collectionNewBadge = !isConsumable && isUncollected('relic', r.id) ? renderNewBadge('new-badge--shop') : '';

        return `
        <div class="relative">
        <button type="button" data-relic-id="${r.id}" onclick="window.buyItem(${idx})" class="shop-choice-card" style="--shop-accent:${RARITY_TOP_COLOR[r.rarity]}; background:${cardBg}; border:1px solid rgba(74,68,85,0.3); border-top:2px solid ${RARITY_TOP_COLOR[r.rarity]}; border-left:3px solid ${RARITY_LEFT_COLOR[r.rarity]};">
            <div class="absolute top-0 right-0 w-24 h-24 ${style.bg} blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2 opacity-60"></div>
            <div class="shop-choice-card__content relative z-10">
                <div class="shop-choice-card__header">
                    <h3 class="shop-choice-card__title ${style.color}">${rName}</h3>
                    <div class="shop-choice-card__meta">
                            <span class="shop-choice-card__tag ${style.bg} ${style.color} border ${style.border}">${i18n.t(`messages.rarity_${r.rarity}`) || style.label}</span>
                            ${consumableBadgeHtml}
                            ${isFusionMaterial ? `<span onclick="event.stopPropagation(); window.showFusionInfo('${fusionResultId}')" class="shop-choice-card__fusion">${i18n.t('ui.shop_fusion_hint') || '可融合'}</span>` : ''}
                    </div>
                </div>
                <p class="shop-choice-card__desc">${rDesc}</p>
            </div>
            </button>
        ${collectionNewBadge}
        </div>`;
    }).join('');
    
    if(shopItems.length === 0) el.shopItemsContainer.innerHTML = `<div class="col-span-full text-center text-slate-400 py-6 font-bold text-base">${i18n.t('messages.shop_sold_out')}</div>`;
}

export function showFusionReplaceModal(currentFusions, newFusionId, callback) {
    if (!el.fusionReplaceModal || !el.fusionReplaceContent) return;
    if (el.fusionReplaceTitle) {
        el.fusionReplaceTitle.textContent = i18n.t('ui.fusion_limit_title', currentFusions.length);
    }

    let html = '';
    const allRelics = [...currentFusions, newFusionId];

    const relicMap = new Map(RELIC_DB.map(r => [r.id, r]));
    allRelics.forEach((id, index) => {
        let relic = relicMap.get(id);
        if (!relic) return;

        let style = RARITY[relic.rarity] || RARITY[1];
        let isNew = (id === newFusionId);

        let rName = i18n.t(`relics.${relic.id}.name`) || relic.name;
        let rDesc = i18n.t(`relics.${relic.id}.desc`) || relic.desc;

        let materialsHtml = '';
        if (FUSION_RECIPES[id]) {
            let mat1 = relicMap.get(FUSION_RECIPES[id].mat1);
            let mat2 = relicMap.get(FUSION_RECIPES[id].mat2);
            // 取得素材的翻譯名稱
            let mat1Name = mat1 ? (i18n.t(`relics.${mat1.id}.name`) || mat1.name) : FUSION_RECIPES[id].mat1;
            let mat2Name = mat2 ? (i18n.t(`relics.${mat2.id}.name`) || mat2.name) : FUSION_RECIPES[id].mat2;
            
            // 使用語系檔中的 ui.fusion_materials (需要去語系檔補上這個 key)
            let returnMatText = i18n.t('ui.fusion_materials') || '退回素材：';
            materialsHtml = `<div class="text-[12px] md:text-xs text-amber-300/80 mt-2 border-t border-amber-900/50 pt-2">
                ${returnMatText}<br/>• ${mat1Name}<br/>• ${mat2Name}
            </div>`;
        }

        // 取得標籤與按鈕的翻譯 (需要去語系檔補上這些 key)
        let newFusionText = i18n.t('ui.fusion_new_item') || '本次合成';
        let discardBtnText = i18n.t('ui.fusion_discard_btn') || '捨棄並分解';

        html += `
        <div class="fusion-replace-card-wrap">
            ${isNew ? `<span class="fusion-replace-card-new">${newFusionText}</span>` : ''}
            <div class="fusion-replace-card bg-slate-900/80 border-2 ${isNew ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-slate-600'} rounded-xl p-3 md:p-4 flex flex-col justify-between overflow-hidden">
            <div>
                <div class="flex justify-between items-start mb-2 mt-2">
                    <h3 class="text-base md:text-lg font-black ${style.color}">${rName}</h3>
                    <span class="text-[12px] md:text-xs px-2 py-0.5 rounded ${style.bg} ${style.color} border ${style.border} font-bold z-10 relative">${i18n.t(`messages.rarity_${relic.rarity}`) || style.label}</span>
                </div>
                <p class="text-xs md:text-sm text-slate-300 font-bold mb-3">${rDesc}</p>
                ${materialsHtml}
            </div>

            <button onclick="window.selectFusionDiscard('${id}')" class="w-full mt-4 bg-red-950/80 hover:bg-red-900 border border-red-800 hover:border-red-500 text-red-400 hover:text-white font-black py-2.5 rounded-lg transition-all active:scale-95 text-sm md:text-base">
                ${discardBtnText}
            </button>
            </div>
        </div>
        `;
    });

    el.fusionReplaceContent.innerHTML = html;

    // Attach the callback globally so the onclick handler can access it
    window._fusionReplaceCallback = callback;

    window.selectFusionDiscard = function(selectedId) {
        el.fusionReplaceModal.classList.add('hidden');
        el.fusionReplaceModal.classList.remove('flex');
        if (window._fusionReplaceCallback) {
            window._fusionReplaceCallback(selectedId);
            window._fusionReplaceCallback = null;
        }
    };

    el.fusionReplaceModal.classList.remove('hidden');
    el.fusionReplaceModal.classList.add('flex');
}

export function updateShopRerollBtn(shopRerollsUsed, rerollLimit = 1) {
    const remaining = Math.max(0, rerollLimit - shopRerollsUsed);
    if (remaining > 0) {
        el.shopRerollBtn.innerHTML = i18n.t('ui.shop_reroll_remaining', remaining, rerollLimit);
        el.shopRerollBtn.className = "w-full sm:w-auto flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl transition-colors active:scale-95 text-base md:text-lg border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 shadow-lg shadow-emerald-900/50";
        el.shopRerollBtn.disabled = false;
    } else {
        el.shopRerollBtn.innerHTML = i18n.t('messages.shop_rerolled') || '已刷新過';
        el.shopRerollBtn.className = "w-full sm:w-auto flex-1 bg-slate-700 text-slate-400 font-black py-3 rounded-xl cursor-not-allowed text-base md:text-lg border-b-4 border-slate-900";
        el.shopRerollBtn.disabled = true;
    }
}

export function updateMobilePlatformStatus(authState, premiumState, energyState) {
    const badge = document.getElementById('mobile-energy-badge');
    const panel = document.getElementById('mobile-account-panel');
    const value = document.getElementById('mobile-energy-value');
    const accountState = document.getElementById('mobile-account-state');
    const authActions = document.getElementById('mobile-auth-actions');
    const userActions = document.getElementById('mobile-user-actions');
    const emailInput = document.getElementById('mobile-account-email');
    const passwordInput = document.getElementById('mobile-account-password');
    const deletePassword = document.getElementById('mobile-delete-password');
    const buyButton = document.getElementById('btn-mobile-buy-premium');
    const accountTitle = document.getElementById('platform-account-title');
    if (value) value.textContent = premiumState?.active ? '∞' : `${energyState?.remaining ?? 0}/5`;
    if (badge) badge.classList.toggle('hidden', false);
    if (panel) panel.classList.toggle('hidden', false);
    if (accountTitle) {
        accountTitle.textContent = window.bibiPlatform?.isMobile
            ? i18n.t('ui.mobile_account_title')
            : i18n.t('ui.cloud_account_title');
    }

    const user = authState?.user;
    if (accountState) {
        accountState.textContent = user
            ? i18n.t('ui.mobile_signed_in', user.email || '')
            : i18n.t('ui.mobile_guest');
    }
    if (authActions) authActions.classList.toggle('hidden', Boolean(user));
    if (userActions) userActions.classList.toggle('hidden', !user);
    if (emailInput) emailInput.classList.toggle('hidden', Boolean(user));
    if (passwordInput) passwordInput.classList.toggle('hidden', Boolean(user));
    if (!user && deletePassword) deletePassword.value = '';
    if (buyButton) {
        buyButton.disabled = Boolean(premiumState?.active);
        buyButton.textContent = premiumState?.active
            ? i18n.t('ui.mobile_premium_active')
            : i18n.t('ui.mobile_buy_premium');
    }
}

export function requestMobileEnergyAd() {
    const modal = document.getElementById('mobile-energy-modal');
    const cancel = document.getElementById('btn-mobile-energy-cancel');
    const watch = document.getElementById('btn-mobile-energy-ad');
    if (!modal || !cancel || !watch) return Promise.resolve(false);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    return new Promise(resolve => {
        const finish = decision => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            cancel.onclick = null;
            watch.onclick = null;
            resolve(decision);
        };
        cancel.onclick = () => finish(false);
        watch.onclick = () => finish(true);
    });
}

export function closeTopModal() {
    const modalIds = [
        'mobile-energy-modal',
        'dev-modal',
        'fate-selection-modal',
        'run-setup-modal',
        'settings-modal',
        'how-to-play-modal',
        'collection-modal',
        'history-modal',
        'souls-modal'
    ];
    for (const id of modalIds) {
        const modal = document.getElementById(id);
        if (!modal || modal.classList.contains('hidden')) continue;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        return true;
    }
    return false;
}

function getLocalizedCombo(comboStr) {
    if (!comboStr || comboStr === '無') return i18n.t('messages.none') || '無';
    const groups = ['groupA', 'groupB', 'groupC', 'groupD'];
    const prefixes = { groupA: 'a', groupB: 'b', groupC: 'c', groupD: 'd' };
    return comboStr.split(' + ').map(part => {
        const name = part.trim();
        if (!name || name === '無') return i18n.t('messages.none') || '無';
        for (const g of groups) {
            const found = RULE_DB?.[g]?.find(r => r.name === name);
            if (found) {
                const idx = RULE_DB[g].indexOf(found);
                const key = `rules.rule_${prefixes[g]}${idx}.name`;
                return (window.i18n ? window.i18n.t(key) : null) || name;
            }
        }
        return name;
    }).join(' + ');
}

function getHighlightLabel(id) {
    if (!id) return '';
    const key = `ui.highlight_${id}`;
    const translated = i18n.t(key);
    return translated && translated !== key ? translated : id;
}

function renderHighlightBadges(highlight, extraClass = '') {
    if (!highlight || !Array.isArray(highlight.tags) || highlight.tags.length === 0) return '';
    return `<div class="highlight-badge-row ${extraClass}">${
        highlight.tags.slice(0, 5).map(id => `<span class="highlight-badge">${getHighlightLabel(id)}</span>`).join('')
    }</div>`;
}

function buildHighlightShareText(highlight, damage, combo, relics, multiplier = 0) {
    const title = highlight && highlight.primaryTag ? getHighlightLabel(highlight.primaryTag) : i18n.t('ui.highlight_card_title');
    const lines = [
        `BIBI DICE - ${title}`,
        `${i18n.t('ui.highlight_damage')}: ${Number(damage || 0).toLocaleString()}`,
        `${i18n.t('ui.highlight_multiplier')}: x${Number(multiplier || highlight?.multiplier || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}`,
        `${i18n.t('ui.highlight_combo')}: ${getLocalizedCombo(combo || highlight?.combo || '無')}`
    ];
    if (highlight && Array.isArray(highlight.tags) && highlight.tags.length > 0) {
        lines.push(highlight.tags.map(getHighlightLabel).join(' / '));
    }
    if (Array.isArray(relics) && relics.length > 0) {
        const relicNames = relics.slice(0, 6).map(id => {
            const relicDef = RELIC_DB.find(x => x.id === id) || CONSUMABLES_DB.find(x => x.id === id);
            if (!relicDef) return null;
            return id.startsWith('cons_') ? i18n.t(`consumables.${id}.name`) : (i18n.t(`relics.${id}.name`) || relicDef.name);
        }).filter(Boolean);
        if (relicNames.length > 0) lines.push(`${i18n.t('messages.history_relics_label')}: ${relicNames.join(' ')}`);
    }
    return lines.join('\n');
}

window.copyHighlightSummary = async function() {
    const text = window.__lastHighlightShareText || '';
    if (!text) return;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            const area = document.createElement('textarea');
            area.value = text;
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            area.remove();
        }
        showToast(i18n.t('ui.copy_highlight_done'));
    } catch (error) {
        console.warn('copyHighlightSummary failed', error);
        showToast(text, null, { closable: true, duration: 6000 });
    }
};

export function renderHistoryModal(records, metaData) {
    const dash = '-';
    let pbHtml = '';
    if (metaData && metaData.stats) {
        let highestDamageComboTranslated = getLocalizedCombo(metaData.stats.highestDamageCombo);

        pbHtml = `
            <div class="bg-amber-900/40 border border-amber-600/50 p-4 rounded-xl shadow-inner">
                <h3 class="text-lg font-black text-amber-400 mb-3 flex items-center gap-2">${i18n.t('ui.pb_title') || '個人最佳紀錄'}</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <div class="text-xs text-amber-200/70 font-bold">${i18n.t('ui.pb_highest_dmg') || '最高傷害'}</div>
                        <div class="text-xl font-black text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">${Math.floor(metaData.stats.highestDamage).toLocaleString()}</div>
                        <div class="text-[12px] text-amber-400/80 mt-0.5">${highestDamageComboTranslated}</div>
                    </div>
                    <div>
                        <div class="text-xs text-amber-200/70 font-bold">${i18n.t('ui.pb_highest_multi') || '最高倍率'}</div>
                        <div class="text-xl font-black text-emerald-400">x${(metaData.stats.highestMulti || 0).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})}</div>
                    </div>
                    <div>
                        <div class="text-xs text-amber-200/70 font-bold">${i18n.t('ui.pb_highest_infinite') || '最高無限層數'}</div>
                        <div class="text-xl font-black text-purple-400">${parseInt(localStorage.getItem('bibbidiba_pb_infinite')) > 0 ? `PB: ${i18n.t('ui.stage', parseInt(localStorage.getItem('bibbidiba_pb_infinite')))}` : dash}</div>
                    </div>
                </div>
                <div class="mt-3 flex flex-wrap gap-1">
                    ${(metaData.stats.highestDamageRelics || []).map(r => {
                        let relicDef = RELIC_DB.find(x => x.id === r) || CONSUMABLES_DB.find(x => x.id === r);
                        if (!relicDef) return null;
                        let rName = r.startsWith('cons_') ? i18n.t(`consumables.${r}.name`) : (i18n.t(`relics.${r}.name`) || relicDef.name);
                        return `<span class="bg-slate-700 px-1.5 py-0.5 rounded text-[12px] text-slate-300 inline-block">${rName}</span>`;
                    }).filter(Boolean).join('')}
                </div>
            </div>
        `;
    }

    if (!records || records.length === 0) {
        el.historyContent.innerHTML =
            (pbHtml ? `<div class="history-pb-sticky">${pbHtml}</div>` : '') +
            `<div class="history-list-section justify-center"><div class="text-center text-slate-500 py-6 font-bold">${i18n.t('messages.history_empty')}</div></div>`;
        return;
    }

    window._toggleHistoryEntry = function(idx) {
        const det = document.getElementById('hist-det-' + idx);
        const ico = document.getElementById('hist-ico-' + idx);
        if (det) {
            det.classList.toggle('hidden');
            if (ico) ico.textContent = det.classList.contains('hidden') ? '+' : '-';
        }
    };

    const listHtml = records.filter(r => r && typeof r === 'object' && Object.keys(r).length > 0).map((r, i) => {
        if (!r.stageName && r.win == null) return '';
        let resultColor = r.win ? "text-violet-300" : "text-red-400";
        let stageDisplayName;
        if (r.level != null) {
            stageDisplayName = r.level < 10
                ? i18n.t('enemies.enemy_' + r.level)
                : i18n.t('monsters.monster_' + (r.infiniteMonsterId || 1));
        }
        let resultText = stageDisplayName || r.stageName || (r.win ? i18n.t('messages.win') || '勝利' : i18n.t('messages.lose') || '失敗');
        let dateObj = new Date(r.date || 0);
        let dateStr = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        let stageTypeLabel = dash;
        if (r.stageType === 'boss') stageTypeLabel = i18n.t('ui.stage_type_boss');
        else if (r.stageType === 'elite') stageTypeLabel = i18n.t('ui.stage_type_elite');
        else if (r.stageType === 'infinite') stageTypeLabel = i18n.t('ui.stage_type_infinite');
        else if (r.stageType === 'normal') stageTypeLabel = i18n.t('ui.stage_type_normal');
        else if (r.isInfiniteMode) stageTypeLabel = i18n.t('ui.stage_type_infinite');

        let highestMultiStr = (r.highestMulti != null && r.highestMulti > 0)
            ? `x${Number(r.highestMulti).toFixed(1)}`
            : dash;

        let shackleStr = dash;
        if (r.shackle) {
            let shackleDef = SHACKLE_DB.find(s => s.id === r.shackle);
            shackleStr = shackleDef
                ? (i18n.t(`shackles.${r.shackle}.name`) || shackleDef.name)
                : r.shackle;
        }

        let relicHtml = (r.relics && r.relics.length > 0) ? r.relics.map(id => {
            let relicDef = RELIC_DB.find(x => x.id === id) || CONSUMABLES_DB.find(x => x.id === id);
            if (!relicDef) return null;
            let rName = id.startsWith('cons_') ? i18n.t(`consumables.${id}.name`) : (i18n.t(`relics.${id}.name`) || relicDef.name);
            return `<span class="bg-slate-700 px-1.5 py-0.5 rounded text-[12px] text-slate-300 mr-1 mb-1 inline-block">${rName}</span>`;
        }).filter(Boolean).join('') : '<span class="text-slate-500 text-[12px]">' + i18n.t('messages.none') + '</span>';
        const highlightHtml = renderHighlightBadges(r.highlight, 'highlight-badge-row--history');

        return `
        <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div class="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-slate-700/50 transition-colors select-none" onclick="window._toggleHistoryEntry(${i})">
                <span class="font-black ${resultColor} text-sm md:text-base">${resultText}</span>
                <div class="flex items-center gap-2">
                    <span class="text-[12px] md:text-xs text-slate-400">${dateStr}</span>
                    <span id="hist-ico-${i}" class="text-slate-500 text-xs">+</span>
                </div>
            </div>
            <div id="hist-det-${i}" class="relative hidden px-3 pb-3 pt-2 border-t border-slate-700/50">
                <div class="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-2">
                    <div class="text-xs text-slate-300">
                        <div class="text-[12px] text-slate-500">${i18n.t('ui.history_stage_type')}</div>
                        <div class="font-bold">${stageTypeLabel}</div>
                    </div>
                    <div class="text-xs text-slate-300">
                        <div class="text-[12px] text-slate-500">${i18n.t('ui.pb_highest_dmg') || '最終傷害'}</div>
                        <div class="font-black text-white">${Number(r.highestDamage || 0).toLocaleString()}</div>
                    </div>
                    <div class="text-xs text-slate-300">
                        <div class="text-[12px] text-slate-500">${i18n.t('ui.pb_highest_multi') || '最高倍率'}</div>
                        <div class="font-bold text-emerald-400">${highestMultiStr}</div>
                    </div>
                    <div class="text-xs text-slate-300">
                        <div class="text-[12px] text-slate-500">${i18n.t('ui.history_best_hand')}</div>
                        <div class="font-bold text-blue-300">${getLocalizedCombo(r.combo)}</div>
                    </div>
                    <div class="col-span-2 text-xs text-slate-300">
                        <div class="text-[12px] text-slate-500">${i18n.t('ui.history_shackles')}</div>
                        <div class="font-bold text-red-300">${shackleStr}</div>
                    </div>
                </div>
                <div>
                    <div class="text-[12px] text-slate-500 mb-0.5">${i18n.t('ui.history_relics')}</div>
                    <div class="flex flex-wrap">${relicHtml}</div>
                </div>
                ${highlightHtml ? `<div class="mt-2">${highlightHtml}</div>` : ''}
            </div>
        </div>`;
    }).filter(Boolean).reverse().join('');

    el.historyContent.innerHTML =
        (pbHtml ? `<div class="history-pb-sticky">${pbHtml}</div>` : '') +
        `<div class="history-list-section">${listHtml}</div>`;
}

export function renderEndGameStats(highestDamage, highestDamageCombo, relics, highlight = null, highestMulti = 0) {
    if(!el.endStats) return;
    
    let relicHtml = (relics && relics.length > 0) ? relics.map(id => {
        let relicDef = RELIC_DB.find(x => x.id === id) || CONSUMABLES_DB.find(x => x.id === id);
        if (!relicDef) return '';
        let style = RARITY[relicDef.rarity] || RARITY[1];
        let rName = id.startsWith('cons_') ? i18n.t(`consumables.${id}.name`) : (i18n.t(`relics.${id}.name`) || relicDef.name);
        return `<span class="highlight-relic-chip ${style.bg} ${style.color} border ${style.border}">${rName}</span>`;
    }).join('') : '<span class="highlight-card__empty">' + i18n.t('messages.none') + '</span>';
    
    const primaryHighlight = highlight && highlight.primaryTag ? getHighlightLabel(highlight.primaryTag) : i18n.t('ui.highlight_card_title');
    const shareText = buildHighlightShareText(highlight, highestDamage, highestDamageCombo, relics, highestMulti);
    window.__lastHighlightShareText = shareText;

    el.endStats.innerHTML = `
        <div class="highlight-card w-full mx-auto text-left">
            <div class="highlight-card__header">
                <div>
                    <div class="highlight-card__eyebrow">${i18n.t('ui.highlight_card_eyebrow')}</div>
                    <div class="highlight-card__title">${primaryHighlight}</div>
                </div>
                <button type="button" class="highlight-copy-btn" onclick="window.copyHighlightSummary()">${i18n.t('ui.copy_highlight')}</button>
            </div>
            ${renderHighlightBadges(highlight)}
            <div class="highlight-card__stats">
                <div>
                    <div class="highlight-card__label">${i18n.t('ui.highlight_damage')}</div>
                    <div class="highlight-card__damage">${Number(highestDamage).toLocaleString()}</div>
                </div>
                <div>
                    <div class="highlight-card__label">${i18n.t('ui.highlight_multiplier')}</div>
                    <div class="highlight-card__multi">x${Number(highestMulti || highlight?.multiplier || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })}</div>
                </div>
            </div>
            <div class="highlight-card__combo">
                <div class="highlight-card__label">${i18n.t('ui.highlight_combo')}</div>
                <div class="highlight-card__combo-text">${getLocalizedCombo(highestDamageCombo || highlight?.combo)}</div>
            </div>
            <div class="highlight-card__relics">
                <div class="highlight-card__label">${i18n.t('messages.history_relics_label')}</div>
                <div class="highlight-card__relic-grid">${relicHtml}</div>
            </div>
        </div>
    `;
}

function renderCollectionEntry({ unlocked, title, desc, colorClass, metaHtml = '', badgeHtml = '', extraHtml = '', lockedText }) {
    const stateClass = unlocked ? 'collection-entry--unlocked' : 'collection-entry--locked';
    return `
        <div class="collection-entry ${stateClass}">
            <div class="collection-entry__main">
                <div class="collection-entry__title-row">
                    <h3 class="collection-entry__title ${unlocked ? colorClass : 'text-slate-500'}">${unlocked ? title : '???'}</h3>
                    ${unlocked ? badgeHtml : ''}
                </div>
                <p class="collection-entry__desc">${unlocked ? desc : lockedText}</p>
                ${unlocked ? extraHtml : ''}
            </div>
            ${unlocked && metaHtml ? `<div class="collection-entry__meta">${metaHtml}</div>` : ''}
        </div>`;
}

export function renderCollectionModal(tab = 'hands') {
    const coll = window.getCollection ? window.getCollection() : { hands: [], relics: [], shackles: [] };
    const newItems = window.getCollectionNewItems ? window.getCollectionNewItems() : { hands: [], relics: [], shackles: [] };
    const summary = window.getCollectionSummary ? window.getCollectionSummary() : null;
    let html = '';
    if (el.collectionTotalProgress) {
        el.collectionTotalProgress.textContent = summary?.total
            ? i18n.t('ui.collection_total_progress', summary.total.collected, summary.total.count)
            : '';
    }

    if (tab === 'hands') {
        const allRules = [
            ...(RULE_DB.groupA || []),
            ...(RULE_DB.groupB || []),
            ...(RULE_DB.groupC || []),
            ...(RULE_DB.groupD || []),
        ];
        const groups = [
            { key: 'groupA', titleKey: 'rules.groupA_desc' },
            { key: 'groupB', titleKey: 'rules.groupB_desc' },
            { key: 'groupC', titleKey: 'rules.groupC_desc' },
            { key: 'groupD', titleKey: 'rules.groupD_desc' }
        ];
        groups.forEach(g => {
            html += `<section class="collection-section"><h3 class="collection-section-title">${i18n.t(g.titleKey)}</h3>`;
            html += `<div class="collection-grid">`;
            let letter = g.key.replace('group', '').toLowerCase();
            let renderArr = RULE_DB[g.key].slice().sort((a, b) => b.rarity - a.rarity);
            renderArr.forEach((rule, rIdx) => {
                const origIdx = RULE_DB[g.key].indexOf(rule);
                const unlocked = coll.hands.includes(rule.id) || coll.hands.includes(rule.name);
                const isNew = unlocked && (newItems.hands || []).includes(rule.id);
                let ruleName = i18n.t(`rules.rule_${letter}${origIdx}.name`) || rule.name;
                let ruleDesc = i18n.t(`rules.rule_${letter}${origIdx}.desc`) || rule.desc;

                let rStyle = RARITY[rule.rarity] || RARITY[1];
                const newBadge = isNew ? renderNewBadge() : '';
                const metaHtml = `<span class="collection-entry__tag ${rStyle.bg} ${rStyle.color} border ${rStyle.border}">${i18n.t(`messages.rarity_${rule.rarity}`) || rStyle.label}</span>`;
                html += renderCollectionEntry({
                    unlocked,
                    title: ruleName,
                    desc: ruleDesc,
                    colorClass: rStyle.color,
                    metaHtml,
                    badgeHtml: newBadge,
                    lockedText: i18n.t('ui.locked')
                });
            });
            html += `</div></section>`;
        });
    } else if (tab === 'relics') {
        html += `<div class="collection-grid">`;
        RELIC_DB.forEach(r => {
            const unlocked = coll.relics.includes(r.id);
            const isNew = unlocked && (newItems.relics || []).includes(r.id);
            let style = RARITY[r.rarity] || RARITY[1];
            let rName = r.id.startsWith('cons_') ? i18n.t(`consumables.${r.id}.name`) : (i18n.t(`relics.${r.id}.name`) || r.name);
            let rDesc = r.id.startsWith('cons_') ? i18n.t(`consumables.${r.id}.desc`) : (i18n.t(`relics.${r.id}.desc`) || r.desc);

            let fusionText = '';
            if (r.rarity === 5 && FUSION_RECIPES[r.id]) {
                let mat1Id = FUSION_RECIPES[r.id].mat1;
                let mat2Id = FUSION_RECIPES[r.id].mat2;
                let mat1Def = RELIC_DB.find(x => x.id === mat1Id);
                let mat2Def = RELIC_DB.find(x => x.id === mat2Id);
                let mat1Name = mat1Def ? (i18n.t(`relics.${mat1Id}.name`) || mat1Def.name) : mat1Id;
                let mat2Name = mat2Def ? (i18n.t(`relics.${mat2Id}.name`) || mat2Def.name) : mat2Id;
                fusionText = `<p class="collection-entry__note">${i18n.t('ui.fusion_text_short', mat1Name, mat2Name)}</p>`;
            }
            const newBadge = isNew ? renderNewBadge() : '';
            const metaHtml = `<span class="collection-entry__tag ${style.bg} ${style.color} border ${style.border}">${i18n.t(`messages.rarity_${r.rarity}`) || style.label}</span>`;
            html += renderCollectionEntry({
                unlocked,
                title: rName,
                desc: rDesc,
                colorClass: style.color,
                metaHtml,
                badgeHtml: newBadge,
                extraHtml: fusionText,
                lockedText: i18n.t('ui.locked_relic')
            });
        });
        html += `</div>`;
    } else if (tab === 'shackles') {
        html += `<div class="collection-grid">`;
        SHACKLE_DB.forEach(s => {
            const unlocked = coll.shackles.includes(s.id);
            const isNew = unlocked && (newItems.shackles || []).includes(s.id);
            let colorClass = s.type === 'heavy' ? "text-red-400" : "text-amber-400";
            let sName = i18n.t(`shackles.${s.id}.name`) || s.name;
            let sDesc = i18n.t(`shackles.${s.id}.desc`) || s.desc;
            const newBadge = isNew ? renderNewBadge() : '';
            const metaHtml = `<span class="collection-entry__type-dot collection-entry__type-dot--${s.type === 'heavy' ? 'heavy' : 'light'}" aria-hidden="true"></span>`;
            html += renderCollectionEntry({
                unlocked,
                title: sName,
                desc: sDesc,
                colorClass,
                metaHtml,
                badgeHtml: newBadge,
                lockedText: i18n.t('ui.locked_shackle')
            });
        });
        html += `</div>`;
    }

    el.collectionContent.innerHTML = html;
    if (window.clearCollectionNewItems) {
        window.clearCollectionNewItems(tab);
    }
}


function renderDevShackleSection(container) {
    const activeShackle = window.getStageActiveShackle ? window.getStageActiveShackle() : null;

    let activeHtml = '';
    if (activeShackle) {
        const sDef = SHACKLE_DB.find(s => s.id === activeShackle);
        const sName = sDef ? (i18n.t(`shackles.${activeShackle}.name`) || sDef.name) : activeShackle;
        const colorClass = sDef && sDef.type === 'heavy' ? 'text-red-400' : 'text-amber-400';
        activeHtml = `
            <div class="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-600">
                <span class="${colorClass} font-bold text-sm">${sName}</span>
                <button onclick="window.devRemoveShackle(); window.openDevModal();" class="text-xs bg-red-900 hover:bg-red-800 text-red-300 px-2 py-1 rounded border border-red-700 font-bold transition-colors active:scale-95">
                    ${i18n.t('ui.dev_shackle_remove') || '移除'}
                </button>
            </div>`;
    } else {
        activeHtml = `<div class="text-slate-500 text-sm italic">${i18n.t('ui.dev_shackle_none') || '（無枷鎖）'}</div>`;
    }

    let shackleOptions = `<option value="">${i18n.t('ui.dev_shackle_select_ph') || '-- 選擇枷鎖 --'}</option>`;
    SHACKLE_DB.forEach(s => {
        const sName = i18n.t(`shackles.${s.id}.name`) || s.name;
        const typeLabel = s.type === 'heavy' ? ' [重]' : ' [輕]';
        shackleOptions += `<option value="${s.id}">${sName}${typeLabel} (${s.id})</option>`;
    });

    container.innerHTML = `
        <div class="border-t border-slate-600 pt-3 flex flex-col gap-2">
            <h3 class="text-base font-black text-violet-300">${i18n.t('ui.dev_shackle_title') || '枷鎖編輯'}</h3>
            <div class="text-xs text-slate-400 font-bold">${i18n.t('ui.dev_shackle_current') || '當前枷鎖'}:</div>
            ${activeHtml}
            <div id="dev-shackle-conflict" class="hidden text-red-400 text-xs font-bold bg-red-950/40 border border-red-800 rounded p-2"></div>
            <input id="dev-shackle-filter" type="text" placeholder="${i18n.t('ui.dev_shackle_filter') || '搜尋枷鎖...'}"
                class="bg-slate-900 text-white p-2 rounded border border-slate-600 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-slate-500"
                oninput="window._devFilterShackles(this.value)" />
            <select id="dev-shackle-select"
                class="bg-slate-900 text-white p-2 rounded border border-slate-600 font-bold max-h-40 overflow-y-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                onchange="window._devCheckShackleConflict()">
                ${shackleOptions}
            </select>
            <button onclick="window._devApplyShackleBtn()" class="w-full bg-violet-700 hover:bg-violet-600 text-white font-black py-2 rounded-lg transition-colors active:scale-95 text-sm">
                ${i18n.t('ui.dev_shackle_apply') || '套用枷鎖'}
            </button>
        </div>`;

    window._allShackleOptions = SHACKLE_DB.map(s => ({
        id: s.id,
        name: i18n.t(`shackles.${s.id}.name`) || s.name,
        type: s.type
    }));

    window._devFilterShackles = (filter) => {
        const select = document.getElementById('dev-shackle-select');
        if (!select) return;
        const low = filter.toLowerCase();
        select.innerHTML = `<option value="">${i18n.t('ui.dev_shackle_select_ph') || '-- 選擇枷鎖 --'}</option>`;
        window._allShackleOptions
            .filter(s => !filter || s.name.toLowerCase().includes(low) || s.id.toLowerCase().includes(low))
            .forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = `${s.name}${s.type === 'heavy' ? ' [重]' : ' [輕]'} (${s.id})`;
                select.appendChild(opt);
            });
        window._devCheckShackleConflict();
    };

    window._devCheckShackleConflict = () => {
        const select = document.getElementById('dev-shackle-select');
        const conflictDiv = document.getElementById('dev-shackle-conflict');
        if (!select || !conflictDiv) return;
        const current = window.getStageActiveShackle ? window.getStageActiveShackle() : null;
        const selected = select.value;
        if (selected && current && current !== selected) {
            conflictDiv.textContent = i18n.t('ui.dev_shackle_conflict') || '已有枷鎖套用中，強制套用將覆蓋現有枷鎖。';
            conflictDiv.classList.remove('hidden');
        } else {
            conflictDiv.classList.add('hidden');
        }
    };

    window._devApplyShackleBtn = () => {
        const select = document.getElementById('dev-shackle-select');
        if (!select || !select.value) return;
        if (window.devApplyShackle) window.devApplyShackle(select.value);
        const section = document.getElementById('dev-shackle-section');
        if (section) renderDevShackleSection(section);
    };
}

// DEV ONLY
if (IS_DEV) {
    window.openDevModal = function() {
        if (!el.devModal || !el.devRelicSelect) return;
        el.devRelicSelect.innerHTML = '<option value="">-- 請選擇遺物 --</option>';
        RELIC_DB.forEach(r => {
            let opt = document.createElement('option');
            opt.value = r.id;
            opt.innerText = `${r.name} (${r.id})`;
            el.devRelicSelect.appendChild(opt);
        });
        const shackleSection = document.getElementById('dev-shackle-section');
        if (shackleSection) renderDevShackleSection(shackleSection);
        el.devModal.classList.remove('hidden');
        el.devModal.classList.add('flex');
    };

    window.closeDevModal = function() {
        if (!el.devModal) return;
        el.devModal.classList.add('hidden');
        el.devModal.classList.remove('flex');
    };

    if (el.devRelicCancel) {
        el.devRelicCancel.onclick = window.closeDevModal;
    }
}

export function renderRunSetup(relics, setup, sealLimit, contractLimit) {
    if (!el.runSetupModal) return;
    const contractLevel = Math.max(0, Math.min(contractLimit, Number(setup.contractLevel) || 0));
    if (el.runContractSection) el.runContractSection.classList.toggle('hidden', contractLimit === 0);
    if (el.runContractRange) {
        el.runContractRange.max = String(contractLimit);
        el.runContractRange.value = String(contractLevel);
    }
    if (el.runContractLevel) {
        el.runContractLevel.textContent = i18n.t('ui.run_contract_level', contractLevel, contractLimit);
    }
    if (el.runContractEffect) {
        const hpMultiplier = 1 + (contractLevel * SOUL_UPGRADE_BY_ID.soulBurst.hpMultiplierPerLevel);
        const soulBonus = contractLevel * SOUL_UPGRADE_BY_ID.soulBurst.soulBonusPerLevel;
        el.runContractEffect.textContent = i18n.t('ui.run_contract_effect', hpMultiplier, soulBonus);
    }

    const selected = new Set(setup.sealedRelics || []);
    const atLimit = selected.size >= sealLimit;
    if (el.runSetupRelicSection) el.runSetupRelicSection.classList.toggle('hidden', sealLimit === 0);
    if (el.runSetupRelicCount) {
        el.runSetupRelicCount.textContent = i18n.t('ui.blank_ledger_count', selected.size, sealLimit);
    }

    if (!el.runSetupRelicList) return;
    if (!Array.isArray(relics) || relics.length === 0) {
        el.runSetupRelicList.innerHTML = `<p class="run-setup-empty">${i18n.t('ui.blank_ledger_empty')}</p>`;
        return;
    }

    el.runSetupRelicList.innerHTML = relics.map(relic => {
        const isSelected = selected.has(relic.id);
        const style = RARITY[relic.rarity] || RARITY[1];
        const name = i18n.t(`relics.${relic.id}.name`) || relic.name;
        const desc = i18n.t(`relics.${relic.id}.desc`) || relic.desc;
        return `
            <label class="run-setup-entry ${isSelected ? 'run-setup-entry--selected' : ''}">
                <span class="run-setup-entry__copy">
                    <span class="run-setup-entry__name ${style.color}">${name}</span>
                    <span class="run-setup-entry__desc">${desc}</span>
                </span>
                <input class="run-setup-entry__checkbox" type="checkbox" data-relic-id="${relic.id}"
                    ${isSelected ? 'checked' : ''} ${!isSelected && atLimit ? 'disabled' : ''}>
            </label>`;
    }).join('');
}

export function showRunSetupModal() {
    if (!el.runSetupModal) return;
    const closeLabel = i18n.t('ui.toast_close');
    if (el.btnCloseRunSetup) {
        el.btnCloseRunSetup.setAttribute('aria-label', closeLabel);
        el.btnCloseRunSetup.setAttribute('title', closeLabel);
    }
    el.runSetupModal.classList.remove('hidden');
}

export function hideRunSetupModal() {
    if (el.runSetupModal) el.runSetupModal.classList.add('hidden');
}

export function renderFateSelection(relics) {
    if (!el.fateSelectionList) return;
    el.fateSelectionList.innerHTML = relics.map(relic => {
        const style = RARITY[relic.rarity] || RARITY[1];
        const name = i18n.t(`relics.${relic.id}.name`) || relic.name;
        const desc = i18n.t(`relics.${relic.id}.desc`) || relic.desc;
        return `
            <button type="button" class="fate-selection-card" data-relic-id="${relic.id}">
                <span class="fate-selection-card__name ${style.color}">${name}</span>
                <span class="fate-selection-card__desc">${desc}</span>
                <span class="fate-selection-card__meta">${i18n.t('messages.rarity_1')}</span>
            </button>`;
    }).join('');
}

export function showFateSelectionModal() {
    if (!el.fateSelectionModal) return;
    const closeLabel = i18n.t('ui.toast_close');
    if (el.btnCloseFateSelection) {
        el.btnCloseFateSelection.setAttribute('aria-label', closeLabel);
        el.btnCloseFateSelection.setAttribute('title', closeLabel);
    }
    el.fateSelectionModal.classList.remove('hidden');
}

export function hideFateSelectionModal() {
    if (el.fateSelectionModal) el.fateSelectionModal.classList.add('hidden');
}

function renderSoulLevelNodes(currentLv, max) {
    const nodes = Array.from({ length: max }, (_, i) => {
        const state = i < currentLv ? 'on' : 'off';
        return `<img class="soul-level-node soul-level-node--${state}" src="img/ui/soul_node_${state}.png" alt="" aria-hidden="true">`;
    }).join('');
    return `<div class="soul-level-nodes" aria-label="${currentLv}/${max}">${nodes}</div>`;
}

export function renderSoulsModal(metaData) {
    if (!el.soulsContent) return;
    el.soulsHeaderText.innerText = i18n.t('souls.owned', metaData.souls);

    const warningHtml = `<p class="souls-warning">${i18n.t('ui.souls_warning')}</p>`;
    el.soulsContent.innerHTML = warningHtml + SOUL_UPGRADE_DB.map(u => {
        let currentLv = metaData.upgrades[u.id] || 0;
        let isMax = currentLv >= u.max;
        let currentCost = u.costs[Math.min(currentLv, u.costs.length - 1)];
        const requirementMet = u.id !== 'fateSelection' || (metaData.upgrades.startRelic || 0) > 0;
        let canAfford = requirementMet && metaData.souls >= currentCost;

        let uName = i18n.t(`souls.${u.id}.name`) || u.name;
        let uDesc = i18n.t(`souls.${u.id}.desc`) || u.desc;

        const stateClass = isMax ? 'soul-upgrade-card--max' : (canAfford ? 'soul-upgrade-card--ready' : 'soul-upgrade-card--locked');
        const costHtml = isMax
            ? `<span class="soul-upgrade-card__cost soul-upgrade-card__cost--max">${i18n.t('souls.maxed')}</span>`
            : `<span class="soul-upgrade-card__cost">${i18n.t('souls.cost', currentCost)}</span>`;
        const disabledAttr = isMax || !canAfford ? 'disabled' : '';
        const clickAttr = isMax || !canAfford ? '' : `onclick="window.buySoulUpgrade('${u.id}')"`;

        return `
        <button type="button" class="soul-upgrade-card ${stateClass}" ${clickAttr} ${disabledAttr}>
            <img class="soul-upgrade-card__icon" src="img/ui/soul_node_${currentLv > 0 ? 'on' : 'off'}.png" alt="" aria-hidden="true">
            <div class="soul-upgrade-card__body">
                <div class="soul-upgrade-card__head">
                    <div>
                        <div class="soul-upgrade-card__title">${uName}</div>
                        <div class="soul-upgrade-card__desc">${uDesc}</div>
                    </div>
                    ${costHtml}
                </div>
                <div class="soul-upgrade-card__levels">
                    ${renderSoulLevelNodes(currentLv, u.max)}
                    <span>${currentLv}/${u.max}</span>
                </div>
            </div>
        </button>
        `;
    }).join('');

    el.soulsContent.innerHTML += `
        <div class="mt-4 pt-4 border-t border-slate-700/50">
            <button onclick="window.resetSouls()" class="w-full bg-red-600/80 hover:bg-red-500/80 text-white py-2 rounded font-bold transition-colors">${i18n.t('ui.reset_souls') || '重置靈魂 (退還所有花費)'}</button>
        </div>
    `;
}

window.buySoulUpgrade = function(id) {
    let meta = window.getMetaData();
    const upgradeDef = SOUL_UPGRADE_DB.find(u => u.id === id);
    const currentLevel = Number(meta.upgrades[id]) || 0;
    const cost = upgradeDef?.costs[currentLevel];
    const requirementMet = id !== 'fateSelection' || (meta.upgrades.startRelic || 0) > 0;
    if (!upgradeDef || currentLevel >= upgradeDef.max || !requirementMet || !Number.isFinite(cost)) return;
    if (meta.souls >= cost) {
        meta.souls -= cost;
        meta.upgrades[id] = currentLevel + 1;
        window.saveMetaData();
        if (window.unlockSteamAchievement) {
            window.unlockSteamAchievement('ACH_SOUL_TIER_1');
            if (upgradeDef && meta.upgrades[id] >= upgradeDef.max) {
                window.unlockSteamAchievement('ACH_SOUL_MAX_ONE');
            }
        }
        if (window.clearSave) window.clearSave();
        if (el.btnContinue) el.btnContinue.classList.add('hidden');
        renderSoulsModal(meta);
    } else {
        showToast(i18n.t('messages.toast_no_money'));
    }
};


window.resetSouls = function() {
    let meta = window.getMetaData();
    let totalRefund = 0;

    for (let u of SOUL_UPGRADE_DB) {
        let level = meta.upgrades[u.id] || 0;
        const refundFromLevel = u.id === 'mythicVessel'
            ? Math.min(level, Number(meta.freeMythicVesselLevels) || 0)
            : 0;
        for (let i = refundFromLevel; i < level; i++) {
            totalRefund += u.costs[i];
        }
        meta.upgrades[u.id] = 0;
    }
    meta.sealedRelics = [];
    meta.lastContractLevel = 0;
    meta.freeMythicVesselLevels = 0;

    meta.souls += totalRefund;
    window.saveMetaData();

    renderSoulsModal(meta);
    if (window.clearSave) window.clearSave();
    const btnContinue = document.getElementById('btn-continue');
    if (btnContinue) btnContinue.classList.add('hidden');
};

// ===== Tutorial UI =====

const _tutorialHighlighted = {
    el: null,
    origPos: '',
    origZ: '',
    origShadow: '',
    shopOverlay: null,
    origShopZ: '',
    boardPanel: null,
    origBoardPanelZ: '',
    enemyCard: null,
    origEnemyCardPos: '',
    origEnemyCardZ: ''
};

export function showTutorialStep(stepIndex, totalSteps) {
    const overlay = document.getElementById('tutorial-overlay');
    const backdrop = document.getElementById('tutorial-backdrop');
    const tooltip = document.getElementById('tutorial-tooltip');
    const indicatorEl = document.getElementById('tutorial-step-indicator');
    const textEl = document.getElementById('tutorial-tooltip-text');
    const skipBtn = document.getElementById('tutorial-skip-btn');
    const nextBtn = document.getElementById('tutorial-next-btn');
    if (!overlay || !tooltip) return;

    const steps = window.TUTORIAL_STEPS;
    if (!steps || stepIndex >= steps.length) return;
    const step = steps[stepIndex];

    // Update text & indicator
    indicatorEl.textContent = i18n.t('tutorial.step_indicator', stepIndex + 1, totalSteps);
    textEl.textContent = i18n.t(`tutorial.step${stepIndex}`);
    skipBtn.textContent = i18n.t('tutorial.skip');
    nextBtn.textContent = i18n.t('tutorial.next_btn') || '繼續 →';

    const showNext = step.waitFor === 'any_click';
    nextBtn.classList.toggle('hidden', !showNext);

    // Step 6: show complete button instead of next
    if (step.onComplete === 'end_tutorial') {
        nextBtn.textContent = i18n.t('tutorial.complete_btn') || '開始正式挑戰';
        nextBtn.classList.remove('hidden');
    }

    skipBtn.onclick = () => { if (window.skipTutorial) window.skipTutorial(); };
    nextBtn.onclick = () => { if (window.advanceTutorialStep) window.advanceTutorialStep(); };

    // Remove previous highlight
    _unhighlightTutorialElement();

    // Apply new highlight
    const highlightMap = {
        'enemy-hp': 'enemy-card',
        'shackle-badge': 'active-shackle-badge',
        'turns-left': 'turns-left',
        'dice-container': 'dice-container',
        'roll-btn': 'controls-container',
        'score-preview': 'score-area',
        'damage-preview': 'final-damage-preview',
        'attack-btn': 'controls-container',
        'shop-container': 'shop-items'
    };
    const targetId = step.highlight ? (highlightMap[step.highlight] || step.highlight) : null;
    let targetEl = targetId ? document.getElementById(targetId) : null;

    if (targetEl) {
        _tutorialHighlighted.el = targetEl;
        _tutorialHighlighted.origPos = targetEl.style.position;
        _tutorialHighlighted.origZ = targetEl.style.zIndex;
        targetEl.style.position = 'relative';
        targetEl.style.zIndex = '196';
        targetEl.classList.add('tutorial-highlight');
        const shopOverlay = targetEl.closest('#shop-overlay');
        if (shopOverlay) {
            _tutorialHighlighted.shopOverlay = shopOverlay;
            _tutorialHighlighted.origShopZ = shopOverlay.style.zIndex;
            shopOverlay.style.zIndex = '196';
        }
        if (step.highlight === 'enemy-hp' || step.highlight === 'shackle-badge' || step.highlight === 'turns-left') {
            const enemyCard = document.getElementById('enemy-card');
            if (enemyCard && enemyCard !== targetEl) {
                _tutorialHighlighted.enemyCard = enemyCard;
                _tutorialHighlighted.origEnemyCardPos = enemyCard.style.position;
                _tutorialHighlighted.origEnemyCardZ = enemyCard.style.zIndex;
                enemyCard.style.position = 'relative';
                enemyCard.style.zIndex = '196';
            }
        }
        // 攻擊步驟：#game-container 有 transform:scale() 建立 stacking context，
        // board-panel 無 z-index 故會被 backdrop(z-195) 遮蔽；暫時提升至 196 使按鈕可點擊
        if (step.highlight === 'attack-btn' || step.highlight === 'dice-container' || step.highlight === 'roll-btn') {
            const boardPanel = document.getElementById('board-panel');
            if (boardPanel) {
                _tutorialHighlighted.boardPanel = boardPanel;
                _tutorialHighlighted.origBoardPanelZ = boardPanel.style.zIndex;
                boardPanel.style.zIndex = '196';
            }
        }
    }

    // Show overlay
    overlay.classList.remove('hidden');
    tooltip.classList.remove('hidden');

    // 需要玩家直接點擊遊戲元素的步驟（shop_select、attack_action），
    // 將 backdrop 設為 pointer-events:none，讓點擊穿透至下方遊戲按鈕
    const needsClickThrough = step.waitFor === 'shop_select' || step.waitFor === 'attack_action' || step.waitFor === 'lock_two_dice' || step.waitFor === 'roll_action' || step.waitFor === 'shackle_info';
    backdrop.style.pointerEvents = needsClickThrough ? 'none' : 'auto';

    // Position tooltip near highlighted element (or center-bottom if none)
    _positionTutorialTooltip(targetEl);
    _positionTutorialPointer(targetEl);
}

export function clearTutorialTooltip() {
    const backdrop = document.getElementById('tutorial-backdrop');
    const tooltip = document.getElementById('tutorial-tooltip');
    const indicatorEl = document.getElementById('tutorial-step-indicator');
    const textEl = document.getElementById('tutorial-tooltip-text');
    const nextBtn = document.getElementById('tutorial-next-btn');
    const pointer = document.getElementById('tutorial-pointer');
    if (backdrop) backdrop.style.pointerEvents = 'auto';
    if (tooltip) tooltip.classList.add('hidden');
    if (indicatorEl) indicatorEl.textContent = '';
    if (textEl) textEl.textContent = '';
    if (nextBtn) nextBtn.classList.add('hidden');
    if (pointer) pointer.classList.add('hidden');
    _unhighlightTutorialElement();
}

function _unhighlightTutorialElement() {
    const pointer = document.getElementById('tutorial-pointer');
    if (pointer) pointer.classList.add('hidden');

    if (_tutorialHighlighted.el) {
        _tutorialHighlighted.el.style.position = _tutorialHighlighted.origPos;
        _tutorialHighlighted.el.style.zIndex = _tutorialHighlighted.origZ;
        _tutorialHighlighted.el.classList.remove('tutorial-highlight');
        _tutorialHighlighted.el = null;
    }
    if (_tutorialHighlighted.shopOverlay) {
        _tutorialHighlighted.shopOverlay.style.zIndex = _tutorialHighlighted.origShopZ;
        _tutorialHighlighted.shopOverlay = null;
    }
    if (_tutorialHighlighted.boardPanel) {
        _tutorialHighlighted.boardPanel.style.zIndex = _tutorialHighlighted.origBoardPanelZ;
        _tutorialHighlighted.boardPanel = null;
    }
    if (_tutorialHighlighted.enemyCard) {
        _tutorialHighlighted.enemyCard.style.position = _tutorialHighlighted.origEnemyCardPos;
        _tutorialHighlighted.enemyCard.style.zIndex = _tutorialHighlighted.origEnemyCardZ;
        _tutorialHighlighted.enemyCard = null;
    }
}

function _positionTutorialTooltip(targetEl) {
    const tooltip = document.getElementById('tutorial-tooltip');
    if (!tooltip) return;

    const PAD = 12;
    const viewport = window.visualViewport || { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
    const vw = viewport.width;
    const vh = viewport.height;
    const viewLeft = viewport.offsetLeft || 0;
    const viewTop = viewport.offsetTop || 0;
    // 使用實際渲染尺寸（overlay 已在此函式呼叫前移除 hidden），確保手機窄螢幕下也準確
    tooltip.style.width = `${Math.min(290, Math.max(220, vw - PAD * 2))}px`;
    tooltip.style.maxHeight = `${Math.max(120, vh - PAD * 2)}px`;

    const tooltipRect = tooltip.getBoundingClientRect();
    const TOOLTIP_W = tooltipRect.width || tooltip.offsetWidth || 290;
    const TOOLTIP_H = tooltipRect.height || tooltip.offsetHeight || 150;
    const container = document.getElementById('game-container');
    const containerRect = container ? container.getBoundingClientRect() : null;
    const containerScale = container && containerRect && container.offsetWidth
        ? (containerRect.width / container.offsetWidth)
        : 1;

    let left, top;

    if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        // 優先顯示於元素下方，空間不足則改顯示於上方
        if (rect.bottom + TOOLTIP_H + PAD <= viewTop + vh - PAD) {
            top = rect.bottom + PAD;
        } else if (rect.top - TOOLTIP_H - PAD >= viewTop + PAD) {
            top = rect.top - TOOLTIP_H - PAD;
        } else {
            const spaceBelow = viewTop + vh - rect.bottom;
            const spaceAbove = rect.top - viewTop;
            top = spaceBelow >= spaceAbove ? rect.bottom + PAD : rect.top - TOOLTIP_H - PAD;
        }
        // 水平置中對齊目標元素
        left = rect.left + rect.width / 2 - TOOLTIP_W / 2;
    } else {
        // 無目標時置中螢幕
        left = viewLeft + vw / 2 - TOOLTIP_W / 2;
        top = viewTop + vh / 2 - TOOLTIP_H / 2;
    }

    // 統一進行四邊邊界限制，避免任何情況下溢出螢幕（手機直式螢幕極端情況亦安全）
    left = Math.max(viewLeft + PAD, Math.min(viewLeft + vw - TOOLTIP_W - PAD, left));
    top = Math.max(viewTop + PAD, Math.min(viewTop + vh - TOOLTIP_H - PAD, top));

    if (containerRect && containerScale) {
        left = (left - containerRect.left) / containerScale;
        top = (top - containerRect.top) / containerScale;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function _positionTutorialPointer(targetEl) {
    const pointer = document.getElementById('tutorial-pointer');
    if (!pointer) return;
    if (!targetEl) {
        pointer.classList.add('hidden');
        return;
    }

    const PAD = 12;
    const POINTER_W = 24;
    const POINTER_H = 18;
    const viewport = window.visualViewport || { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
    const viewLeft = viewport.offsetLeft || 0;
    const viewTop = viewport.offsetTop || 0;
    const rect = targetEl.getBoundingClientRect();
    const container = document.getElementById('game-container');
    const containerRect = container ? container.getBoundingClientRect() : null;
    const containerScale = container && containerRect && container.offsetWidth
        ? (containerRect.width / container.offsetWidth)
        : 1;

    let left = rect.left + rect.width / 2 - POINTER_W / 2;
    let top = rect.top - POINTER_H - 8;

    if (top < viewTop + PAD) {
        top = rect.bottom + 8;
    }

    left = Math.max(viewLeft + PAD, Math.min(viewLeft + viewport.width - POINTER_W - PAD, left));
    top = Math.max(viewTop + PAD, Math.min(viewTop + viewport.height - POINTER_H - PAD, top));

    if (containerRect && containerScale) {
        left = (left - containerRect.left) / containerScale;
        top = (top - containerRect.top) / containerScale;
    }

    pointer.style.left = `${left}px`;
    pointer.style.top = `${top}px`;
    pointer.classList.remove('hidden');
}

export function hideTutorialOverlay() {
    _unhighlightTutorialElement();
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.classList.add('hidden');
}

// ===== How-to-play modal =====

export function renderHowToPlayTab(tabKey) {
    const contentEl = document.getElementById('htp-content');
    if (!contentEl) return;

    // Tab button active state
    const tabs = ['basics', 'hands', 'relics', 'shackles', 'souls'];
    tabs.forEach(t => {
        const btn = document.getElementById(`htp-tab-${t}`);
        if (!btn) return;
        const isActive = t === tabKey;
        btn.className = isActive
            ? 'flex-shrink-0 px-3 py-2 text-sm font-bold text-violet-400 bg-slate-800 transition-colors border-b-2 border-violet-500'
            : 'flex-shrink-0 px-3 py-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b-2 border-transparent';
    });

    if (tabKey === 'hands') {
        // Reuse the already-rendered rules content
        const rulesContent = document.getElementById('rules-content');
        if (!rulesContent) return;
        if (!rulesContent.innerHTML.trim()) renderRulesDB();
        contentEl.innerHTML = rulesContent.innerHTML;
        return;
    }

    const keyMap = {
        basics: 'htp_basics',
        relics: 'htp_relics',
        shackles: 'htp_shackles',
        souls: 'htp_souls'
    };
    contentEl.innerHTML = i18n.t(`tutorial.${keyMap[tabKey]}`) || '';
}

export function initResponsiveScaling() {
    const container = document.getElementById('game-container');
    const scaler = document.getElementById('game-scaler');
    if (!container || !scaler) return;
    function resize() {
        const w = scaler.clientWidth || window.innerWidth;
        const h = scaler.clientHeight || window.innerHeight;
        const rawScale = Math.min(w / 450, h / 800);
        const portraitScale = parseFloat(getComputedStyle(document.body).getPropertyValue('--steam-portrait-max-scale'));
        const maxScale = document.body.classList.contains('steam-portrait') && Number.isFinite(portraitScale) ? portraitScale : rawScale;
        const scale = Math.min(rawScale, maxScale);
        container.style.transform = `scale(${scale})`;
    }
    window.addEventListener('resize', resize);
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', resize);
    }
    resize();
}

initResponsiveScaling();

// 遺物欄：桌機用滑鼠滾輪橫向捲動
if (el.inventoryGrid) {
    el.inventoryGrid.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // 已有橫向滾動時跳過
        e.preventDefault();
        el.inventoryGrid.scrollLeft += e.deltaY * 0.8;
    }, { passive: false });
}

// DEV ONLY：設定標題 5 連點開發者入口
if (IS_DEV && el.settingsTitle) {
    let settingsTapCount = 0;
    let settingsTapTimer = null;
    el.settingsTitle.addEventListener('click', () => {
        settingsTapCount++;
        clearTimeout(settingsTapTimer);
        settingsTapTimer = setTimeout(() => { settingsTapCount = 0; }, 2000);

        if (settingsTapCount >= 5) {
            settingsTapCount = 0;
            const settingsModal = document.getElementById('settings-modal');
            if (settingsModal) settingsModal.classList.add('hidden');
            if (window.openDevModal) window.openDevModal();
        }
    });
}

// --- 滑鼠拖曳橫向滾動 ---
function enableDragScroll(el) {
    if (el.dataset.dragScrollBound === '1') return;
    el.dataset.dragScrollBound = '1';

    const DRAG_THRESHOLD = 5;
    let isDown = false, startX = 0, scrollLeft = 0, hasDragged = false, suppressClick = false, lastRelicOpenAt = 0, pointerDownRelic = null;
    el.style.touchAction = 'pan-x';
    const debugRelicEvents = (() => {
        if (new URLSearchParams(window.location.search).get('debugRelic') === '1') return true;
        try {
            return new URL(document.referrer).searchParams.get('debugRelic') === '1';
        } catch (err) {
            return false;
        }
    })();

    const logRelicEvent = (label, e, relicTarget) => {
        if (!debugRelicEvents) return;
        let panel = document.getElementById('relic-debug-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'relic-debug-panel';
            panel.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;max-width:420px;max-height:180px;overflow:auto;background:rgba(0,0,0,.86);color:#fff;font:12px monospace;padding:8px;border:1px solid #a78bfa;border-radius:6px;white-space:pre-wrap;pointer-events:none;';
            panel.textContent = `debugRelic active href=${window.location.href}\nref=${document.referrer || 'none'}`;
            document.body.appendChild(panel);
        }
        const targetInfo = e.target?.id || e.target?.dataset?.relicId || e.target?.tagName || 'none';
        const relicInfo = relicTarget?.dataset?.relicId || 'none';
        const line = `${label} target=${targetInfo} relic=${relicInfo} x=${Math.round(e.clientX || 0)} drag=${hasDragged}`;
        panel.textContent = `${line}\n${panel.textContent}`.slice(0, 1800);
    };

    const findRelicTarget = e => {
        const directTarget = e.target.closest?.('[data-relic-id]');
        if (directTarget && el.contains(directTarget)) return directTarget;

        const pointTarget = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-relic-id]');
        if (pointTarget && el.contains(pointTarget)) return pointTarget;

        if (pointerDownRelic && el.contains(pointerDownRelic)) return pointerDownRelic;
        return null;
    };

    const openRelicFromEvent = e => {
        const relicTarget = findRelicTarget(e);
        if (!relicTarget) return false;
        e.preventDefault();
        e.stopPropagation();
        lastRelicOpenAt = Date.now();
        window.showRelicInfo(relicTarget.dataset.relicId);
        return true;
    };

    el.addEventListener('pointerdown', e => {
        isDown = true;
        startX = e.clientX;
        scrollLeft = el.scrollLeft;
        hasDragged = false;
        suppressClick = false;
        pointerDownRelic = findRelicTarget(e);
        logRelicEvent('pointerdown', e, pointerDownRelic);
        el.setPointerCapture?.(e.pointerId);
    });
    el.addEventListener('pointercancel', e => { logRelicEvent('pointercancel', e, pointerDownRelic); isDown = false; pointerDownRelic = null; });
    el.addEventListener('pointerup', e => {
        logRelicEvent('pointerup', e, findRelicTarget(e));
        if (!hasDragged) {
            openRelicFromEvent(e);
        }

        if (hasDragged) {
            suppressClick = true;
            setTimeout(() => { suppressClick = false; }, 0);
        }

        isDown = false;
        pointerDownRelic = null;
        el.releasePointerCapture?.(e.pointerId);
    });
    el.addEventListener('pointerleave', e => { logRelicEvent('pointerleave', e, pointerDownRelic); isDown = false; pointerDownRelic = null; });
    el.addEventListener('pointermove', e => {
        if (!isDown) return;
        const deltaX = e.clientX - startX;
        if (!hasDragged && Math.abs(deltaX) < DRAG_THRESHOLD) return;
        hasDragged = true;
        logRelicEvent('pointermove-drag', e, pointerDownRelic);
        e.preventDefault();
        el.scrollLeft = scrollLeft - deltaX;
    });
    el.addEventListener('click', e => {
        const relicTarget = e.target.closest?.('[data-relic-id]');
        logRelicEvent('click', e, relicTarget);
        if (suppressClick || (relicTarget && Date.now() - lastRelicOpenAt < 500)) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (relicTarget && el.contains(relicTarget)) {
            e.preventDefault();
            e.stopPropagation();
            window.showRelicInfo(relicTarget.dataset.relicId);
        }
    });
    el.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const relicTarget = e.target.closest?.('[data-relic-id]');
        if (!relicTarget || !el.contains(relicTarget)) return;
        e.preventDefault();
        window.showRelicInfo(relicTarget.dataset.relicId);
    });
}

export function initDragScrollAll() {
    document.querySelectorAll('.scrollable-row').forEach(enableDragScroll);
}

export function showPlayerHit(amount, severity = 'light') {
    const restartClass = (node, cls, duration) => {
        if (!node) return;
        node.classList.remove(cls);
        void node.offsetWidth;
        node.classList.add(cls);
        setTimeout(() => node.classList.remove(cls), duration);
    };

    restartClass(el.battleArea, 'player-hit-screen-shake', severity === 'light' ? 380 : 460);

    if (el.playerHeartHp) {
        el.playerHeartHp.classList.remove('shake-player-hp', 'heart-hp--danger');
        void el.playerHeartHp.offsetWidth;
        el.playerHeartHp.classList.add('shake-player-hp');
        setTimeout(() => el.playerHeartHp.classList.remove('shake-player-hp'), 420);
        if (severity === 'fatal') {
            el.playerHeartHp.classList.add('heart-hp--danger');
            setTimeout(() => el.playerHeartHp.classList.remove('heart-hp--danger'), 1000);
        }
    }

    const rect = el.playerHeartHp ? el.playerHeartHp.getBoundingClientRect() : null;
    if (rect) {
        const txt = document.createElement('div');
        txt.className = 'player-damage-text';
        txt.textContent = `-${amount}`;
        txt.style.left = `${rect.left + rect.width / 2}px`;
        txt.style.top = `${rect.top}px`;
        document.body.appendChild(txt);
        const removeTxt = () => { if (txt.parentNode) txt.remove(); };
        txt.addEventListener('animationend', removeTxt, { once: true });
        setTimeout(removeTxt, 1200);
    }

    const slash = document.createElement('div');
    slash.className = 'player-hit-slash';
    document.body.appendChild(slash);
    const removeSlash = () => { if (slash.parentNode) slash.remove(); };
    slash.addEventListener('animationend', removeSlash, { once: true });
    setTimeout(removeSlash, 600);

    const overlay = document.createElement('div');
    if (severity === 'fatal') {
        overlay.className = 'danger-vignette';
    } else if (severity === 'heavy') {
        overlay.className = 'player-heavy-hit-vignette';
    } else {
        overlay.className = 'player-hit-vignette';
    }
    document.body.appendChild(overlay);
    const removeOverlay = () => { if (overlay.parentNode) overlay.remove(); };
    overlay.addEventListener('animationend', removeOverlay, { once: true });
    setTimeout(removeOverlay, 1500);
}

export function showEnemyAttackCue(onImpact) {
    const enemyCard = el.enemyName?.closest('.card-enemy') || el.battleArea;

    if (enemyCard) {
        enemyCard.classList.remove('enemy-attack-cue');
        void enemyCard.offsetWidth;
        enemyCard.classList.add('enemy-attack-cue');
        setTimeout(() => enemyCard.classList.remove('enemy-attack-cue'), 650);
    }

    const slash = document.createElement('div');
    slash.className = 'enemy-attack-slash';
    document.body.appendChild(slash);
    const removeSlash = () => { if (slash.parentNode) slash.remove(); };
    slash.addEventListener('animationend', removeSlash, { once: true });
    setTimeout(removeSlash, 650);

    setTimeout(() => {
        if (typeof onImpact === 'function') onImpact();
    }, 260);
}

const STEAM_STORE_URL = 'https://store.steampowered.com/app/4792230/_BIBI_DICE/';

function isPromoTarget() {
    const body = document.body;
    return body.classList.contains('steam-demo-build') || body.classList.contains('itch-build');
}

function openStoreUrl() {
    if (window.electronAPI && window.electronAPI.openExternal) {
        window.electronAPI.openExternal(STEAM_STORE_URL);
    } else {
        window.open(STEAM_STORE_URL, '_blank', 'noopener,noreferrer');
    }
}

export function initPromo() {
    if (!isPromoTarget()) return;

    const titleCard = document.getElementById('promo-title-card');
    const titleBtn  = document.getElementById('promo-title-btn');
    if (titleCard) {
        titleCard.classList.remove('hidden');
        if (titleBtn) {
            titleBtn.addEventListener('click', openStoreUrl);
            titleBtn.dataset.promoReady = 'true';
        }
    }

    const winBtn = document.getElementById('promo-win-btn');
    if (winBtn) {
        winBtn.addEventListener('click', openStoreUrl);
        winBtn.dataset.promoReady = 'true';
    }
}

export function showPromoWinCard() {
    if (!isPromoTarget()) return;
    const card = document.getElementById('promo-win-card');
    if (card) card.classList.remove('hidden');
}

export function hidePromoWinCard() {
    const card = document.getElementById('promo-win-card');
    if (card) card.classList.add('hidden');
}
