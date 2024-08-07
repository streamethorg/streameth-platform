import { test as setup, expect } from '@playwright/test';

const authFile = 'packages/app/playwright/.auth/user.json';

setup('login to studio page with Privy', async ({ page }) => {
  await page.goto('/studio');
  const email = process.env['PRIVY_EMAIL'] || '';
  const otp = process.env['PRIVY_OTP'] || '';

  // Find and click the login button
  await page.getByRole('button', { name: 'Sign in' }).click();
  const loginButton = page.getByRole('button', {
    name: 'Log in with email or socials',
  });
  await expect(loginButton).toBeVisible({ timeout: 5000 });
  await loginButton.click();

  // Enter email
  const emailInput = page.getByPlaceholder('your@email.com');
  await expect(emailInput).toBeVisible({ timeout: 5000 });
  await emailInput.fill(email);
  await page.waitForTimeout(1000);

  // Submit email
  const submitButton = page.getByRole('button', { name: 'Submit' });
  await expect(submitButton).toBeVisible({ timeout: 5000 });
  await submitButton.click();
  await page.waitForTimeout(1000);

  // Enter OTP
  for (let i = 0; i < 6; i++) {
    const otpInput = page.locator(`input[name="code-${i}"]`);
    await expect(otpInput).toBeVisible({ timeout: 5000 });
    await otpInput.fill(otp[i]);
    await page.waitForTimeout(200);
  }

  await page.waitForTimeout(3000);
  await page.goto('http://localhost:3000/studio/create');
  await page.waitForURL('http://localhost:3000/studio/create');

  // Check for the existence of the heading
  const heading = page.getByRole('heading', {
    name: 'Create an organization',
  });
  await expect(heading).toBeVisible({ timeout: 200000 });

  await page.context().storageState({ path: authFile });
});
