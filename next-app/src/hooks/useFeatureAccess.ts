'use client';

import { useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { PricingTierId, canPerformAction, getTierLimits } from '@/lib/pricing';
import { trackLimitReached } from '@/lib/analytics';

export function useFeatureAccess() {
  const { user } = useUser();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const userTier = (user?.publicMetadata?.tier as PricingTierId) || 'FREE';
  const limits = getTierLimits(userTier);

  const checkFeatureAccess = useCallback(
    (
      feature: keyof typeof limits,
      currentUsage: number
    ): { allowed: boolean; message?: string } => {
      const allowed = canPerformAction(userTier, feature, currentUsage);

      if (!allowed) {
        trackLimitReached(feature as string, userTier, user?.id);

        return {
          allowed: false,
          message: `You've reached your ${feature} limit. Upgrade to continue.`,
        };
      }

      return { allowed: true };
    },
    [userTier, user?.id, limits]
  );

  const promptUpgrade = useCallback((reason: string) => {
    setShowUpgradeModal(true);
    console.log('Upgrade prompted:', reason);
  }, []);

  const closeUpgradeModal = useCallback(() => {
    setShowUpgradeModal(false);
  }, []);

  const upgradeNow = useCallback(() => {
    window.location.href = '/pricing';
  }, []);

  return {
    userTier,
    limits,
    checkFeatureAccess,
    promptUpgrade,
    showUpgradeModal,
    closeUpgradeModal,
    upgradeNow,
  };
}
