import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/studio');

  await expect(page).toHaveTitle(/StreamETH/);
});
