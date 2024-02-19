import { google } from 'googleapis';
import { config } from '../../config';
const { accountEmail, privateKey } = config.google;

export default class GoogleSheetService {
  connection: any;
  constructor() {
    const serviceAccount = {
      client_email: accountEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    };
    const jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      undefined,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
    this.connection = google.sheets({
      version: 'v4',
      auth: jwtClient,
    });
  }
  async getDataForRange(
    sheetId: string,
    sheetName: string,
    range: string,
  ): Promise<any[]> {
    const response = await this.connection.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!${range}`,
    });
    return response.data.values || [];
  }

  async appendData(
    sheetId: string,
    sheetName: string,
    values: any[],
  ): Promise<void> {
    try {
      await this.connection.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: sheetName,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [values],
        },
      });
    } catch (error) {
      console.error('Error appending data to Google Sheets:', error);
      throw error;
    }
  }
}
