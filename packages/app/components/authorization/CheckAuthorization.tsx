import { apiUrl } from '@/lib/utils/utils'
import { cookies } from 'next/headers'

const CheckAuthorization = async () => {
  const userSession = cookies().get('user-session')
  const res = await fetch(`${apiUrl()}/auth/verify-token`, {
    method: 'POST',
    body: JSON.stringify({
      token: userSession?.value,
    }),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  const isAuthorized = (await res.json()).data

  return isAuthorized
}

export default CheckAuthorization
