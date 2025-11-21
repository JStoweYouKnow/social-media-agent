import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Runs a cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'sk-test-key';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'pk_test_key';
process.env.CLERK_SECRET_KEY = 'sk_test_key';
process.env.STRIPE_SECRET_KEY = 'sk_test_key';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_key';
process.env.STRIPE_STARTER_PRICE_ID = 'price_test_starter';
process.env.STRIPE_PRO_PRICE_ID = 'price_test_pro';
process.env.STRIPE_AGENCY_PRICE_ID = 'price_test_agency';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
