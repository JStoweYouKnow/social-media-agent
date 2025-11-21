# Testing Guide

This directory contains all tests for the application.

## Directory Structure

```
tests/
├── unit/           # Unit tests for individual functions/modules
├── integration/    # Integration tests for API routes and services
├── e2e/           # End-to-end tests using Playwright
└── setup.ts       # Test setup and configuration
```

## Running Tests

### Unit & Integration Tests (Vitest)

```bash
# Run all unit and integration tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed
```

## Writing Tests

### Unit Tests

Unit tests should test individual functions in isolation. Place them in `tests/unit/`.

Example:
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/myModule';

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction('input')).toBe('expected');
  });
});
```

### Integration Tests

Integration tests should test API routes and service interactions. Place them in `tests/integration/`.

Example:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/my-route/route';

describe('POST /api/my-route', () => {
  it('should handle valid requests', async () => {
    const request = new Request('http://localhost:3000/api/my-route', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

### E2E Tests

E2E tests should test complete user flows. Place them in `tests/e2e/`.

Example:
```typescript
import { test, expect } from '@playwright/test';

test('user can complete checkout', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Sign In');
  // ... test flow
});
```

## Test Coverage

Aim for:
- **Unit tests**: 80%+ coverage for utility functions
- **Integration tests**: All critical API routes
- **E2E tests**: All critical user flows

## CI/CD Integration

Tests run automatically on:
- Every pull request
- Every push to main branch
- Before deployment

## Mocking

### Environment Variables
Environment variables are mocked in `tests/setup.ts`.

### External Services
Mock external API calls using Vitest's `vi.mock()`:

```typescript
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn().mockResolvedValue({ userId: 'test_user' }),
}));
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Clarity**: Test names should describe what they test
3. **Speed**: Keep unit tests fast
4. **Coverage**: Focus on critical paths first
5. **Maintenance**: Update tests when code changes

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
