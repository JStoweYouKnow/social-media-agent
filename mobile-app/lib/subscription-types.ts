/**
 * Subscription tier configuration matching web app
 */

import { SubscriptionTier, TierLimits } from './types';

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    aiGenerations: 10,
    scheduledPosts: 5,
    canvaDesigns: 0,
    customCategories: 0,
  },
  starter: {
    aiGenerations: 50,
    scheduledPosts: 25,
    canvaDesigns: 10,
    customCategories: 3,
  },
  pro: {
    aiGenerations: 200,
    scheduledPosts: 100,
    canvaDesigns: 50,
    customCategories: 10,
  },
  agency: {
    aiGenerations: Infinity,
    scheduledPosts: Infinity,
    canvaDesigns: Infinity,
    customCategories: Infinity,
  },
};

export const TIER_PRICES: Record<Exclude<SubscriptionTier, 'free'>, { monthly: number; yearly: number }> = {
  starter: {
    monthly: 19,
    yearly: 190, // ~$16/month
  },
  pro: {
    monthly: 49,
    yearly: 490, // ~$41/month
  },
  agency: {
    monthly: 149,
    yearly: 1490, // ~$124/month
  },
};

export const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    '10 AI generations per month',
    '5 scheduled posts',
    'Basic content library',
    '13 built-in content categories',
    'Single platform scheduling',
  ],
  starter: [
    '50 AI generations per month',
    '25 scheduled posts',
    'Advanced content library',
    '13 built-in + 3 custom categories',
    'Multi-platform scheduling',
    '10 Canva design generations',
    'Sentiment analysis',
    'Engagement scoring',
  ],
  pro: [
    '200 AI generations per month',
    '100 scheduled posts',
    'Unlimited content library',
    '13 built-in + 10 custom categories',
    'Advanced multi-platform scheduling',
    '50 Canva design generations',
    'Sentiment analysis',
    'Engagement scoring',
    'Weekly batch generation',
    'Trending content integration',
    'Priority support',
  ],
  agency: [
    'Unlimited AI generations',
    'Unlimited scheduled posts',
    'Unlimited content library',
    'Unlimited custom categories',
    'Advanced multi-platform scheduling',
    'Unlimited Canva design generations',
    'Sentiment analysis',
    'Engagement scoring',
    'Weekly batch generation',
    'Trending content integration',
    'White-label options',
    'Dedicated account manager',
    'API access',
  ],
};

export function getTierLimits(tier: SubscriptionTier): TierLimits {
  return TIER_LIMITS[tier];
}

export function getTierDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Professional',
    agency: 'Agency',
  };
  return names[tier];
}

export function canUseFeature(
  tier: SubscriptionTier,
  feature: 'aiGeneration' | 'scheduledPost' | 'canvaDesign' | 'customCategory',
  currentUsage: number
): boolean {
  const limits = getTierLimits(tier);

  switch (feature) {
    case 'aiGeneration':
      return currentUsage < limits.aiGenerations;
    case 'scheduledPost':
      return currentUsage < limits.scheduledPosts;
    case 'canvaDesign':
      return limits.canvaDesigns > 0 && currentUsage < limits.canvaDesigns;
    case 'customCategory':
      return limits.customCategories > 0 && currentUsage < limits.customCategories;
    default:
      return false;
  }
}

export function getUpgradeMessage(tier: SubscriptionTier, feature: string): string {
  const messages: Record<SubscriptionTier, string> = {
    free: `Upgrade to Starter to unlock ${feature} and more!`,
    starter: `Upgrade to Pro for increased ${feature} limits!`,
    pro: `Upgrade to Agency for unlimited ${feature}!`,
    agency: 'You already have the highest tier!',
  };
  return messages[tier];
}

export function getTierPrice(tier: SubscriptionTier, period: 'monthly' | 'yearly' = 'monthly'): number {
  if (tier === 'free') {
    return 0;
  }
  return TIER_PRICES[tier][period];
}
