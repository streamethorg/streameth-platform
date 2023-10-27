import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

class GoogleSheetService {
  sheetId: string
  connection: any

  constructor(sheetId: string) {
    this.sheetId = sheetId

    const serviceAccount = {
      client_email: process.env.SERVICE_ACCOUNT_EMAIL,
      private_key:
        process.env.SERVICE_ACCOUNT_PRIVATE_KEY &&
        process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }

    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    )

    this.connection = google.sheets({
      version: 'v4',
      auth: jwtClient,
    })
  }

  async getDataForRange(
    sheetName: string,
    range: string
  ): Promise<any[]> {
    const response = await this.connection.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: `${sheetName}!${range}`,
    })
    return response.data.values || []
  }

  async appendData(
    sheetName: string,
    values: any[][]
  ): Promise<void> {
    try {
      await this.connection.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: sheetName,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: values,
        },
      })
    } catch (error) {
      console.error('Error appending data to Google Sheets:', error)
      throw error
    }
  }
}

export default GoogleSheetService
