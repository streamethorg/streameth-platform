import { test as base, expect } from '@playwright/test';
import crypto from 'crypto';
import {
  createOrganization,
  fetchOrganizations,
} from '@/lib/services/organizationService';
import path from 'path';
import { existsSync } from 'fs';
import { deleteStage, fetchStages } from '@/lib/services/stageService';
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface';
import { removeStage } from './utils/removeStages';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] || '';

const generateShortId = () => {
  return crypto.randomBytes(3).toString('hex');
};

const test = base.extend<{ organization: IOrganization }>({
  organization: async ({ browserName, context }, use, testInfo) => {
    // Get environment variables and generate unique ID
    const baseEnv = process.env['ORG_NAME'] || 'TestOrg';
    const uniqueId = generateShortId();
    const orgName = `${baseEnv}_${browserName.toLowerCase()}_${uniqueId}`;

    console.log(
      `Creating organization for test "${testInfo.title}" with name: ${orgName}`
    );

    // Get authentication token from cookies
    const cookies = await context.cookies();
    const authToken = cookies.find(
      (cookie) => cookie.name === 'user-session'
    )?.value;
    const walletAddress = cookies.find(
      (cookie) => cookie.name === 'user-address'
    )?.value;

    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    if (!walletAddress) {
      throw new Error('Wallet address not found');
    }

    // Prepare logo path
    const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
    if (!existsSync(logoPath)) {
      throw new Error(`Logo file not found at ${logoPath}`);
    }

    // Create organization
    const organizationData = {
      name: orgName,
      email: 'test@example.com',
      logo: logoPath,
      walletAddress: walletAddress,
    };

    const createdOrg = await createOrganization({
      organization: organizationData,
      authToken: authToken,
    });

    if (!createdOrg) {
      throw new Error('Failed to create organization');
    }

    await use(createdOrg);
  },
});

test.afterEach(async ({ request, context, organization }) => {
  try {
    // step 1: get the authentication token
    const cookies = await context.cookies();
    const authToken = cookies.find(
      (cookie) => cookie.name === 'user-session'
    )?.value;

    if (!authToken) {
      console.error('authentication token not found');
      return;
    }

    const organizations = await fetchOrganizations();
    const testOrg = organizations.find((org) => org.name === organization.name);

    if (!testOrg) {
      console.log(
        'Test organization not found. It may have already been deleted or was not created.'
      );
    }

    const organizationId = testOrg?._id?.toString();

    // Step 2: DELETE request to remove the organization
    const deleteResponse = await request.delete(
      `${API_URL}/organizations/${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!deleteResponse.ok()) {
      console.error(
        `Failed to delete organization. Status: ${deleteResponse.status()}`
      );
    }

    console.log(`Organization with ID ${organizationId} has been deleted.`);
  } catch (error) {
    console.error('Error in cleanup process:', error);
  }
});

test('Organization page exists', async ({ page, organization }) => {
  await page.goto(`/studio/${organization.slug}`);
  expect(page.url()).toContain(`/studio/${organization.slug}`);

  expect(page.getByRole('button', { name: 'View channel page' })).toBeVisible();
});

test('navigate to channel page', async ({ page, organization }) => {
  await page.goto(`/studio/${organization.slug}`);

  const channelButton = page.getByRole('button', { name: 'View channel page' });
  expect(channelButton).toBeVisible();
  await channelButton.click();

  expect(page.url()).toContain(`/${organization.slug}`);
});

test('able to select your organization', async ({ page, organization }) => {
  await page.goto(`/studio`);

  expect(
    page.getByRole('heading', { name: 'Your organizations' })
  ).toBeVisible();
  await page
    .getByRole('link', { name: `logo ${organization.slug}` })
    .getByRole('button')
    .click();

  await expect(page).toHaveURL(`/studio/${organization.slug}`);
});

test('able to create a second organization', async ({ page }) => {
  await page.goto(`/studio`);

  await page.getByRole('button', { name: 'Create Organization' }).click();
  expect(
    page.getByRole('heading', { name: 'Create an organization' })
  ).toBeVisible();
});

test('create a livestream "right now"', async ({
  page,
  context,
  organization,
}) => {
  const thumbnailPath = path.join(__dirname, 'assets', 'thumbnail.png');

  if (!existsSync(thumbnailPath)) {
    throw new Error(`Logo file not found at ${thumbnailPath}`);
  }

  await page.goto(`/studio/${organization.slug}`);

  await page.getByRole('button', { name: 'Create Livestream' }).click();
  await page
    .locator('div')
    .filter({ hasText: 'Right nowStream to your' })
    .nth(2)
    .click();
  await page
    .getByPlaceholder('e.g. My first livestream')
    .fill('my_test_stream');

  const fileInput = page.locator('div input[type="file"]');
  await fileInput.setInputFiles(thumbnailPath);

  await page.getByRole('button', { name: 'Create livestream' }).click();
  await page.waitForURL(
    new RegExp(`/studio/${organization.slug}/livestreams/\\w+$`)
  );

  removeStage(context, organization);
});

test('create a scheduled livestream', async ({
  page,
  context,
  organization,
}) => {
  const thumbnailPath = path.join(__dirname, 'assets', 'thumbnail.png');

  if (!existsSync(thumbnailPath)) {
    throw new Error(`Logo file not found at ${thumbnailPath}`);
  }

  await page.goto(`/studio/${organization.slug}`);

  await page.getByRole('button', { name: 'Create Livestream' }).click();
  await page.getByRole('heading', { name: 'Schedule a stream' }).click();
  await page
    .getByPlaceholder('e.g. My first livestream')
    .fill('my_test_stream');

  const fileInput = page.locator('div input[type="file"]');
  await fileInput.setInputFiles(thumbnailPath);

  await page.getByRole('button', { name: 'August 28th,' }).click();
  await page.getByRole('gridcell', { name: '30' }).nth(1).click();
  await page.getByRole('combobox').click();
  await page.getByLabel('04:30').click();
  await page.getByRole('button', { name: 'Schedule livestream' }).click();

  await page.waitForURL(
    new RegExp(`/studio/${organization.slug}/livestreams/\\w+$`)
  );

  removeStage(context, organization);
});
