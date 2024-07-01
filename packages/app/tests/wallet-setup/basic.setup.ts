import { MetaMask, defineWalletSetup } from '@synthetixio/synpress'

const SEED_PHRASE = process.env.SEED_PHRASE || ''
const PASSWORD = process.env.PASSWORD || ''

const setupWallet = defineWalletSetup(
  PASSWORD,
  async (context, walletPage) => {
    const metamask = new MetaMask(context, walletPage, PASSWORD)

    await metamask.importWallet(SEED_PHRASE)
  }
)

export default setupWallet
