import { expect, Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export const setFile = async (page: Page) => {
  const logoPath = path.join(__dirname, '..', '..', 'public', 'logo.png');

  // Ensure the file exists
  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo file not found at ${logoPath}`);
  }

  const fileInput = page.locator('div.rounded-full input[type="file"]');
  await fileInput.setInputFiles(logoPath);

  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeVisible({ timeout: 20000 });
  console.log('Image upload successful');
  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeHidden({ timeout: 7000 });
};
