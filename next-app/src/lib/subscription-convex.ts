/**
 * Subscription Management with Convex
 *
 * This version uses Convex for persistent storage instead of in-memory Maps.
 * To use this, replace imports in your webhook handler:
 *
 * FROM: import { ... } from '@/lib/subscription';
 * TO:   import { ... } from '@/lib/subscription-convex';
 */

import { api } from "../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

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

// Initialize Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.warn('NEXT_PUBLIC_CONVEX_URL not set - subscription features will not work');
}
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

/**
 * Get user subscription by userId
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  if (!convex) {
    throw new Error('Convex not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }

  const subscription = await convex.query(api.subscriptions.getUserSubscription, { userId });
  return subscription as UserSubscription;
}

/**
 * Get user subscription by Stripe customer ID
 */
export async function getSubscriptionByCustomerId(customerId: string): Promise<UserSubscription | null> {
  if (!convex) {
    throw new Error('Convex not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }

  const subscription = await convex.query(api.subscriptions.getSubscriptionByCustomerId, { customerId });
  return subscription as UserSubscription | null;
}

/**
 * Get user subscription by Stripe subscription ID
 */
export async function getSubscriptionBySubscriptionId(subscriptionId: string): Promise<UserSubscription | null> {
  if (!convex) {
    throw new Error('Convex not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }

  const subscription = await convex.query(api.subscriptions.getSubscriptionBySubscriptionId, { subscriptionId });
  return subscription as UserSubscription | null;
}

/**
 * Create or update user subscription
 */
export async function updateUserSubscription(data: {
  userId: string;
  tier?: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  priceId?: string;
  status?: UserSubscription['status'];
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
}): Promise<UserSubscription> {
  if (!convex) {
    throw new Error('Convex not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }

  // Convert Date to timestamp if needed
  const updateData = {
    ...data,
    currentPeriodEnd: data.currentPeriodEnd?.getTime(),
  };

  const subscription = await convex.mutation(api.subscriptions.updateUserSubscription, updateData);
  return subscription as UserSubscription;
}

/**
 * Get tier from Stripe price ID
 */
export function getTierFromPriceId(priceId: string): SubscriptionTier {
  const starterPriceId = process.env.STRIPE_STARTER_PRICE_ID;
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
  const agencyPriceId = process.env.STRIPE_AGENCY_PRICE_ID;

  if (priceId === starterPriceId) return 'starter';
  if (priceId === proPriceId) return 'pro';
  if (priceId === agencyPriceId) return 'agency';

  return 'free';
}

/**
 * Get usage limits for a tier
 */
export function getTierLimits(tier: SubscriptionTier) {
  const limits = {
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
 * Track usage for a user
 */
export async function trackUsage(userId: string, type: 'aiGenerations', count: number = 1): Promise<void> {
  if (!convex) {
    throw new Error('Convex not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }

  await convex.mutation(api.subscriptions.trackUsage, { userId, type, count });
}

/**
 * Get current usage for a user
 */
export async function getUserUsage(userId: string): Promise<UsageTracking> {
  if (!convex) {
    throw new Error('Convex not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }

  const usage = await convex.query(api.subscriptions.getUserUsage, { userId });
  return usage as UsageTracking;
}

/**
 * Check if user can perform an action based on their tier and usage
 */
export async function canPerformAction(userId: string, action: 'aiGenerations'): Promise<{ allowed: boolean; message?: string }> {
  if (!convex) {
    throw new Error('Convex not configured. Set NEXT_PUBLIC_CONVEX_URL');
  }

  const subscription = await getUserSubscription(userId);
  const limits = getTierLimits(subscription.tier);
  const currentUsage = await getUserUsage(userId);

  if (action === 'aiGenerations') {
    if (limits.aiGenerations === Infinity) {
      return { allowed: true };
    }

    if (currentUsage.aiGenerations >= limits.aiGenerations) {
      return {
        allowed: false,
        message: `You've reached your monthly limit of ${limits.aiGenerations} AI generations. Upgrade to generate more.`,
      };
    }

    return { allowed: true };
  }

  return { allowed: false, message: 'Unknown action' };
}

/**
 * Track analytics event
 */
export async function trackAnalytics(userId: string, event: string, properties?: any): Promise<void> {
  if (!convex) {
    return; // Silently fail if Convex not configured
  }

  try {
    await convex.mutation(api.subscriptions.trackAnalytics, { userId, event, properties });
  } catch (error) {
    console.error('Failed to track analytics:', error);
  }
}
