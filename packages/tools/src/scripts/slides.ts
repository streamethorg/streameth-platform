import { CreateFolders } from 'services/slides'
import { CONFIG } from 'utils/config'

console.log('Running in', CONFIG.NODE_ENV, 'mode')

Run()

async function Run() {
  // Add and copy on shared Devcon programming
  // await CreateSlide('Generated Presentation', '107oMKhvteSBeiWfvAyU1GP0PWfh_9UM9')

  await CreateFolders(['TrustX', 'EthStaker', 'Event #3'], '1gSUR_OqP2HkDC6VIe3ogFv2t6L-lyCiK')

  process.exit(0)
}
