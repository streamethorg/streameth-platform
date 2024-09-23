import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/studio');

  await expect(page).toHaveTitle(/StreamETH/);
});

test('sign out from studio', async ({ page }) => {
  await page.goto(`/studio`);

  const signOut = page.getByRole('button', { name: 'Sign Out' });
  await signOut.waitFor({ state: 'visible' });
  await signOut.click();

  await expect(page).toHaveURL('/studio');
});
