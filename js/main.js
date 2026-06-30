// js/main.js
import { RELIC_DB, ENEMY_DB, RULE_DB, SHACKLE_DB as COLLECTION_SHACKLE_DB, getEnemy, FUSION_RECIPES, FUSION_MATERIAL_LOOKUP, CONSUMABLES_DB, SOUL_UPGRADE_BY_ID, isElite, isBoss } from './data.js';
import { calculateEngineScore, isDamageVisible, isEnemyHpBarVisible, isEnemyHpBarPreviewVisible, getDisplayedEstimatedDamage, setDrunkDisplayValue, clearDrunkDisplayValue, setIllusionaryFakeRatio, clearIllusionaryFakeRatio, calculateDamageSteps, devApplyShackle as engineDevApplyShackle, devRemoveShackle as engineDevRemoveShackle } from './engine.js';
import * as UI from './ui.js';
import * as Audio from './audio.js';
import { i18n } from './i18n.js';
import { getDiceSkinId, setDiceSkin } from './diceSkin.js';


function getWeightedRandomRelics(availableList, count, customWeights = null, itemWeight = null) {
    // Default per-item weights: Common 50, Rare 30, Epic 15, Legendary 5.
    const weights = customWeights || { 1: 50, 2: 30, 3: 15, 4: 5 }; 
    let result = [];
    let pool = [...availableList];

    for (let i = 0; i < count; i++) {
        if (pool.length === 0) break;
        
        const getItemWeight = (item) => {
            const multiplier = itemWeight ? Math.max(0, Number(itemWeight(item)) || 0) : 1;
            return (weights[item.rarity] || 10) * multiplier;
        };
        let totalWeight = pool.reduce((sum, item) => sum + getItemWeight(item), 0);
        let rand = Math.random() * totalWeight;
        let cumulative = 0;
        let selectedIdx = -1;
        
        for (let j = 0; j < pool.length; j++) {
            cumulative += getItemWeight(pool[j]);
            if (rand <= cumulative) {
                selectedIdx = j;
                break;
            }
        }
        
        if (selectedIdx !== -1) {
            result.push(pool[selectedIdx]);
            pool.splice(selectedIdx, 1);
        }
    }
    return result;
}

export function getEnemyWithMeta(levelIndex) {
    let baseEnemy = getEnemy(levelIndex);
    let burstLevel = player.contractLevel || 0;

    if (burstLevel > 0) {
        let prefix = "LV." + burstLevel;
        if (levelIndex >= ENEMY_DB.length) {
            prefix += "層";
        }
        return {
            ...baseEnemy,
            name: prefix + " " + baseEnemy.name,
            hp: baseEnemy.hp * (1 + (burstLevel * SOUL_UPGRADE_BY_ID.soulBurst.hpMultiplierPerLevel))
        };
    }
    return baseEnemy;
}

// --- 遊戲狀態 ---
let player = { hp: 3, relics: [], maxRolls: 3, dismantledFusions: [], fivesRolled: 0, sealedRelics: [], shackleForecast: null, contractLevel: 0, highlights: { best: null, last: null } };
let stage = { level: 0, enemyMaxHp: 0, enemyHp: 0, turnsLeft: 0, activeShackle: null, shackleMeta: null, shackleWasNew: false };
let drunkInterval = null;
let battle = { state: 'IDLE', dice: Array(8).fill().map((_, i) => ({ val: 1, locked: false, id: i, matchedGroups: {A:false, B:false, C:false, D:false} })), rollsLeft: 0, scoreResult: null };
let shopItems = [];
let shopRerollsUsed = 0;
let pendingRunSetup = { contractLevel: 0, sealedRelics: [] };
let runSetupEligibleRelics = [];
let pendingFateChoices = [];
let pendingShopAdvanceAfterFusion = false;
let activeHighlight = null;
let highlightAutoClearTimer = null;
const SAVE_KEY = 'bibbidiba_save_v60';

function clearHighlightTimer() {
    if (highlightAutoClearTimer) {
        clearTimeout(highlightAutoClearTimer);
        highlightAutoClearTimer = null;
    }
}

function clearActiveHighlight(render = false) {
    clearHighlightTimer();
    if (!activeHighlight) return;
    activeHighlight = null;
    if (render && battle.state === 'WAIT_ACTION') {
        UI.renderDice(battle, activeHighlight, player);
        UI.renderScore(battle, activeHighlight);
    }
}

// --- Tutorial state ---
let tutorialMode = false;
let tutorialStep = 0;
let tutorialForcedDice = null; // array[8] to force on next roll

const TUTORIAL_STEPS = [
    { step: 0, highlight: 'enemy-hp',       forceDice: [3, 3, 5, 2, 7, 1, 4, 6], waitFor: 'any_click' },
    { step: 1, highlight: 'shackle-badge',  waitFor: 'shackle_info' },
    { step: 2, highlight: 'turns-left',     waitFor: 'any_click' },
    { step: 3, highlight: 'dice-container', waitFor: 'any_click' },
    { step: 4, highlight: 'dice-container', waitFor: 'lock_two_dice' },
    { step: 5, highlight: 'roll-btn',       waitFor: 'roll_action', forceDiceAfterRoll: [3, 3, 3, 6, 6, 1, 4, 2] },
    { step: 6, highlight: 'damage-preview', waitFor: 'any_click' },
    { step: 7, highlight: 'attack-btn',     waitFor: 'attack_action' },
    { step: 8, highlight: 'shop-container', waitFor: 'shop_select' },
    { step: 9, highlight: null,             waitFor: 'any_click', onComplete: 'end_tutorial' }
];
window.TUTORIAL_STEPS = TUTORIAL_STEPS;
const TUTORIAL_ATTACK_UNLOCK_STEP = 7;
window.TUTORIAL_ATTACK_UNLOCK_STEP = TUTORIAL_ATTACK_UNLOCK_STEP;
const HISTORY_KEY = 'bibbidiba_history_v60';
const COLLECTION_KEY = 'bibbidiba_collection_v60';

const META_KEY = 'bibbidiba_meta_v1';
const STEAM_CLOUD_LOCAL_UPDATED_KEY = 'bibbidiba_cloud_updated_at';
const STEAM_CLOUD_DEVICE_KEY = 'bibbidiba_device_id';
const STEAM_ACHIEVEMENTS_KEY = 'bibbidiba_steam_achievements_v1';
const STEAM_CLOUD_KEYS = [
    META_KEY,
    COLLECTION_KEY,
    HISTORY_KEY,
    SAVE_KEY,
    'bibbidiba_pb_infinite',
    'bibbidiba_settings',
    'bibbidiba_lang',
    'bibbidiba_tutorial_done',
    'setting_stepAnimation',
    'diceSkin',
    STEAM_ACHIEVEMENTS_KEY
];
const STEAM_ACHIEVEMENT_IDS = new Set([
    'ACH_FIRST_BLOOD',
    'ACH_FIRST_ELITE',
    'ACH_FIRST_BOSS',
    'ACH_ENTER_INFINITE',
    'ACH_INFINITE_10',
    'ACH_FIRST_FUSION',
    'ACH_THREE_FUSIONS_RUN',
    'ACH_DAMAGE_1M',
    'ACH_DAMAGE_100M',
    'ACH_BIBI_DICE_HAND',
    'ACH_FOUR_ZONE_RESONANCE',
    'ACH_SOUL_TIER_1',
    'ACH_SOUL_MAX_ONE',
    'ACH_COLLECTION_50',
    'ACH_COLLECTION_100'
]);
let steamCloudFlushTimer = null;
let steamCloudImporting = false;

const DEFAULT_META_UPGRADES = Object.freeze({
    hp: 0,
    discount: 0,
    startGold: 0,
    rerolls: 0,
    startRelic: 0,
    finalDamage: 0,
    soulBurst: 0,
    fateSelection: 0,
    relicSense: 0,
    mythicVessel: 0,
    fusionCompass: 0,
    shopReconsider: 0,
    omenEye: 0,
    blankLedger: 0
});

let metaData = {
    souls: 0,
    stats: {
        highestDamage: 0,
        highestDamageCombo: '無',
        highestDamageRelics: [],
        highestMulti: 0,
        highestInfiniteLevel: 0
    },
    upgrades: { ...DEFAULT_META_UPGRADES },
    sealedRelics: [],
    lastContractLevel: 0,
    freeMythicVesselLevels: 0,
    soulUpgradeVersion: 2
};

function getLocalDeviceId() {
    let id = localStorage.getItem(STEAM_CLOUD_DEVICE_KEY);
    if (!id) {
        id = `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem(STEAM_CLOUD_DEVICE_KEY, id);
    }
    return id;
}

function collectSteamCloudKeys() {
    return STEAM_CLOUD_KEYS.reduce((keys, key) => {
        const value = localStorage.getItem(key);
        if (value !== null) keys[key] = value;
        return keys;
    }, {});
}

function buildSteamCloudProfile(options = {}) {
    const persistUpdatedAt = options.persistUpdatedAt !== false;
    const updatedAt = Date.now();
    if (persistUpdatedAt) {
        localStorage.setItem(STEAM_CLOUD_LOCAL_UPDATED_KEY, String(updatedAt));
    }
    return {
        schemaVersion: 1,
        appVersion: i18n.t('ui.version') || '1.0.0',
        steamAppId: '4792230',
        updatedAt,
        sourceDeviceId: getLocalDeviceId(),
        keys: collectSteamCloudKeys()
    };
}

function importSteamCloudKeys(profile) {
    if (!profile || typeof profile !== 'object' || !profile.keys || typeof profile.keys !== 'object') return false;
    steamCloudImporting = true;
    try {
        for (const key of STEAM_CLOUD_KEYS) {
            if (Object.prototype.hasOwnProperty.call(profile.keys, key)) {
                localStorage.setItem(key, String(profile.keys[key]));
            } else {
                localStorage.removeItem(key);
            }
        }
        localStorage.setItem(STEAM_CLOUD_LOCAL_UPDATED_KEY, String(profile.updatedAt || Date.now()));
        return true;
    } finally {
        steamCloudImporting = false;
    }
}

function syncLocaleFromStorage() {
    const storedLocale = localStorage.getItem('bibbidiba_lang');
    if (storedLocale && storedLocale !== i18n.getLocale()) {
        i18n.setLocale(storedLocale);
    }
}

async function flushSteamCloudProfile() {
    if (!window.steamCloud || typeof window.steamCloud.saveProfile !== 'function' || steamCloudImporting) return;
    try {
        const result = await window.steamCloud.saveProfile(buildSteamCloudProfile());
        if (!result || !result.ok) {
            console.warn('[Steam Cloud] save skipped:', result && (result.error || result.reason));
        }
    } catch (error) {
        console.warn('[Steam Cloud] save failed:', error);
    }
}

function scheduleSteamCloudFlush(delay = 1500) {
    if (!window.steamCloud || typeof window.steamCloud.saveProfile !== 'function' || steamCloudImporting) return;
    if (steamCloudFlushTimer) clearTimeout(steamCloudFlushTimer);
    steamCloudFlushTimer = setTimeout(() => {
        steamCloudFlushTimer = null;
        flushSteamCloudProfile();
    }, delay);
}

async function initSteamCloudProfile() {
    if (!window.steamCloud || typeof window.steamCloud.loadProfile !== 'function') return;

    try {
        const result = await window.steamCloud.loadProfile();
        if (!result || !result.ok) {
            console.warn('[Steam Cloud] load skipped:', result && result.error);
            return;
        }

        const localUpdatedAt = Number(localStorage.getItem(STEAM_CLOUD_LOCAL_UPDATED_KEY) || 0);
        if (result.exists && result.profile && Number(result.profile.updatedAt || 0) > localUpdatedAt) {
            if (importSteamCloudKeys(result.profile)) syncLocaleFromStorage();
        } else if (!result.exists) {
            await flushSteamCloudProfile();
        }
    } catch (error) {
        console.warn('[Steam Cloud] load failed:', error);
    }
}

function loadSteamAchievementState() {
    const fallback = { unlocked: [], pending: [] };
    const state = secureParseStorage(STEAM_ACHIEVEMENTS_KEY, fallback, (data) => Array.isArray(data.unlocked) && Array.isArray(data.pending));
    state.unlocked = [...new Set(state.unlocked.filter(id => STEAM_ACHIEVEMENT_IDS.has(id)))];
    state.pending = [...new Set(state.pending.filter(id => STEAM_ACHIEVEMENT_IDS.has(id) && !state.unlocked.includes(id)))];
    return state;
}

function saveSteamAchievementState(state) {
    localStorage.setItem(STEAM_ACHIEVEMENTS_KEY, JSON.stringify({
        unlocked: state.unlocked,
        pending: state.pending
    }));
    scheduleSteamCloudFlush();
}

async function unlockSteamAchievement(achievementId) {
    if (!STEAM_ACHIEVEMENT_IDS.has(achievementId)) return false;

    const state = loadSteamAchievementState();
    if (state.unlocked.includes(achievementId)) return true;
    if (!state.pending.includes(achievementId)) {
        state.pending.push(achievementId);
        saveSteamAchievementState(state);
    }

    if (!window.steamAchievements || typeof window.steamAchievements.unlock !== 'function') return false;

    try {
        const result = await window.steamAchievements.unlock(achievementId);
        if (result && result.ok) {
            const nextState = loadSteamAchievementState();
            nextState.pending = nextState.pending.filter(id => id !== achievementId);
            if (!nextState.unlocked.includes(achievementId)) nextState.unlocked.push(achievementId);
            saveSteamAchievementState(nextState);
            return true;
        }
    } catch (error) {
        console.warn('[Steam Achievements] unlock failed:', achievementId, error);
    }
    return false;
}

function retryPendingSteamAchievements() {
    const state = loadSteamAchievementState();
    state.pending.forEach(id => unlockSteamAchievement(id));
}

function trackCollectionAchievements() {
    const summary = getCollectionSummary();
    const total = summary.total.count || 0;
    if (!total) return;

    const ratio = summary.total.collected / total;
    if (ratio >= 0.5) unlockSteamAchievement('ACH_COLLECTION_50');
    if (summary.total.collected >= total) unlockSteamAchievement('ACH_COLLECTION_100');
}

function trackFusionAchievements() {
    unlockSteamAchievement('ACH_FIRST_FUSION');
    const fusionCount = player.relics.filter(id => FUSION_RECIPES[id]).length;
    if (fusionCount >= 3) unlockSteamAchievement('ACH_THREE_FUSIONS_RUN');
}

function loadMetaData() {
    let parsed = secureParseStorage(META_KEY, metaData, (data) => typeof data.souls === 'number');
    const needsSoulUpgradeMigration = Number(parsed.soulUpgradeVersion || 0) < 2;
    if (!parsed.stats) {
        parsed.stats = {
            highestDamage: 0,
            highestDamageCombo: '無',
            highestDamageRelics: [],
            highestMulti: 0,
            highestInfiniteLevel: 0
        };
    }
    parsed.upgrades = { ...DEFAULT_META_UPGRADES, ...(parsed.upgrades || {}) };
    Object.entries(SOUL_UPGRADE_BY_ID).forEach(([id, upgrade]) => {
        parsed.upgrades[id] = Math.max(0, Math.min(upgrade.max, Number(parsed.upgrades[id]) || 0));
    });
    parsed.sealedRelics = Array.isArray(parsed.sealedRelics) ? parsed.sealedRelics : [];
    parsed.lastContractLevel = Math.max(0, Math.min(parsed.upgrades.soulBurst, Number(parsed.lastContractLevel) || 0));
    parsed.freeMythicVesselLevels = Math.max(0, Math.min(4, Number(parsed.freeMythicVesselLevels) || 0));
    if (needsSoulUpgradeMigration) {
        const oldBurstLevel = parsed.upgrades.soulBurst;
        const inheritedVesselLevel = oldBurstLevel >= 10 ? 4 : oldBurstLevel >= 8 ? 3 : oldBurstLevel >= 5 ? 2 : oldBurstLevel >= 2 ? 1 : 0;
        parsed.upgrades.mythicVessel = Math.max(parsed.upgrades.mythicVessel, inheritedVesselLevel);
        parsed.freeMythicVesselLevels = Math.max(parsed.freeMythicVesselLevels, inheritedVesselLevel);
        parsed.soulUpgradeVersion = 2;
    }
    metaData = parsed;
    if (needsSoulUpgradeMigration) saveMetaData();
}
function saveMetaData() {
    localStorage.setItem(META_KEY, JSON.stringify(metaData));
    scheduleSteamCloudFlush();
}

window.getMetaData = () => metaData;
window.saveMetaData = saveMetaData;
window.clearSave = clearSave;
window.unlockSteamAchievement = unlockSteamAchievement;


// 開發者模式（僅限本地開發環境）
const IS_DEV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
if (IS_DEV) {
    let devSecretBuffer = "";
    window.addEventListener('keydown', (e) => {
        devSecretBuffer += e.key;
        if (devSecretBuffer.length > 7) devSecretBuffer = devSecretBuffer.slice(-7);
        if (devSecretBuffer === "3345678") {
            triggerDevMode();
        }
    });
}

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
    shackles: [],
    newItems: {
        hands: [],
        relics: [],
        shackles: []
    }
};

function createEmptyCollection() {
    return {
        hands: [],
        relics: [],
        shackles: [],
        newItems: {
            hands: [],
            relics: [],
            shackles: []
        }
    };
}

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
    collection = secureParseStorage(COLLECTION_KEY, createEmptyCollection(), (data) => {
        return Array.isArray(data.hands) && Array.isArray(data.relics) && Array.isArray(data.shackles);
    });

    let changed = false;
    const ensureStringArray = (value) => Array.isArray(value) ? value.filter(item => typeof item === 'string') : [];
    const normalizeHandKey = (key) => {
        if (typeof key !== 'string') return null;
        if (key.startsWith('rule_')) return key;
        return ruleNameToId(key) || key;
    };
    const sameArray = (a, b) => a.length === b.length && a.every((item, index) => item === b[index]);

    if (!collection.newItems || typeof collection.newItems !== 'object' || Array.isArray(collection.newItems)) {
        collection.newItems = { hands: [], relics: [], shackles: [] };
        changed = true;
    }

    const originalBuckets = {
        hands: ensureStringArray(collection.hands),
        relics: ensureStringArray(collection.relics),
        shackles: ensureStringArray(collection.shackles),
        newHands: ensureStringArray(collection.newItems.hands),
        newRelics: ensureStringArray(collection.newItems.relics),
        newShackles: ensureStringArray(collection.newItems.shackles)
    };

    collection.hands = [...new Set(ensureStringArray(collection.hands).map(normalizeHandKey).filter(Boolean))];
    collection.relics = [...new Set(ensureStringArray(collection.relics))];
    collection.shackles = [...new Set(ensureStringArray(collection.shackles))];

    collection.newItems.hands = [...new Set(ensureStringArray(collection.newItems.hands).map(normalizeHandKey).filter(Boolean))]
        .filter(id => collection.hands.includes(id));
    collection.newItems.relics = [...new Set(ensureStringArray(collection.newItems.relics))]
        .filter(id => collection.relics.includes(id));
    collection.newItems.shackles = [...new Set(ensureStringArray(collection.newItems.shackles))]
        .filter(id => collection.shackles.includes(id));

    if (
        !sameArray(collection.hands, originalBuckets.hands) ||
        !sameArray(collection.relics, originalBuckets.relics) ||
        !sameArray(collection.shackles, originalBuckets.shackles) ||
        !sameArray(collection.newItems.hands, originalBuckets.newHands) ||
        !sameArray(collection.newItems.relics, originalBuckets.newRelics) ||
        !sameArray(collection.newItems.shackles, originalBuckets.newShackles)
    ) {
        changed = true;
    }
    if (changed) saveCollection();
}

window.saveCollection = saveCollection;
function saveCollection() {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    scheduleSteamCloudFlush();
}

function ruleNameToId(name) {
    if (typeof name !== 'string') return null;

    for (let group in RULE_DB) {
        const rule = RULE_DB[group].find(r => r.name === name || name.startsWith(r.name + '('));
        if (rule) return rule.id;
    }
    return null;
}

function getAllCollectionRules() {
    return Object.values(RULE_DB).flat();
}

function getCollectionSummary() {
    const allRules = getAllCollectionRules();
    const handCollected = allRules.filter(rule => collection.hands.includes(rule.id) || collection.hands.includes(rule.name)).length;
    const relicCollected = RELIC_DB.filter(relic => collection.relics.includes(relic.id)).length;
    const shackleCollected = COLLECTION_SHACKLE_DB.filter(shackle => collection.shackles.includes(shackle.id)).length;
    const handTotal = allRules.length;
    const relicTotal = RELIC_DB.length;
    const shackleTotal = COLLECTION_SHACKLE_DB.length;

    return {
        total: {
            collected: handCollected + relicCollected + shackleCollected,
            count: handTotal + relicTotal + shackleTotal
        },
        hands: { collected: handCollected, count: handTotal },
        relics: { collected: relicCollected, count: relicTotal },
        shackles: { collected: shackleCollected, count: shackleTotal }
    };
}

function hasCollectionNewItems() {
    const newItems = window.getCollectionNewItems ? window.getCollectionNewItems() : { hands: [], relics: [], shackles: [] };
    return ['hands', 'relics', 'shackles'].some(key => Array.isArray(newItems[key]) && newItems[key].length > 0);
}

function isCollectionUnlocked(type, id) {
    if (typeof id !== 'string' || id === '') return false;
    if (type === 'hand') return collection.hands.includes(id) || collection.hands.includes(ruleNameToId(id));
    if (type === 'relic') return collection.relics.includes(id);
    if (type === 'shackle') return collection.shackles.includes(id);
    return false;
}

function updateCollectionButtonLabel() {
    if (!UI.el.btnCollection) return;
    const badge = hasCollectionNewItems()
        ? `<span class="new-badge">${i18n.t('ui.fusion_new_item')}</span>`
        : '';
    UI.el.btnCollection.innerHTML = `<span class="inline-flex items-center justify-center gap-1.5">${i18n.t('ui.btn_collection')}${badge}</span>`;
}

function unlockCollectionItem(type, id) {
    const bucket = type === 'hand' ? 'hands' : type === 'relic' ? 'relics' : type === 'shackle' ? 'shackles' : null;
    if (!bucket || typeof id !== 'string' || id === '') return false;

    if (!collection.newItems || typeof collection.newItems !== 'object') {
        collection.newItems = { hands: [], relics: [], shackles: [] };
    }
    if (!Array.isArray(collection.newItems[bucket])) collection.newItems[bucket] = [];

    if (!collection[bucket].includes(id)) {
        collection[bucket].push(id);
        if (!collection.newItems[bucket].includes(id)) collection.newItems[bucket].push(id);
        saveCollection();
        updateCollectionButtonLabel();
        trackCollectionAchievements();
        return true;
    }

    return false;
}

window.unlockCollectionItem = unlockCollectionItem; // Export for external usage if needed
window.getCollection = () => collection;
window.getCollectionSummary = getCollectionSummary;
window.getRuleCollectionId = ruleNameToId;
window.isCollectionUnlocked = isCollectionUnlocked;
window.getCollectionNewItems = () => {
    if (!collection.newItems || typeof collection.newItems !== 'object') {
        collection.newItems = { hands: [], relics: [], shackles: [] };
    }
    return collection.newItems;
};
window.clearCollectionNewItems = (tab) => {
    if (!['hands', 'relics', 'shackles'].includes(tab)) return false;
    if (!collection.newItems || !Array.isArray(collection.newItems[tab]) || collection.newItems[tab].length === 0) return false;
    collection.newItems[tab] = [];
    saveCollection();
    updateCollectionButtonLabel();
    return true;
};
window.getStageActiveShackle = () => stage.activeShackle;
window.isCurrentShackleNew = (id) => Boolean(stage.shackleWasNew && stage.activeShackle === id);
window.getStageLevel = () => stage.level;
window.getMaxHp = () => 3 + (metaData.upgrades.hp * 1) + player.relics.filter(r => r === 'cons_fruit').length;
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
            if (player.relics.includes('cons_doll')) {
                UI.showToast(i18n.t('messages.toast_doll_block'));
                player.relics.splice(player.relics.indexOf('cons_doll'), 1);
            } else {
                player.hp--;
                if (player.hp > 0 && player.relics.includes('berserker')) {
                    player.berserkerBonus = (player.berserkerBonus || 0) + 1;
                    UI.showToast(i18n.t('messages.toast_berserker'));
                }
                UI.updateHeaderUI(player, stage);
                UI.showPlayerHit(1, player.hp <= 1 ? 'fatal' : 'light');
                UI.showToast(i18n.t('messages.toast_thornarmor'));
                if (player.hp <= 0) playerDied = true;
            }
        }
    }

    if (stage.activeShackle === 'mutualdestruction') {
        let recoil = Math.floor(dmg * 0.05);
        if (recoil > 0) {
            if (player.relics.includes('cons_doll')) {
                UI.showToast(i18n.t('messages.toast_doll_block'));
                player.relics.splice(player.relics.indexOf('cons_doll'), 1);
            } else {
                player.hp -= recoil;
                UI.updateHeaderUI(player, stage);
                UI.showPlayerHit(recoil, player.hp <= 1 ? 'fatal' : (recoil >= 2 ? 'heavy' : 'light'));
                UI.showToast(i18n.t('messages.toast_mutual_destruct', recoil));
                if (player.hp <= 0) {
                    player.hp = 1;
                    UI.updateHeaderUI(player, stage);
                    UI.showToast(i18n.t('messages.toast_mutual_destruct_survive'));
                }
            }
        }
    }

    return playerDied;
}

// --- 存檔系統 (Save System) ---
function saveGame() {
    if (tutorialMode) return;
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
            shackleWasNew: stage.shackleWasNew || false,
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
    scheduleSteamCloudFlush();
}

function getRuleMetaByName(name) {
    const id = ruleNameToId(name);
    for (const group of Object.values(RULE_DB)) {
        const byId = id ? group.find(rule => rule.id === id) : null;
        if (byId) return byId;
        const byName = group.find(rule => rule.name === name || (typeof name === 'string' && name.startsWith(rule.name + '(')));
        if (byName) return byName;
    }
    return null;
}

function getScoredHandEntries(scoreResult) {
    if (!scoreResult) return [];
    return [scoreResult.tagA, scoreResult.tagB, scoreResult.tagC, scoreResult.tagD]
        .filter(tag => tag && tag.name && tag.name !== '無')
        .map(tag => {
            const rule = getRuleMetaByName(tag.name);
            return {
                name: tag.name,
                id: rule ? rule.id : (ruleNameToId(tag.name) || tag.name),
                rarity: rule ? (rule.rarity || 1) : 1,
                multi: tag.multi || 1
            };
        });
}

function getComboNameFromScore(scoreResult) {
    const entries = getScoredHandEntries(scoreResult);
    return entries.map(entry => entry.name).join(' + ') || '無';
}

function createHighlightTag(id, priority) {
    return { id, priority };
}

function buildAttackHighlights(context) {
    const {
        damage,
        enemyHpBefore,
        enemyMaxHp,
        playerHpBefore,
        turnsLeftBefore,
        defeated,
        scoreResult,
        activeShackle,
        relics,
        level
    } = context;

    const handEntries = getScoredHandEntries(scoreResult);
    const handIds = handEntries.map(entry => entry.id);
    const maxRarity = handEntries.reduce((max, entry) => Math.max(max, entry.rarity || 1), 1);
    const fusionCount = (relics || []).filter(id => FUSION_RECIPES[id]).length;
    const finalMultiplier = scoreResult ? Number(scoreResult.finalMultiplier) || 0 : 0;
    const overkillRatio = enemyHpBefore > 0 ? damage / enemyHpBefore : 0;
    const tags = [];

    if (handIds.includes('rule_a0')) tags.push(createHighlightTag('bibi_hand', 120));
    if (handEntries.length >= 4) tags.push(createHighlightTag('zone_resonance', 110));
    if (defeated && playerHpBefore <= 1) tags.push(createHighlightTag('one_hp_clutch', 105));
    if (defeated && activeShackle) tags.push(createHighlightTag('shackle_breaker', 95));
    if (defeated && turnsLeftBefore <= 1) tags.push(createHighlightTag('last_turn_kill', 90));
    if (damage >= 100_000_000) tags.push(createHighlightTag('damage_100m', 88));
    else if (damage >= 1_000_000) tags.push(createHighlightTag('damage_1m', 72));
    if (overkillRatio >= 3 || damage >= enemyMaxHp * 5) tags.push(createHighlightTag('overkill', 84));
    if (finalMultiplier >= 100000) tags.push(createHighlightTag('multiplier_monster', 82));
    if (fusionCount >= 2 && damage >= 1_000_000) tags.push(createHighlightTag('mythic_engine', 78));
    if (maxRarity >= 5) tags.push(createHighlightTag('mythic_hand', 76));
    if (defeated && (isBoss(level) || (level >= ENEMY_DB.length && isBoss(level)))) tags.push(createHighlightTag('boss_slayer', 70));

    const uniqueTags = [];
    const seen = new Set();
    tags
        .sort((a, b) => b.priority - a.priority)
        .forEach(tag => {
            if (!seen.has(tag.id)) {
                seen.add(tag.id);
                uniqueTags.push(tag.id);
            }
        });

    if (uniqueTags.length === 0) return null;

    const highlight = {
        tags: uniqueTags.slice(0, 5),
        primaryTag: uniqueTags[0],
        damage,
        multiplier: finalMultiplier,
        combo: getComboNameFromScore(scoreResult),
        handIds,
        relics: [...(relics || [])],
        shackle: activeShackle || null,
        stageLevel: level,
        defeated: Boolean(defeated),
        createdAt: Date.now()
    };
    highlight.score = Math.floor(Math.log10(Math.max(1, damage))) * 10 + uniqueTags.length * 8 + (defeated ? 10 : 0);
    return highlight;
}

function rememberAttackHighlight(highlight) {
    if (!highlight) return;
    if (!player.highlights || typeof player.highlights !== 'object') {
        player.highlights = { best: null, last: null };
    }
    player.highlights.last = highlight;
    if (!player.highlights.best || (highlight.score || 0) >= (player.highlights.best.score || 0)) {
        player.highlights.best = highlight;
    }
}

function loadGame() {
    const parsed = secureParseStorage(SAVE_KEY, null, (data) => {
        return data && typeof data.player === 'object' && typeof data.stage === 'object' && typeof data.battle === 'object';
    });
    
    if (parsed) {
        player = parsed.player;
        player.dismantledFusions = player.dismantledFusions || [];
        player.fivesRolled = player.fivesRolled || 0;
        player.sealedRelics = Array.isArray(player.sealedRelics) ? player.sealedRelics : [];
        player.shackleForecast = player.shackleForecast && typeof player.shackleForecast === 'object'
            ? player.shackleForecast
            : null;
        player.contractLevel = Math.max(0, Math.min(
            metaData.upgrades.soulBurst,
            Number.isFinite(Number(player.contractLevel)) ? Number(player.contractLevel) : metaData.upgrades.soulBurst
        ));
        if (!player.highlights || typeof player.highlights !== 'object') {
            player.highlights = { best: null, last: null };
        }
        UI.el.titleScreen.classList.add('hidden');

        if (parsed.shop && parsed.shop.active) {
            stage.level = parsed.stage.level;
        stage.activeShackle = parsed.stage.activeShackle || null;
        stage.shackleMeta = parsed.stage.shackleMeta || null;
        stage.shackleWasNew = parsed.stage.shackleWasNew || false;
            let enemy = getEnemyWithMeta(stage.level);
            stage.enemyMaxHp = enemy.hp;
            stage.enemyName = enemy.name;
            stage.enemyHp = 0; // 已經擊敗
            stage.turnsLeft = enemy.turns;

            shopItems = parsed.shop.items || [];
            shopRerollsUsed = parsed.shop.rerolls || 0;
            ensureShackleForecast(stage.level + 1);

            renderAll();
            UI.el.shopOverlay.classList.remove('hidden');
            UI.el.shopOverlay.classList.add('flex');
            UI.updateShopRerollBtn(shopRerollsUsed, getShopRerollLimit());
            UI.renderShopItems(shopItems, player);
            UI.renderShopForecast(player.shackleForecast);
            saveGame();
        } else {
            loadStage(parsed.stage.level, true, parsed);
        }
    }
}

function clearSave() {
    localStorage.removeItem(SAVE_KEY);
    scheduleSteamCloudFlush();
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
    updateCollectionButtonLabel();

    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = i18n.getLocale();
        langSelect.addEventListener('change', (e) => {
            i18n.setLocale(e.target.value);
            scheduleSteamCloudFlush();
        });
    }

    i18n.subscribe(() => {
        UI.updateHeaderUI(player, stage);
        if (battle.state !== 'IDLE') {
            renderAll();
        }
        if (!UI.el.shopOverlay.classList.contains('hidden')) {
            UI.renderShopItems(shopItems, player);
            UI.renderShopForecast(player.shackleForecast);
            UI.updateShopRerollBtn(shopRerollsUsed, getShopRerollLimit());
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
        updateCollectionButtonLabel();
    });

    loadMetaData();
    UI.renderRulesDB();
    checkSaveExists();

    UI.el.titleScreen.addEventListener('click', (e) => {
        if (e.target.closest('button')) {
            Audio.initAudio();
            Audio.playClickSound();
        }
    });

    UI.el.btnNewGame.onclick = beginNewGameSetup;
    UI.el.btnContinue.onclick = () => {
        UI.el.titleScreen.classList.add('hidden');
        loadGame();
    };

    if (UI.el.runSetupModal) {
        UI.el.runSetupModal.onchange = (event) => {
            if (event.target === UI.el.runContractRange) {
                pendingRunSetup.contractLevel = Math.max(0, Math.min(getContractLimit(), Number(event.target.value) || 0));
                UI.renderRunSetup(runSetupEligibleRelics, pendingRunSetup, getBlankLedgerLimit(), getContractLimit());
                return;
            }
            const input = event.target.closest('input[data-relic-id]');
            if (!input) return;
            const id = input.dataset.relicId;
            const limit = getBlankLedgerLimit();
            if (input.checked) {
                if (!pendingRunSetup.sealedRelics.includes(id) && pendingRunSetup.sealedRelics.length < limit) {
                    pendingRunSetup.sealedRelics.push(id);
                }
            } else {
                pendingRunSetup.sealedRelics = pendingRunSetup.sealedRelics.filter(relicId => relicId !== id);
            }
            pendingFateChoices = [];
            UI.renderRunSetup(runSetupEligibleRelics, pendingRunSetup, limit, getContractLimit());
        };
    }
    const closeRunSetup = () => {
        pendingRunSetup = { contractLevel: 0, sealedRelics: [] };
        runSetupEligibleRelics = [];
        pendingFateChoices = [];
        UI.hideRunSetupModal();
    };
    if (UI.el.btnRunSetupCancel) UI.el.btnRunSetupCancel.onclick = closeRunSetup;
    if (UI.el.btnCloseRunSetup) UI.el.btnCloseRunSetup.onclick = closeRunSetup;
    if (UI.el.runSetupModal) {
        UI.el.runSetupModal.onclick = (event) => {
            if (event.target === UI.el.runSetupModal) closeRunSetup();
        };
    }
    if (UI.el.btnRunSetupConfirm) {
        UI.el.btnRunSetupConfirm.onclick = () => {
            const selected = sanitizeSealedRelics(
                pendingRunSetup.sealedRelics,
                getBlankLedgerLimit(),
                runSetupEligibleRelics
            );
            metaData.sealedRelics = selected;
            metaData.lastContractLevel = pendingRunSetup.contractLevel;
            saveMetaData();
            pendingRunSetup.sealedRelics = selected;
            beginFateSelection(pendingRunSetup);
        };
    }
    if (UI.el.fateSelectionList) {
        UI.el.fateSelectionList.onclick = (event) => {
            const choice = event.target.closest('button[data-relic-id]');
            if (!choice || !pendingFateChoices.includes(choice.dataset.relicId)) return;
            startNewGameWithSetup({ ...pendingRunSetup, startRelicId: choice.dataset.relicId });
        };
    }
    const closeFateSelection = () => {
        UI.hideFateSelectionModal();
        pendingFateChoices = [];
    };
    if (UI.el.btnFateSelectionCancel) UI.el.btnFateSelectionCancel.onclick = closeFateSelection;
    if (UI.el.btnCloseFateSelection) UI.el.btnCloseFateSelection.onclick = closeFateSelection;
    if (UI.el.fateSelectionModal) {
        UI.el.fateSelectionModal.onclick = (event) => {
            if (event.target === UI.el.fateSelectionModal) closeFateSelection();
        };
    }

    const btnRules = document.getElementById('btn-rules');
    const btnCloseRules = document.getElementById('btn-close-rules');
    if (btnRules && UI.el.rulesModal) {
        btnRules.onclick = () => UI.el.rulesModal.classList.remove('hidden');
    }
    if (btnCloseRules && UI.el.rulesModal) {
        btnCloseRules.onclick = () => UI.el.rulesModal.classList.add('hidden');
    }
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
        const renderTabLabel = (tab, labelKey) => {
            const label = i18n.t(labelKey);
            const summary = window.getCollectionSummary ? window.getCollectionSummary() : null;
            const progress = summary?.[tab];
            const progressHtml = progress
                ? `<span class="collection-tab-progress">${progress.collected}/${progress.count}</span>`
                : '';
            const newItems = window.getCollectionNewItems ? window.getCollectionNewItems() : { hands: [], relics: [], shackles: [] };
            const hasNewItems = Array.isArray(newItems[tab]) && newItems[tab].length > 0;
            const badge = hasNewItems ? `<span class="new-badge">${i18n.t('ui.fusion_new_item')}</span>` : '';
            return `<span class="collection-tab-label"><span>${label}</span>${progressHtml}${badge}</span>`;
        };
        const setTabButton = (button, tab, labelKey) => {
            const active = currentTab === tab;
            button.className = active
                ? "flex-1 py-2 text-sm font-bold text-emerald-400 bg-slate-800 transition-colors border-b-2 border-emerald-500"
                : "flex-1 py-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-b-2 border-transparent";
            button.innerHTML = renderTabLabel(tab, labelKey);
        };
        const updateTabUI = () => {
            UI.renderCollectionModal(currentTab);
            setTabButton(UI.el.tabHands, 'hands', 'ui.tab_hands');
            setTabButton(UI.el.tabRelics, 'relics', 'ui.tab_relics');
            setTabButton(UI.el.tabShackles, 'shackles', 'ui.tab_shackles');
        };

        UI.el.btnCollection.onclick = () => {
            currentTab = 'hands';
            updateTabUI();
            updateCollectionButtonLabel();
            UI.el.collectionModal.classList.remove('hidden');
        };
        UI.el.btnCloseCollection.onclick = () => UI.el.collectionModal.classList.add('hidden');
        
        UI.el.tabHands.onclick = () => { currentTab = 'hands'; updateTabUI(); };
        UI.el.tabRelics.onclick = () => { currentTab = 'relics'; updateTabUI(); };
        UI.el.tabShackles.onclick = () => { currentTab = 'shackles'; updateTabUI(); };
    }

    // Tutorial button
    const btnTutorial = document.getElementById('btn-tutorial');
    const tutorialConfirmModal = document.getElementById('tutorial-confirm-modal');
    const tutorialConfirmTitle = document.getElementById('tutorial-confirm-title');
    const tutorialConfirmBody = document.getElementById('tutorial-confirm-body');
    const tutorialConfirmOk = document.getElementById('tutorial-confirm-ok');
    const tutorialConfirmCancel = document.getElementById('tutorial-confirm-cancel');
    const tutorialConfirmClose = document.getElementById('tutorial-confirm-close');
    const closeTutorialConfirm = () => {
        if (tutorialConfirmModal) tutorialConfirmModal.classList.add('hidden');
    };
    const openTutorialConfirm = () => {
        if (!tutorialConfirmModal) {
            startTutorialGame();
            return;
        }
        if (tutorialConfirmTitle) tutorialConfirmTitle.textContent = i18n.t('tutorial.confirm_title');
        if (tutorialConfirmBody) tutorialConfirmBody.textContent = i18n.t('tutorial.confirm_body');
        if (tutorialConfirmOk) tutorialConfirmOk.textContent = i18n.t('tutorial.confirm_ok');
        if (tutorialConfirmCancel) tutorialConfirmCancel.textContent = i18n.t('tutorial.confirm_cancel');
        if (tutorialConfirmClose) {
            const closeLabel = i18n.t('ui.toast_close') || i18n.t('tutorial.confirm_cancel');
            tutorialConfirmClose.setAttribute('aria-label', closeLabel);
            tutorialConfirmClose.setAttribute('title', closeLabel);
        }
        tutorialConfirmModal.classList.remove('hidden');
    };
    if (btnTutorial) {
        btnTutorial.onclick = openTutorialConfirm;
    }
    if (tutorialConfirmCancel) tutorialConfirmCancel.onclick = closeTutorialConfirm;
    if (tutorialConfirmClose) tutorialConfirmClose.onclick = closeTutorialConfirm;
    if (tutorialConfirmModal) {
        tutorialConfirmModal.onclick = (event) => {
            if (event.target === tutorialConfirmModal) closeTutorialConfirm();
        };
    }
    if (tutorialConfirmOk) {
        tutorialConfirmOk.onclick = () => {
            closeTutorialConfirm();
            startTutorialGame();
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
        finishShopAndAdvance();
    };
    document.getElementById('btn-restart').onclick = () => location.reload();

    let btnInfinite = document.getElementById('btn-infinite');
    if (btnInfinite) {
        btnInfinite.onclick = () => {
            unlockSteamAchievement('ACH_ENTER_INFINITE');
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
    const windowSizeRow = document.getElementById('settings-window-size-row');
    const windowSizeSelect = document.getElementById('settings-window-size-select');
    const diceSkinSelect = document.getElementById('settings-dice-skin-select');
    const validWindowSizes = new Set(['small', 'medium', 'large']);

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
    const applySteamWindowSize = (sizeKey) => {
        const normalizedSizeKey = validWindowSizes.has(sizeKey) ? sizeKey : 'medium';
        if (window.steamPortrait && typeof window.steamPortrait.setWindowSize === 'function') {
            window.steamPortrait.setWindowSize(normalizedSizeKey).catch((error) => {
                console.error('Failed to apply Steam window size', error);
            });
        } else if (window.steamPortrait && typeof window.steamPortrait.setSizeClass === 'function') {
            window.steamPortrait.setSizeClass(normalizedSizeKey === 'large' ? 'steam-portrait-large' : '');
        }
    };

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
            if (savedSettings.windowSize !== undefined && validWindowSizes.has(savedSettings.windowSize)) {
                if (windowSizeSelect) windowSizeSelect.value = savedSettings.windowSize;
                applySteamWindowSize(savedSettings.windowSize);
            }
        } catch (e) {
            console.error("Failed to parse settings", e);
        }
    }
    if (windowSizeRow && !(window.steamPortrait && typeof window.steamPortrait.setWindowSize === 'function')) {
        windowSizeRow.classList.add('hidden');
    }

    const saveSettings = () => {
        localStorage.setItem('bibbidiba_settings', JSON.stringify({
            bgmVolume: parseFloat(bgmSlider.value),
            sfxVolume: parseFloat(sfxSlider.value),
            bgmMuted: bgmMuteToggle ? bgmMuteToggle.getAttribute('aria-checked') === 'true' : false,
            sfxMuted: sfxMuteToggle ? sfxMuteToggle.getAttribute('aria-checked') === 'true' : false,
            windowSize: windowSizeSelect && validWindowSizes.has(windowSizeSelect.value) ? windowSizeSelect.value : 'medium'
        }));
        scheduleSteamCloudFlush();
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

    if (windowSizeSelect) {
        windowSizeSelect.addEventListener('change', (e) => {
            const nextSize = validWindowSizes.has(e.target.value) ? e.target.value : 'medium';
            e.target.value = nextSize;
            applySteamWindowSize(nextSize);
            saveSettings();
        });
    }

    if (diceSkinSelect) {
        diceSkinSelect.value = getDiceSkinId();
        diceSkinSelect.addEventListener('change', (e) => {
            if (!setDiceSkin(e.target.value)) return;
            scheduleSteamCloudFlush();
            renderAll();
        });
    }

    if (settingsLangSelect) {
        settingsLangSelect.value = i18n.getLocale();
        settingsLangSelect.addEventListener('change', (e) => {
            i18n.setLocale(e.target.value);
            scheduleSteamCloudFlush();
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
            scheduleSteamCloudFlush();
            applyStepAnimToggle(next);
        });
    }

    const openSettings = () => {
        Audio.initAudio();
        if (diceSkinSelect) diceSkinSelect.value = getDiceSkinId();
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
        dismantledFusions: [], fivesRolled: 0, highestDamage: 0, highestDamageCombo: '', isInfiniteMode: false, highlights: { best: null, last: null }
    };
    stage = {
        level: 0,
        enemyMaxHp: 50, enemyHp: 50,
        enemyName: i18n.t('enemies.enemy_0') || '史萊姆',
        turnsLeft: 5,
        activeShackle: 'rusty', shackleMeta: null, shackleWasNew: false,
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
        // 步驟推進後重新渲染控制器，確保攻擊按鈕的 disabled 狀態與當前 tutorialStep 同步
        // （renderControls 內 isTutorialAttackLocked 會依 TUTORIAL_ATTACK_UNLOCK_STEP 解除禁用）
        UI.renderControls(battle, player.maxRolls);
        UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length);
    }
};

window.onTutorialShackleInfo = function(id) {
    if (!tutorialMode) return;
    const currentStep = TUTORIAL_STEPS[tutorialStep];
    if (currentStep?.waitFor !== 'shackle_info') return;
    if (stage.activeShackle && id !== stage.activeShackle) return;
    tutorialStep++;
    UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length);
};

window.skipTutorial = function() {
    tutorialMode = false;
    tutorialForcedDice = null;
    clearSave();
    UI.hideTutorialOverlay();
    location.reload();
};

function endTutorial() {
    tutorialMode = false;
    tutorialForcedDice = null;
    clearSave();
    localStorage.setItem('bibbidiba_tutorial_done', 'true');
    scheduleSteamCloudFlush();
    UI.hideTutorialOverlay();
    location.reload();
}

window.getTutorialState = () => ({ mode: tutorialMode, step: tutorialStep });

function getBlankLedgerLimit() {
    return Math.max(0, Math.min(2, Number(metaData.upgrades.blankLedger) || 0));
}

function getContractLimit() {
    return Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.soulBurst.max, Number(metaData.upgrades.soulBurst) || 0));
}

function getBlankLedgerEligibleRelics() {
    const unlocked = new Set(collection.relics || []);
    return RELIC_DB.filter(relic => relic.price > 0 && relic.rarity !== 5 && unlocked.has(relic.id));
}

function sanitizeSealedRelics(ids, limit = getBlankLedgerLimit(), eligibleRelics = getBlankLedgerEligibleRelics()) {
    const eligibleIds = new Set(eligibleRelics.map(relic => relic.id));
    return [...new Set(Array.isArray(ids) ? ids : [])]
        .filter(id => eligibleIds.has(id))
        .slice(0, limit);
}

function getStarterRelicPool(sealedRelics = []) {
    const sealed = new Set(sealedRelics);
    return RELIC_DB.filter(relic => relic.price > 0 && relic.rarity === 1 && !sealed.has(relic.id));
}

function startNewGameWithSetup(setup) {
    clearSave();
    UI.hideRunSetupModal();
    UI.hideFateSelectionModal();
    UI.el.titleScreen.classList.add('hidden');
    initNewGame(setup);
    pendingFateChoices = [];
}

function beginFateSelection(setup) {
    const fateEnabled = (metaData.upgrades.startRelic || 0) > 0 && (metaData.upgrades.fateSelection || 0) > 0;
    if (!fateEnabled) {
        startNewGameWithSetup({ ...setup, startRelicId: null });
        return;
    }

    const pool = getStarterRelicPool(setup.sealedRelics);
    const choiceCount = SOUL_UPGRADE_BY_ID.fateSelection.choiceCount;
    const currentChoicesAreValid = pendingFateChoices.length > 0
        && pendingFateChoices.every(id => pool.some(relic => relic.id === id));
    if (!currentChoicesAreValid) {
        pendingFateChoices = [...pool]
            .sort(() => Math.random() - 0.5)
            .slice(0, choiceCount)
            .map(relic => relic.id);
    }

    const choices = pendingFateChoices
        .map(id => pool.find(relic => relic.id === id))
        .filter(Boolean);
    if (choices.length === 0) {
        startNewGameWithSetup({ ...setup, startRelicId: null });
        return;
    }

    UI.hideRunSetupModal();
    UI.renderFateSelection(choices);
    UI.showFateSelectionModal();
}

function beginNewGameSetup() {
    const contractLimit = getContractLimit();
    const sealLimit = getBlankLedgerLimit();
    runSetupEligibleRelics = getBlankLedgerEligibleRelics();
    pendingRunSetup = {
        contractLevel: Math.max(0, Math.min(contractLimit, Number(metaData.lastContractLevel) || 0)),
        sealedRelics: sanitizeSealedRelics(metaData.sealedRelics, sealLimit, runSetupEligibleRelics)
    };
    pendingFateChoices = [];

    const hasRunOptions = contractLimit > 0 || (sealLimit > 0 && runSetupEligibleRelics.length > 0);
    if (!hasRunOptions) {
        beginFateSelection(pendingRunSetup);
        return;
    }

    UI.renderRunSetup(runSetupEligibleRelics, pendingRunSetup, sealLimit, contractLimit);
    UI.showRunSetupModal();
}

function initNewGame(setup = {}) {
    let startHp = 3 + (metaData.upgrades.hp * 1);
    let startRerolls = 3 + (metaData.upgrades.rerolls * 1);
    const runSealedRelics = sanitizeSealedRelics(setup.sealedRelics);
    const contractLevel = Math.max(0, Math.min(getContractLimit(), Number(setup.contractLevel) || 0));

    player = {
        hp: startHp,
        relics: [],
        maxRolls: startRerolls,
        highestDamage: 0,
        highestDamageCombo: '',
        highestMulti: 0,
        isInfiniteMode: false, bonusBasePoints: 0, nextDamageMulti: 1.0,
        dismantledFusions: [], fivesRolled: 0,
        sealedRelics: runSealedRelics,
        shackleForecast: null,
        contractLevel,
        highlights: { best: null, last: null }
    };

    if (metaData.upgrades.startRelic > 0) {
        let available = getStarterRelicPool(runSealedRelics);
        if(available.length > 0) {
            let r = available.find(relic => relic.id === setup.startRelicId)
                || available[Math.floor(Math.random() * available.length)];
            player.relics.push(r.id);
            unlockCollectionItem('relic', r.id);
        }
    }

    loadStage(0);
}

function getShackleTypeForStage(levelIndex) {
    if (levelIndex < ENEMY_DB.length) {
        if (levelIndex === 2 || levelIndex === 8) return 'light';
        if (levelIndex === 5 || levelIndex === 9) return 'heavy';
        return null;
    }

    const infiniteLevel = levelIndex - ENEMY_DB.length + 1;
    const cycleStep = ((infiniteLevel - 1) % 3) + 1;
    return cycleStep === 3 ? 'heavy' : 'light';
}

function getShackleCandidatesForStage(levelIndex) {
    const shackleType = getShackleTypeForStage(levelIndex);
    return shackleType ? SHACKLE_DB.filter(shackle => shackle.type === shackleType) : [];
}

function rollShackleIdForStage(levelIndex) {
    const candidates = getShackleCandidatesForStage(levelIndex);
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)].id;
}

function assignShackleForStage(levelIndex, forecastId = null) {
    const candidates = getShackleCandidatesForStage(levelIndex);
    const shackleType = getShackleTypeForStage(levelIndex);

    if (shackleType) {
        let selected = candidates.find(shackle => shackle.id === forecastId)
            || candidates[Math.floor(Math.random() * candidates.length)];
        
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

function ensureShackleForecast(levelIndex) {
    if ((metaData.upgrades.omenEye || 0) < 1) {
        player.shackleForecast = null;
        return null;
    }

    const candidates = getShackleCandidatesForStage(levelIndex);
    if (candidates.length === 0) {
        player.shackleForecast = null;
        return null;
    }

    const current = player.shackleForecast;
    const currentIsValid = current
        && current.level === levelIndex
        && candidates.some(shackle => shackle.id === current.id);
    if (!currentIsValid) {
        player.shackleForecast = { level: levelIndex, id: rollShackleIdForStage(levelIndex) };
    }
    return player.shackleForecast;
}

function shouldPlayShackleIntroAnimation(levelIndex) {
    if (levelIndex < ENEMY_DB.length) return true;
    const infiniteLevel = levelIndex - ENEMY_DB.length + 1;
    return infiniteLevel > 0 && infiniteLevel % 3 === 0;
}

function setBoardTexture(levelIndex) {
    const board = document.getElementById('board-panel');
    if (!board) return;
    const map = {
        0: 'board_stone_blue',  1: 'board_stone_blue',
        2: 'board_brick_brown', 3: 'board_brick_brown',
        4: 'board_rock',        5: 'board_rock',
        6: 'board_asphalt',     7: 'board_asphalt',
        8: 'board_blue_brick',  9: 'board_blue_brick',
    };
    const name = map[levelIndex] ?? 'board_lava';
    board.style.setProperty('background-image', `url('img/${name}.webp')`, 'important');
    board.style.setProperty('background-size', 'cover', 'important');
    board.style.setProperty('background-position', 'center', 'important');
}

function loadStage(levelIndex, isLoad = false, parsedData = null) {
    if (levelIndex >= ENEMY_DB.length && !player.isInfiniteMode) return gameWin();
    stage.level = levelIndex;
    console.log('setBoardTexture called:', levelIndex);
    setBoardTexture(levelIndex);
    let enemy = getEnemyWithMeta(levelIndex);
    stage.enemyMaxHp = enemy.hp;
            stage.enemyName = enemy.name;
    let shackleIntroMessage = null;

    if (isLoad && parsedData && parsedData.stage) {
        stage.enemyHp = parsedData.stage.enemyHp ?? enemy.hp;
        stage.turnsLeft = parsedData.stage.turnsLeft ?? enemy.turns;
        stage.activeShackle = parsedData.stage.activeShackle || null;
        stage.shackleMeta = parsedData.stage.shackleMeta || null;
        stage.shackleWasNew = parsedData.stage.shackleWasNew || false;
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
        stage.shackleWasNew = false;
        if (levelIndex >= ENEMY_DB.length) {
            stage.infiniteMonsterId = Math.floor(Math.random() * 50) + 1;
        } else {
            stage.infiniteMonsterId = null;
        }
        
        const forecastId = player.shackleForecast && player.shackleForecast.level === levelIndex
            ? player.shackleForecast.id
            : null;
        let shackleAssignment = assignShackleForStage(levelIndex, forecastId);
        stage.activeShackle = shackleAssignment.id;
        stage.shackleMeta = shackleAssignment.meta;
        if (forecastId) player.shackleForecast = null;
        
        // Setup consumables buff for this stage
        stage.damageBuffMulti = player.nextDamageMulti || 1.0;
        player.nextDamageMulti = 1.0; // Consume it


        if (stage.activeShackle === 'timecompress') {
            stage.turnsLeft = 2;
        }

        if (stage.activeShackle === 'wither') {
            player.hp = 1;
        }
        
        if (stage.activeShackle && player.relics.includes('cons_pliers')) {
            stage.activeShackle = null;
            stage.shackleMeta = null;
            stage.shackleWasNew = false;
            player.relics.splice(player.relics.indexOf('cons_pliers'), 1);
        }

        if (stage.activeShackle) {
            stage.shackleWasNew = !isCollectionUnlocked('shackle', stage.activeShackle);
            unlockCollectionItem('shackle', stage.activeShackle);
            let sDef = SHACKLE_DB.find(s => s.id === stage.activeShackle);
            if (sDef) {
                let extraMsg = "";
                if (stage.activeShackle === 'parityfear') {
                    extraMsg = `\n(本局目標：${stage.shackleMeta.fearType === 'odd' ? '奇數' : '偶數'})`;
                } else if (stage.activeShackle === 'numberplunder') {
                    extraMsg = `\n(本局目標數字：${stage.shackleMeta.targetNumber})`;
                }
                const newPrefix = stage.shackleWasNew ? `[${i18n.t('ui.fusion_new_item')}] ` : '';
                shackleIntroMessage = i18n.t('messages.toast_shackle_found', `${newPrefix}${i18n.t(`shackles.${sDef.id}.name`) || sDef.name}`, (i18n.t(`shackles.${sDef.id}.desc`) || sDef.desc), extraMsg);
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

    // Play correct BGM
    if ((levelIndex < ENEMY_DB.length && (isElite(levelIndex) || isBoss(levelIndex))) ||
        (levelIndex >= ENEMY_DB.length && isBoss(levelIndex))) {
        Audio.playBGMTrack('02');
    } else {
        Audio.playBGMTrack('01');
    }

    saveGame();
    renderAll();

    if (!isLoad || !parsedData || !parsedData.battle || battle.state === 'IDLE') {
        if (shackleIntroMessage) {
            if (shouldPlayShackleIntroAnimation(levelIndex)) {
                UI.playShackleSealAnimation(() => {
                    UI.showToast(shackleIntroMessage, startTurn);
                });
            } else {
                UI.showToast(shackleIntroMessage, startTurn);
            }
        } else {
            startTurn();
        }
    }
}

function startTurn() {
    if (stage.turnsLeft <= 0) return gameOver(i18n.t('ui.game_over_desc'));
    if (drunkInterval) { clearInterval(drunkInterval); drunkInterval = null; clearDrunkDisplayValue(); }
    if (stage.activeShackle === 'illusionary') { setIllusionaryFakeRatio(Math.random() * 0.25 + 0.05); }
    battle.state = 'IDLE';
    clearActiveHighlight();

    if (stage.activeShackle === 'gluttony') {
        let healAmount = Math.floor(stage.enemyMaxHp * 0.03);
        if (stage.enemyHp < stage.enemyMaxHp) {
            stage.enemyHp = Math.min(stage.enemyMaxHp, stage.enemyHp + healAmount);
            UI.updateEnemyUI(stage);
            UI.showToast(i18n.t('messages.toast_gluttony', healAmount));
        }
    }
    
    let baseMaxRolls = 2 + (metaData.upgrades?.rerolls || 0) + (player.relics.filter(id => id === 'refresh').length * 2) + (player.berserkerBonus || 0) + player.relics.filter(id => id === 'cons_guide').length + (player.relics.filter(id => id === 'cons_loaded_dice').length * 2);
    if (stage.activeShackle === 'fatigue') {
        baseMaxRolls = 1;
    }
    if (stage.activeShackle === 'destinychain') {
        baseMaxRolls = 1;
    }
    if (tutorialMode) {
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
    UI.renderControls(battle, player.maxRolls);
    UI.renderScore(battle, activeHighlight);
}

// --- 註冊給 UI onclick 呼叫的全域函式 ---
window.toggleLock = function(idx) {
    if (battle.state === 'WAIT_ACTION' && (!activeHighlight || tutorialMode)) {
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

        if (stage.activeShackle === 'ultimatelock' && [1, 2, 5, 6].includes(idx)) {
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
            const lockedDice = battle.dice.filter(d => d.locked);
            const lockedCount = lockedDice.length;
            if (TUTORIAL_STEPS[tutorialStep]?.waitFor === 'lock_two_dice' && lockedCount >= 2) {
                const lockedVals = lockedDice.map(d => d.val);
                const hasPair = lockedVals.some((val, index) => lockedVals.indexOf(val) !== index);
                if (hasPair) {
                    tutorialStep++;
                    const nextStep = TUTORIAL_STEPS[tutorialStep];
                    if (nextStep?.forceDiceAfterRoll) tutorialForcedDice = [...nextStep.forceDiceAfterRoll];
                    UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length);
                } else {
                    UI.showToast(i18n.t('tutorial.lock_pair_hint'));
                }
            }
        }
    }
};

function isTextInputFocused() {
    const activeElement = document.activeElement;
    if (!activeElement) return false;
    const tagName = activeElement.tagName ? activeElement.tagName.toLowerCase() : '';
    return activeElement.isContentEditable || ['input', 'select', 'textarea'].includes(tagName);
}

function isBlockingModalOpen() {
    const blockingSelectors = [
        '#rules-modal',
        '#history-modal',
        '#collection-modal',
        '#settings-modal',
        '#souls-modal',
        '#how-to-play-modal',
        '#dev-modal',
        '#fusion-replace-modal'
    ];
    return blockingSelectors.some((selector) => {
        const modal = document.querySelector(selector);
        return modal && !modal.classList.contains('hidden');
    });
}

function getShortcutDiceIndex(event) {
    const key = event.key.toLowerCase();
    const keyboardMap = {
        q: 0, w: 1, e: 2, r: 3,
        a: 4, s: 5, d: 6, f: 7
    };
    if (Object.prototype.hasOwnProperty.call(keyboardMap, key)) return keyboardMap[key];
    if (/^[1-8]$/.test(key)) return Number(key) - 1;
    return null;
}

function shouldIgnoreGameShortcut(event) {
    if (event.defaultPrevented) return true;
    if (event.repeat) return true;
    if (event.metaKey || event.altKey) return true;
    if (isTextInputFocused()) return true;
    if (isBlockingModalOpen()) return true;
    if (UI.el.titleScreen && !UI.el.titleScreen.classList.contains('hidden')) return true;
    if (UI.el.shopOverlay && !UI.el.shopOverlay.classList.contains('hidden')) return true;
    if (UI.el.endOverlay && !UI.el.endOverlay.classList.contains('hidden')) return true;
    return false;
}

function registerKeyboardShortcuts() {
    window.addEventListener('keydown', (event) => {
        if (shouldIgnoreGameShortcut(event)) return;

        const diceIndex = getShortcutDiceIndex(event);
        if (diceIndex !== null) {
            if (battle.state === 'WAIT_ACTION') {
                event.preventDefault();
                window.toggleLock(diceIndex);
            }
            return;
        }

        if (event.key === 'Control') {
            if (battle.state === 'WAIT_ACTION' && battle.rollsLeft > 0) {
                event.preventDefault();
                window.executeRoll(false);
            }
            return;
        }

        if (event.code === 'Space') {
            const isTutorialAttackLocked = tutorialMode && tutorialStep < TUTORIAL_ATTACK_UNLOCK_STEP;
            if (battle.state === 'WAIT_ACTION' && battle.scoreResult && !isTutorialAttackLocked) {
                event.preventDefault();
                window.fireAttack();
            }
        }
    });
}

registerKeyboardShortcuts();

window.setHighlight = function(group) {
    if (battle.state !== 'WAIT_ACTION') return;
    const tagMap = {
        A: battle.scoreResult?.tagA,
        B: battle.scoreResult?.tagB,
        C: battle.scoreResult?.tagC,
        D: battle.scoreResult?.tagD
    };
    const tag = tagMap[group];
    const hasMatchedDice = battle.dice.some(d => d.matchedGroups && d.matchedGroups[group]);
    if (!battle.scoreResult || stage.activeShackle === 'amnesia' || !tag || tag.name === '無' || tag.name === '???' || (group !== 'D' && !hasMatchedDice)) {
        return;
    }

    clearHighlightTimer();
    if (activeHighlight === group) {
        activeHighlight = null;
    } else {
        activeHighlight = group;
        highlightAutoClearTimer = setTimeout(() => {
            clearActiveHighlight(true);
        }, 5000);
    }
    UI.renderDice(battle, activeHighlight, player);
    UI.renderScore(battle, activeHighlight);
};

window.executeRoll = function(isInitial = false) {
    if (!isInitial && battle.rollsLeft <= 0) return;
    if (battle.state === 'ROLLING' || battle.state === 'ATTACKING') return;

    if (!isInitial) {
        // Tutorial: advance step on roll action
        if (tutorialMode && TUTORIAL_STEPS[tutorialStep]?.waitFor === 'roll_action') {
            tutorialStep++; // Will show damage preview tooltip after roll completes
            UI.clearTutorialTooltip();
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
    clearActiveHighlight();
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

            // Apply Consumables: Lucky Clovers
            if (isInitial) {
                [3, 4, 5, 6].forEach(num => {
                    let cloverId = `cons_clover_${num}`;
                    if (player.relics.includes(cloverId)) {
                        let unlocked = battle.dice.filter(d => !d.locked);
                        for (let i = 0; i < Math.min(3, unlocked.length); i++) {
                            unlocked[i].val = num;
                        }
                        // Consume the item
                        player.relics = player.relics.filter(r => r !== cloverId);
                    }
                });
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

            battle.scoreResult = calculateEngineScore(battle.dice, activeRelics, battle.rollsLeft, player.hp, shackleConfig ? [shackleConfig] : [], stage.turnsLeft, { level: stage.level, relics: player.relics, unlockedHands: Object.keys(window.getCollection ? window.getCollection().hands : {}).length, playerHp: player.hp, maxHp: window.getMaxHp(), fivesRolled: player.fivesRolled, finalDamageUpgrade: metaData?.upgrades?.finalDamage || 0, damageBuffMulti: stage.damageBuffMulti || 1.0, isEliteOrBoss: isElite(stage.level) || isBoss(stage.level), bonusBasePoints: (player.bonusBasePoints || 0) });

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
            const _unlockedForAnim = battle.dice.map((d, i) => !d.locked ? i : -1).filter(i => i !== -1);
            renderAll();
            UI.startRerollAnimation(_unlockedForAnim, battle.dice);

            // Tutorial: show current step tooltip after roll completes
            if (tutorialMode) {
                setTimeout(() => UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length), 520);
            }
        }
    }, 25);
};

window.fireAttack = function() {
    if (battle.state !== 'WAIT_ACTION' || !battle.scoreResult) return;
    battle.state = 'ATTACKING';
    clearActiveHighlight();

    // Tutorial: advance on attack action
    if (tutorialMode && TUTORIAL_STEPS[tutorialStep]?.waitFor === 'attack_action') {
        tutorialStep++; // shop selection step will be shown when shop opens
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
            battle.scoreResult = calculateEngineScore(battle.dice, activeRelics, battle.rollsLeft, player.hp, shackleConfig ? [shackleConfig] : [], stage.turnsLeft, { level: stage.level, relics: player.relics, unlockedHands: Object.keys(window.getCollection ? window.getCollection().hands : {}).length, playerHp: player.hp, maxHp: window.getMaxHp(), fivesRolled: player.fivesRolled, finalDamageUpgrade: metaData?.upgrades?.finalDamage || 0, damageBuffMulti: stage.damageBuffMulti || 1.0, isEliteOrBoss: isElite(stage.level) || isBoss(stage.level), bonusBasePoints: (player.bonusBasePoints || 0) });
            UI.showToast(i18n.t('messages.toast_tremor'));
        }
    }

    UI.renderDice(battle, activeHighlight, player);
    UI.renderControls(battle, player.maxRolls);
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
    const env = { level: stage.level, relics: player.relics, unlockedHands: Object.keys(window.getCollection ? window.getCollection().hands : {}).length, playerHp: player.hp, maxHp: window.getMaxHp(), fivesRolled: player.fivesRolled, finalDamageUpgrade: metaData?.upgrades?.finalDamage || 0, damageBuffMulti: stage.damageBuffMulti || 1.0, isEliteOrBoss: isElite(stage.level) || isBoss(stage.level), bonusBasePoints: (player.bonusBasePoints || 0) };
    let steps = calculateDamageSteps(battle.dice, activeRelics, battle.rollsLeft, player.hp, shackleConfig ? [shackleConfig] : [], stage.turnsLeft, env);


    // Ensure final step shows actual finalDamage
    steps[steps.length - 1].damageAfter = finalDamage;
    const previewHighlight = buildAttackHighlights({
        damage: finalDamage,
        enemyHpBefore: stage.enemyHp,
        enemyMaxHp: stage.enemyMaxHp,
        playerHpBefore: player.hp,
        turnsLeftBefore: stage.turnsLeft,
        defeated: finalDamage >= stage.enemyHp,
        scoreResult: battle.scoreResult,
        activeShackle: stage.activeShackle,
        relics: player.relics,
        level: stage.level
    });

    // --- doAttack: original combat resolution, wrapped as callback ---
    const doAttack = () => {
        let dmg = finalDamage;
        const enemyHpBefore = stage.enemyHp;
        const playerHpBefore = player.hp;
        const turnsLeftBefore = stage.turnsLeft;

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
        const actualHighlight = buildAttackHighlights({
            damage: dmg,
            enemyHpBefore,
            enemyMaxHp: stage.enemyMaxHp,
            playerHpBefore,
            turnsLeftBefore,
            defeated: stage.enemyHp <= 0,
            scoreResult: battle.scoreResult,
            activeShackle: stage.activeShackle,
            relics: player.relics,
            level: stage.level
        });
        rememberAttackHighlight(actualHighlight);

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
                UI.showPlayerHit(1, player.hp <= 1 ? 'fatal' : 'heavy');
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

        if (finalDamage >= 1_000_000) unlockSteamAchievement('ACH_DAMAGE_1M');
        if (finalDamage >= 100_000_000) unlockSteamAchievement('ACH_DAMAGE_100M');

        const scoredHandIds = [battle.scoreResult.tagA, battle.scoreResult.tagB, battle.scoreResult.tagC, battle.scoreResult.tagD]
            .filter(tag => tag && tag.name !== '無')
            .map(tag => ruleNameToId(tag.name) || tag.name);

        scoredHandIds.forEach(id => unlockCollectionItem('hand', id));
        if (scoredHandIds.includes('rule_a0')) unlockSteamAchievement('ACH_BIBI_DICE_HAND');
        if (scoredHandIds.length === 4) unlockSteamAchievement('ACH_FOUR_ZONE_RESONANCE');

        UI.el.battleArea.classList.remove('shake-hard');
        void UI.el.battleArea.offsetWidth;
        UI.el.battleArea.classList.add('shake-hard');

        UI.el.hitFlash.classList.remove('hidden');
        UI.el.hitFlash.classList.remove('flash-red-anim');
        void UI.el.hitFlash.offsetWidth;
        UI.el.hitFlash.classList.add('flash-red-anim');

        const isEpicHit = finalDamage / (stage.enemyMaxHp || 1) >= 5.0
            || finalDamage >= 100_000_000
            || (battle.scoreResult.finalMultiplier || 0) >= 100_000;
        let dmgEl = document.createElement('div');
        dmgEl.className = 'damage-text text-6xl md:text-8xl font-black text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.9)] z-30 absolute top-1/2 left-1/2'
            + (isEpicHit ? ' damage-float--epic' : '')
            + (actualHighlight ? ' damage-float--highlight' : '');
        let displayDmg = dmg;
        if (stage.activeShackle === 'illusionary') {
            let fakeMultiplier = Math.floor(Math.random() * 16) + 5;
            displayDmg *= fakeMultiplier;
        }
        const damageText = `-${displayDmg.toLocaleString()}`;
        if (damageText.length >= 15) dmgEl.classList.add('damage-text--tiny');
        else if (damageText.length >= 11) dmgEl.classList.add('damage-text--compact');
        dmgEl.innerText = damageText;
        UI.el.damageContainer.appendChild(dmgEl);
        setTimeout(() => { dmgEl.remove(); UI.el.hitFlash.classList.add('hidden'); }, isEpicHit ? 1800 : 1200);

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
                    if (player.relics.includes('cons_doll')) {
                        UI.showToast(i18n.t('messages.toast_doll_timeout'));
                        player.relics.splice(player.relics.indexOf('cons_doll'), 1);
                        stage.turnsLeft = getEnemyWithMeta(stage.level).turns;
                        if (stage.activeShackle === 'timecompress') stage.turnsLeft = 2;
                        startTurn();
                    } else {
                        UI.showEnemyAttackCue(() => {
                            player.hp--;
                            if (player.hp > 0 && player.relics.includes('berserker')) {
                                player.berserkerBonus = (player.berserkerBonus || 0) + 1;
                                UI.showToast(i18n.t('messages.toast_berserker'));
                            }
                            UI.updateHeaderUI(player, stage);
                            UI.showPlayerHit(1, player.hp <= 1 ? 'fatal' : 'light');
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
                        });
                    }
                } else startTurn();
            }
        }, 1000 + delay);
    };

    if (localStorage.getItem('setting_stepAnimation') === 'false') {
        const finalStep = steps && steps.find(s => s.final);
        if (finalStep && UI.el.finalScoreValue) UI.el.finalScoreValue.textContent = finalStep.damageAfter.toLocaleString();
        doAttack();
    } else {
        UI.showHandNamesPreview(battle.scoreResult);
        setTimeout(() => {
            UI.playDamageStepsAnimation(steps, doAttack, { highlight: previewHighlight });
        }, 1600);
    }
};

// --- 商店與關卡結算 ---

function getRelicRarityWeights(baseWeights = { 1: 50, 2: 30, 3: 15, 4: 5 }) {
    const level = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.relicSense.max, Number(metaData.upgrades.relicSense) || 0));
    const commonShift = SOUL_UPGRADE_BY_ID.relicSense.commonWeightShiftPerLevel * level;
    const higherShift = SOUL_UPGRADE_BY_ID.relicSense.higherWeightShiftPerLevel * level;
    return {
        1: Math.max(1, baseWeights[1] - commonShift),
        2: baseWeights[2] + higherShift,
        3: baseWeights[3] + higherShift,
        4: baseWeights[4] + higherShift
    };
}

function getFusionCompassWeight(relic) {
    const level = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.fusionCompass.max, Number(metaData.upgrades.fusionCompass) || 0));
    if (level === 0) return 1;
    const material = FUSION_MATERIAL_LOOKUP[relic.id];
    if (!material || !player.relics.includes(material.mat) || player.dismantledFusions.includes(material.fid)) return 1;
    return SOUL_UPGRADE_BY_ID.fusionCompass.partnerWeightMultipliers[level - 1];
}

function getMythicRelicLimit() {
    const level = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.mythicVessel.max, Number(metaData.upgrades.mythicVessel) || 0));
    return 2 + (level * SOUL_UPGRADE_BY_ID.mythicVessel.extraLimitPerLevel);
}

function getShopRerollLimit() {
    const level = Math.max(0, Math.min(SOUL_UPGRADE_BY_ID.shopReconsider.max, Number(metaData.upgrades.shopReconsider) || 0));
    return 1 + (level * SOUL_UPGRADE_BY_ID.shopReconsider.extraRerollsPerLevel);
}

if (IS_DEV) {
    window.devGetSoulUpgradeEffects = (relicId = null) => {
        const relic = relicId ? RELIC_DB.find(item => item.id === relicId) : null;
        return {
            rarityWeights: getRelicRarityWeights(),
            fusionWeight: relic ? getFusionCompassWeight(relic) : null,
            mythicLimit: getMythicRelicLimit(),
            shopRerollLimit: getShopRerollLimit()
        };
    };
}

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

                let maxMythic = getMythicRelicLimit();

                if (currentRarity5.length >= maxMythic) {
                    // Maximum of maxMythic rarity 5 items reached
                    // Trigger modal and pause the checking loop
                    player.relics = player.relics.filter(r => r !== rec.mat1 && r !== rec.mat2);
                    window.triggerFusionReplace(currentRarity5, fid, rec.mat1, rec.mat2);
                    return true; // Important: return to pause execution. Callback will resume if needed.
                }

                // Normal fusion
                player.relics = player.relics.filter(r => r !== rec.mat1 && r !== rec.mat2);
                player.relics.push(fid);
                unlockCollectionItem('relic', fid);
                trackFusionAchievements();

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

    return false;
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
            trackFusionAchievements();

            let newDef = RELIC_DB.find(x => x.id === newFusionId);
            UI.showToast(i18n.t('messages.toast_fusion_replace', discardedName, newDef.name));
        }

        // Re-check just in case the returned materials can form something else
        // (though they shouldn't since we added them to dismantledFusions)
        const fusionStillPending = checkRelicFusion();

        // Update UI
        UI.renderInventory(player, battle);
        if (!UI.el.shopOverlay.classList.contains('hidden')) {
            UI.renderShopItems(shopItems, player);
        }
        saveGame();

        if (pendingShopAdvanceAfterFusion && !fusionStillPending) {
            pendingShopAdvanceAfterFusion = false;
            finishShopAndAdvance();
        }
    });
};

function enemyDefeated() {
    ['cons_strike_a', 'cons_fever_b', 'cons_combo_c', 'cons_science_d', 'cons_bomb', 'cons_loaded_dice'].forEach(consId => {
        let idx = player.relics.indexOf(consId);
        if (idx !== -1) player.relics.splice(idx, 1);
    });

    let shouldTriggerFirstAid = (stage.level + 1) % 3 === 0;
    if (player.relics.includes('firstaid') && shouldTriggerFirstAid && player.hp < window.getMaxHp()) {
        player.hp++;
        UI.showToast(i18n.t('messages.toast_firstaid'));
    }

    if (stage.activeShackle === 'wither' && stage.shackleMeta && stage.shackleMeta.originalHp) {
        player.hp = stage.shackleMeta.originalHp;
    }

    UI.shootConfetti();
    unlockSteamAchievement('ACH_FIRST_BLOOD');
    if (isElite(stage.level)) unlockSteamAchievement('ACH_FIRST_ELITE');
    if (isBoss(stage.level)) unlockSteamAchievement('ACH_FIRST_BOSS');
    if (stage.level >= ENEMY_DB.length) {
        const infiniteLevel = stage.level - ENEMY_DB.length + 1;
        if (infiniteLevel >= 10) unlockSteamAchievement('ACH_INFINITE_10');
    }

    // Exclude Rarity 5 and fusion materials of active fusions from drops
    const getDropFusedMaterials = () => {
        let mats = [];
        player.relics.forEach(rId => {
            if (FUSION_RECIPES[rId]) { mats.push(FUSION_RECIPES[rId].mat1, FUSION_RECIPES[rId].mat2); }
        });
        return mats;
    };
    let availableForShop = RELIC_DB.filter(r => !player.relics.includes(r.id) && r.rarity !== 5 && !getDropFusedMaterials().includes(r.id));
    let nextStep = openShop;

    // Boss (9) or Elite (2, 5, 8)
    let isEliteOrBossDrop = isElite(stage.level) || isBoss(stage.level);

    if (isEliteOrBossDrop && availableForShop.length > 0) {
        let dropWeights = getRelicRarityWeights({ 1: 20, 2: 40, 3: 30, 4: 10 });
        let randomRelic = getWeightedRandomRelics(availableForShop, 1, dropWeights)[0];
        player.relics.push(randomRelic.id);
        unlockCollectionItem('relic', randomRelic.id);

        // Ensure UI updates properly if fusion happens
        checkRelicFusion();

        availableForShop = RELIC_DB.filter(r => !player.relics.includes(r.id) && r.rarity !== 5 && !getDropFusedMaterials().includes(r.id));
        nextStep = openShop;

        if (isBoss(stage.level) && !player.isInfiniteMode) {
            nextStep = gameWin; // End game normally instead of shopping after boss in standard mode
        }

        // Handle Souls
        let enemyName = getEnemyWithMeta(stage.level).name;
        let enemyNameI18n = enemyName;
        if (stage.level < ENEMY_DB.length) {
            enemyNameI18n = i18n.t(`enemies.enemy_${stage.level}`) || enemyName;
        } else {
            enemyNameI18n = i18n.t(`monsters.monster_${stage.infiniteMonsterId}`);
        }
        let earnedSouls = isBoss(stage.level) && !player.isInfiniteMode ? 2 : 1;
        if (player.isInfiniteMode || stage.level >= ENEMY_DB.length) earnedSouls = 1;

        let burstLevel = player.contractLevel || 0;
        earnedSouls += burstLevel * SOUL_UPGRADE_BY_ID.soulBurst.soulBonusPerLevel;
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

        let burstLevel = player.contractLevel || 0;
        if (earnedSouls > 0 || burstLevel > 0) {
            earnedSouls += burstLevel * SOUL_UPGRADE_BY_ID.soulBurst.soulBonusPerLevel;
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
    ensureShackleForecast(stage.level + 1);
    UI.el.shopOverlay.classList.remove('hidden');
    UI.el.shopOverlay.classList.add('flex');
    shopRerollsUsed = 0;
    window.itemsBoughtThisScreen = 0;
    UI.updateShopRerollBtn(shopRerollsUsed, getShopRerollLimit());
    UI.updateHeaderUI(player, stage);
    window.rerollShop(true);

    // Tutorial: show shop selection step
    if (tutorialMode && TUTORIAL_STEPS[tutorialStep]?.waitFor === 'shop_select') {
        setTimeout(() => UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length), 400);
    }
}

window.rerollShop = function(isInitial = false) {
    if (!isInitial) {
        const rerollLimit = getShopRerollLimit();
        if (shopRerollsUsed >= rerollLimit) return UI.showToast(i18n.t('messages.toast_shop_limit', rerollLimit));
        shopRerollsUsed++;
        UI.updateShopRerollBtn(shopRerollsUsed, rerollLimit);
        UI.updateHeaderUI(player, stage);
    }
    window.itemsBoughtThisScreen = 0;

    // Remember currently displayed items to prevent them from showing up again
    let currentItemIds = shopItems ? shopItems.map(item => item.id) : [];

    const sealedRelics = new Set(player.sealedRelics || []);
    let available = RELIC_DB.filter(r => !player.relics.includes(r.id) && r.rarity !== 5 && !sealedRelics.has(r.id));

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

    let selectedItems = getWeightedRandomRelics(available, 3, getRelicRarityWeights(), getFusionCompassWeight);

    // If empty or infinite mode, inject consumables
    if (selectedItems.length < 3 || player.isInfiniteMode) {
        let cons = [...CONSUMABLES_DB];
        let nonDuplicateCons = cons.filter(c => !currentItemIds.includes(c.id));
        if (nonDuplicateCons.length >= (3 - selectedItems.length)) {
            cons = nonDuplicateCons;
        }
        let itemsNeeded = 3 - selectedItems.length;
        let consSelected = getWeightedRandomRelics(cons, itemsNeeded);
        for (let c of consSelected) {
            selectedItems.push(c);
        }

        // Filter out excess clover items (max 1 clover per shop)
        let cloverCount = 0;
        let filteredSelectedItems = [];
        for (let item of selectedItems) {
            if (item.id.startsWith('cons_clover_')) {
                cloverCount++;
                if (cloverCount <= 1) {
                    filteredSelectedItems.push(item);
                }
            } else {
                filteredSelectedItems.push(item);
            }
        }
        selectedItems = filteredSelectedItems;

        // Refill if clovers were removed
        if (selectedItems.length < 3) {
            let newlyNeeded = 3 - selectedItems.length;
            let currentShopItemIds = selectedItems.map(i => i.id);
            // Available cons that are not already in shop and not clovers
            let refillCons = cons.filter(c => !currentShopItemIds.includes(c.id) && !c.id.startsWith('cons_clover_'));
            let refillSelected = getWeightedRandomRelics(refillCons, newlyNeeded);
            for (let c of refillSelected) {
                selectedItems.push(c);
            }
        }
    }

    shopItems = selectedItems;
    UI.renderShopItems(shopItems, player);
    UI.renderShopForecast(player.shackleForecast);
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
        tutorialStep++; // advance to post-shop tutorial step
        UI.showTutorialStep(tutorialStep, TUTORIAL_STEPS.length);
        return;
    }

    Audio.playBuySound();
    window.itemsBoughtThisScreen++;
    let fusionPending = false;

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
        } else {
            const toastKeys = {
                cons_bomb: 'messages.toast_cons_bomb',
                cons_pliers: 'messages.toast_cons_pliers',
                cons_doll: 'messages.toast_cons_doll',
                cons_fruit: 'messages.toast_cons_fruit',
                cons_loaded_dice: 'messages.toast_cons_loaded_dice',
                cons_guide: 'messages.toast_cons_guide',
                cons_strike_a: 'messages.toast_cons_combo_a',
                cons_fever_b: 'messages.toast_cons_fever_b',
                cons_combo_c: 'messages.toast_cons_combo_c',
                cons_science_d: 'messages.toast_cons_science_d'
            };

            player.relics.push(r.id);
            const toastKey = r.id.startsWith('cons_clover_') ? 'messages.toast_cons_clover' : toastKeys[r.id];
            UI.showToast(toastKey ? i18n.t(toastKey, r.id.replace('cons_clover_', '')) : i18n.t('messages.toast_obtained') + (i18n.t(`consumables.${r.id}.name`) || r.name));
        }
    } else {
        // Relic logic
        player.relics.push(r.id);
        unlockCollectionItem('relic', r.id);
        fusionPending = checkRelicFusion();
    }

    shopItems.splice(idx, 1);
    UI.updateHeaderUI(player, stage);
    UI.renderInventory(player, battle);
    saveGame();

    if (fusionPending) {
        pendingShopAdvanceAfterFusion = true;
        UI.el.shopOverlay.classList.add('hidden');
        UI.el.shopOverlay.classList.remove('flex');
        return;
    }

    finishShopAndAdvance();
};

function finishShopAndAdvance() {
    UI.el.shopOverlay.classList.add('hidden');
    UI.el.shopOverlay.classList.remove('flex');
    nextStage();
}

function nextStage() { loadStage(stage.level + 1); }

function recordHistory(win) {
    if (stage.shackleTimer) {
        clearTimeout(stage.shackleTimer);
        stage.shackleTimer = null;
    }

    if (player.isInfiniteMode) {
        let currentInfiniteFloor = stage.level - ENEMY_DB.length + 1;
        let pbInfinite = parseInt(localStorage.getItem('bibbidiba_pb_infinite')) || 0;
        if (currentInfiniteFloor > pbInfinite) {
            localStorage.setItem('bibbidiba_pb_infinite', currentInfiniteFloor.toString());
            scheduleSteamCloudFlush();
        }
    }

    let history = secureParseStorage(HISTORY_KEY, [], (data) => Array.isArray(data));
    let currentRecord = {
        win: win,
        isInfiniteMode: player.isInfiniteMode,
        infiniteLevel: player.isInfiniteMode ? (stage.level - ENEMY_DB.length + 1) : 0,
        level: stage.level,
        infiniteMonsterId: stage.infiniteMonsterId || null,
        stageName: (getEnemyWithMeta(stage.level) || {}).name || '未知關卡',
        stageType: player.isInfiniteMode ? 'infinite' : (isBoss(stage.level) ? 'boss' : (isElite(stage.level) ? 'elite' : 'normal')),
        date: Date.now(),
        highestDamage: player.highestDamage || 0,
        highestMulti: player.highestMulti || 0,
        combo: player.highestDamageCombo || '無',
        highlight: player.highlights?.best || null,
        relics: [...player.relics],
        shackle: stage.activeShackle || null
    };
    history.push(currentRecord);
    // 只保留最近 20 筆紀錄
    if (history.length > 20) {
        history.shift();
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    scheduleSteamCloudFlush();
}


function playerTakesFatalDamage(reason) {
    gameOver(reason);
}

function gameOver(reason) {
    clearSave();
    recordHistory(false);
    UI.clearToasts();
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
    UI.renderEndGameStats(player.highestDamage, player.highestDamageCombo, player.relics, player.highlights?.best || null, player.highestMulti || 0);
    UI.hidePromoWinCard();
}

function gameWin() {
    if (stage.activeShackle === 'wither' && stage.shackleMeta && stage.shackleMeta.originalHp) {
        player.hp = stage.shackleMeta.originalHp;
    }

    unlockSteamAchievement('ACH_FIRST_BLOOD');
    unlockSteamAchievement('ACH_FIRST_BOSS');
    clearSave();
    recordHistory(true);
    UI.clearToasts();
    UI.el.endOverlay.classList.remove('hidden');
    UI.el.endOverlay.classList.add('flex');

    let btnRestart = document.getElementById('btn-restart');
    let btnInfinite = document.getElementById('btn-infinite');

    if (btnRestart) btnRestart.classList.remove('hidden');
    if (btnInfinite) btnInfinite.classList.remove('hidden');

    UI.el.endTitle.className = "text-5xl md:text-7xl font-black text-amber-400 mb-4 pop-anim";
    UI.el.endTitle.innerText = i18n.t('messages.game_clear');
    UI.el.endDesc.innerText = i18n.t('messages.game_clear_desc');
    UI.renderEndGameStats(player.highestDamage, player.highestDamageCombo, player.relics, player.highlights?.best || null, player.highestMulti || 0);
    UI.showPromoWinCard();
    let endInterval = setInterval(UI.shootConfetti, 1000);
    setTimeout(() => clearInterval(endInterval), 5000);
}

let cheatBuffer = '';
window.addEventListener('keydown', (e) => {
    cheatBuffer += e.key;
    if (cheatBuffer.length > 20) cheatBuffer = cheatBuffer.slice(-20);

    if (cheatBuffer.endsWith('8989889')) {
        if (window.devKillEnemy) window.devKillEnemy();
        cheatBuffer = '';
    } else {
        let match = cheatBuffer.match(/ss([1-8]{8})$/);
        if (match) {
            if (window.devSetDice) window.devSetDice(match[1]);
            cheatBuffer = '';
        }
    }
});

window.devKillEnemy = () => {
    if (battle.state === 'ATTACKING') return;
    stage.enemyHp = 0;
    UI.updateEnemyUI(stage);
    enemyDefeated();
};

window.devGetAllRelics = () => {
    // Add all relics (including mythic) to bypass fusion limit logic and empty the shop pool
    RELIC_DB.forEach(r => {
        if (!r.id.startsWith('cons_') && !player.relics.includes(r.id)) {
            player.relics.push(r.id);
            if (typeof unlockCollectionItem === 'function') unlockCollectionItem('relic', r.id);
        }
    });

    UI.renderInventory(player, battle);
    if (typeof saveGame === 'function') saveGame();

    UI.showToast(i18n.t('messages.toast_dev_get_all'));
    if (window.closeDevModal) window.closeDevModal();
};

function refreshDevScoreResult() {
    if (battle.state !== 'WAIT_ACTION' || !battle.scoreResult) return;
    let shackleConfig = null;
    if (stage.activeShackle) {
        shackleConfig = { id: stage.activeShackle };
        if (stage.shackleMeta) Object.assign(shackleConfig, stage.shackleMeta);
    }
    let activeRelics = player.relics;
    if (stage.activeShackle === 'relicseal' && stage.shackleMeta && stage.shackleMeta.ignoredRelics) {
        activeRelics = player.relics.filter(r => !stage.shackleMeta.ignoredRelics.includes(r));
    }
    battle.scoreResult = calculateEngineScore(battle.dice, activeRelics, battle.rollsLeft, player.hp, shackleConfig ? [shackleConfig] : [], stage.turnsLeft, { level: stage.level, relics: player.relics, unlockedHands: Object.keys(window.getCollection ? window.getCollection().hands : {}).length, playerHp: player.hp, maxHp: window.getMaxHp(), fivesRolled: player.fivesRolled, finalDamageUpgrade: metaData?.upgrades?.finalDamage || 0, damageBuffMulti: stage.damageBuffMulti || 1.0, isEliteOrBoss: isElite(stage.level) || isBoss(stage.level), bonusBasePoints: (player.bonusBasePoints || 0) });
}

window.devDamagePlayer = (amount = 1) => {
    if (battle.state === 'ATTACKING') return;
    const damage = Math.max(1, Math.min(99, Math.floor(Number(amount) || 1)));
    player.hp = Math.max(1, (Number(player.hp) || 1) - damage);
    refreshDevScoreResult();
    renderAll();
    UI.showToast(i18n.t('messages.toast_dev_damage_self', damage, player.hp, window.getMaxHp()));
};

window.devSetEnemyTurnsOne = () => {
    if (battle.state === 'ATTACKING') return;
    stage.turnsLeft = 1;
    refreshDevScoreResult();
    renderAll();
    UI.showToast(i18n.t('messages.toast_dev_turn_one'));
};

window.devSetDice = (digitString) => {
    if (battle.state === 'ATTACKING') return;
    for (let i = 0; i < 8; i++) {
        if (digitString[i]) {
            battle.dice[i].val = parseInt(digitString[i], 10);
            battle.dice[i].locked = false;
        }
    }
    battle.dice.sort((a, b) => a.val - b.val);

    refreshDevScoreResult();
    renderAll();
};

const btnDevKill = document.getElementById('dev-kill-btn');
const btnDevDice = document.getElementById('dev-dice-btn');
const inputDevDice = document.getElementById('dev-dice-input');
const btnDevGetAll = document.getElementById('dev-get-all-relics-btn');
const btnDevDamage = document.getElementById('dev-damage-btn');
const inputDevDamage = document.getElementById('dev-damage-input');
const btnDevTurnOne = document.getElementById('dev-turn-one-btn');

if (btnDevGetAll) {
    btnDevGetAll.onclick = () => {
        if (window.devGetAllRelics) window.devGetAllRelics();
    };
}

if (btnDevKill) {
    btnDevKill.onclick = () => {
        if (window.devKillEnemy) {
            window.devKillEnemy();
            if (window.closeDevModal) window.closeDevModal();
        }
    };
}

if (btnDevTurnOne) {
    btnDevTurnOne.onclick = () => {
        if (window.devSetEnemyTurnsOne) {
            window.devSetEnemyTurnsOne();
            if (window.closeDevModal) window.closeDevModal();
        }
    };
}

if (btnDevDamage && inputDevDamage) {
    btnDevDamage.onclick = () => {
        if (window.devDamagePlayer) {
            window.devDamagePlayer(inputDevDamage.value);
            if (window.closeDevModal) window.closeDevModal();
        }
    };
}

if (btnDevDice && inputDevDice) {
    btnDevDice.onclick = () => {
        const val = inputDevDice.value.trim();
        if (/^[1-8]{8}$/.test(val) && window.devSetDice) {
            window.devSetDice(val);
            if (window.closeDevModal) window.closeDevModal();
        } else {
            alert('請輸入精確的 8 個數字 (1-8)');
        }
    };
}

window.addEventListener('beforeunload', () => {
    if (steamCloudFlushTimer) {
        clearTimeout(steamCloudFlushTimer);
        steamCloudFlushTimer = null;
    }
    if (!window.steamCloud || typeof window.steamCloud.saveProfileSync !== 'function' || steamCloudImporting) return;
    try {
        const result = window.steamCloud.saveProfileSync(buildSteamCloudProfile({ persistUpdatedAt: false }));
        if (!result || !result.ok) {
            console.warn('[Steam Cloud] sync save skipped:', result && (result.error || result.reason));
        }
    } catch (error) {
        console.warn('[Steam Cloud] sync save failed:', error);
    }
});

async function bootGame() {
    await initSteamCloudProfile();
    loadCollection();
    retryPendingSteamAchievements();
    initTitleScreen();
    UI.initDragScrollAll();
    UI.initPromo();
    window.getEnemyWithMeta = getEnemyWithMeta;
}

bootGame();
