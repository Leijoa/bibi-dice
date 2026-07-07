export async function performRewardedAction({ premium = false, showAd, onReward }) {
    if (premium) {
        await onReward();
        return { ok: true, bypassed: true };
    }
    try {
        const result = await showAd();
        if (!result?.rewarded) return { ok: false, bypassed: false, reason: result?.reason || 'not_rewarded' };
        await onReward();
        return { ok: true, bypassed: false };
    } catch (error) {
        return { ok: false, bypassed: false, reason: error?.message || 'ad_failed' };
    }
}

export function getShopRerollAccess({ isMobile, premium, rerollsUsed, rerollLimit }) {
    const used = Math.max(0, Number(rerollsUsed) || 0);
    const limit = Math.max(0, Number(rerollLimit) || 0);
    if (used >= limit) return { allowed: false, requiresAd: false };
    const nextReroll = used + 1;
    return {
        allowed: true,
        requiresAd: Boolean(isMobile && !premium && nextReroll === limit)
    };
}
