import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  notFoundResponse,
  rateLimitResponse,
} from '@/lib/api-response';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));

describe('API Response Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successResponse', () => {
    it('should return success response with data', async () => {
      const data = { message: 'Success' };
      const response = successResponse(data);
      const json = await response.json();

      expect(json).toEqual({
        success: true,
        data,
      });
      expect(response.status).toBe(200);
    });

    it('should accept custom status code', async () => {
      const data = { id: 123 };
      const response = successResponse(data, 201);

      expect(response.status).toBe(201);
    });

    it('should handle different data types', async () => {
      const stringData = successResponse('test');
      const arrayData = successResponse([1, 2, 3]);
      const numberData = successResponse(42);

      expect((await stringData.json()).data).toBe('test');
      expect((await arrayData.json()).data).toEqual([1, 2, 3]);
      expect((await numberData.json()).data).toBe(42);
    });
  });

  describe('errorResponse', () => {
    it('should return error response with message', async () => {
      const response = errorResponse('Something went wrong');
      const json = await response.json();

      expect(json).toEqual({
        success: false,
        error: 'Something went wrong',
      });
      expect(response.status).toBe(500);
    });

    it('should accept custom status code', async () => {
      const response = errorResponse('Bad request', 400);
      expect(response.status).toBe(400);
    });

    it('should include error code when provided', async () => {
      const response = errorResponse('Error', 400, 'INVALID_INPUT');
      const json = await response.json();

      expect(json.code).toBe('INVALID_INPUT');
    });
  });

  describe('Common Error Responses', () => {
    it('unauthorizedResponse should return 401', async () => {
      const response = unauthorizedResponse();
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.code).toBe('UNAUTHORIZED');
      expect(json.error).toContain('Unauthorized');
    });

    it('badRequestResponse should return 400', async () => {
      const response = badRequestResponse('Invalid data');
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.code).toBe('BAD_REQUEST');
      expect(json.error).toBe('Invalid data');
    });

    it('notFoundResponse should return 404', async () => {
      const response = notFoundResponse();
      const json = await response.json();

      expect(response.status).toBe(404);
      expect(json.code).toBe('NOT_FOUND');
    });

    it('notFoundResponse should accept custom message', async () => {
      const response = notFoundResponse('User not found');
      const json = await response.json();

      expect(json.error).toBe('User not found');
    });
  });

  describe('rateLimitResponse', () => {
    it('should return rate limit response with headers', async () => {
      const response = rateLimitResponse(100, 0, Date.now() + 60000);
      const json = await response.json();

      expect(response.status).toBe(429);
      expect(json.success).toBe(false);
      expect(json.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(json.limit).toBe(100);
      expect(json.remaining).toBe(0);
    });

    it('should include rate limit headers', () => {
      const limit = 100;
      const remaining = 50;
      const reset = Date.now() + 60000;

      const response = rateLimitResponse(limit, remaining, reset);

      expect(response.headers.get('X-RateLimit-Limit')).toBe('100');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('50');
      expect(response.headers.get('X-RateLimit-Reset')).toBe(reset.toString());
    });
  });
});
