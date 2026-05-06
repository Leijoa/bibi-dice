// js/main.js
import { RELIC_DB, ENEMY_DB, RULE_DB, getEnemy, FUSION_RECIPES, CONSUMABLES_DB, isElite, isBoss } from './data.js';
import { calculateEngineScore, isDamageVisible, isEnemyHpBarVisible, isEnemyHpBarPreviewVisible, getDisplayedEstimatedDamage, setDrunkDisplayValue, clearDrunkDisplayValue, setIllusionaryFakeRatio, clearIllusionaryFakeRatio, calculateDamageSteps, devApplyShackle as engineDevApplyShackle, devRemoveShackle as engineDevRemoveShackle } from './engine.js';
import * as UI from './ui.js';
import * as Audio from './audio.js';
import { i18n } from './i18n.js';


export function getEnemyWithMeta(levelIndex) {
    let baseEnemy = getEnemy(levelIndex);
    let burstLevel = metaData.upgrades.soulBurst || 0;

    if (burstLevel > 0) {
        let prefix = "LV." + burstLevel;
        if (levelIndex >= ENEMY_DB.length) {
            prefix += "層";
        }
        return {
            ...baseEnemy,
            name: prefix + " " + baseEnemy.name,
            hp: baseEnemy.hp * (burstLevel + 1)
        };
    }
    return baseEnemy;
}

// --- 遊戲狀態 ---
let player = { hp: 3, relics: [], maxRolls: 3, dismantledFusions: [], fivesRolled: 0, fivesRolled: 0 };
let stage = { level: 0, enemyMaxHp: 0, enemyHp: 0, turnsLeft: 0, activeShackle: null, shackleMeta: null };
let drunkInterval = null;
let battle = { state: 'IDLE', dice: Array(8).fill().map((_, i) => ({ val: 1, locked: false, id: i, matchedGroups: {A:false, B:false, C:false, D:false} })), rollsLeft: 0, scoreResult: null };
let shopItems = [];
let shopRerollsUsed = 0;
let activeHighlight = null;
const SAVE_KEY = 'bibbidiba_save_v60';

// --- Tutorial state ---
let tutorialMode = false;
let tutorialStep = 0;
let tutorialForcedDice = null; // array[8] to force on next roll

const TUTORIAL_STEPS = [
    { step: 0, highlight: null,            forceDice: [3, 3, 5, 2, 7, 1, 4, 6], waitFor: 'any_click' },
    { step: 1, highlight: 'dice-container', forceDice: [3, 3, 5, 2, 7, 1, 4, 6], waitFor: 'lock_two_dice' },
    { step: 2, highlight: 'roll-btn',       waitFor: 'roll_action', forceDiceAfterRoll: [3, 3, 3, 6, 6, 1, 4, 2] },
    { step: 3, highlight: 'score-preview', waitFor: 'any_click' },
    { step: 4, highlight: 'attack-btn',    waitFor: 'attack_action' },
    { step: 5, highlight: 'shop-container', waitFor: 'shop_select' },
    { step: 6, highlight: null,            waitFor: 'any_click', onComplete: 'end_tutorial' }
];
window.TUTORIAL_STEPS = TUTORIAL_STEPS;
const HISTORY_KEY = 'bibbidiba_history_v60';
const COLLECTION_KEY = 'bibbidiba_collection_v60';

const META_KEY = 'bibbidiba_meta_v1';
let metaData = {
    souls: 0,
    stats: {
        highestDamage: 0,
        highestDamageCombo: '無',
        highestDamageRelics: [],
        highestMulti: 0,
        highestInfiniteLevel: 0
    },
    upgrades: {
        hp: 0,         // 等級 0~2 (+1 最大生命)
        discount: 0,   // 等級 0~3 (-2 商店金幣)
        startGold: 0,  // 等級 0~3 (+10 初始金幣)
        rerolls: 0,    // 等級 0~2 (+1 初始重骰)
        startRelic: 0, // 等級 0~1 (+1 初始遺物)
        finalDamage: 0, // 等級 0~5 (+10% 最終傷害)
        soulBurst: 0   // 等級 0~10 (敵血+等級倍, 靈魂+等級)
    }
};

function loadMetaData() {
    let parsed = secureParseStorage(META_KEY, metaData, (data) => typeof data.souls === 'number');
    if (!parsed.stats) {
        parsed.stats = {
            highestDamage: 0,
            highestDamageCombo: '無',
            highestDamageRelics: [],
            highestMulti: 0,
            highestInfiniteLevel: 0
        };
    }
    if (!parsed.upgrades) {
        parsed.upgrades = {
            hp: 0, discount: 0, startGold: 0, rerolls: 0, startRelic: 0, finalDamage: 0, soulBurst: 0
        };
    }
    metaData = parsed;
}
function saveMetaData() {
    localStorage.setItem(META_KEY, JSON.stringify(metaData));
}

window.getMetaData = () => metaData;
window.saveMetaData = saveMetaData;


// 開發者模式
let devSecretBuffer = "";
window.addEventListener('keydown', (e) => {
    devSecretBuffer += e.key;
    if (devSecretBuffer.length > 7) devSecretBuffer = devSecretBuffer.slice(-7);
    if (devSecretBuffer === "3345678") {
        triggerDevMode();
    }
});

function triggerDevMode() {
    UI.updateHeaderUI(player, stage);

    // 增加靈魂
    metaData.souls += 1000;
    saveMetaData();

    // 如果在標題畫面，全開收集冊
    if (!UI.el.titleScreen.classList.contains('hidden')) {
        for (let group in RULE_DB) RULE_DB[group].forEach(r => { if (!collection.hands.includes(r.id)) collection.hands.push(r.id); });
        RELIC_DB.forEach(r => { if (!collection.relics.includes(r.id)) collection.relics.push(r.id); });
        import('./data.js').then(({ SHACKLE_DB }) => {
            SHACKLE_DB.forEach(r => { if (!collection.shackles.includes(r.id)) collection.shackles.push(r.id); });
            saveCollection();
        });
        UI.showToast(i18n.t('messages.toast_dev_mode', '99,999'));
    } else {
        UI.showToast(i18n.t('messages.toast_dev_mode_simple', '99,999'));
    }

    if (window.openDevModal) {
        window.openDevModal();
    }
}

if (UI.el.devRelicConfirm) {
    UI.el.devRelicConfirm.onclick = () => {
        let select = UI.el.devRelicSelect;
        if (!select || !select.value) {
            UI.showToast(i18n.t('messages.toast_need_relic'));
            return;
        }
        let rId = select.value;
        player.relics.push(rId);
        unlockCollectionItem('relic', rId);

        // 為了使用 checkRelicFusion 與 renderInventory 我們直接呼叫
        if (typeof checkRelicFusion === 'function') checkRelicFusion();
        UI.renderInventory(player, battle);
        if (typeof saveGame === 'function') saveGame();

        let rName = rId.startsWith('cons_') ? i18n.t(`consumables.${rId}.name`) : (i18n.t(`relics.${rId}.name`) || rId);
        UI.showToast(i18n.t('messages.toast_dev_get_relic', rName));
        window.closeDevModal();
    };
}

// 收集冊狀態
let collection = {
    hands: [],
    relics: [],
    shackles: []
};

// --- 安全存儲解析 (Secure Storage Parsing) ---
function secureParseStorage(key, fallbackValue, validatorFn = null) {
    try {
        const data = localStorage.getItem(key);
        if (!data) return fallbackValue;
        
        const parsed = JSON.parse(data);
        
        // Basic type check to prevent prototype pollution or non-object evaluation
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed) !== Array.isArray(fallbackValue)) {
            console.warn(`[Security] Invalid structure for ${key}, falling back to default.`);
            return fallbackValue;
        }

        // Custom validation (schema checking) if provided
        if (validatorFn && !validatorFn(parsed)) {
             console.warn(`[Security] Validation failed for ${key}, falling back to default.`);
             return fallbackValue;
        }
        
        return parsed;
    } catch (e) {
        console.error(`[Security] JSON parse error for ${key}:`, e);
        return fallbackValue;
    }
}

function loadCollection() {
    collection = secureParseStorage(COLLECTION_KEY, { hands: [], relics: [], shackles: [] }, (data) => {
        return Array.isArray(data.hands) && Array.isArray(data.relics) && Array.isArray(data.shackles);
    });
}

window.saveCollection = saveCollection;
function saveCollection() {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
}

function unlockCollectionItem(type, id) {
    if (type === 'hand' && !collection.hands.includes(id)) {
        collection.hands.push(id);
        saveCollection();
    } else if (type === 'relic' && !collection.relics.includes(id)) {
        collection.relics.push(id);
        saveCollection();
    } else if (type === 'shackle' && !collection.shackles.includes(id)) {
        collection.shackles.push(id);
        saveCollection();
    }
}

window.unlockCollectionItem = unlockCollectionItem; // Export for external usage if needed
window.getCollection = () => collection;
window.getStageActiveShackle = () => stage.activeShackle;
window.getStageLevel = () => stage.level;
window.getMaxHp = () => 3 + (metaData.upgrades.hp * 1);
window.getShackleMeta = () => stage.shackleMeta;
window.getStageEnemyHp = () => stage.enemyHp;
window.getStageEnemyMaxHp = () => stage.enemyMaxHp;
window.isDamageVisible = () => isDamageVisible(stage.activeShackle);
window.isEnemyHpBarVisible = () => isEnemyHpBarVisible(stage.activeShackle);
window.isEnemyHpBarPreviewVisible = () => isEnemyHpBarPreviewVisible(stage.activeShackle);
window.getDisplayedEstimatedDamage = (actualDamage) => getDisplayedEstimatedDamage(actualDamage, stage.activeShackle);
window.refreshDamageDisplay = () => { if (battle.scoreResult) UI.renderScore(battle, activeHighlight); };

// DEV ONLY
window.devApplyShackle = (shackleId) => {
    if (stage.shackleTimer) { clearTimeout(stage.shackleTimer); stage.shackleTimer = null; }
    engineDevApplyShackle(stage, shackleId);
    if (shackleId === 'thalassophobia') {
        const triggerFear = () => {
            if (battle.state === 'IDLE' || battle.state === 'WAIT_ACTION') {
                if (UI.el.diceContainer) {
                    UI.el.diceContainer.classList.add('deep-sea-anim');
                    setTimeout(() => UI.el.diceContainer.classList.remove('deep-sea-anim'), 1000);
                }
            }
            stage.shackleTimer = setTimeout(triggerFear, 3000 + Math.random() * 5000);
        };
        stage.shackleTimer = setTimeout(triggerFear, 3000 + Math.random() * 5000);
    }
    UI.updateEnemyUI(stage);
    if (battle.scoreResult) UI.renderScore(battle, activeHighlight);
    saveGame();
};
// DEV ONLY
window.devRemoveShackle = () => {
    if (stage.shackleTimer) { clearTimeout(stage.shackleTimer); stage.shackleTimer = null; }
    clearIllusionaryFakeRatio();
    engineDevRemoveShackle(stage);
    UI.updateEnemyUI(stage);
    if (battle.scoreResult) UI.renderScore(battle, activeHighlight);
    saveGame();
};

// --- Modular Game Loop Hooks ---
function applyCombatShackles(dmg, actualDamage, isEnemyDefeated) {
    if (!stage.activeShackle) return false; // Returns true if player dies from recoil

    let playerDied = false;

    if (stage.activeShackle === 'thornarmor') {
        let threshold = stage.enemyMaxHp * 0.10;
        if (dmg < threshold) {
            player.hp--;
            if (player.hp > 0 && player.relics.includes('berserker')) {
                player.berserkerBonus = (player.berserkerBonus || 0) + 1;
                UI.showToast(i18n.t('messages.toast_berserker'));
            }
            UI.updateHeaderUI(player, stage);
            UI.showToast(i18n.t('messages.toast_thornarmor'));
            if (player.hp <= 0) playerDied = true;
        }
    }

    if (stage.activeShackle === 'mutualdestruction') {
        let recoil = Math.floor(dmg * 0.05);
        if (recoil > 0) {
            player.hp -= recoil;
            UI.updateHeaderUI(player, stage);
            UI.showToast(i18n.t('messages.toast_mutual_destruct', recoil));
            if (player.hp <= 0) {
                player.hp = 1;
                UI.updateHeaderUI(player, stage);
                UI.showToast(i18n.t('messages.toast_mutual_destruct_survive'));
            }
        }
    }

    return playerDied;
}

// --- 存檔系統 (Save System) ---
function saveGame() {
    let inShop = !UI.el.shopOverlay.classList.contains('hidden');
    const saveData = {
        player: {
            ...player
        },
        stage: {
            level: stage.level,
            enemyMaxHp: stage.enemyMaxHp,
            enemyHp: stage.enemyHp,
            turnsLeft: stage.turnsLeft,
            activeShackle: stage.activeShackle,
            shackleMeta: stage.shackleMeta,
            hasAttackedThisStage: stage.hasAttackedThisStage,
            infiniteMonsterId: stage.infiniteMonsterId
        },
        battle: {
            state: battle.state,
            dice: battle.dice,
            rollsLeft: battle.rollsLeft,
            scoreResult: battle.scoreResult,
            balanceUsedThisTurn: battle.balanceUsedThisTurn
        },
        shop: inShop ? { active: true, items: shopItems, rerolls: shopRerollsUsed } : { active: false }
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

function loadGame() {
    const parsed = secureParseStorage(SAVE_KEY, null, (data) => {
        return data && typeof data.player === 'object' && typeof data.stage === 'object' && typeof data.battle === 'object';
    });
    
    if (parsed) {
        player = parsed.player;
        player.dismantledFusions = player.dismantledFusions || [];
        player.fivesRolled = player.fivesRolled || 0;
        UI.el.titleScreen.classList.add('hidden');

        if (parsed.shop && parsed.shop.active) {
            stage.level = parsed.stage.level;
            stage.activeShackle = parsed.stage.activeShackle || null;
            stage.shackleMeta = parsed.stage.shackleMeta || null;
            let enemy = getEnemyWithMeta(stage.level);
            stage.enemyMaxHp = enemy.hp;
            stage.enemyName = enemy.name;
            stage.enemyHp = 0; // 已經擊敗
            stage.turnsLeft = enemy.turns;

            shopItems = parsed.shop.items || [];
            shopRerollsUsed = parsed.shop.rerolls || 0;

            renderAll();
            UI.el.shopOverlay.classList.remove('hidden');
            UI.el.shopOverlay.classList.add('flex');
            UI.updateShopRerollBtn(shopRerollsUsed, false, false);
            UI.renderShopItems(shopItems, player);
        } else {
            loadStage(parsed.stage.level, true, parsed);
        }
    }
}

function clearSave() {
    localStorage.removeItem(SAVE_KEY);
}

function checkSaveExists() {
    if (localStorage.getItem(SAVE_KEY)) {
        UI.el.btnContinue.classList.remove('hidden');
    }
}

// --- 初始化與主流程 ---
function initTitleScreen() {
    i18n.updateDOM(); // Initialize standard DOM texts
    if (window.i18n) { i18n.updateDOM(); }

    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = i18n.getLocale();
        langSelect.addEventListener('change', (e) => {
            i18n.setLocale(e.target.value);
        });
    }

    i18n.subscribe(() => {
        UI.updateHeaderUI(player, stage);
        if (battle.state !== 'IDLE') {
            renderAll();
        }
        if (!UI.el.shopOverlay.classList.contains('hidden')) {
            UI.renderShopItems(shopItems, player);
            UI.updateShopRerollBtn(shopRerollsUsed, player.relics.includes('scavenger'), player.relics.includes('recycle'));
        }
        UI.renderRulesDB();
        
        if (document.getElementById('history-modal') && !document.getElementById('history-modal').classList.contains('hidden')) {
            window.renderHistoryModal();
        }
        if (document.getElementById('collection-modal') && !document.getElementById('collection-modal').classList.contains('hidden')) {
            window.renderCollectionModal();
        }
        if (document.getElementById('souls-modal') && !document.getElementById('souls-modal').classList.contains('hidden')) {
            window.renderSoulsModal();
        }
    });

    loadMetaData();
    UI.renderRulesDB();
    checkSaveExists();

    UI.el.btnNewGame.onclick = () => {
        clearSave();
        UI.el.titleScreen.classList.add('hidden');
        initNewGame();
    };
    UI.el.btnContinue.onclick = () => {
        UI.el.titleScreen.classList.add('hidden');
        loadGame();
    };

    document.getElementById('btn-rules').onclick = () => UI.el.rulesModal.classList.remove('hidden');
    document.getElementById('btn-close-rules').onclick = () => UI.el.rulesModal.classList.add('hidden');
    if (document.getElementById('btn-back-to-title')) {
        document.getElementById('btn-back-to-title').onclick = () => {
            if (window.confirm(i18n.t('ui.confirm_back_title'))) {
                location.reload();
            }
        };
    }

        if (UI.el.btnSouls) {
        UI.el.btnSouls.onclick = () => {
            UI.renderSoulsModal(metaData);
            UI.el.soulsModal.classList.remove('hidden');
        };
        UI.el.btnCloseSouls.onclick = () => UI.el.soulsModal.classList.add('hidden');
    }

    if (UI.el.btnHistory && UI.el.historyModal && UI.el.btnCloseHistory) {
        UI.el.btnHistory.onclick = () => {
            let history = secureParseStorage(HISTORY_KEY, [], (data) => Array.isArray(data));
            UI.renderHistoryModal(history, metaData);
            UI.el.historyModal.classList.remove('hidden');
        };
        UI.el.btnCloseHistory.onclick = () => UI.el.historyModal.classList.add('hidden');
    }

    if (UI.el.btnCollection && UI.el.collectionModal && UI.el.btnCloseCollection) {
        let currentTab = 'hands';
        const updateTabUI = () => {
            UI.el.tabHands.className = currentTab === 'hands' ? "flex-1 py-2 text-sm font-bold text-emerald-400 bg-slate-800 transition-colors border-b-2 border-emerald-500" : "flex-1 py-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b-2 border-transparent";
            UI.el.tabRelics.className = currentTab === 'relics' ? "flex-1 py-2 text-sm font-bold text-emerald-400 bg-slate-800 transition-colors border-b-2 border-emerald-500" : "flex-1 py-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b-2 border-transparent";
            UI.el.tabShackles.className = currentTab === 'shackles' ? "flex-1 py-2 text-sm font-bold text-emerald-400 bg-slate-800 transition-colors border-b-2 border-emerald-500" : "flex-1 py-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b-2 border-transparent";
            UI.renderCollectionModal(currentTab);
        };

        UI.el.btnCollection.onclick = () => {
            currentTab = 'hands';
            updateTabUI();
            UI.el.collectionModal.classList.remove('hidden');
        };
        UI.el.btnCloseCollection.onclick = () => UI.el.collectionModal.classList.add('hidden');
        
        UI.el.tabHands.onclick = () => { currentTab = 'hands'; updateTabUI(); };
        UI.el.tabRelics.onclick = () => { currentTab = 'relics'; updateTabUI(); };
        UI.el.tabShackles.onclick = () => { currentTab = 'shackles'; updateTabUI(); };
    }

    // Tutorial button
    const btnTutorial = document.getElementById('btn-tutorial');
    if (btnTutorial) {
        btnTutorial.onclick = () => {
            const confirmMsg = (i18n.t('tutorial.btn_start') || '🎓 新手教學') + '\n\n' +
                (i18n.getLocale() === 'en' ? 'Enter tutorial mode? Dice will be preset for learning. (~2 min)' :
                 i18n.getLocale() === 'ja' ? 'チュートリアルを開始しますか？ダイスは事前設定されます。(約2分)' :
                 i18n.getLocale() === 'zh-cn' ? '进入新手引导局？骰子将被预设以利教学。(约2分钟)' :
                 '進入新手引導局？骰子結果將被預先設定以利教學。(約 2 分鐘)');
            if (window.confirm(confirmMsg)) {
                startTutorialGame();
            }
        };
    }

    // How-to-play button & modal
    const btnHowToPlay = document.getElementById('btn-how-to-play');
    const htpModal = document.getElementById('how-to-play-modal');
    const btnCloseHtp = document.getElementById('btn-close-how-to-play');
    if (btnHowToPlay && htpModal) {
        let htpTab = 'basics';
        const openHtp = () => {
            htpModal.classList.remove('hidden');
            UI.renderHowToPlayTab(htpTab);
        };
        btnHowToPlay.onclick = openHtp;
        if (btnCloseHtp) btnCloseHtp.onclick = () => htpModal.classList.add('hidden');
        ['basics', 'hands', 'relics', 'shackles', 'souls'].forEach(t => {
            const btn = document.getElementById(`htp-tab-${t}`);
            if (btn) btn.onclick = () => { htpTab = t; UI.renderHowToPlayTab(t); };
        });
    }

    UI.el.shopRerollBtn.onclick = () => window.rerollShop(false);
    document.getElementById('btn-next-stage').onclick = () => {
        if (UI.el.shopOverlay.classList.contains('hidden')) return;
        nextStage();
    };
    document.getElementById('btn-restart').onclick = () => location.reload();

    let btnInfinite = document.getElementById('btn-infinite');
    if (btnInfinite) {
        btnInfinite.onclick = () => {
            player.isInfiniteMode = true;
            UI.el.endOverlay.classList.add('hidden');
            document.getElementById('btn-restart').classList.remove('hidden');
            btnInfinite.classList.add('hidden');
            enemyDefeated(); // Proceed to shop as if enemy was defeated normally
        };
    }

    const settingsModal = document.getElementById('settings-modal');
    const bgmSlider = document.getElementById('bgm-volume-slider');
    const sfxSlider = document.getElementById('sfx-volume-slider');
    const bgmMuteToggle = document.getElementById('bgm-mute-toggle');
    const sfxMuteToggle = document.getElementById('sfx-mute-toggle');

    const applyMuteToggleUI = (el, isMuted) => {
        if (!el) return;
        const thumb = el.querySelector('span');
        el.setAttribute('aria-checked', isMuted ? 'true' : 'false');
        el.classList.toggle('bg-red-600', isMuted);
        el.classList.toggle('bg-slate-600', !isMuted);
        if (thumb) {
            thumb.classList.toggle('translate-x-5', isMuted);
            thumb.classList.toggle('translate-x-1', !isMuted);
        }
    };
    const settingsLangSelect = document.getElementById('settings-lang-select');

    // Load saved settings
    let savedSettingsStr = localStorage.getItem('bibbidiba_settings');
    if (savedSettingsStr) {
        try {
            const savedSettings = JSON.parse(savedSettingsStr);
            if (savedSettings.bgmVolume !== undefined) {
                Audio.setBGMVolume(savedSettings.bgmVolume);
                if (bgmSlider) bgmSlider.value = savedSettings.bgmVolume;
            }
            if (savedSettings.sfxVolume !== undefined) {
                Audio.setSFXVolume(savedSettings.sfxVolume);
                if (sfxSlider) sfxSlider.value = savedSettings.sfxVolume;
            }
            if (savedSettings.bgmMuted !== undefined) {
                Audio.setBGMMute(savedSettings.bgmMuted);
                if (bgmMuteToggle) applyMuteToggleUI(bgmMuteToggle, savedSettings.bgmMuted);
            }
            if (savedSettings.sfxMuted !== undefined) {
                Audio.setSFXMute(savedSettings.sfxMuted);
                if (sfxMuteToggle) applyMuteToggleUI(sfxMuteToggle, savedSettings.sfxMuted);
            }
        } catch (e) {
            console.error("Failed to parse settings", e);
        }
    }

    const saveSettings = () => {
        localStorage.setItem('bibbidiba_settings', JSON.stringify({
            bgmVolume: parseFloat(bgmSlider.value),
            sfxVolume: parseFloat(sfxSlider.value),
            bgmMuted: bgmMuteToggle ? bgmMuteToggle.getAttribute('aria-checked') === 'true' : false,
            sfxMuted: sfxMuteToggle ? sfxMuteToggle.getAttribute('aria-checked') === 'true' : false
        }));
    };

    if (bgmSlider) {
        bgmSlider.addEventListener('input', (e) => {
            Audio.setBGMVolume(parseFloat(e.target.value));
            saveSettings();
        });
    }

    if (sfxSlider) {
        sfxSlider.addEventListener('input', (e) => {
            Audio.setSFXVolume(parseFloat(e.target.value));
            saveSettings();
            Audio.playClickSound(); // Preview SFX volume
        });
    }

    if (bgmMuteToggle) {
        bgmMuteToggle.addEventListener('click', () => {
            const isMuted = bgmMuteToggle.getAttribute('aria-checked') !== 'true';
            Audio.setBGMMute(isMuted);
            applyMuteToggleUI(bgmMuteToggle, isMuted);
            saveSettings();
        });
    }

    if (sfxMuteToggle) {
        sfxMuteToggle.addEventListener('click', () => {
            const isMuted = sfxMuteToggle.getAttribute('aria-checked') !== 'true';
            Audio.setSFXMute(isMuted);
            applyMuteToggleUI(sfxMuteToggle, isMuted);
            saveSettings();
            if (!isMuted) Audio.playClickSound(); // Preview if unmuted
        });
    }

    if (settingsLangSelect) {
        settingsLangSelect.value = i18n.getLocale();
        settingsLangSelect.addEventListener('change', (e) => {
            i18n.setLocale(e.target.value);
            const langSelect = document.getElementById('lang-select');
            if (langSelect) langSelect.value = e.target.value; // Sync with home screen select
        });
        // Sync the other way around: home screen changing -> settings select changes
        const langSelect = document.getElementById('lang-select');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                settingsLangSelect.value = e.target.value;
            });
        }
    }

    const stepAnimToggle = document.getElementById('setting-step-animation-toggle');
    const isStepAnimEnabled = () => localStorage.getItem('setting_stepAnimation') !== 'false';
    const applyStepAnimToggle = (enabled) => {
        if (!stepAnimToggle) return;
        const thumb = stepAnimToggle.querySelector('span');
        stepAnimToggle.setAttribute('aria-checked', enabled ? 'true' : 'false');
        stepAnimToggle.classList.toggle('bg-violet-600', enabled);
        stepAnimToggle.classList.toggle('bg-slate-600', !enabled);
        if (thumb) { thumb.classList.toggle('translate-x-6', enabled); thumb.classList.toggle('translate-x-1', !enabled); }
    };
    applyStepAnimToggle(isStepAnimEnabled());
    if (stepAnimToggle) {
        stepAnimToggle.addEventListener('click', () => {
            const next = !isStepAnimEnabled();
            localStorage.setItem('setting_stepAnimation', next ? 'true' : 'false');
            applyStepAnimToggle(next);
        });
    }

    const openSettings = () => {
        Audio.initAudio();
        if (settingsModal) settingsModal.classList.remove('hidden');
    };

    const btnTitleSettings = document.getElementById('btn-title-settings');
    if (btnTitleSettings) btnTitleSettings.onclick = openSettings;

    const btnHeaderSettings = document.getElementById('btn-header-settings');
    if (btnHeaderSettings) btnHeaderSettings.onclick = openSettings;

    const btnCloseSettings = document.getElementById('btn-close-settings');
    if (btnCloseSettings) {
        btnCloseSettings.onclick = () => {
            if (settingsModal) settingsModal.classList.add('hidden');
        };
    }

    const btnSettingsConfirm = document.getElementById('btn-settings-confirm');
    if (btnSettingsConfirm) {
        btnSettingsConfirm.onclick = () => {
            if (settingsModal) settingsModal.classList.add('hidden');
        };
    }
}

import { SHACKLE_DB } from './data.js';

// --- Tutorial functions ---
function startTutorialGame() {
    tutorialMode = true;
    tutorialStep = 0;
    tutorialForcedDice = [...TUTORIAL_STEPS[0].forceDice];

    UI.el.titleScreen.classList.add('hidden');

    player = {
        hp: 3, relics: [], maxRolls: 3, bonusBasePoints: 0, nextDamageMulti: 1.0,
        dismantledFusions: [], fivesRolled: 0, highestDamage: 0, highestDamageCombo: '', isInfiniteMode: false
    };
    stage = {
        level: 0,
        enemyMaxHp: 50, enemyHp: 50,
        enemyName: i18n.t('enemies.enemy_0') || '史萊姆',
        turnsLeft: 5,
        activeShackle: null, shackleMeta: null,
        hasAttackedThisStage: false, damageBuffMulti: 1.0
    };

    renderAll();
    startTurn();
}

window.advanceTutorialStep = function() {
    if (!tutorialMode) return;
    const currentStep = TUTORIAL_STEPS[tutorialStep];
    if (currentStep && currentStep.onComplete === 'end_tutorial') {
        endTutorial();
        return;
    }
    tutorialStep++;
    if (tutorialStep < TUTORIAL_STEPS.length) {
        UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length);
    }
};

window.skipTutorial = function() {
    tutorialMode = false;
    tutorialForcedDice = null;
    UI.hideTutorialOverlay();
    location.reload();
};

function endTutorial() {
    tutorialMode = false;
    tutorialForcedDice = null;
    localStorage.setItem('bibbidiba_tutorial_done', 'true');
    UI.hideTutorialOverlay();
    location.reload();
}

window.getTutorialState = () => ({ mode: tutorialMode, step: tutorialStep });

function initNewGame() {
    let startHp = 3 + (metaData.upgrades.hp * 1);
    let startRerolls = 3 + (metaData.upgrades.rerolls * 1);

    player = {
        hp: startHp,
        relics: [],
        maxRolls: startRerolls,
        highestDamage: 0,
        highestDamageCombo: '',
        highestMulti: 0,
        isInfiniteMode: false, bonusBasePoints: 0, nextDamageMulti: 1.0,
        dismantledFusions: [], fivesRolled: 0
    };

    if (metaData.upgrades.startRelic > 0) {
        let available = RELIC_DB.filter(r => r.price > 0 && r.rarity === 1); // Give a basic relic
        if(available.length > 0) {
            let r = available[Math.floor(Math.random() * available.length)];
            player.relics.push(r.id);
            unlockCollectionItem('relic', r.id);
        }
    }

    loadStage(0);
}

function assignShackleForStage(levelIndex) {
    let shackleType = null;
    if (levelIndex < ENEMY_DB.length) {
        if (levelIndex === 2) shackleType = 'light';
        else if (levelIndex === 5) shackleType = 'heavy';
        else if (levelIndex === 8) shackleType = 'light';
        else if (levelIndex === 9) shackleType = 'heavy';
    } else {
        let infiniteLevel = levelIndex - ENEMY_DB.length + 1;
        let m = ((infiniteLevel - 1) % 3) + 1;
        shackleType = (m === 3) ? 'heavy' : 'light';
    }
    
    if (shackleType) {
        let candidates = SHACKLE_DB.filter(s => s.type === shackleType);
        let selected = candidates[Math.floor(Math.random() * candidates.length)];
        
        let meta = null;
        if (selected.id === 'parityfear') {
            meta = { fearType: Math.random() > 0.5 ? 'odd' : 'even' };
        } else if (selected.id === 'numberplunder') {
            meta = { targetNumber: Math.floor(Math.random() * 8) + 1 };
        } else if (selected.id === 'illusion') {
            meta = { fakeNumber: Math.floor(Math.random() * 8) + 1 };
        } else if (selected.id === 'dizziness') {
            meta = { displayOrder: [0, 1, 2, 3, 4, 5, 6, 7] };
        } else if (selected.id === 'inversion') {
            let colors = ['bg-slate-500', 'bg-blue-600', 'bg-pink-600', 'bg-purple-600', 'bg-teal-600', 'bg-emerald-900', 'bg-red-600', 'bg-amber-600'];
            meta = { colorMap: colors.sort(() => Math.random() - 0.5) };
        } else if (selected.id === 'blind') {
            meta = { blindIndices: [] };
        } else if (selected.id === 'wither') {
            meta = { originalHp: player.hp };
        } else if (selected.id === 'cursedlock') {
            meta = { cursedId: null };
        } else if (selected.id === 'relicseal') {
            let shuffled = [...player.relics].sort(() => 0.5 - Math.random());
            meta = { ignoredRelics: shuffled.slice(0, 2) };
        } else if (selected.id === 'illusionary') {
            let fakeRatio = Math.random() * 0.25 + 0.05;
            setIllusionaryFakeRatio(fakeRatio);
            meta = { fakeRatio };
        }
        
        return { id: selected.id, meta: meta };
    }
    return { id: null, meta: null };
}

function loadStage(levelIndex, isLoad = false, parsedData = null) {
    if (levelIndex >= ENEMY_DB.length && !player.isInfiniteMode) return gameWin();
    stage.level = levelIndex;
    let enemy = getEnemyWithMeta(levelIndex);
    stage.enemyMaxHp = enemy.hp;
            stage.enemyName = enemy.name;

    if (isLoad && parsedData && parsedData.stage) {
        stage.enemyHp = parsedData.stage.enemyHp ?? enemy.hp;
        stage.turnsLeft = parsedData.stage.turnsLeft ?? enemy.turns;
        stage.activeShackle = parsedData.stage.activeShackle || null;
        stage.shackleMeta = parsedData.stage.shackleMeta || null;
        stage.hasAttackedThisStage = parsedData.stage.hasAttackedThisStage || false;
        stage.infiniteMonsterId = parsedData.stage.infiniteMonsterId || null;

        if (parsedData.player && parsedData.player.isInfiniteMode !== undefined) {
            player.isInfiniteMode = parsedData.player.isInfiniteMode;
        }

        if (parsedData.battle) {
            battle.state = parsedData.battle.state;
            if (battle.state === 'ROLLING' || battle.state === 'ATTACKING') {
                battle.state = 'WAIT_ACTION';
            }
            battle.dice = parsedData.battle.dice || battle.dice;
            battle.rollsLeft = parsedData.battle.rollsLeft;
            battle.scoreResult = parsedData.battle.scoreResult;
            battle.balanceUsedThisTurn = parsedData.battle.balanceUsedThisTurn || false;
        }
    } else {
        stage.enemyHp = enemy.hp;
        stage.turnsLeft = enemy.turns;
        stage.hasAttackedThisStage = false;
        if (levelIndex >= ENEMY_DB.length) {
            stage.infiniteMonsterId = Math.floor(Math.random() * 50) + 1;
        } else {
            stage.infiniteMonsterId = null;
        }
        
        let shackleAssignment = assignShackleForStage(levelIndex);
        stage.activeShackle = shackleAssignment.id;
        stage.shackleMeta = shackleAssignment.meta;
        
        // Setup consumables buff for this stage
        stage.damageBuffMulti = player.nextDamageMulti || 1.0;
        player.nextDamageMulti = 1.0; // Consume it


        if (stage.activeShackle === 'timecompress') {
            stage.turnsLeft = 2;
        }

        if (stage.activeShackle === 'wither') {
            player.hp = 1;
        }
        
        if (stage.activeShackle) {
            unlockCollectionItem('shackle', stage.activeShackle);
            let sDef = SHACKLE_DB.find(s => s.id === stage.activeShackle);
            if (sDef) {
                let extraMsg = "";
                if (stage.activeShackle === 'parityfear') {
                    extraMsg = `\n(本局目標：${stage.shackleMeta.fearType === 'odd' ? '奇數' : '偶數'})`;
                } else if (stage.activeShackle === 'numberplunder') {
                    extraMsg = `\n(本局目標數字：${stage.shackleMeta.targetNumber})`;
                }
                
                setTimeout(() => {
                    UI.showToast(i18n.t('messages.toast_shackle_found', (i18n.t(`shackles.${sDef.id}.name`) || sDef.name), (i18n.t(`shackles.${sDef.id}.desc`) || sDef.desc), extraMsg));
                }, 500);
            }
        }
    }

    if (stage.shackleTimer) {
        clearTimeout(stage.shackleTimer);
        stage.shackleTimer = null;
    }

    if (stage.activeShackle === 'thalassophobia') {
        const triggerFear = () => {
            if (battle.state === 'IDLE' || battle.state === 'WAIT_ACTION') {
                let diceContainer = document.getElementById('dice-container');
                if (diceContainer) {
                    diceContainer.classList.add('deep-sea-anim');
                    setTimeout(() => diceContainer.classList.remove('deep-sea-anim'), 1000);
                }
            }
            stage.shackleTimer = setTimeout(triggerFear, 3000 + Math.random() * 5000);
        };
        stage.shackleTimer = setTimeout(triggerFear, 3000 + Math.random() * 5000);
    }

    UI.el.shopOverlay.classList.add('hidden');

    saveGame();
    renderAll();

    if (!isLoad || !parsedData || !parsedData.battle || battle.state === 'IDLE') {
        startTurn();
    }
}

function startTurn() {
    if (stage.turnsLeft <= 0) return gameOver(i18n.t('ui.game_over_desc'));
    if (drunkInterval) { clearInterval(drunkInterval); drunkInterval = null; clearDrunkDisplayValue(); }
    if (stage.activeShackle === 'illusionary') { setIllusionaryFakeRatio(Math.random() * 0.25 + 0.05); }
    battle.state = 'IDLE';
    activeHighlight = null;

    if (stage.activeShackle === 'gluttony') {
        let healAmount = Math.floor(stage.enemyMaxHp * 0.03);
        if (stage.enemyHp < stage.enemyMaxHp) {
            stage.enemyHp = Math.min(stage.enemyMaxHp, stage.enemyHp + healAmount);
            UI.updateEnemyUI(stage);
            UI.showToast(i18n.t('messages.toast_gluttony', healAmount));
        }
    }
    
    let baseMaxRolls = 2 + (player.relics.filter(id => id === 'refresh').length * 2) + (player.berserkerBonus || 0);
    if (stage.activeShackle === 'fatigue') {
        baseMaxRolls = 1;
    }
    if (stage.activeShackle === 'destinychain') {
        baseMaxRolls = 1;
    }
    
    player.maxRolls = baseMaxRolls;
    battle.rollsLeft = player.maxRolls;
    battle.balanceUsedThisTurn = false;
    battle.dice = battle.dice.map((d, i) => ({ val: 1, locked: false, id: i, matchedGroups: {A:false, B:false, C:false, D:false} }));
    battle.scoreResult = null;
    if (!tutorialMode) saveGame();
    renderAll();
    window.executeRoll(true);
}

function renderAll() {
    UI.updateHeaderUI(player, stage);
    UI.updateEnemyUI(stage);
    UI.renderInventory(player, battle);
    UI.renderDice(battle, activeHighlight, player);
    UI.renderControls(battle);
    UI.renderScore(battle, activeHighlight);
}

// --- 註冊給 UI onclick 呼叫的全域函式 ---
window.toggleLock = function(idx) {
    if (battle.state === 'WAIT_ACTION' && !activeHighlight) {
        if (stage.activeShackle === 'fragile') {
            return UI.showToast(i18n.t('messages.toast_fragile'));
        }
        
        if (stage.activeShackle === 'cursedlock' && stage.shackleMeta && battle.dice[idx].id === stage.shackleMeta.cursedId) {
            const diceEl = document.getElementById(`dice-element-${idx}`);
            if(diceEl) {
                diceEl.classList.remove('shake-hard');
                void diceEl.offsetWidth;
                diceEl.classList.add('shake-hard');
            }
            return UI.showToast(i18n.t('messages.toast_cursedlock'));
        }

        if (stage.activeShackle === 'ultimatelock' && [2, 3, 4, 5].includes(idx)) {
            const diceEl = document.getElementById(`dice-element-${idx}`);
            if(diceEl) {
                diceEl.classList.remove('shake-hard');
                void diceEl.offsetWidth;
                diceEl.classList.add('shake-hard');
            }
            return UI.showToast(i18n.t('messages.toast_ultimatelock'));
        }
        
        let willLock = !battle.dice[idx].locked;

        if (willLock && stage.activeShackle === 'hardcap') {
            let currentLocks = battle.dice.filter(d => d.locked).length;
            if (currentLocks >= 4) {
                const diceEl = document.getElementById(`dice-element-${idx}`);
                if(diceEl) {
                    diceEl.classList.remove('shake-hard');
                    void diceEl.offsetWidth;
                    diceEl.classList.add('shake-hard');
                }
                return UI.showToast(i18n.t('messages.toast_hardcap'));
            }
        }
        
        if (willLock && stage.activeShackle === 'rusty') {
            let currentLocks = battle.dice.filter(d => d.locked).length;
            if (currentLocks >= 6) {
                const diceEl = document.getElementById(`dice-element-${idx}`);
                if(diceEl) {
                    diceEl.classList.remove('shake-hard');
                    void diceEl.offsetWidth;
                    diceEl.classList.add('shake-hard');
                }
                return UI.showToast(i18n.t('messages.toast_rusty'));
            }
        }

        battle.dice[idx].locked = willLock;
        
        if (stage.activeShackle === 'dizziness' && stage.shackleMeta && stage.shackleMeta.displayOrder) {
            stage.shackleMeta.displayOrder.sort(() => Math.random() - 0.5);
        }
        
        if (!tutorialMode) saveGame();
        UI.renderDice(battle, activeHighlight, player);
        const diceEl = document.getElementById(`dice-element-${idx}`);
        if(diceEl) {
            diceEl.classList.remove('pop-anim');
            void diceEl.offsetWidth;
            diceEl.classList.add('pop-anim');
        }

        // Tutorial: check lock_two_dice condition
        if (tutorialMode && willLock) {
            const lockedCount = battle.dice.filter(d => d.locked).length;
            if (TUTORIAL_STEPS[tutorialStep]?.waitFor === 'lock_two_dice' && lockedCount >= 2) {
                tutorialStep++;
                const nextStep = TUTORIAL_STEPS[tutorialStep];
                if (nextStep?.forceDiceAfterRoll) tutorialForcedDice = [...nextStep.forceDiceAfterRoll];
                UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length);
            }
        }
    }
};

window.setHighlight = function(group) {
    if (battle.state !== 'WAIT_ACTION') return;
    if (activeHighlight === group) activeHighlight = null;
    else activeHighlight = group;
    UI.renderDice(battle, activeHighlight, player);
    UI.renderScore(battle, activeHighlight);
};

window.executeRoll = function(isInitial = false) {
    if (!isInitial && battle.rollsLeft <= 0) return;
    if (battle.state === 'ROLLING' || battle.state === 'ATTACKING') return;

    if (!isInitial) {
        // Tutorial: advance step on roll action
        if (tutorialMode && TUTORIAL_STEPS[tutorialStep]?.waitFor === 'roll_action') {
            tutorialStep++; // Will show step 3 tooltip after roll completes
        }

        if (stage.activeShackle === 'rebel') {
            let freed = 0;
            battle.dice.forEach(d => {
                if (d.locked && Math.random() < 0.15) {
                    d.locked = false;
                    freed++;
                }
            });
            if (freed > 0) UI.showToast(i18n.t('messages.toast_rebel', freed));
        }

        if (!tutorialMode && player.relics.includes('balance') && battle.rollsLeft === player.maxRolls && !battle.balanceUsedThisTurn) {
            UI.showToast(i18n.t('messages.toast_balance'));
            battle.balanceUsedThisTurn = true;
        } else {
            battle.rollsLeft--;
        }
    }
    
    battle.state = 'ROLLING';
    activeHighlight = null;
    battle.dice.forEach(d => { d.matchedGroups = {A:false, B:false, C:false, D:false}; });
    saveGame();
    
    renderAll();

    let intervals = 0;
    let timer = setInterval(() => {
        Audio.playRollSound();
        battle.dice = battle.dice.map(d => d.locked ? d : { ...d, val: Math.floor(Math.random() * 8) + 1 });
        intervals++;
        UI.renderDice(battle, activeHighlight, player);

        if (intervals >= 15) { // increased animation duration
            clearInterval(timer);

            // Apply tutorial forced dice before sort & score calc
            if (tutorialMode && tutorialForcedDice) {
                let desired = [...tutorialForcedDice];
                battle.dice.filter(d => d.locked).forEach(d => {
                    let idx = desired.indexOf(d.val);
                    if (idx !== -1) desired.splice(idx, 1);
                });
                let unlockedDice = battle.dice.filter(d => !d.locked);
                unlockedDice.forEach((d, i) => { if (i < desired.length) d.val = desired[i]; });
                tutorialForcedDice = null;
            }

            battle.dice.sort((a, b) => a.val - b.val);

            player.fivesRolled += battle.dice.filter(d => d.val === 5).length;

            if (!isInitial && stage.activeShackle === 'forcedshift') {
                let lockedDice = battle.dice.filter(d => d.locked);
                if (lockedDice.length > 0) {
                    let target = lockedDice[Math.floor(Math.random() * lockedDice.length)];
                    target.val = Math.floor(Math.random() * 8) + 1;
                    battle.dice.sort((a, b) => a.val - b.val);
                    UI.showToast(i18n.t('messages.toast_forcedshift'));
                }
            }
            
            if (isInitial && stage.activeShackle === 'cursedlock' && stage.shackleMeta) {
                let minVal = Math.min(...battle.dice.map(d => d.val));
                let cursedDie = battle.dice.find(d => d.val === minVal);
                cursedDie.locked = true;
                stage.shackleMeta.cursedId = cursedDie.id;
            }

            let shackleConfig = null;
            if (stage.activeShackle) {
                shackleConfig = { id: stage.activeShackle };
                if (stage.shackleMeta) {
                    Object.assign(shackleConfig, stage.shackleMeta);
                }
            }

            let activeRelics = player.relics;
            if (stage.activeShackle === 'relicseal' && stage.shackleMeta && stage.shackleMeta.ignoredRelics) {
                activeRelics = player.relics.filter(r => !stage.shackleMeta.ignoredRelics.includes(r));
            }

            battle.scoreResult = calculateEngineScore(battle.dice, activeRelics, battle.rollsLeft, player.hp, shackleConfig ? [shackleConfig] : [], stage.turnsLeft, { level: stage.level, relics: player.relics, unlockedHands: Object.keys(window.getCollection ? window.getCollection().hands : {}).length, playerHp: player.hp, maxHp: window.getMaxHp(), fivesRolled: player.fivesRolled, finalDamageUpgrade: metaData?.upgrades?.finalDamage || 0, damageBuffMulti: stage.damageBuffMulti || 1.0, isEliteOrBoss: isElite(stage.level) || isBoss(stage.level) });

            if (stage.activeShackle === 'blind' && stage.shackleMeta) {
                let unlockedIndices = battle.dice.map((d, i) => !d.locked ? i : -1).filter(i => i !== -1);
                unlockedIndices.sort(() => Math.random() - 0.5);
                stage.shackleMeta.blindIndices = unlockedIndices.slice(0, 2);
            }

            const applyMatch = (usedVals, groupName) => {
                if(!usedVals || usedVals.length === 0) return;
                let available = battle.dice.filter(d => !d.matchedGroups[groupName]);
                usedVals.forEach(v => {
                    let idx = available.findIndex(dice => dice.val === v);
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

            battle.state = 'WAIT_ACTION';

            if (stage.activeShackle === 'shackle_drunk' && battle.scoreResult) {
                if (drunkInterval) clearInterval(drunkInterval);
                const actualScore = battle.scoreResult.finalScore;
                drunkInterval = setInterval(() => {
                    const distort = 1 + (Math.random() * 0.4 - 0.2);
                    setDrunkDisplayValue(Math.floor(actualScore * distort));
                    if (window.refreshDamageDisplay) window.refreshDamageDisplay();
                }, 300);
            }

            if (!tutorialMode) saveGame();
            renderAll();

            // Tutorial: show current step tooltip after roll completes
            if (tutorialMode) {
                setTimeout(() => UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length), 80);
            }
        }
    }, 25);
};

window.fireAttack = function() {
    if (battle.state !== 'WAIT_ACTION' || !battle.scoreResult) return;
    battle.state = 'ATTACKING';
    activeHighlight = null;

    // Tutorial: advance on attack action
    if (tutorialMode && TUTORIAL_STEPS[tutorialStep]?.waitFor === 'attack_action') {
        tutorialStep++; // step 5 will be shown when shop opens
        UI.hideTutorialOverlay();
    }

    if (drunkInterval) { clearInterval(drunkInterval); drunkInterval = null; clearDrunkDisplayValue(); }
    clearIllusionaryFakeRatio();

    if (stage.activeShackle === 'tremor' && Math.random() < 0.10) {
        let unlockedDice = battle.dice.filter(d => !d.locked);
        if (unlockedDice.length > 0) {
            let target = unlockedDice[Math.floor(Math.random() * unlockedDice.length)];
            target.val = Math.floor(Math.random() * 8) + 1;
            battle.dice.sort((a, b) => a.val - b.val);

            let shackleConfig = null;
            if (stage.activeShackle) {
                shackleConfig = { id: stage.activeShackle };
                if (stage.shackleMeta) Object.assign(shackleConfig, stage.shackleMeta);
            }
            let activeRelics = player.relics;
            if (stage.activeShackle === 'relicseal' && stage.shackleMeta && stage.shackleMeta.ignoredRelics) {
                activeRelics = player.relics.filter(r => !stage.shackleMeta.ignoredRelics.includes(r));
            }
            battle.scoreResult = calculateEngineScore(battle.dice, activeRelics, battle.rollsLeft, player.hp, shackleConfig ? [shackleConfig] : [], stage.turnsLeft, { level: stage.level, relics: player.relics, unlockedHands: Object.keys(window.getCollection ? window.getCollection().hands : {}).length, playerHp: player.hp, maxHp: window.getMaxHp(), fivesRolled: player.fivesRolled, finalDamageUpgrade: metaData?.upgrades?.finalDamage || 0, damageBuffMulti: stage.damageBuffMulti || 1.0, isEliteOrBoss: isElite(stage.level) || isBoss(stage.level) });
            UI.showToast(i18n.t('messages.toast_tremor'));
        }
    }

    UI.renderDice(battle, activeHighlight, player);
    UI.renderControls(battle);
    Audio.playAttackSound();

    // --- Build shackleConfig + activeRelics for steps calculation ---
    let shackleConfig = null;
    if (stage.activeShackle) {
        shackleConfig = { id: stage.activeShackle };
        if (stage.shackleMeta) Object.assign(shackleConfig, stage.shackleMeta);
    }
    let activeRelics = player.relics;
    if (stage.activeShackle === 'relicseal' && stage.shackleMeta && stage.shackleMeta.ignoredRelics) {
        activeRelics = player.relics.filter(r => !stage.shackleMeta.ignoredRelics.includes(r));
    }

    // --- Compute final damage (all modifiers) ---
    let finalDamage = Math.floor(battle.scoreResult.finalScore);

    // --- Build animation steps ---
    const env = { level: stage.level, relics: player.relics, unlockedHands: Object.keys(window.getCollection ? window.getCollection().hands : {}).length, playerHp: player.hp, maxHp: window.getMaxHp(), fivesRolled: player.fivesRolled, finalDamageUpgrade: metaData?.upgrades?.finalDamage || 0, damageBuffMulti: stage.damageBuffMulti || 1.0, isEliteOrBoss: isElite(stage.level) || isBoss(stage.level) };
    let steps = calculateDamageSteps(battle.dice, activeRelics, battle.rollsLeft, player.hp, shackleConfig ? [shackleConfig] : [], stage.turnsLeft, env);


    // Ensure final step shows actual finalDamage
    steps[steps.length - 1].damageAfter = finalDamage;

    // --- doAttack: original combat resolution, wrapped as callback ---
    const doAttack = () => {
        let dmg = finalDamage;

        if (stage.activeShackle === 'ironwall') {
            dmg = Math.floor(dmg * 0.8);
            UI.showToast(i18n.t('messages.toast_ironwall'));
        }

        if (stage.activeShackle === 'absolutebarrier' && !stage.hasAttackedThisStage) {
            dmg = 0;
            stage.hasAttackedThisStage = true;
            UI.showToast(i18n.t('messages.toast_absolutebarrier'));
        } else {
            stage.hasAttackedThisStage = true;
        }

        if (stage.activeShackle === 'abyssgaze' && dmg > 0 && dmg < stage.enemyMaxHp * 0.20) {
            let healAmount = dmg;
            dmg = 0;
            stage.enemyHp = Math.min(stage.enemyMaxHp, stage.enemyHp + healAmount);
            UI.showToast(i18n.t('messages.toast_abyssgaze', healAmount));
        }

        let actualDamage = Math.min(dmg, stage.enemyHp);
        stage.enemyHp -= dmg;

        if (stage.activeShackle === 'healingdice') {
            let count2 = battle.dice.filter(d => d.val === 2).length;
            if (count2 > 0) {
                let healAmount = Math.floor(count2 * stage.enemyMaxHp * 0.03);
                stage.enemyHp = Math.min(stage.enemyMaxHp, stage.enemyHp + healAmount);
                UI.showToast(i18n.t('messages.toast_healingdice', healAmount));
            }
        }

        if (stage.activeShackle === 'wrath') {
            let hasLegendary = false;
            ['tagA', 'tagB', 'tagC', 'tagD'].forEach(tag => {
                let name = battle.scoreResult[tag].name;
                if (name !== '無') {
                    for (let group in RULE_DB) {
                        let rule = RULE_DB[group].find(r => r.name === name);
                        if (rule && rule.rarity === 4) hasLegendary = true;
                    }
                }
            });
            if (hasLegendary) {
                player.hp -= 1;
                UI.updateHeaderUI(player, stage);
                UI.showToast(i18n.t('messages.toast_wrath'));
            }
        }

        if (dmg > (player.highestDamage || 0)) {
            player.highestDamage = dmg;
            let combos = [];
            if (battle.scoreResult.tagA.name !== '無') combos.push(battle.scoreResult.tagA.name);
            if (battle.scoreResult.tagB.name !== '無') combos.push(battle.scoreResult.tagB.name);
            if (battle.scoreResult.tagC.name !== '無') combos.push(battle.scoreResult.tagC.name);
            if (battle.scoreResult.tagD.name !== '無') combos.push(battle.scoreResult.tagD.name);
            player.highestDamageCombo = combos.join(' + ') || '無';
        }

        if (dmg > metaData.stats.highestDamage) {
            metaData.stats.highestDamage = dmg;
            let combos = [];
            if (battle.scoreResult.tagA.name !== '無') combos.push(battle.scoreResult.tagA.name);
            if (battle.scoreResult.tagB.name !== '無') combos.push(battle.scoreResult.tagB.name);
            if (battle.scoreResult.tagC.name !== '無') combos.push(battle.scoreResult.tagC.name);
            if (battle.scoreResult.tagD.name !== '無') combos.push(battle.scoreResult.tagD.name);
            metaData.stats.highestDamageCombo = combos.join(' + ') || '無';
            metaData.stats.highestDamageRelics = [...player.relics];
            saveMetaData();
        }

        if (battle.scoreResult.finalMultiplier > metaData.stats.highestMulti) {
            metaData.stats.highestMulti = battle.scoreResult.finalMultiplier;
            saveMetaData();
        }
        if (battle.scoreResult.finalMultiplier > (player.highestMulti || 0)) {
            player.highestMulti = battle.scoreResult.finalMultiplier;
        }

        if (battle.scoreResult.tagA.name !== '無') unlockCollectionItem('hand', battle.scoreResult.tagA.name);
        if (battle.scoreResult.tagB.name !== '無') unlockCollectionItem('hand', battle.scoreResult.tagB.name);
        if (battle.scoreResult.tagC.name !== '無') unlockCollectionItem('hand', battle.scoreResult.tagC.name);
        if (battle.scoreResult.tagD.name !== '無') unlockCollectionItem('hand', battle.scoreResult.tagD.name);

        UI.el.battleArea.classList.remove('shake-hard');
        void UI.el.battleArea.offsetWidth;
        UI.el.battleArea.classList.add('shake-hard');

        UI.el.hitFlash.classList.remove('hidden');
        UI.el.hitFlash.classList.remove('flash-red-anim');
        void UI.el.hitFlash.offsetWidth;
        UI.el.hitFlash.classList.add('flash-red-anim');

        let dmgEl = document.createElement('div');
        dmgEl.className = 'damage-text text-6xl md:text-8xl font-black text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.9)] z-30 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
        let displayDmg = dmg;
        if (stage.activeShackle === 'illusionary') {
            let fakeMultiplier = Math.floor(Math.random() * 16) + 5;
            displayDmg *= fakeMultiplier;
        }
        dmgEl.innerText = `-${displayDmg.toLocaleString()}`;
        UI.el.damageContainer.appendChild(dmgEl);
        setTimeout(() => { dmgEl.remove(); UI.el.hitFlash.classList.add('hidden'); }, 1200);

        UI.updateEnemyUI(stage);

        let delay = dmg > stage.enemyMaxHp * 0.20 ? 100 : 0;
        setTimeout(() => {
            let isDefeated = stage.enemyHp <= 0;
            let playerDied = applyCombatShackles(dmg, actualDamage, isDefeated);

            if (player.hp <= 0) {
                let deathReason = playerDied ? i18n.t('messages.death_thorns') : i18n.t('messages.death_hp');
                playerTakesFatalDamage(deathReason);
                if (player.hp <= 0) return;
            }

            if (isDefeated) {
                if (stage.level === ENEMY_DB.length - 1) {
                    gameWin();
                } else {
                    enemyDefeated();
                }
            } else {
                stage.turnsLeft--;
                if (stage.turnsLeft <= 0) {
                    player.hp--;
                    if (player.hp > 0 && player.relics.includes('berserker')) {
                        player.berserkerBonus = (player.berserkerBonus || 0) + 1;
                        UI.showToast(i18n.t('messages.toast_berserker'));
                    }
                    if (player.hp <= 0) {
                        playerTakesFatalDamage(i18n.t('messages.death_hp'));
                        if (player.hp <= 0) return;
                        UI.showToast(i18n.t('messages.toast_timeout_wealth'), () => {
                            stage.turnsLeft = getEnemyWithMeta(stage.level).turns;
                            if (stage.activeShackle === 'timecompress') stage.turnsLeft = 2;
                            startTurn();
                        });
                    } else {
                        UI.showToast(i18n.t('messages.toast_timeout_retry'), () => {
                            stage.turnsLeft = getEnemyWithMeta(stage.level).turns;
                            if (stage.activeShackle === 'timecompress') stage.turnsLeft = 2;
                            startTurn();
                        });
                    }
                } else startTurn();
            }
        }, 1000 + delay);
    };

    if (localStorage.getItem('setting_stepAnimation') === 'false') {
        const finalStep = steps && steps.find(s => s.final);
        if (finalStep && UI.el.finalScoreValue) UI.el.finalScoreValue.innerText = finalStep.damageAfter.toLocaleString();
        doAttack();
    } else {
        UI.playDamageStepsAnimation(steps, doAttack);
    }
};

// --- 商店與關卡結算 ---

function checkRelicFusion() {
    let fusedAny = false;
    let recipesToProcess = Object.keys(FUSION_RECIPES);

    // Check multiple times in case one fusion satisfies another (rare, but good practice)
    let keepChecking = true;
    while(keepChecking) {
        keepChecking = false;
        for (let i = 0; i < recipesToProcess.length; i++) {
            let fid = recipesToProcess[i];
            let rec = FUSION_RECIPES[fid];

            // Ignore if recipe was dismantled
            if (player.dismantledFusions && player.dismantledFusions.includes(fid)) continue;

            // Check if player has BOTH materials and DOES NOT have the fused relic yet
            if (player.relics.includes(rec.mat1) && player.relics.includes(rec.mat2) && !player.relics.includes(fid)) {
                let currentRarity5 = player.relics.filter(rId => {
                    let rDef = RELIC_DB.find(x => x.id === rId);
                    return rDef && rDef.rarity === 5;
                });

                let burstLevel = metaData.upgrades.soulBurst || 0;
                let extraLimit = 0;
                if (burstLevel >= 10) extraLimit = 4;
                else if (burstLevel >= 8) extraLimit = 3;
                else if (burstLevel >= 5) extraLimit = 2;
                else if (burstLevel >= 2) extraLimit = 1;

                let maxMythic = 2 + extraLimit;

                if (currentRarity5.length >= maxMythic) {
                    // Maximum of maxMythic rarity 5 items reached
                    // Trigger modal and pause the checking loop
                    player.relics = player.relics.filter(r => r !== rec.mat1 && r !== rec.mat2);
                    window.triggerFusionReplace(currentRarity5, fid, rec.mat1, rec.mat2);
                    return; // Important: return to pause execution. Callback will resume if needed.
                }

                // Normal fusion
                player.relics = player.relics.filter(r => r !== rec.mat1 && r !== rec.mat2);
                player.relics.push(fid);
                unlockCollectionItem('relic', fid);

                let relicDef = RELIC_DB.find(x => x.id === fid);
                UI.showToast(i18n.t('messages.toast_fusion_res', (i18n.t(`relics.${rec.mat1}.name`) || RELIC_DB.find(x=>x.id===rec.mat1).name), (i18n.t(`relics.${rec.mat2}.name`) || RELIC_DB.find(x=>x.id===rec.mat2).name), (i18n.t(`relics.${relicDef.id}.name`) || relicDef.name)));

                fusedAny = true;
                keepChecking = true;
                break; // Restart loop to handle potential state changes safely
            }
        }
    }

    if (fusedAny) {
        UI.renderInventory(player, battle);
        if (!UI.el.shopOverlay.classList.contains('hidden')) {
            UI.renderShopItems(shopItems, player);
        }
    }
}

window.triggerFusionReplace = function(currentFusions, newFusionId, mat1, mat2) {
    UI.showFusionReplaceModal(currentFusions, newFusionId, (discardedId) => {
        player.dismantledFusions = player.dismantledFusions || [];
        player.dismantledFusions.push(discardedId);

        let discardedName = RELIC_DB.find(r => r.id === discardedId)?.name || discardedId;

        if (discardedId === newFusionId) {
            // Discarding the new one, return its materials to inventory
            player.relics.push(mat1, mat2);
            // Remove returned materials from shop pool to prevent duplicates
            shopItems = shopItems.filter(item => item.id !== mat1 && item.id !== mat2);
            UI.showToast(i18n.t('messages.toast_dismantle', discardedName));
        } else {
            // Discarding an old one. Return its materials.
            let oldRec = FUSION_RECIPES[discardedId];
            if (oldRec) {
                player.relics.push(oldRec.mat1, oldRec.mat2);
                // Remove returned materials from shop pool to prevent duplicates
                shopItems = shopItems.filter(item => item.id !== oldRec.mat1 && item.id !== oldRec.mat2);
            }

            // Remove the discarded old relic from inventory
            player.relics = player.relics.filter(r => r !== discardedId);

            // Add the new one
            player.relics.push(newFusionId);
            unlockCollectionItem('relic', newFusionId);

            let newDef = RELIC_DB.find(x => x.id === newFusionId);
            UI.showToast(i18n.t('messages.toast_fusion_replace', discardedName, newDef.name));
        }

        // Re-check just in case the returned materials can form something else
        // (though they shouldn't since we added them to dismantledFusions)
        checkRelicFusion();

        // Update UI
        UI.renderInventory(player, battle);
        if (!UI.el.shopOverlay.classList.contains('hidden')) {
            UI.renderShopItems(shopItems, player);
        }
        saveGame();
    });
};

function enemyDefeated() {
    let shouldTriggerFirstAid = (stage.level + 1) % 3 === 0;
    if (player.relics.includes('firstaid') && shouldTriggerFirstAid && player.hp < window.getMaxHp()) {
        player.hp++;
        UI.showToast(i18n.t('messages.toast_firstaid'));
    }

    if (stage.activeShackle === 'wither' && stage.shackleMeta && stage.shackleMeta.originalHp) {
        player.hp = stage.shackleMeta.originalHp;
    }

    UI.shootConfetti();

    // Exclude Rarity 5 and fusion materials of active fusions from drops
    const getDropFusedMaterials = () => {
        let mats = [];
        player.relics.forEach(rId => {
            if (FUSION_RECIPES[rId]) { mats.push(FUSION_RECIPES[rId].mat1, FUSION_RECIPES[rId].mat2); }
        });
        return mats;
    };
    let availableForShop = RELIC_DB.filter(r => !player.relics.includes(r.id) && r.rarity !== 5 && !getDropFusedMaterials().includes(r.id));
    let nextStep = (availableForShop.length === 0 && !player.isInfiniteMode) ? nextStage : openShop;

    // Boss (9) or Elite (2, 5, 8)
    let isEliteOrBossDrop = isElite(stage.level) || isBoss(stage.level);

    if (isEliteOrBossDrop && availableForShop.length > 0) {
        let randomRelic = availableForShop[Math.floor(Math.random() * availableForShop.length)];
        player.relics.push(randomRelic.id);
        unlockCollectionItem('relic', randomRelic.id);

        // Ensure UI updates properly if fusion happens
        checkRelicFusion();

        availableForShop = RELIC_DB.filter(r => !player.relics.includes(r.id) && r.rarity !== 5 && !getDropFusedMaterials().includes(r.id));
        nextStep = (availableForShop.length === 0 && !player.isInfiniteMode) ? nextStage : openShop;

        if (isBoss(stage.level) && !player.isInfiniteMode) {
            nextStep = gameWin; // End game normally instead of shopping after boss in standard mode
        }

        // Handle Souls
        let enemyName = getEnemyWithMeta(stage.level).name;
        let enemyNameI18n = i18n.t(`enemies.enemy_${stage.level}`) || enemyName;
        let earnedSouls = isBoss(stage.level) && !player.isInfiniteMode ? 2 : 1;
        if (player.isInfiniteMode || stage.level >= ENEMY_DB.length) earnedSouls = 1;

        let burstLevel = metaData.upgrades.soulBurst || 0;
        earnedSouls += burstLevel;
        metaData.souls += earnedSouls;
        saveMetaData();
        let soulMsg = i18n.t('messages.toast_soul_gain', earnedSouls);

        let randomRelicName = i18n.t(`relics.${randomRelic.id}.name`) || randomRelic.name;
        if (isBoss(stage.level)) {
            UI.showToast(i18n.t('messages.toast_boss_defeat', enemyNameI18n, soulMsg, randomRelicName), nextStep);
        } else {
            UI.showToast(i18n.t('messages.toast_elite_defeat', '', soulMsg, randomRelicName), nextStep);
        }
    } else {
        let enemyName = getEnemyWithMeta(stage.level).name;
        let enemyNameI18n = i18n.t(`enemies.enemy_${stage.level}`) || enemyName;
        let earnedSouls = 0;
        if (isBoss(stage.level) && !player.isInfiniteMode) earnedSouls = 2;
        else if (player.isInfiniteMode || stage.level >= ENEMY_DB.length) earnedSouls = 1;

        let burstLevel = metaData.upgrades.soulBurst || 0;
        if (earnedSouls > 0 || burstLevel > 0) {
            earnedSouls += burstLevel;
        }

        if (isBoss(stage.level) && !player.isInfiniteMode) {
            nextStep = gameWin;
        }

        if (stage.level >= ENEMY_DB.length) {
            let infiniteLevel = stage.level - ENEMY_DB.length + 1;
            let n = Math.floor((infiniteLevel - 1) / 3) + 1;
            let m = ((infiniteLevel - 1) % 3) + 1;
            let nmStr = `${n}-${m}`;
            if (m === 3) enemyNameI18n = i18n.t('messages.stage_infinite_boss', nmStr);
            else if (m === 2) enemyNameI18n = i18n.t('messages.stage_infinite_elite', nmStr);
            else enemyNameI18n = i18n.t('messages.stage_infinite', nmStr);
        }

        let soulMsg = '';
        if (earnedSouls > 0) {
            metaData.souls += earnedSouls;
            saveMetaData();
            soulMsg = i18n.t('messages.toast_soul_gain', earnedSouls);
        }
        UI.showToast(i18n.t('messages.toast_enemy_defeat', enemyNameI18n, soulMsg), nextStep);
    }
}

function openShop() {
    UI.el.shopOverlay.classList.remove('hidden');
    UI.el.shopOverlay.classList.add('flex');
    shopRerollsUsed = 0;
    window.itemsBoughtThisScreen = 0;
    UI.updateShopRerollBtn(shopRerollsUsed, false, false);
    UI.updateHeaderUI(player, stage);
    window.rerollShop(true);

    // Tutorial: show shop selection step
    if (tutorialMode && TUTORIAL_STEPS[tutorialStep]?.waitFor === 'shop_select') {
        setTimeout(() => UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length), 400);
    }
}

window.rerollShop = function(isInitial = false) {
    if (!isInitial) {
        if (shopRerollsUsed > 0) return UI.showToast(i18n.t('messages.toast_shop_limit'));
        shopRerollsUsed++;
        UI.updateShopRerollBtn(shopRerollsUsed, false, false);
        UI.updateHeaderUI(player, stage);
    }
    window.itemsBoughtThisScreen = 0;

    // Remember currently displayed items to prevent them from showing up again
    let currentItemIds = shopItems ? shopItems.map(item => item.id) : [];

    let available = RELIC_DB.filter(r => !player.relics.includes(r.id) && r.rarity !== 5);

    // Track materials used in fusions to prevent them from showing up again
    let fusedMaterials = [];
    if (player.relics) {
        player.relics.forEach(rId => {
            if (FUSION_RECIPES[rId]) {
                fusedMaterials.push(FUSION_RECIPES[rId].mat1);
                fusedMaterials.push(FUSION_RECIPES[rId].mat2);
            }
        });
    }

    // Filter out fused materials unconditionally so they never show up
    available = available.filter(r => !fusedMaterials.includes(r.id));

    // Try to filter out current items if we have enough alternatives
    let nonDuplicateAvailable = available.filter(r => !currentItemIds.includes(r.id));
    if (nonDuplicateAvailable.length >= 3 || nonDuplicateAvailable.length > available.length / 2) {
        available = nonDuplicateAvailable;
    }

    available.sort(() => 0.5 - Math.random());
    let selectedItems = available.slice(0, 3);

    // If empty or infinite mode, inject consumables
    if (selectedItems.length < 3 || player.isInfiniteMode) {
        let cons = [...CONSUMABLES_DB];
        let nonDuplicateCons = cons.filter(c => !currentItemIds.includes(c.id));
        if (nonDuplicateCons.length >= (3 - selectedItems.length)) {
            cons = nonDuplicateCons;
        }
        cons.sort(() => 0.5 - Math.random());

        while(selectedItems.length < 3 && cons.length > 0) {
            selectedItems.push(cons.pop());
        }
    }

    shopItems = selectedItems;
    UI.renderShopItems(shopItems, player);
    saveGame();
};

window.showFusionInfo = function(fusionId) {
    let relic = RELIC_DB.find(r => r.id === fusionId);
    if (relic) {
        // 先動態翻譯遺物的名稱與描述
        let rName = i18n.t(`relics.${fusionId}.name`) || relic.name;
        let rDesc = i18n.t(`relics.${fusionId}.desc`) || relic.desc;

        // 再把翻譯好的名稱與描述塞進去
        UI.showToast(i18n.t('messages.toast_fusion_preview', rName, rDesc));
    }
};

window.buyItem = function(idx) {
    let r = shopItems[idx];

    // Tutorial: intercept shop selection
    if (tutorialMode && TUTORIAL_STEPS[tutorialStep]?.waitFor === 'shop_select') {
        Audio.playBuySound();
        if (!r.id.startsWith('cons_')) {
            player.relics.push(r.id);
            unlockCollectionItem('relic', r.id);
        }
        UI.renderInventory(player, battle);
        UI.el.shopOverlay.classList.add('hidden');
        tutorialStep++; // advance to step 6
        UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length);
        return;
    }

    Audio.playBuySound();
    window.itemsBoughtThisScreen++;

    if (r.id.startsWith('cons_')) {
        // Consumable logic
        if (r.id === 'cons_power') {
            player.nextDamageMulti = (player.nextDamageMulti || 1.0) * 1.5;
            UI.showToast(i18n.t('messages.toast_cons_power'));
        } else if (r.id === 'cons_potential') {
            player.bonusBasePoints = (player.bonusBasePoints || 0) + 50;
            UI.showToast(i18n.t('messages.toast_cons_potential'));
        } else if (r.id === 'cons_hp') {
            player.hp = Math.min(window.getMaxHp(), player.hp + 1);
            UI.showToast(i18n.t('messages.toast_cons_hp'));
        }
    } else {
        // Relic logic
        player.relics.push(r.id);
        unlockCollectionItem('relic', r.id);
        checkRelicFusion();
    }

    shopItems.splice(idx, 1);
    UI.updateHeaderUI(player, stage);
    UI.renderInventory(player, battle);
    saveGame();

    // Close shop immediately after picking one
    UI.el.shopOverlay.classList.add('hidden');
    nextStage();
};

function nextStage() { loadStage(stage.level + 1); }

function recordHistory(win) {
    if (stage.shackleTimer) {
        clearTimeout(stage.shackleTimer);
        stage.shackleTimer = null;
    }
    let history = secureParseStorage(HISTORY_KEY, [], (data) => Array.isArray(data));
    let currentRecord = {
        win: win,
        isInfiniteMode: player.isInfiniteMode,
        infiniteLevel: player.isInfiniteMode ? (stage.level - ENEMY_DB.length + 1) : 0,
        stageName: (getEnemyWithMeta(stage.level) || {}).name || '未知關卡',
        stageType: player.isInfiniteMode ? 'infinite' : (isBoss(stage.level) ? 'boss' : (isElite(stage.level) ? 'elite' : 'normal')),
        date: Date.now(),
        highestDamage: player.highestDamage || 0,
        highestMulti: player.highestMulti || 0,
        combo: player.highestDamageCombo || '無',
        relics: [...player.relics],
        shackle: stage.activeShackle || null
    };
    history.push(currentRecord);
    // 只保留最近 20 筆紀錄
    if (history.length > 20) {
        history.shift();
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}


function playerTakesFatalDamage(reason) {
    gameOver(reason);
}

function gameOver(reason) {
    clearSave();
    recordHistory(false);
    UI.el.endOverlay.classList.remove('hidden');
    UI.el.endOverlay.classList.add('flex');
    UI.el.endTitle.className = "text-5xl md:text-7xl font-black text-red-500 mb-4 shake-hard";

    if (player.isInfiniteMode) {
        let infiniteLevel = stage.level - ENEMY_DB.length + 1;
        UI.el.endTitle.innerText = i18n.t('messages.infinite_fail', infiniteLevel);
    } else {
        UI.el.endTitle.innerText = "GAME OVER";
    }

    UI.el.endDesc.innerText = reason;
    UI.renderEndGameStats(player.highestDamage, player.highestDamageCombo, player.relics);
}

function gameWin() {
    if (stage.activeShackle === 'wither' && stage.shackleMeta && stage.shackleMeta.originalHp) {
        player.hp = stage.shackleMeta.originalHp;
    }

    clearSave();
    recordHistory(true);
    UI.el.endOverlay.classList.remove('hidden');
    UI.el.endOverlay.classList.add('flex');

    let btnRestart = document.getElementById('btn-restart');
    let btnInfinite = document.getElementById('btn-infinite');

    if (btnRestart) btnRestart.classList.remove('hidden');
    if (btnInfinite) btnInfinite.classList.remove('hidden');

    UI.el.endTitle.className = "text-5xl md:text-7xl font-black text-amber-400 mb-4 pop-anim";
    UI.el.endTitle.innerText = i18n.t('messages.game_clear');
    UI.el.endDesc.innerText = i18n.t('messages.game_clear_desc');
    UI.renderEndGameStats(player.highestDamage, player.highestDamageCombo, player.relics);
    let endInterval = setInterval(UI.shootConfetti, 1000);
    setTimeout(() => clearInterval(endInterval), 5000);
}

// 啟動遊戲
loadCollection();
initTitleScreen();

window.getEnemyWithMeta = getEnemyWithMeta;
