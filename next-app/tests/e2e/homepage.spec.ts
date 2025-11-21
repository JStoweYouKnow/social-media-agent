import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle(/Post Planner|Social Media/i);
  });

  test('should have sign-in link', async ({ page }) => {
    await page.goto('/');

    // Check for authentication links
    const signInLink = page.getByRole('link', { name: /sign in|login/i });
    await expect(signInLink).toBeVisible();
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/');

    // Find and click pricing link
    const pricingLink = page.getByRole('link', { name: /pricing/i });
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await expect(page).toHaveURL(/\/pricing/);
    }
  });
});

test.describe('Authentication Flow', () => {
  test('should redirect to sign-in page', async ({ page }) => {
    await page.goto('/sign-in');

    // Check that we're on the sign-in page (Clerk hosted)
    await expect(page).toHaveURL(/sign-in/);
  });

  test('should redirect to sign-up page', async ({ page }) => {
    await page.goto('/sign-up');

    // Check that we're on the sign-up page (Clerk hosted)
    await expect(page).toHaveURL(/sign-up/);
  });
});
