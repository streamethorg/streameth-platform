import { test as base, expect } from '@playwright/test';
import path from 'path';
import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface';
import crypto from 'crypto';

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

test.afterEach(async ({ request, context, orgId }) => {
  try {
    // Step 1: Get the authentication token
    const cookies = await context.cookies();
    const authToken = cookies.find(
      (cookie) => cookie.name === 'user-session'
    )?.value;

    if (!authToken) {
      console.error('Authentication token not found');
      return;
    }

    // Step 2: GET request to find the organization ID
    const getResponse = await request.get(`${API_URL}/organizations`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!getResponse.ok()) {
      console.error(
        `Failed to fetch organizations. Status: ${getResponse.status()}`
      );
      return;
    }

    const responseBody = await getResponse.json();
    const organizations: IOrganization[] = responseBody.data;

    const testOrg = organizations.find((org) => org.name === orgId);

    if (testOrg) {
      const organizationId = testOrg._id?.toString();

      // Step 3: DELETE request to remove the organization
      const deleteResponse = await request.delete(
        `${API_URL}/organizations/${organizationId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (deleteResponse.ok()) {
        console.log(`Organization with ID ${organizationId} has been deleted.`);
      } else {
        console.error(
          `Failed to delete organization. Status: ${deleteResponse.status()}`
        );
      }
    } else {
      console.log(
        'Test organization not found. It may have already been deleted or was not created.'
      );
    }
  } catch (error) {
    console.error('Error in cleanup process:', error);
  }
});

test('create an organization with all mandatory information', async ({
  page,
  orgId,
}) => {
  // Navigate to the create organization page
  await page.goto('http://localhost:3000/studio/create');

  // Check if we're on the correct page
  expect(page.url()).toContain('/studio/create');

  // Verify the heading is present
  const heading = page.getByRole('heading', {
    name: 'Create an organization',
  });
  await expect(heading).toBeVisible({ timeout: 20000 });

  // Fill in the form
  const name = page.getByPlaceholder('Name');
  const email = page.getByPlaceholder('Email');

  await name.fill(orgId);
  await page.waitForTimeout(200);
  await email.fill('test@example.com');
  await page.waitForTimeout(200);

  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const fileChooserPromise = page.waitForEvent('filechooser');

  await page.locator('label').nth(1).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(logoPath);

  await page.getByText('Image uploaded successfully').isVisible();
  await page.waitForTimeout(6000);
  await page.getByText('Image uploaded successfully').isHidden();

  await page.getByRole('button', { name: 'Create' }).click();

  await page.waitForTimeout(2000);

  expect(page.getByRole('button', { name: 'View channel page' })).toBeVisible();
});

test('create an organization with all mandatory information and description', async ({
  page,
  orgId,
}) => {
  // Navigate to the create organization page
  await page.goto('http://localhost:3000/studio/create');

  // Check if we're on the correct page
  expect(page.url()).toContain('/studio/create');

  // Verify the heading is present
  const heading = page.getByRole('heading', {
    name: 'Create an organization',
  });
  await expect(heading).toBeVisible({ timeout: 20000 });

  // Fill in the form
  await page.getByPlaceholder('Name').fill(orgId);
  await page.getByPlaceholder('Email').fill('test@example.com');

  // Upload logo
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('label').nth(1).click(),
  ]);
  await fileChooser.setFiles(logoPath);

  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeVisible();
  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeHidden({ timeout: 10000 });

  // Fill in the description (approximately 1000 characters)
  const description =
    'This is a test organization created for automated testing purposes.';

  await page.getByPlaceholder('Description').fill(description);

  // Submit the form
  await page.getByRole('button', { name: 'Create' }).click();

  await page.waitForTimeout(2000);

  expect(page.getByRole('button', { name: 'View channel page' })).toBeVisible();
});

test('create an organization with all mandatory information and a description too long', async ({
  page,
  orgId,
}) => {
  // Navigate to the create organization page
  await page.goto('http://localhost:3000/studio/create');

  // Check if we're on the correct page
  expect(page.url()).toContain('/studio/create');

  // Verify the heading is present
  const heading = page.getByRole('heading', {
    name: 'Create an organization',
  });
  await expect(heading).toBeVisible({ timeout: 20000 });

  // Fill in the form
  await page.getByPlaceholder('Name').fill(orgId);
  await page.getByPlaceholder('Email').fill('test@example.com');

  // Upload logo
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.locator('label').nth(1).click(),
  ]);
  await fileChooser.setFiles(logoPath);

  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeVisible();
  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeHidden({ timeout: 10000 });

  // Fill in the description (approximately 1000 characters)
  const longDescription =
    `This is a test organization created for automated testing purposes. 
  Our mission is to push the boundaries of technology and innovation while maintaining a strong 
  focus on ethical practices and sustainability. We believe in the power of collaboration and 
  open-source development, striving to create solutions that benefit the global community. 
  Our team consists of passionate individuals from diverse backgrounds, each bringing unique 
  perspectives and skills to the table. We are committed to fostering an inclusive environment 
  where creativity thrives and ideas are transformed into reality. Our projects span various 
  domains including artificial intelligence, blockchain technology, renewable energy, and 
  space exploration. We are constantly seeking new challenges and opportunities to make a 
  positive impact on the world. Through rigorous research and development, we aim to address 
  some of the most pressing issues facing our society today. Education and knowledge sharing 
  are at the core of our values, and we actively engage in outreach programs to inspire the 
  next generation of innovators. We believe that by working together and leveraging cutting-edge 
  technologies, we can create a brighter, more sustainable future for all. Join us on this 
  exciting journey as we push the boundaries of what's possible and work towards a better tomorrow.`.repeat(
      2
    );

  await page.getByPlaceholder('Description').fill(longDescription);

  // Submit the form
  await page.getByRole('button', { name: 'Create' }).click();

  // Check for error message
  const errorMessage = page.getByText('Description is too long');
  await expect(errorMessage).toBeVisible();
});

test('try to create an organization with missing the logo', async ({
  page,
  orgId,
}) => {
  // Navigate to the create organization page
  await page.goto('http://localhost:3000/studio/create');

  // Check if we're on the correct page
  expect(page.url()).toContain('/studio/create');

  // Verify the heading is present
  const heading = page.getByRole('heading', {
    name: 'Create an organization',
  });
  await expect(heading).toBeVisible({ timeout: 20000 });

  // Fill in the form
  const name = page.getByPlaceholder('Name');
  const email = page.getByPlaceholder('Email');

  await name.fill(orgId);
  await page.waitForTimeout(200);
  await email.fill('test@example.com');
  await page.waitForTimeout(200);

  await page.getByRole('button', { name: 'Create' }).click();

  const errorMessage = page.getByText('Logo is required');
  await expect(errorMessage).toBeVisible();
});

test('attempt to create an organization with missing name', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/studio/create');

  // Fill only email and upload logo
  await page.getByPlaceholder('Email').fill('test@example.com');

  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('label').nth(1).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(logoPath);

  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeVisible();
  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeHidden({ timeout: 6000 });

  // Try to submit the form
  await page.getByRole('button', { name: 'Create' }).click();

  // Check for error message
  const errorMessage = page.getByText('Name is required');
  await expect(errorMessage).toBeVisible();
});

test('attempt to create an organization with missing email', async ({
  page,
  orgId,
}) => {
  await page.goto('http://localhost:3000/studio/create');

  // Fill only name and upload logo
  await page.getByPlaceholder('Name').fill(orgId);

  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator('label').nth(1).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(logoPath);

  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeVisible();
  await expect(
    page.getByText('Image uploaded successfully').first()
  ).toBeHidden({ timeout: 6000 });

  // Try to submit the form
  await page.getByRole('button', { name: 'Create' }).click();

  // Check for error message
  const errorMessage = page.getByText('Invalid email');
  await expect(errorMessage).toBeVisible();
});
