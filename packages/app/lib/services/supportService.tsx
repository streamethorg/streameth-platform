import { apiUrl } from '../utils/utils'
import { ISupport } from 'streameth-new-server/src/interfaces/support.interface'

export async function createSupportTicket({
  message,
  authToken,
}: {
  message: string
  authToken: string
}): Promise<ISupport> {
  const response = await fetch(`${apiUrl()}/tickets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ message }),
  })
  if (!response.ok) {
    throw 'Error creating ticket'
  }
  return (await response.json()).data
}
