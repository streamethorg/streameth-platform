import { apiUrl } from '@/lib/utils/utils'
import { cookies } from 'next/headers'

const CheckAuthorization = async () => {
  const userSession = cookies().get('privy-token')

  const res = await fetch(`${apiUrl()}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      token: userSession?.value,
    }),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  const resData = await res.json()
  const isAuthorized = !!userSession && resData.status === 'success'

  return isAuthorized
}

export default CheckAuthorization
