import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

describe('API Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow authenticated requests', async () => {
    const { auth } = await import('@clerk/nextjs/server');
    vi.mocked(auth).mockResolvedValue({
      userId: 'user_123',
      sessionId: 'session_123',
      orgId: null,
      orgRole: null,
      orgSlug: null,
      has: vi.fn(),
      actor: null,
      sessionClaims: null,
      getToken: vi.fn(),
      debug: vi.fn(),
    } as any);

    const result = await requireAuth();

    expect(result.userId).toBe('user_123');
    expect(result.error).toBe(null);
  });

  it('should reject unauthenticated requests', async () => {
    const { auth } = await import('@clerk/nextjs/server');
    vi.mocked(auth).mockResolvedValue({
      userId: null,
      sessionId: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      has: vi.fn(),
      actor: null,
      sessionClaims: null,
      getToken: vi.fn(),
      debug: vi.fn(),
    } as any);

    const result = await requireAuth();

    expect(result.userId).toBeNull();
    expect(result.error).toBeDefined();
    expect(result.error).toBeInstanceOf(NextResponse);
  });
});
