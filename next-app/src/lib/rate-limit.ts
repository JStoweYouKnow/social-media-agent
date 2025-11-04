import { NextResponse } from 'next/server';
import { PricingTierId, getTierLimits } from './pricing';

// In-memory rate limiting (for production, use Redis or similar)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}, 60 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // in milliseconds
  uniqueTokenPerInterval: number; // max requests per interval
}

export class RateLimiter {
  config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = {
      interval: 60 * 1000, // 1 minute default
      uniqueTokenPerInterval: 10, // 10 requests per minute default
      ...config,
    };
  }

  async check(token: string): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }> {
    const now = Date.now();
    const key = `${token}:${Math.floor(now / this.config.interval)}`;

    if (!store[key]) {
      store[key] = {
        count: 0,
        resetAt: now + this.config.interval,
      };
    }

    const data = store[key];
    const success = data.count < this.config.uniqueTokenPerInterval;

    if (success) {
      data.count += 1;
    }

    return {
      success,
      limit: this.config.uniqueTokenPerInterval,
      remaining: Math.max(0, this.config.uniqueTokenPerInterval - data.count),
      reset: data.resetAt,
    };
  }
}

// Usage tracking for monetization
interface UsageStore {
  [userId: string]: {
    [key: string]: number; // key: 'aiGenerations:2024-01', value: count
  };
}

const usageStore: UsageStore = {};

export function trackUsage(
  userId: string,
  metric: string,
  amount: number = 1
): void {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const key = `${metric}:${monthKey}`;

  if (!usageStore[userId]) {
    usageStore[userId] = {};
  }

  usageStore[userId][key] = (usageStore[userId][key] || 0) + amount;
}

export function getUsage(userId: string, metric: string): number {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const key = `${metric}:${monthKey}`;

  return usageStore[userId]?.[key] || 0;
}

export function canUseFeature(
  userId: string,
  userTier: PricingTierId,
  metric: keyof ReturnType<typeof getTierLimits>
): {
  allowed: boolean;
  usage: number;
  limit: number | boolean;
  message?: string;
} {
  const limits = getTierLimits(userTier);
  const limit = limits[metric];

  // Boolean limits (features)
  if (typeof limit === 'boolean') {
    return {
      allowed: limit,
      usage: 0,
      limit,
      message: limit ? undefined : 'This feature is not available in your plan',
    };
  }

  // Numeric limits
  if (limit === Infinity) {
    return {
      allowed: true,
      usage: 0,
      limit: Infinity,
    };
  }

  const usage = getUsage(userId, metric as string);
  const allowed = usage < (limit as number);

  return {
    allowed,
    usage,
    limit,
    message: allowed
      ? undefined
      : `You've reached your monthly limit of ${limit} ${metric}. Upgrade to continue.`,
  };
}

// Middleware helper for API routes
export async function checkRateLimit(
  request: Request,
  identifier: string,
  config?: Partial<RateLimitConfig>
) {
  const limiter = new RateLimiter(config);
  const result = await limiter.check(identifier);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
        },
      }
    );
  }

  return null; // No error, continue
}
