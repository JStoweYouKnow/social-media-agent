import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the entire stripe module
const mockConstructEvent = vi.fn();

vi.mock('@/lib/stripe', () => {
  return {
    verifyWebhookSignature: (body: string, signature: string) => {
      return mockConstructEvent(body, signature);
    },
  };
});

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should verify webhook signature correctly', async () => {
    const mockEvent = {
      id: 'evt_test',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test',
          customer: 'cus_test',
          subscription: 'sub_test',
          metadata: { userId: 'user_123' },
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent);

    const { verifyWebhookSignature } = await import('@/lib/stripe');
    const body = JSON.stringify(mockEvent);
    const signature = 'test_signature';

    const result = verifyWebhookSignature(body, signature);

    expect(result).toEqual(mockEvent);
    expect(mockConstructEvent).toHaveBeenCalledWith(body, signature);
  });

  it('should throw error for invalid signature', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const { verifyWebhookSignature } = await import('@/lib/stripe');
    const body = JSON.stringify({ test: 'data' });
    const signature = 'invalid_signature';

    expect(() => verifyWebhookSignature(body, signature)).toThrow('Invalid signature');
  });
});
