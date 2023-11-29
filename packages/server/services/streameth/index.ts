import { apiUrl } from '../../utils'

export default class StreamethApi {
  private static baseUrl = apiUrl()

  static async get<T>({ path }: { path: string }): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: T = await response.json()
    return data
  }
}
