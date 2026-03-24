import { test, expect } from '@playwright/test';

test.describe('workflow-e2e generated suite', () => {
  test('replace with generated scenario', async ({ page }) => {
    const baseUrl = process.env.PLAYWRIGHT_BASE_URL;

    if (!baseUrl) {
      throw new Error('Missing PLAYWRIGHT_BASE_URL');
    }

    await page.goto(baseUrl);
    await expect(page).toHaveURL(/.*/);
  });
});
