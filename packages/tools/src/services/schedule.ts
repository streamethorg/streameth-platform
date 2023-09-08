import { AuthenticateServiceAccount } from './google'

export const SHEET_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
]

// Constants
const STAGE_SHEET = 'Stages'
const STAGE_DATA_RANGE = 'A3:B'
// const SPEAKER_SHEET = 'Speakers'
// const SPEAKER_DATA_RANGE = 'A3:F'
// const SESSION_SHEET = 'Sessions'
// const SESSION_DATA_RANGE = 'A3:R'
// const SPONSOR_SHEET = 'Sponsors'
// const SPONSOR_DATA_RANGE = 'A3:E'

export async function GetScheduleInfo(id: string) {
  console.log('Get Schedule Info', id)
  const google = await AuthenticateServiceAccount(SHEET_SCOPES)
  const client = google.sheets('v4')

  const sheetRes = await client.spreadsheets.get({
    spreadsheetId: id,
  })

  return sheetRes.data
}

export async function GetItems(id: string) {
  console.log('Get Items', id)
  const google = await AuthenticateServiceAccount(SHEET_SCOPES)
  const client = google.sheets('v4')

  const res = await client.spreadsheets.values.get({
    spreadsheetId: id,
    range: `${STAGE_SHEET}!${STAGE_DATA_RANGE}`,
  })

  const items = res.data.values
  console.log('Items', items)
}
