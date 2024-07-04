import { test, expect } from '@playwright/test'
import { getAccessToken } from '@privy-io/react-auth'
import * as jose from 'jose'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/studio')
})

async function generatePrivyJWT() {
  const { publicKey, privateKey } =
    await jose.generateKeyPair('ES256')

  console.log(process.env.PRIVY_APP_ID)

  const session = 'test-session-' + Date.now()
  const subject = 'did:privy:test-' + Date.now()
  const issuer = 'privy.io'
  const audience = process.env.PRIVY_APP_ID || ''
  const expiration = '1h'

  const authToken = await new jose.SignJWT({ sid: session })
    .setProtectedHeader({ alg: 'ES256', typ: 'JWT' })
    .setIssuer(issuer)
    .setIssuedAt()
    .setAudience(audience)
    .setSubject(subject)
    .setExpirationTime(expiration)
    .sign(privateKey)

  try {
    const payload = await jose.jwtVerify(authToken, publicKey, {
      issuer: 'privy.io',
      audience: process.env.PRIVY_APP_ID || '',
    })
    console.log('JWT verified successfully. Payload:', payload)
  } catch (error) {
    console.error(`JWT failed to verify with error: ${error}`)
    throw error
  }

  return authToken
}

test('login to studio page with Privy JWT', async ({ page }) => {
  const authToken = await generatePrivyJWT()
  const accessToken = await getAccessToken()

  console.log(accessToken)

  await page.goto('http://localhost:3000/studio/create', {
    waitUntil: 'networkidle',
  })

  await page.evaluate((token) => {
    localStorage.setItem('privy:auth:token', token)
  }, authToken)

  await page.reload({ waitUntil: 'networkidle' })

  expect(page.url()).toContain('/studio')

  await expect(page.locator('text=Studio')).toBeVisible({
    timeout: 30000,
  })
})
