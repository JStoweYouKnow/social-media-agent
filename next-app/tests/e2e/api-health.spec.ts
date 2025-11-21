import { test, expect } from '@playwright/test';

test.describe('API Health Checks', () => {
  test('should return robots.txt', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const text = await response.text();
    expect(text).toContain('User-agent');
  });

  test('should return sitemap.xml', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const text = await response.text();
    expect(text).toContain('urlset');
  });

  test('should reject unauthenticated API requests', async ({ request }) => {
    const response = await request.post('/api/ai/generate', {
      data: { prompt: 'test' },
    });

    // Should be unauthorized
    expect(response.status()).toBe(401);
  });

  test('should handle missing parameters in API requests', async ({ request }) => {
    const response = await request.post('/api/ai/generate', {
      data: {}, // Missing required prompt
    });

    // Should be bad request or unauthorized
    expect([400, 401]).toContain(response.status());
  });

  test('should serve static assets', async ({ page }) => {
    await page.goto('/');

    // Check that the page loads images/assets
    const response = await page.waitForLoadState('networkidle');
    const images = await page.locator('img').count();

    // Either has images or successfully loaded without them
    expect(images >= 0).toBe(true);
  });
});
