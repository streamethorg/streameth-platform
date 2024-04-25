import { google } from 'googleapis'

class GoogleDriveService {
  connection: any

  constructor() {
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
      ['https://www.googleapis.com/auth/drive']
    )

    this.connection = google.drive({
      version: 'v3',
      auth: jwtClient,
    })
  }

  async listFiles(): Promise<any[]> {
    const response = await this.connection.files.list({
      pageSize: 10,
      fields: 'files(id, name)',
    })
    return response.data.files || []
  }

  async copyFile(fileId: string, name: string): Promise<string> {
    const response = await this.connection.files.copy({
      fileId,
      supportsAllDrives: true,
      requestBody: {
        name,
      },
    })
    return response.data.id
  }
}

export default GoogleDriveService
