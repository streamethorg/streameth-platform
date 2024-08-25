import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/studio');

  await expect(page).toHaveTitle(/StreamETH/);
});
