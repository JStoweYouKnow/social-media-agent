/**
 * Shared subscription types and utilities
 * Used by both web and mobile apps
 */

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'agency';

export interface UserSubscription {
  _id?: string;
  userId: string;
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  priceId?: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface UsageTracking {
  userId: string;
  aiGenerations: number;
  periodStart: number;
  periodEnd: number;
}

export interface TierLimits {
  aiGenerations: number;
  platforms: number;
  canExport: boolean;
  canvaIntegration: boolean;
  teamMembers: number;
  apiAccess: boolean;
}

/**
 * Get usage limits for a tier
 */
export function getTierLimits(tier: SubscriptionTier): TierLimits {
  const limits: Record<SubscriptionTier, TierLimits> = {
    free: {
      aiGenerations: 5,
      platforms: 1,
      canExport: false,
      canvaIntegration: false,
      teamMembers: 1,
      apiAccess: false,
    },
    starter: {
      aiGenerations: 50,
      platforms: 3,
      canExport: true,
      canvaIntegration: false,
      teamMembers: 1,
      apiAccess: false,
    },
    pro: {
      aiGenerations: 200,
      platforms: Infinity,
      canExport: true,
      canvaIntegration: true,
      teamMembers: 3,
      apiAccess: false,
    },
    agency: {
      aiGenerations: Infinity,
      platforms: Infinity,
      canExport: true,
      canvaIntegration: true,
      teamMembers: 10,
      apiAccess: true,
    },
  };

  return limits[tier];
}

/**
 * Get tier from Stripe price ID
 */
export function getTierFromPriceId(priceId: string): SubscriptionTier {
  // These should match your Stripe price IDs
  const STRIPE_STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID;
  const STRIPE_PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;
  const STRIPE_AGENCY_PRICE_ID = process.env.STRIPE_AGENCY_PRICE_ID;

  if (priceId === STRIPE_STARTER_PRICE_ID) return 'starter';
  if (priceId === STRIPE_PRO_PRICE_ID) return 'pro';
  if (priceId === STRIPE_AGENCY_PRICE_ID) return 'agency';

  return 'free';
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
    agency: 'Agency',
  };
  return names[tier];
}

/**
 * Get tier price (monthly)
 */
export function getTierPrice(tier: SubscriptionTier): number {
  const prices: Record<SubscriptionTier, number> = {
    free: 0,
    starter: 19,
    pro: 49,
    agency: 149,
  };
  return prices[tier];
}

/**
 * Check if usage is at risk of hitting limit
 */
export function isUsageAtRisk(usage: number, limit: number): boolean {
  if (limit === Infinity) return false;
  return usage >= limit * 0.8; // 80% threshold
}

/**
 * Check if usage exceeded limit
 */
export function isUsageExceeded(usage: number, limit: number): boolean {
  if (limit === Infinity) return false;
  return usage >= limit;
}

/**
 * Calculate usage percentage
 */
export function getUsagePercentage(usage: number, limit: number): number {
  if (limit === Infinity) return 0;
  return Math.min((usage / limit) * 100, 100);
}
