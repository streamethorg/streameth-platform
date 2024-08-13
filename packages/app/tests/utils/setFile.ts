import { expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export const setFile = async (page: Page) => {
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');

  // Ensure the file exists
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo file not found at ${logoPath}`);
  }

  const fileChooserPromise = page.waitForEvent('filechooser');

  await page.locator('label').nth(1).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(logoPath);

  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeVisible();
  console.log('Image upload successful');
  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeHidden({ timeout: 7000 });
};
