import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorResponse } from '@/lib/api-response';

// Mock Sentry
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));

describe('API Response Sentry Integration', () => {
  const originalSentryDsn = process.env.SENTRY_DSN;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SENTRY_DSN = 'https://test@sentry.io/test';
  });

  afterEach(() => {
    process.env.SENTRY_DSN = originalSentryDsn;
  });

  describe('Error Response Sentry Logging', () => {
    it('should log 5xx errors to Sentry', async () => {
      const Sentry = await import('@sentry/nextjs');

      errorResponse('Internal server error', 500, 'SERVER_ERROR');

      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        'Internal server error',
        expect.objectContaining({
          level: 'error',
          tags: expect.objectContaining({
            errorCode: 'SERVER_ERROR',
            httpStatus: 500,
          }),
        })
      );
    });

    it('should log exceptions to Sentry when error object provided', async () => {
      const Sentry = await import('@sentry/nextjs');
      const testError = new Error('Database connection failed');

      errorResponse('Failed to connect', 500, 'DB_ERROR', testError);

      expect(Sentry.captureException).toHaveBeenCalledWith(
        testError,
        expect.objectContaining({
          tags: expect.objectContaining({
            errorCode: 'DB_ERROR',
            httpStatus: 500,
          }),
          extra: expect.objectContaining({
            message: 'Failed to connect',
          }),
        })
      );
    });

    it('should not log 4xx errors to Sentry by default', async () => {
      const Sentry = await import('@sentry/nextjs');

      errorResponse('Bad request', 400, 'BAD_REQUEST');

      expect(Sentry.captureException).not.toHaveBeenCalled();
      expect(Sentry.captureMessage).not.toHaveBeenCalled();
    });

    it('should log 4xx errors with error object to Sentry', async () => {
      const Sentry = await import('@sentry/nextjs');
      const testError = new Error('Validation failed');

      errorResponse('Invalid input', 400, 'VALIDATION_ERROR', testError);

      expect(Sentry.captureException).toHaveBeenCalledWith(
        testError,
        expect.any(Object)
      );
    });

    it('should include error code in Sentry tags', async () => {
      const Sentry = await import('@sentry/nextjs');

      errorResponse('Service unavailable', 503, 'SERVICE_DOWN');

      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          tags: expect.objectContaining({
            errorCode: 'SERVICE_DOWN',
          }),
        })
      );
    });

    it('should include HTTP status in Sentry tags', async () => {
      const Sentry = await import('@sentry/nextjs');

      errorResponse('Gateway timeout', 504, 'TIMEOUT');

      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          tags: expect.objectContaining({
            httpStatus: 504,
          }),
        })
      );
    });

    it('should handle non-Error objects in error parameter', async () => {
      const Sentry = await import('@sentry/nextjs');

      errorResponse('Something failed', 500, 'UNKNOWN', 'string error');

      expect(Sentry.captureMessage).toHaveBeenCalledWith(
        'Something failed',
        expect.objectContaining({
          extra: expect.objectContaining({
            error: 'string error',
          }),
        })
      );
    });

    it('should use UNKNOWN_ERROR code when none provided', async () => {
      const Sentry = await import('@sentry/nextjs');
      const testError = new Error('Unexpected error');

      errorResponse('Failed', 500, undefined, testError);

      expect(Sentry.captureException).toHaveBeenCalledWith(
        testError,
        expect.objectContaining({
          tags: expect.objectContaining({
            errorCode: 'UNKNOWN_ERROR',
          }),
        })
      );
    });

    it('should not log when SENTRY_DSN is not set', async () => {
      delete process.env.SENTRY_DSN;
      const Sentry = await import('@sentry/nextjs');

      errorResponse('Error without Sentry', 500, 'NO_SENTRY');

      expect(Sentry.captureException).not.toHaveBeenCalled();
      expect(Sentry.captureMessage).not.toHaveBeenCalled();
    });

    it('should return proper error response structure', async () => {
      const response = errorResponse('Test error', 500, 'TEST_CODE');
      const data = await response.json();

      expect(data).toEqual({
        success: false,
        error: 'Test error',
        code: 'TEST_CODE',
      });
      expect(response.status).toBe(500);
    });

    it('should handle multiple error types correctly', async () => {
      const Sentry = await import('@sentry/nextjs');

      // 500 error with Error object
      errorResponse('Server error 1', 500, 'ERR1', new Error('Error 1'));
      expect(Sentry.captureException).toHaveBeenCalledTimes(1);

      vi.clearAllMocks();

      // 503 error with string
      errorResponse('Server error 2', 503, 'ERR2', 'String error');
      expect(Sentry.captureMessage).toHaveBeenCalledTimes(1);

      vi.clearAllMocks();

      // 500 error without error object
      errorResponse('Server error 3', 500, 'ERR3');
      expect(Sentry.captureMessage).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Response without Sentry', () => {
    beforeEach(() => {
      delete process.env.SENTRY_DSN;
    });

    it('should still return proper response when Sentry is disabled', async () => {
      const response = errorResponse('Error', 500, 'CODE');
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toBe('Error');
      expect(data.code).toBe('CODE');
    });

    it('should handle all status codes without Sentry', async () => {
      const response400 = errorResponse('Bad request', 400);
      const response500 = errorResponse('Server error', 500);

      expect(response400.status).toBe(400);
      expect(response500.status).toBe(500);
    });
  });
});
