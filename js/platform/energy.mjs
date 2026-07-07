export const ENERGY_MAX = 5;
export const ENERGY_RECOVERY_MS = 60 * 60 * 1000;

function safeTimestamp(value, fallback) {
    const timestamp = Number(value);
    return Number.isFinite(timestamp) && timestamp >= 0 ? timestamp : fallback;
}

export function normalizeEnergy(state, now = Date.now()) {
    const currentTime = safeTimestamp(now, Date.now());
    const source = state && typeof state === 'object' ? state : {};
    let remaining = Math.max(0, Math.min(ENERGY_MAX, Math.floor(Number(source.remaining) || 0)));
    let recoveredAt = safeTimestamp(source.recoveredAt, currentTime);

    if (remaining >= ENERGY_MAX) return { remaining: ENERGY_MAX, recoveredAt: currentTime };
    if (currentTime <= recoveredAt) return { remaining, recoveredAt };

    const recovered = Math.floor((currentTime - recoveredAt) / ENERGY_RECOVERY_MS);
    if (recovered > 0) {
        remaining = Math.min(ENERGY_MAX, remaining + recovered);
        recoveredAt = remaining >= ENERGY_MAX ? currentTime : recoveredAt + recovered * ENERGY_RECOVERY_MS;
    }
    return { remaining, recoveredAt };
}

export function spendEnergy(state, now = Date.now(), premium = false) {
    const normalized = normalizeEnergy(state, now);
    if (premium) return { ok: true, state: normalized, bypassed: true };
    if (normalized.remaining < 1) return { ok: false, state: normalized, bypassed: false };
    return {
        ok: true,
        bypassed: false,
        state: {
            remaining: normalized.remaining - 1,
            recoveredAt: normalized.remaining >= ENERGY_MAX ? Number(now) : normalized.recoveredAt
        }
    };
}

export function grantEnergy(state, amount = 1, now = Date.now()) {
    const normalized = normalizeEnergy(state, now);
    return {
        remaining: Math.min(ENERGY_MAX, normalized.remaining + Math.max(0, Math.floor(Number(amount) || 0))),
        recoveredAt: normalized.recoveredAt
    };
}

export function applyPendingSpends(state, localCounter, acknowledgedCounter, now = Date.now()) {
    const normalized = normalizeEnergy(state, now);
    const pending = Math.max(
        0,
        Math.floor(Number(localCounter) || 0) - Math.floor(Number(acknowledgedCounter) || 0)
    );
    return {
        remaining: Math.max(0, normalized.remaining - pending),
        recoveredAt: normalized.recoveredAt
    };
}

export function nextEnergyAt(state, now = Date.now()) {
    const normalized = normalizeEnergy(state, now);
    return normalized.remaining >= ENERGY_MAX ? null : normalized.recoveredAt + ENERGY_RECOVERY_MS;
}

export function energyFullAt(state, now = Date.now()) {
    const normalized = normalizeEnergy(state, now);
    return normalized.remaining >= ENERGY_MAX
        ? null
        : normalized.recoveredAt + (ENERGY_MAX - normalized.remaining) * ENERGY_RECOVERY_MS;
}
