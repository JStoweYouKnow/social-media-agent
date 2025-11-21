import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateEnvOrThrow, getRequiredEnv, getEnv } from '@/lib/env-validation';

describe('Environment Validation Helper Functions', () => {
  // Store original environment
  const originalEnv = { ...process.env };

  // Mock console methods
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    // Reset environment to test state
    process.env = {
      ...originalEnv,
      OPENAI_API_KEY: 'sk-test-key',
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_key',
      CLERK_SECRET_KEY: 'sk_test_key',
      STRIPE_SECRET_KEY: 'sk_test_key',
      STRIPE_WEBHOOK_SECRET: 'whsec_test_key',
      STRIPE_STARTER_PRICE_ID: 'price_test_starter',
      STRIPE_PRO_PRICE_ID: 'price_test_pro',
      STRIPE_AGENCY_PRICE_ID: 'price_test_agency',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NODE_ENV: 'test',
    };

    // Clear console mocks
    consoleLogSpy.mockClear();
    consoleWarnSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('validateEnvOrThrow', () => {
    it('should log success message when all required variables are present', () => {
      validateEnvOrThrow();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Environment variables validated successfully')
      );
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should log warnings when optional variables are missing', () => {
      delete process.env.CANVA_API_KEY;
      delete process.env.NEXT_PUBLIC_CONVEX_URL;

      validateEnvOrThrow();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Environment warnings')
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Canva integration not configured')
      );
    });

    it('should log errors when required variables are missing', () => {
      delete process.env.OPENAI_API_KEY;

      validateEnvOrThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Environment validation failed')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required environment variable: OPENAI_API_KEY')
      );
    });

    it('should log helpful message about .env.local file', () => {
      delete process.env.OPENAI_API_KEY;

      validateEnvOrThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Please check your .env.local file')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('See .env.example for reference')
      );
    });

    it('should log development mode message when not in production', () => {
      delete process.env.OPENAI_API_KEY;
      process.env.NODE_ENV = 'development';

      validateEnvOrThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Running in development mode - continuing despite errors')
      );
    });

    it('should throw error in production mode when validation fails', () => {
      delete process.env.OPENAI_API_KEY;
      process.env.NODE_ENV = 'production';

      expect(() => validateEnvOrThrow()).toThrow('Environment validation failed');
    });

    it('should not throw in development mode when validation fails', () => {
      delete process.env.OPENAI_API_KEY;
      process.env.NODE_ENV = 'development';

      expect(() => validateEnvOrThrow()).not.toThrow();
    });

    it('should log all warnings before errors', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      delete process.env.OPENAI_API_KEY;

      validateEnvOrThrow();

      // Verify warnings logged before errors
      const warnCalls = consoleWarnSpy.mock.calls;
      const errorCalls = consoleErrorSpy.mock.calls;

      expect(warnCalls.length).toBeGreaterThan(0);
      expect(errorCalls.length).toBeGreaterThan(0);
    });

    it('should handle multiple missing required variables', () => {
      delete process.env.OPENAI_API_KEY;
      delete process.env.STRIPE_SECRET_KEY;
      delete process.env.CLERK_SECRET_KEY;

      validateEnvOrThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('OPENAI_API_KEY')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('STRIPE_SECRET_KEY')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('CLERK_SECRET_KEY')
      );
    });

    it('should handle invalid key formats', () => {
      process.env.OPENAI_API_KEY = 'invalid-key-format';

      validateEnvOrThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('OPENAI_API_KEY must start with "sk-"')
      );
    });
  });

  describe('getRequiredEnv', () => {
    it('should return value when environment variable exists', () => {
      process.env.TEST_VAR = 'test-value';

      const result = getRequiredEnv('TEST_VAR');

      expect(result).toBe('test-value');
    });

    it('should throw error when environment variable is missing', () => {
      delete process.env.TEST_VAR;

      expect(() => getRequiredEnv('TEST_VAR')).toThrow(
        'Missing required environment variable: TEST_VAR'
      );
    });

    it('should throw error when environment variable is empty string', () => {
      process.env.TEST_VAR = '';

      expect(() => getRequiredEnv('TEST_VAR')).toThrow(
        'Missing required environment variable: TEST_VAR'
      );
    });

    it('should handle API keys correctly', () => {
      const apiKey = getRequiredEnv('OPENAI_API_KEY');

      expect(apiKey).toBe('sk-test-key');
      expect(apiKey.length).toBeGreaterThan(0);
    });

    it('should handle Stripe keys correctly', () => {
      const stripeKey = getRequiredEnv('STRIPE_SECRET_KEY');

      expect(stripeKey).toBe('sk_test_key');
    });

    it('should handle Clerk keys correctly', () => {
      const clerkKey = getRequiredEnv('CLERK_SECRET_KEY');

      expect(clerkKey).toBe('sk_test_key');
    });

    it('should throw with descriptive error message', () => {
      delete process.env.CUSTOM_VARIABLE;

      expect(() => getRequiredEnv('CUSTOM_VARIABLE')).toThrow(
        expect.objectContaining({
          message: expect.stringContaining('CUSTOM_VARIABLE'),
        })
      );
    });
  });

  describe('getEnv', () => {
    it('should return value when environment variable exists', () => {
      process.env.TEST_VAR = 'test-value';

      const result = getEnv('TEST_VAR');

      expect(result).toBe('test-value');
    });

    it('should return empty string when variable is missing and no default provided', () => {
      delete process.env.TEST_VAR;

      const result = getEnv('TEST_VAR');

      expect(result).toBe('');
    });

    it('should return default value when variable is missing', () => {
      delete process.env.TEST_VAR;

      const result = getEnv('TEST_VAR', 'default-value');

      expect(result).toBe('default-value');
    });

    it('should return actual value over default when variable exists', () => {
      process.env.TEST_VAR = 'actual-value';

      const result = getEnv('TEST_VAR', 'default-value');

      expect(result).toBe('actual-value');
    });

    it('should handle empty string as valid value', () => {
      process.env.TEST_VAR = '';

      const result = getEnv('TEST_VAR', 'default-value');

      // Empty string is falsy, so default should be used
      expect(result).toBe('default-value');
    });

    it('should handle numeric default values', () => {
      delete process.env.PORT;

      const result = getEnv('PORT', '3000');

      expect(result).toBe('3000');
    });

    it('should handle URL values', () => {
      const url = getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');

      expect(url).toBe('http://localhost:3000');
    });

    it('should handle boolean-like string values', () => {
      process.env.FEATURE_FLAG = 'true';

      const result = getEnv('FEATURE_FLAG', 'false');

      expect(result).toBe('true');
    });

    it('should handle undefined default gracefully', () => {
      delete process.env.TEST_VAR;

      const result = getEnv('TEST_VAR');

      expect(result).toBe('');
    });

    it('should work with optional Canva variables', () => {
      process.env.CANVA_API_KEY = 'canva-key';

      const result = getEnv('CANVA_API_KEY', 'not-configured');

      expect(result).toBe('canva-key');
    });

    it('should work with optional Convex variables', () => {
      delete process.env.NEXT_PUBLIC_CONVEX_URL;

      const result = getEnv('NEXT_PUBLIC_CONVEX_URL', 'not-configured');

      expect(result).toBe('not-configured');
    });
  });

  describe('Integration scenarios', () => {
    it('should handle full validation flow with all functions', () => {
      // Verify environment is valid
      validateEnvOrThrow();
      expect(consoleLogSpy).toHaveBeenCalled();

      // Get required variables
      const openaiKey = getRequiredEnv('OPENAI_API_KEY');
      expect(openaiKey).toBeTruthy();

      // Get optional variables with defaults
      const canvaKey = getEnv('CANVA_API_KEY', 'none');
      expect(canvaKey).toBeDefined();
    });

    it('should handle partial configuration gracefully', () => {
      delete process.env.CANVA_API_KEY;
      delete process.env.NEXT_PUBLIC_CONVEX_URL;

      // Should still validate successfully
      validateEnvOrThrow();
      expect(consoleLogSpy).toHaveBeenCalled();

      // Optional variables should use defaults
      const canvaKey = getEnv('CANVA_API_KEY', 'not-configured');
      expect(canvaKey).toBe('not-configured');
    });
  });
});
