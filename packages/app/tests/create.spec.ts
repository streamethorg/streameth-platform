import { test, expect } from '@playwright/test'
import path from 'path'

test('create an organization with all mandatory information', async ({
  page,
}) => {
  // Navigate to the create organization page
  await page.goto('http://localhost:3000/studio/create')

  // Check if we're on the correct page
  expect(page.url()).toContain('/studio/create')

  // Verify the heading is present
  const heading = page.getByRole('heading', {
    name: 'Create an organization',
  })
  await expect(heading).toBeVisible({ timeout: 20000 })

  // Fill in the form
  const name = page.getByPlaceholder('Name')
  const email = page.getByPlaceholder('Email')

  await name.fill('test_organization')
  await page.waitForTimeout(200)
  await email.fill('test@example.com')
  await page.waitForTimeout(200)

  const logoPath = path.join(__dirname, '..', 'public', 'logo.png')
  const fileChooserPromise = page.waitForEvent('filechooser')

  await page.locator('label').nth(1).click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(logoPath)

  await page.getByText('Image uploaded successfully').isVisible()
  await page.waitForTimeout(6000)
  await page.getByText('Image uploaded successfully').isHidden()

  await page.getByRole('button', { name: 'Create' }).click()
})

test('create an organization the second time with all mandatory information', async ({
  page,
}) => {
  // Navigate to the create organization page
  await page.goto('http://localhost:3000/studio/create')

  // Check if we're on the correct page
  expect(page.url()).toContain('/studio/create')

  // Verify the heading is present
  const heading = page.getByRole('heading', {
    name: 'Create an organization',
  })
  await expect(heading).toBeVisible({ timeout: 20000 })

  // Fill in the form
  const name = page.getByPlaceholder('Name')
  const email = page.getByPlaceholder('Email')

  await name.fill('test_organization')
  await page.waitForTimeout(200)
  await email.fill('test@example.com')
  await page.waitForTimeout(200)

  const logoPath = path.join(__dirname, '..', 'public', 'logo.png')
  const fileChooserPromise = page.waitForEvent('filechooser')

  await page.locator('label').nth(1).click()
  const fileChooser = await fileChooserPromise
  await fileChooser.setFiles(logoPath)

  await page.getByText('Image uploaded successfully').isVisible()
  await page.waitForTimeout(6000)
  await page.getByText('Image uploaded successfully').isHidden()

  await page.getByRole('button', { name: 'Create' }).click()

  await page.waitForTimeout(6000)

  // Check for the existence of the heading
  const test = page.getByRole('heading', {
    name: 'Create an organization to get started',
  })
  await expect(test).toBeVisible({ timeout: 10000 })
})
