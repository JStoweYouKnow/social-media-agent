import { describe, it, expect, beforeEach } from 'vitest';
import { validateEnv } from '@/lib/env-validation';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  it('should pass validation with all required variables', () => {
    const result = validateEnv();
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail when OPENAI_API_KEY is missing', () => {
    delete process.env.OPENAI_API_KEY;
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required environment variable: OPENAI_API_KEY');
  });

  it('should fail when Clerk keys are missing', () => {
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required environment variable: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    expect(result.errors).toContain('Missing required environment variable: CLERK_SECRET_KEY');
  });

  it('should fail when Stripe keys are missing', () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required environment variable: STRIPE_SECRET_KEY');
    expect(result.errors).toContain('Missing required environment variable: STRIPE_WEBHOOK_SECRET');
  });

  it('should fail when Stripe key format is invalid', () => {
    process.env.STRIPE_SECRET_KEY = 'invalid_key';
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('STRIPE_SECRET_KEY must start with "sk_"');
  });

  it('should fail when OpenAI key format is invalid', () => {
    process.env.OPENAI_API_KEY = 'invalid_key';
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('OPENAI_API_KEY must start with "sk-"');
  });

  it('should show warning when optional variables are missing', () => {
    delete process.env.CANVA_API_KEY;
    delete process.env.NEXT_PUBLIC_CONVEX_URL;
    const result = validateEnv();
    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('should fail when Stripe price IDs are missing', () => {
    delete process.env.STRIPE_STARTER_PRICE_ID;
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing STRIPE_STARTER_PRICE_ID');
  });

  it('should fail when webhook secret format is invalid', () => {
    process.env.STRIPE_WEBHOOK_SECRET = 'invalid_secret';
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('STRIPE_WEBHOOK_SECRET must start with "whsec_"');
  });

  it('should fail when Clerk publishable key format is invalid', () => {
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'invalid_key';
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with "pk_"');
  });

  it('should fail when Clerk secret key format is invalid', () => {
    process.env.CLERK_SECRET_KEY = 'invalid_key';
    const result = validateEnv();
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('CLERK_SECRET_KEY must start with "sk_"');
  });
});
