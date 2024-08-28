import { test as base, expect } from '@playwright/test';
import crypto from 'crypto';
import {
  createOrganization,
  fetchOrganizations,
} from '@/lib/services/organizationService';
import { setFile } from './utils/setFile';
import path from 'path';
import { existsSync } from 'fs';
import { createOrganizationAction } from '@/lib/actions/organizations';

const generateShortId = () => {
  return crypto.randomBytes(3).toString('hex');
};

const test = base.extend({
  orgId: async ({ browserName }, use, testInfo) => {
    const baseEnv = process.env['ORG_NAME'] || 'TestOrg';
    const uniqueId = generateShortId();
    const orgId = `${baseEnv}_${browserName.toLowerCase()}_${uniqueId}`;
    console.log(`Running test "${testInfo.title}" with ORG_ID: ${orgId}`);
    await use(orgId);
  },
});
const API_URL = process.env['NEXT_PUBLIC_API_URL'] || '';

test.beforeEach(async ({ request, context, orgId }) => {
  // step 1: get the authentication token
  const cookies = await context.cookies();
  const authtoken = cookies.find(
    (cookie) => cookie.name === 'user-session'
  )?.value;
  const walletAddress = cookies.find(
    (cookie) => cookie.name === 'user-address'
  )?.value;

  if (!authtoken) {
    console.error('authentication token not found');
    return;
  }

  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  if (!existsSync(logoPath)) {
    throw new Error(`Logo file not found at ${logoPath}`);
  }

  createOrganizationAction;
  const organization = createOrganization({
    organization: {
      name: orgId,
      email: 'test@example.com',
      logo: logoPath,
      walletAddress: walletAddress,
    },
    authToken: authtoken,
  });
  if (!organization) {
    console.error('Organization does not exist');
    return;
  }
});

test.afterEach(async ({ request, context, orgId }) => {
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
    const testOrg = organizations.find((org) => org.name === orgId);

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

test('Organization page exists', async ({ page, orgId }) => {
  await page.goto(`/studio/${orgId}`);
  expect(page.url()).toContain(`/studio/${orgId}`);

  expect(page.getByRole('button', { name: 'View channel page' })).toBeVisible();
});

test('navigate to channel page', async ({ page, orgId }) => {
  await page.goto(`/studio/${orgId}`);

  const channelButton = page.getByRole('button', { name: 'View channel page' });
  expect(channelButton).toBeVisible();
  await channelButton.click();

  expect(page.url()).toContain(`/${orgId}`);
});

test('able to select your organization', async ({ page, orgId }) => {
  await page.goto(`/studio`);

  expect(
    page.getByRole('heading', { name: 'Your organizations' })
  ).toBeVisible();
  await page
    .getByRole('link', { name: `logo ${orgId}` })
    .getByRole('button')
    .click();

  await expect(page).toHaveURL(`/studio/${orgId}`);
});

test('able to create a second organization', async ({ page }) => {
  await page.goto(`/studio`);

  await page.getByRole('button', { name: 'Create Organization' }).click();
  expect(
    page.getByRole('heading', { name: 'Create an organization' })
  ).toBeVisible();
});
