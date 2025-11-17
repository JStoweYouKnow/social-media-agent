/**
 * Instrumentation file
 *
 * This file is called once when the Next.js server starts up.
 * Perfect for validating environment variables and other startup checks.
 *
 * To enable: Add `experimental.instrumentationHook = true` to next.config.ts
 */

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize Sentry on server startup
    if (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN) {
      await import('../sentry.server.config');
    }

    const { validateEnvOrThrow } = await import('./lib/env-validation');

    console.log('🚀 Starting server...');
    console.log('🔍 Validating environment variables...\n');

    validateEnvOrThrow();

    console.log('');
  }
}
