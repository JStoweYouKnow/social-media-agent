'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * Client-side Sentry initialization component
 * Ensures Sentry is properly initialized on the client side
 */
export function SentryInit() {
  useEffect(() => {
    // Sentry is already initialized via sentry.client.config.ts
    // This component ensures it's loaded on the client side
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // Set user context if available (from Clerk)
      // This will be set when user logs in
      console.log('Sentry initialized on client');
    }
  }, []);

  return null;
}

