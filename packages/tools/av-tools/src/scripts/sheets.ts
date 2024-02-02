import { GetItems, GetScheduleInfo } from 'services/schedule'
import { CONFIG } from 'utils/config'

console.log('Running in', CONFIG.NODE_ENV, 'mode')

Run()

async function Run() {
  // const sheetId = '1gH2j8-IUjoK6dTXAyTQ-zmd5O0RKtmqjNhDLV7DE6nE' // Scheduling template
  const sheetId = '1XzVj-3zhOFvroGsA9W_e8XV3MbTSPs20HDqfmzMNWE8' // Democon Scheduling

  await GetScheduleInfo(sheetId)
  await GetItems(sheetId)

  process.exit(0)
}
