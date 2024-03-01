import { cookies } from 'next/headers'

const CheckAuthorization = () => {
  const userSession = cookies().get('user-session')

  const isAuthorized = userSession?.value

  return isAuthorized
}

export default CheckAuthorization
