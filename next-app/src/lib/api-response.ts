import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

/**
 * Standardized API response helpers
 * Use these for consistent error/success responses across all routes
 */

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export function successResponse<T>(data: T, status = 200): NextResponse<SuccessResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  message: string,
  status = 500,
  code?: string,
  error?: unknown
): NextResponse<ErrorResponse> {
  // Log to Sentry for server errors (5xx) or if explicitly provided
  if ((status >= 500 || error) && process.env.SENTRY_DSN) {
    if (error instanceof Error) {
      Sentry.captureException(error, {
        tags: {
          errorCode: code || 'UNKNOWN_ERROR',
          httpStatus: status,
        },
        extra: {
          message,
        },
      });
    } else if (error) {
      Sentry.captureMessage(message, {
        level: 'error',
        tags: {
          errorCode: code || 'UNKNOWN_ERROR',
          httpStatus: status,
        },
        extra: {
          error: String(error),
        },
      });
    } else if (status >= 500) {
      // Log 5xx errors even without error object
      Sentry.captureMessage(message, {
        level: 'error',
        tags: {
          errorCode: code || 'SERVER_ERROR',
          httpStatus: status,
        },
      });
    }
  }

  return NextResponse.json(
    { success: false, error: message, ...(code && { code }) },
    { status }
  );
}

// Common error responses
export const unauthorizedResponse = () =>
  errorResponse('Unauthorized. Please sign in to use this feature.', 401, 'UNAUTHORIZED');

export const badRequestResponse = (message: string) =>
  errorResponse(message, 400, 'BAD_REQUEST');

export const notFoundResponse = (message = 'Resource not found') =>
  errorResponse(message, 404, 'NOT_FOUND');

export const rateLimitResponse = (limit: number, remaining: number, reset: number) =>
  NextResponse.json(
    {
      success: false,
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT_EXCEEDED',
      limit,
      remaining,
      reset,
    },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    }
  );

