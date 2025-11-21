import { describe, it, expect } from 'vitest';
import {
  getTierLimits,
  canPerformAction,
  getUpgradeMessage,
  PRICING_TIERS
} from '@/lib/pricing';

describe('Pricing Utilities', () => {
  describe('getTierLimits', () => {
    it('should return correct limits for FREE tier', () => {
      const limits = getTierLimits('FREE');
      expect(limits.aiGenerations).toBe(5);
      expect(limits.platforms).toBe(1);
      expect(limits.canExport).toBe(false);
    });

    it('should return correct limits for STARTER tier', () => {
      const limits = getTierLimits('STARTER');
      expect(limits.aiGenerations).toBe(50);
      expect(limits.platforms).toBe(3);
      expect(limits.canExport).toBe(true);
    });

    it('should return correct limits for PRO tier', () => {
      const limits = getTierLimits('PRO');
      expect(limits.aiGenerations).toBe(200);
      expect(limits.platforms).toBe(Infinity);
      expect(limits.canvaIntegration).toBe(true);
    });

    it('should return correct limits for AGENCY tier', () => {
      const limits = getTierLimits('AGENCY');
      expect(limits.aiGenerations).toBe(Infinity);
      expect(limits.platforms).toBe(Infinity);
      expect(limits.apiAccess).toBe(true);
      expect(limits.whiteLabel).toBe(true);
    });
  });

  describe('canPerformAction', () => {
    it('should allow action when under limit', () => {
      const result = canPerformAction('FREE', 'aiGenerations', 3);
      expect(result).toBe(true);
    });

    it('should deny action when at limit', () => {
      const result = canPerformAction('FREE', 'aiGenerations', 5);
      expect(result).toBe(false);
    });

    it('should deny action when over limit', () => {
      const result = canPerformAction('FREE', 'aiGenerations', 10);
      expect(result).toBe(false);
    });

    it('should always allow action for Infinity limit', () => {
      const result = canPerformAction('AGENCY', 'aiGenerations', 999999);
      expect(result).toBe(true);
    });

    it('should handle boolean limits - true', () => {
      const result = canPerformAction('PRO', 'canvaIntegration', 0);
      expect(result).toBe(true);
    });

    it('should handle boolean limits - false', () => {
      const result = canPerformAction('FREE', 'canExport', 0);
      expect(result).toBe(false);
    });
  });

  describe('getUpgradeMessage', () => {
    it('should return correct message for FREE tier', () => {
      const message = getUpgradeMessage('FREE');
      expect(message).toContain('Starter');
    });

    it('should return correct message for STARTER tier', () => {
      const message = getUpgradeMessage('STARTER');
      expect(message).toContain('Pro');
    });

    it('should return correct message for PRO tier', () => {
      const message = getUpgradeMessage('PRO');
      expect(message).toContain('Agency');
    });

    it('should return correct message for AGENCY tier', () => {
      const message = getUpgradeMessage('AGENCY');
      expect(message).toContain('highest tier');
    });
  });

  describe('PRICING_TIERS structure', () => {
    it('should have all required tiers', () => {
      expect(PRICING_TIERS).toHaveProperty('FREE');
      expect(PRICING_TIERS).toHaveProperty('STARTER');
      expect(PRICING_TIERS).toHaveProperty('PRO');
      expect(PRICING_TIERS).toHaveProperty('AGENCY');
    });

    it('should have increasing prices', () => {
      expect(PRICING_TIERS.FREE.price).toBe(0);
      expect(PRICING_TIERS.STARTER.price).toBeGreaterThan(PRICING_TIERS.FREE.price);
      expect(PRICING_TIERS.PRO.price).toBeGreaterThan(PRICING_TIERS.STARTER.price);
      expect(PRICING_TIERS.AGENCY.price).toBeGreaterThan(PRICING_TIERS.PRO.price);
    });

    it('should have PRO marked as popular', () => {
      expect(PRICING_TIERS.PRO.popular).toBe(true);
    });
  });
});
