// sim/core/adapter.mjs
// 無頭環境接線：engine.js 內部以 window.i18n 取名稱（js/engine.js:7-10），
// Node 沒有 window，先掛一個空殼再匯入，讓所有名稱走 fallback（中文原名）。
// 計分邏輯與靜態數值 100% 使用遊戲本體檔案，零複製。

globalThis.window = globalThis.window || {};

export {
    calculateEngineScore,
    calculateDamageSteps,
    isDamageVisible,
    isEnemyHpBarVisible,
    isZoneMultiplierVisible
} from '../../js/engine.js';

export {
    RARITY,
    SOUL_UPGRADE_DB,
    SOUL_UPGRADE_BY_ID,
    FUSION_RECIPES,
    FUSION_MATERIAL_LOOKUP,
    RELIC_DB,
    CONSUMABLES_DB,
    ENEMY_DB,
    SHACKLE_DB,
    RULE_DB,
    isElite,
    isBoss,
    getEnemy
} from '../../js/data.js';
