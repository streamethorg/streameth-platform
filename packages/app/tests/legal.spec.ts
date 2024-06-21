import { test, expect } from '@playwright/test'

// Tests for the /terms page
test.describe('Terms Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/terms')
  })

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/StreamETH/)
  })

  test('footer exists', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('terms and conditions text exists', async ({ page }) => {
    const termsText =
      'General Terms and Conditions StreamETH International B.V.'
    await expect(page.getByText(termsText)).toBeVisible()
  })

  test('streameth logo exists', async ({ page }) => {
    await expect(
      page.getByRole('img', { name: 'StreamETH logo' })
    ).toBeVisible()
  })
})

// Tests for the /privacy page
test.describe('Privacy Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/privacy')
  })

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/StreamETH/)
  })

  test('footer exists', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })

  test('terms and conditions text exists', async ({ page }) => {
    const termsText = 'StreamETH International B.V. Privacy Policy'
    await expect(page.getByText(termsText)).toBeVisible()
  })

  test('streameth logo exists', async ({ page }) => {
    await expect(
      page.getByRole('img', { name: 'StreamETH logo' })
    ).toBeVisible()
  })
})
