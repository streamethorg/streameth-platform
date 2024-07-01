import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/studio')
})

test('sign in button exists', async ({ page }) => {
  await page.keyboard.press('Escape')

  const button = page.getByRole('button')
  await expect(button).toBeVisible()
})

test('login with metamask', async ({ page }) => {
  const button = page.getByRole('button')
  await expect(button).toBeVisible()
})
