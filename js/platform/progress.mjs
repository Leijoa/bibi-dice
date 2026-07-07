const COLLECTION_BUCKETS = ['hands', 'relics', 'shackles'];

function asObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function finiteNonNegative(value) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function uniqueStrings(value) {
    return [...new Set(Array.isArray(value) ? value.filter(item => typeof item === 'string') : [])];
}

export function calculateSoulUpgradeCost(upgrades, upgradeDefinitions, freeMythicVesselLevels = 0) {
    const levels = asObject(upgrades);
    return Object.values(asObject(upgradeDefinitions)).reduce((total, definition) => {
        const level = Math.max(0, Math.min(Number(definition.max) || 0, Number(levels[definition.id]) || 0));
        const freeLevels = definition.id === 'mythicVessel'
            ? Math.max(0, Math.min(level, Number(freeMythicVesselLevels) || 0))
            : 0;
        for (let index = freeLevels; index < level; index++) {
            total += finiteNonNegative(definition.costs?.[index]);
        }
        return total;
    }, 0);
}

export function normalizeSoulLedger(meta, originId, upgradeDefinitions) {
    const normalizedMeta = asObject(meta);
    const safeOriginId = typeof originId === 'string' && originId ? originId : 'local';
    const ledger = Object.fromEntries(
        Object.entries(asObject(normalizedMeta.soulEarnedByOrigin))
            .filter(([key]) => key)
            .map(([key, value]) => [key, finiteNonNegative(value)])
    );
    const spent = calculateSoulUpgradeCost(
        normalizedMeta.upgrades,
        upgradeDefinitions,
        normalizedMeta.freeMythicVesselLevels
    );

    if (Number(normalizedMeta.soulLedgerVersion) < 1 || Object.keys(ledger).length === 0) {
        ledger[safeOriginId] = finiteNonNegative(normalizedMeta.souls) + spent;
    } else {
        const expectedBalance = Math.max(0, Object.values(ledger).reduce((sum, value) => sum + value, 0) - spent);
        const displayedBalance = finiteNonNegative(normalizedMeta.souls);
        if (displayedBalance > expectedBalance) {
            ledger[safeOriginId] = finiteNonNegative(ledger[safeOriginId]) + displayedBalance - expectedBalance;
        }
    }

    normalizedMeta.soulLedgerVersion = 1;
    normalizedMeta.soulEarnedByOrigin = ledger;
    normalizedMeta.souls = Math.max(0, Object.values(ledger).reduce((sum, value) => sum + value, 0) - spent);
    return normalizedMeta;
}

export function createSharedProgress(meta, collection, originId, upgradeDefinitions) {
    const normalizedMeta = normalizeSoulLedger(meta, originId, upgradeDefinitions);
    const safeCollection = asObject(collection);
    return {
        version: 1,
        soulEarnedByOrigin: { ...normalizedMeta.soulEarnedByOrigin },
        upgrades: { ...asObject(normalizedMeta.upgrades) },
        freeMythicVesselLevels: finiteNonNegative(normalizedMeta.freeMythicVesselLevels),
        collection: Object.fromEntries(COLLECTION_BUCKETS.map(bucket => [bucket, uniqueStrings(safeCollection[bucket])])),
        stats: {
            highestDamage: finiteNonNegative(normalizedMeta.stats?.highestDamage),
            highestDamageCombo: typeof normalizedMeta.stats?.highestDamageCombo === 'string'
                ? normalizedMeta.stats.highestDamageCombo
                : '',
            highestDamageRelics: uniqueStrings(normalizedMeta.stats?.highestDamageRelics),
            highestMulti: finiteNonNegative(normalizedMeta.stats?.highestMulti),
            highestInfiniteLevel: finiteNonNegative(normalizedMeta.stats?.highestInfiniteLevel)
        }
    };
}

function mergeRecord(leftStats, rightStats, metric, companionFields) {
    const leftValue = finiteNonNegative(leftStats[metric]);
    const rightValue = finiteNonNegative(rightStats[metric]);
    const winner = rightValue > leftValue ? rightStats : leftStats;
    return {
        [metric]: Math.max(leftValue, rightValue),
        ...Object.fromEntries(companionFields.map(field => [field, winner[field]]))
    };
}

export function mergeSharedProgress(left, right, upgradeDefinitions) {
    const a = asObject(left);
    const b = asObject(right);
    const upgradeIds = new Set([
        ...Object.keys(asObject(upgradeDefinitions)),
        ...Object.keys(asObject(a.upgrades)),
        ...Object.keys(asObject(b.upgrades))
    ]);
    const upgrades = {};
    for (const id of upgradeIds) {
        const maximum = Number(asObject(upgradeDefinitions)[id]?.max);
        const merged = Math.max(finiteNonNegative(a.upgrades?.[id]), finiteNonNegative(b.upgrades?.[id]));
        upgrades[id] = Number.isFinite(maximum) ? Math.min(maximum, merged) : merged;
    }

    const origins = new Set([
        ...Object.keys(asObject(a.soulEarnedByOrigin)),
        ...Object.keys(asObject(b.soulEarnedByOrigin))
    ]);
    const soulEarnedByOrigin = {};
    for (const origin of origins) {
        soulEarnedByOrigin[origin] = Math.max(
            finiteNonNegative(a.soulEarnedByOrigin?.[origin]),
            finiteNonNegative(b.soulEarnedByOrigin?.[origin])
        );
    }

    const damageRecord = mergeRecord(
        asObject(a.stats),
        asObject(b.stats),
        'highestDamage',
        ['highestDamageCombo', 'highestDamageRelics']
    );
    return {
        version: 1,
        soulEarnedByOrigin,
        upgrades,
        freeMythicVesselLevels: Math.max(
            finiteNonNegative(a.freeMythicVesselLevels),
            finiteNonNegative(b.freeMythicVesselLevels)
        ),
        collection: Object.fromEntries(COLLECTION_BUCKETS.map(bucket => [
            bucket,
            uniqueStrings([...(a.collection?.[bucket] || []), ...(b.collection?.[bucket] || [])])
        ])),
        stats: {
            ...damageRecord,
            highestMulti: Math.max(finiteNonNegative(a.stats?.highestMulti), finiteNonNegative(b.stats?.highestMulti)),
            highestInfiniteLevel: Math.max(
                finiteNonNegative(a.stats?.highestInfiniteLevel),
                finiteNonNegative(b.stats?.highestInfiniteLevel)
            )
        }
    };
}

export function applySharedProgress(meta, collection, sharedProgress, originId, upgradeDefinitions) {
    const safeMeta = asObject(meta);
    const safeCollection = asObject(collection);
    const localShared = createSharedProgress(safeMeta, safeCollection, originId, upgradeDefinitions);
    const merged = mergeSharedProgress(localShared, sharedProgress, upgradeDefinitions);

    safeMeta.upgrades = { ...asObject(safeMeta.upgrades), ...merged.upgrades };
    safeMeta.freeMythicVesselLevels = merged.freeMythicVesselLevels;
    safeMeta.soulEarnedByOrigin = merged.soulEarnedByOrigin;
    safeMeta.soulLedgerVersion = 1;
    safeMeta.stats = { ...asObject(safeMeta.stats), ...merged.stats };
    normalizeSoulLedger(safeMeta, originId, upgradeDefinitions);

    safeCollection.newItems = asObject(safeCollection.newItems);
    for (const bucket of COLLECTION_BUCKETS) {
        safeCollection[bucket] = merged.collection[bucket];
        safeCollection.newItems[bucket] = uniqueStrings(safeCollection.newItems[bucket])
            .filter(id => safeCollection[bucket].includes(id));
    }
    return { meta: safeMeta, collection: safeCollection, shared: merged };
}
