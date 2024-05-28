import { apiUrl } from '@/lib/utils/utils'
import { cookies } from 'next/headers'

const CheckAuthorization = async () => {
  const privyToken = cookies().get('privy-refresh-token')
  const userSession = cookies().get('user-session')
  const userAddress = cookies().get('user-address')

  const res = await fetch(`${apiUrl()}/auth/verify-token`, {
    method: 'POST',
    body: JSON.stringify({
      token: userSession?.value,
    }),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  const resData = await res.json()
  const isAuthorized =
    !!userAddress?.value &&
    !!privyToken?.value &&
    !!userSession?.value &&
    !!resData.data

  return isAuthorized
}

export default CheckAuthorization
