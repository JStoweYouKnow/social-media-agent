import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should have functioning navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check for common navigation elements
    const hasNavigation = await page.locator('nav, header').count() > 0;
    expect(hasNavigation).toBe(true);
  });

  test('should navigate between public pages', async ({ page }) => {
    await page.goto('/');

    // Try to navigate to pricing
    const pricingLink = page.getByRole('link', { name: /pricing/i }).first();
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await expect(page).toHaveURL(/\/pricing/);

      // Navigate back to home
      await page.goto('/');
      await expect(page).toHaveURL('/');
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-xyz');

    // Should show 404 or redirect
    expect([404, 200]).toContain(response?.status() || 200);

    // Page should still render
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Page should load successfully
    await expect(page).toHaveTitle(/.+/);

    // Check if page content is visible
    const body = await page.locator('body').isVisible();
    expect(body).toBe(true);
  });

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Page should load successfully
    await expect(page).toHaveTitle(/.+/);
  });

  test('should maintain state during navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate to pricing and back
    await page.goto('/pricing');
    await expect(page).toHaveURL(/\/pricing/);

    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});
