import { CreateFolders } from 'services/slides'
import { CONFIG } from 'utils/config'

console.log('Running in', CONFIG.NODE_ENV, 'mode')

Run()

async function Run() {
  // Add and copy on shared Devcon programming
  // await CreateSlide('Generated Presentation', '107oMKhvteSBeiWfvAyU1GP0PWfh_9UM9')

  await CreateFolders(['Test Event #'], '0AH0WRrJ3rWdMUk9PVA')

  process.exit(0)
}
