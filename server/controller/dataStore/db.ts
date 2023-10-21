import { AddOrUpdateFile, DeleteFile, GetFile, GetAllFiles } from '../../utils/github'
export default class DbController {
  public async write(query: string, data: string): Promise<void> {
    const parsedData = JSON.parse(data)
    const fileName = `${parsedData.name.replace(/ /g, '_').toLowerCase()}.json`
    await AddOrUpdateFile(fileName, data, query)
  }

  public async read(path: string): Promise<string> {
    try {
      return await GetFile(path)
    } catch (e) {
      return ''
    }
  }

  public async readAll(path: string): Promise<string[]> {
    try {
      return await GetAllFiles(path)
    } catch (e) {
      return []
    }
  }

  public async delete(filePath: string, organizationId?: string): Promise<void> {
    try {
      await DeleteFile(organizationId, filePath)
    } catch (e) {
      console.error(`Failed to delete file at ${filePath}:`, e)
    }
  }
}
