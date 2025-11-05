/**
 * Environment Variable Validation
 *
 * Validates required environment variables at startup to fail fast
 * if configuration is missing.
 */

interface EnvConfig {
  // Next.js
  NEXT_PUBLIC_APP_URL?: string;

  // OpenAI (Required for AI features)
  OPENAI_API_KEY?: string;

  // Clerk Authentication (Required)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  CLERK_SECRET_KEY?: string;

  // Stripe (Required for payments)
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_STARTER_PRICE_ID?: string;
  STRIPE_PRO_PRICE_ID?: string;
  STRIPE_AGENCY_PRICE_ID?: string;

  // Canva (Optional)
  CANVA_API_KEY?: string;
  CANVA_CLIENT_ID?: string;
  CANVA_CLIENT_SECRET?: string;

  // Convex (Optional)
  NEXT_PUBLIC_CONVEX_URL?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate required environment variables
 */
export function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required variables
  const required: (keyof EnvConfig)[] = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ];

  for (const key of required) {
    if (!process.env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  }

  // Stripe price IDs (required for subscriptions)
  if (!process.env.STRIPE_STARTER_PRICE_ID) {
    errors.push('Missing STRIPE_STARTER_PRICE_ID');
  }
  if (!process.env.STRIPE_PRO_PRICE_ID) {
    errors.push('Missing STRIPE_PRO_PRICE_ID');
  }
  if (!process.env.STRIPE_AGENCY_PRICE_ID) {
    errors.push('Missing STRIPE_AGENCY_PRICE_ID');
  }

  // Recommended variables
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    warnings.push('NEXT_PUBLIC_APP_URL not set - using default');
  }

  // Optional variables (just informational)
  if (!process.env.CANVA_API_KEY) {
    warnings.push('Canva integration not configured (optional)');
  }

  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    warnings.push('Convex database not configured (optional)');
  }

  // Validate Stripe key format
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    errors.push('STRIPE_SECRET_KEY must start with "sk_"');
  }

  // Validate Stripe webhook secret format
  if (process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    errors.push('STRIPE_WEBHOOK_SECRET must start with "whsec_"');
  }

  // Validate OpenAI key format
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('sk-')) {
    errors.push('OPENAI_API_KEY must start with "sk-"');
  }

  // Validate Clerk keys format
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_')) {
    errors.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with "pk_"');
  }

  if (process.env.CLERK_SECRET_KEY && !process.env.CLERK_SECRET_KEY.startsWith('sk_')) {
    errors.push('CLERK_SECRET_KEY must start with "sk_"');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate environment and throw if invalid (for server startup)
 */
export function validateEnvOrThrow(): void {
  const result = validateEnv();

  if (result.warnings.length > 0) {
    console.warn('⚠️  Environment warnings:');
    result.warnings.forEach(warning => console.warn(`   - ${warning}`));
  }

  if (!result.valid) {
    console.error('❌ Environment validation failed:');
    result.errors.forEach(error => console.error(`   - ${error}`));
    console.error('\n📝 Please check your .env.local file and ensure all required variables are set.');
    console.error('   See .env.example for reference.\n');

    // In production, throw error to prevent startup
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failed. Cannot start application.');
    } else {
      console.error('⚠️  Running in development mode - continuing despite errors');
    }
  } else {
    console.log('✅ Environment variables validated successfully');
  }
}

/**
 * Get a required environment variable or throw
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get an optional environment variable with default
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}
