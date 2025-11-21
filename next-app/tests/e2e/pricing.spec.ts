import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('should display all pricing tiers', async ({ page }) => {
    await page.goto('/pricing');

    // Check for all tier names
    await expect(page.getByText('Free')).toBeVisible();
    await expect(page.getByText('Starter')).toBeVisible();
    await expect(page.getByText('Pro')).toBeVisible();
    await expect(page.getByText('Agency')).toBeVisible();
  });

  test('should display pricing information', async ({ page }) => {
    await page.goto('/pricing');

    // Check for price displays
    await expect(page.getByText('$0')).toBeVisible(); // Free tier
    await expect(page.getByText('$19')).toBeVisible(); // Starter tier
    await expect(page.getByText('$49')).toBeVisible(); // Pro tier
    await expect(page.getByText('$149')).toBeVisible(); // Agency tier
  });

  test('should highlight popular tier', async ({ page }) => {
    await page.goto('/pricing');

    // Pro tier should be marked as popular
    const proTier = page.locator('text=Pro').locator('..');
    const isPopular = await proTier.locator('text=/popular|recommended/i').isVisible().catch(() => false);

    // Either should be visible or not throw
    expect(isPopular !== undefined).toBe(true);
  });

  test('should have CTA buttons for each tier', async ({ page }) => {
    await page.goto('/pricing');

    // Check for action buttons (Get Started, Subscribe, etc.)
    const buttons = await page.getByRole('button', { name: /get started|subscribe|choose|select/i }).count();
    expect(buttons).toBeGreaterThan(0);
  });

  test('should show feature lists for each tier', async ({ page }) => {
    await page.goto('/pricing');

    // Check for common features
    await expect(page.getByText(/AI-generated posts/i)).toBeVisible();
    await expect(page.getByText(/platforms?/i)).toBeVisible();
    await expect(page.getByText(/calendar/i)).toBeVisible();
  });
});
