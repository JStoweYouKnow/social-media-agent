/**
 * Subscription Management
 *
 * This module handles user subscription state and tier management.
 *
 * IMPORTANT: This is a basic implementation that stores data in memory.
 * For production, you MUST replace this with a real database:
 * - Option 1: Use Convex (already configured in your app)
 * - Option 2: Use Supabase, Firebase, or PostgreSQL
 * - Option 3: Use Prisma with any SQL database
 */

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'agency';

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  priceId?: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageTracking {
  userId: string;
  aiGenerations: number;
  periodStart: Date;
  periodEnd: Date;
}

// IN-MEMORY STORAGE - REPLACE WITH DATABASE IN PRODUCTION
const subscriptions = new Map<string, UserSubscription>();
const usage = new Map<string, UsageTracking>();

/**
 * Get user subscription by userId
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  let subscription = subscriptions.get(userId);

  if (!subscription) {
    // Create default free tier subscription
    subscription = {
      userId,
      tier: 'free',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    subscriptions.set(userId, subscription);
  }

  return subscription;
}

/**
 * Get user subscription by Stripe customer ID
 */
export async function getSubscriptionByCustomerId(customerId: string): Promise<UserSubscription | null> {
  for (const subscription of subscriptions.values()) {
    if (subscription.stripeCustomerId === customerId) {
      return subscription;
    }
  }
  return null;
}

/**
 * Get user subscription by Stripe subscription ID
 */
export async function getSubscriptionBySubscriptionId(subscriptionId: string): Promise<UserSubscription | null> {
  for (const subscription of subscriptions.values()) {
    if (subscription.stripeSubscriptionId === subscriptionId) {
      return subscription;
    }
  }
  return null;
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
  const existing = await getUserSubscription(data.userId);

  const updated: UserSubscription = {
    ...existing,
    ...data,
    updatedAt: new Date(),
  };

  subscriptions.set(data.userId, updated);
  return updated;
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
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let userUsage = usage.get(userId);

  if (!userUsage || userUsage.periodStart < periodStart) {
    // Reset usage for new period
    userUsage = {
      userId,
      aiGenerations: 0,
      periodStart,
      periodEnd,
    };
  }

  if (type === 'aiGenerations') {
    userUsage.aiGenerations += count;
  }

  usage.set(userId, userUsage);
}

/**
 * Get current usage for a user
 */
export async function getUserUsage(userId: string): Promise<UsageTracking> {
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let userUsage = usage.get(userId);

  if (!userUsage || userUsage.periodStart < periodStart) {
    // Return fresh usage for current period
    userUsage = {
      userId,
      aiGenerations: 0,
      periodStart,
      periodEnd,
    };
    usage.set(userId, userUsage);
  }

  return userUsage;
}

/**
 * Check if user can perform an action based on their tier and usage
 */
export async function canPerformAction(userId: string, action: 'aiGenerations'): Promise<{ allowed: boolean; message?: string }> {
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
 * Reset usage for testing (DEV ONLY)
 */
export async function resetUsage(userId: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot reset usage in production');
  }
  usage.delete(userId);
}
