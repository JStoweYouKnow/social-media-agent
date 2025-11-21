import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimiter, trackUsage, getUsage, canUseFeature } from '@/lib/rate-limit';

describe('RateLimiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter({
      interval: 1000, // 1 second
      uniqueTokenPerInterval: 3, // 3 requests per second
    });
  });

  it('should allow requests within limit', async () => {
    const token = 'test-user-1';

    const result1 = await limiter.check(token);
    expect(result1.success).toBe(true);
    expect(result1.remaining).toBe(2);

    const result2 = await limiter.check(token);
    expect(result2.success).toBe(true);
    expect(result2.remaining).toBe(1);

    const result3 = await limiter.check(token);
    expect(result3.success).toBe(true);
    expect(result3.remaining).toBe(0);
  });

  it('should block requests exceeding limit', async () => {
    const token = 'test-user-2';

    // Use up the limit
    await limiter.check(token);
    await limiter.check(token);
    await limiter.check(token);

    // This should be blocked
    const result = await limiter.check(token);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('should track different tokens separately', async () => {
    const result1 = await limiter.check('user-1');
    const result2 = await limiter.check('user-2');

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    expect(result1.remaining).toBe(2);
    expect(result2.remaining).toBe(2);
  });

  it('should provide reset timestamp', async () => {
    const result = await limiter.check('test-user-3');
    expect(result.reset).toBeGreaterThan(Date.now());
  });

  describe('Usage Tracking', () => {
    it('should track usage for a user', () => {
      const userId = 'user_test';
      const metric = 'aiGenerations';

      trackUsage(userId, metric, 1);
      const usage = getUsage(userId, metric);

      expect(usage).toBeGreaterThanOrEqual(1);
    });

    it('should increment usage correctly', () => {
      const userId = 'user_test2';
      const metric = 'aiGenerations';

      trackUsage(userId, metric, 1);
      trackUsage(userId, metric, 1);
      const usage = getUsage(userId, metric);

      expect(usage).toBeGreaterThanOrEqual(2);
    });

    it('should track different metrics separately', () => {
      const userId = 'user_test3';

      trackUsage(userId, 'aiGenerations', 5);
      trackUsage(userId, 'scheduledPosts', 3);

      expect(getUsage(userId, 'aiGenerations')).toBeGreaterThanOrEqual(5);
      expect(getUsage(userId, 'scheduledPosts')).toBeGreaterThanOrEqual(3);
    });

    it('should return 0 for unused metrics', () => {
      const userId = 'user_test4';
      const usage = getUsage(userId, 'aiGenerations');

      expect(usage).toBe(0);
    });
  });

  describe('canUseFeature', () => {
    it('should allow feature usage when under limit', () => {
      const result = canUseFeature('user_test5', 'FREE', 'aiGenerations');

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(5);
    });

    it('should allow unlimited features on AGENCY tier', () => {
      const result = canUseFeature('user_test6', 'AGENCY', 'aiGenerations');

      expect(result.allowed).toBe(true);
      expect(result.limit).toBe(Infinity);
    });

    it('should handle boolean feature limits', () => {
      const result1 = canUseFeature('user_test7', 'FREE', 'canExport');
      expect(result1.allowed).toBe(false);
      expect(result1.limit).toBe(false);

      const result2 = canUseFeature('user_test8', 'PRO', 'canExport');
      expect(result2.allowed).toBe(true);
      expect(result2.limit).toBe(true);
    });
  });
});
