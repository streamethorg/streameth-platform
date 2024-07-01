import {
  test as base,
  chromium,
  type BrowserContext,
} from '@playwright/test'
import { initialSetup } from '@synthetixio/synpress/commands/metamask'
import { setExpectInstance } from '@synthetixio/synpress/commands/playwright'
import { resetState } from '@synthetixio/synpress/commands/synpress'
import { prepareMetamask } from '@synthetixio/synpress/helpers'

export const test = base.extend<{
  context: BrowserContext
}>({
  context: async ({ }, use) => {
    // required for synpress as it shares same expect instance as playwright
    await setExpectInstance(expect)

    // download metamask
    const metamaskPath = await prepareMetamask(
      process.env.METAMASK_VERSION || '10.25.0'
    )

    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      '--remote-debugging-port=9222',
    ]

    if (process.env.CI) {
      browserArgs.push('--disable-gpu')
    }

    if (process.env.HEADLESS_MODE) {
      browserArgs.push('--headless=new')
    }

    // launch browser
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: browserArgs,
    })

    // wait for metamask
    await context.pages()[0].waitForTimeout(5000)

    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey: process.env.SEED_PHRASE || '',
      network: 'mainnet',
      password: process.env.PASSWORD || '',
      enableAdvancedSettings: true,
    })

    await use(context)

    await context.close()

    await resetState()
  },
})

export const expect = test.expect
