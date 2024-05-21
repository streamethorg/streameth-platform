import { apiUrl } from '@/lib/utils/utils'
import { cookies } from 'next/headers'

const CheckAuthorization = async () => {
  const privyToken = cookies().get('privy-token')
  const userSession = cookies().get('user-session')
  const userAddress = cookies().get('user-address')

  const res = await fetch(`${apiUrl()}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      token: privyToken?.value,
    }),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  const resData = await res.json()

  const isAuthorized =
    !!userAddress?.value &&
    !!privyToken?.value &&
    !!userSession?.value &&
    !!resData.status

  return isAuthorized
}

export default CheckAuthorization
