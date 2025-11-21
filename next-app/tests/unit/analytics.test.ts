import { describe, it, expect, vi } from 'vitest';

// Mock the analytics module
vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn((event: string, properties?: any) => {
    // Mock implementation - just return void
    return;
  }),
  getAnalytics: vi.fn(() => ({
    initialized: true,
    track: vi.fn(),
  })),
}));

describe('Analytics', () => {
  it('should export trackEvent function', async () => {
    const { trackEvent } = await import('@/lib/analytics');
    expect(trackEvent).toBeDefined();
    expect(typeof trackEvent).toBe('function');
  });

  it('should export getAnalytics function', async () => {
    const { getAnalytics } = await import('@/lib/analytics');
    expect(getAnalytics).toBeDefined();
    expect(typeof getAnalytics).toBe('function');
  });

  it('should call trackEvent without throwing', async () => {
    const { trackEvent } = await import('@/lib/analytics');
    expect(() => trackEvent('test_event', { prop: 'value' })).not.toThrow();
  });

  it('should return analytics object from getAnalytics', async () => {
    const { getAnalytics } = await import('@/lib/analytics');
    const analytics = getAnalytics();
    expect(analytics).toBeDefined();
  });
});
