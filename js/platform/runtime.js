import { grantEnergy, nextEnergyAt, normalizeEnergy, spendEnergy } from './energy.mjs';
import { PROFILE_KEYS } from './profile-keys.mjs';

const ENERGY_KEY = 'bibbidiba_mobile_energy_v1';
const ORIGIN_KEY = 'bibbidiba_progress_origin_v1';
function readEnergy() {
    try {
        return normalizeEnergy(JSON.parse(localStorage.getItem(ENERGY_KEY) || 'null') || {
            remaining: 5,
            recoveredAt: Date.now()
        });
    } catch {
        return normalizeEnergy({ remaining: 5, recoveredAt: Date.now() });
    }
}

function writeEnergy(state) {
    localStorage.setItem(ENERGY_KEY, JSON.stringify(state));
    return state;
}

function localProfile() {
    return {
        version: 2,
        savedAt: Date.now(),
        storage: Object.fromEntries(PROFILE_KEYS.map(key => [key, localStorage.getItem(key)]))
    };
}

function randomOriginId() {
    // crypto.randomUUID 只在安全來源（https / localhost）存在；http 測試環境退回時間戳亂數
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getProgressOrigin() {
    let origin = localStorage.getItem(ORIGIN_KEY);
    if (!origin) {
        origin = `web-${randomOriginId()}`;
        localStorage.setItem(ORIGIN_KEY, origin);
    }
    return origin;
}

if (!window.bibiPlatform) {
    window.bibiPlatform = {
        isMobile: false,
        supportsCloud: false,
        isConfigured: false,
        async ready() {},
        async restoreLocalProfile() { return null; },
        async saveLocalProfile() { return localProfile(); },
        getAuthState() { return { user: null, emailVerified: false }; },
        async signIn() { throw new Error('mobile_unavailable'); },
        async signUp() { throw new Error('mobile_unavailable'); },
        async sendPasswordReset() { throw new Error('mobile_unavailable'); },
        async sendVerification() { throw new Error('mobile_unavailable'); },
        async signOut() {},
        async deleteAccount() { throw new Error('mobile_unavailable'); },
        async syncProgress(shared) { return shared; },
        getProgressOrigin,
        getPremiumState() { return { active: false }; },
        async purchasePremium() { throw new Error('mobile_unavailable'); },
        async restorePurchases() { return { active: false }; },
        getEnergy() { return readEnergy(); },
        async spendEnergy() { return { ok: true, state: readEnergy(), bypassed: true }; },
        async grantEnergy(amount = 1) { return writeEnergy(grantEnergy(readEnergy(), amount)); },
        getNextEnergyAt() { return nextEnergyAt(readEnergy()); },
        async showRewardedAd() { return { rewarded: false, reason: 'mobile_unavailable' }; },
        async showResultBanner() {},
        async hideResultBanner() {},
        async openPrivacyOptions() { throw new Error('mobile_unavailable'); },
        async scheduleEnergyFullNotification() {},
        onAppStateChange() { return () => {}; },
        onBackButton() { return () => {}; },
        async exitApp() {}
    };
}

export { PROFILE_KEYS };
