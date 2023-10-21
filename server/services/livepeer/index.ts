class LivepeerService {
  private apiUrl: string
  private apiToken: string | undefined

  constructor() {
    this.apiUrl = 'https://livepeer.studio/api'
    this.apiToken = process.env.API_TOKEN
  }

  public async getSessionData(id: string): Promise<any> {
    const url = `${this.apiUrl}/session/${id}`
    const headers = new Headers({
      Authorization: `Bearer ${this.apiToken}`,
    })

    try {
      const response = await fetch(url, {
        headers,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default LivepeerService
