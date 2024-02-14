import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { fetchUserAction } from '@/lib/actions/users'
import CheckAuthorization from '@/components/authorization/CheckAuthorization'
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage'
import { IExtendedUser } from '@/lib/types'
import { Youtube } from 'lucide-react'
import { cookies } from 'next/headers'

const User = async () => {
  const isAuthorized = CheckAuthorization()

  if (!isAuthorized) {
    return <AuthorizationMessage />
  }
  const userData: IExtendedUser = await fetchUserAction({})

  // *************************** //
  const response = await fetch(
    'http://localhost:3000/api/google/oauth2',
    {
      cache: 'no-store',
    }
  )
  if (!response.ok) {
    throw new Error(await response.text())
  }
  const url = await response.json()

  const encodedToken = cookies().get('google_token')
  let token
  if (encodedToken) {
    token = JSON.parse(decodeURIComponent(encodedToken?.value || ''))
  }
  console.log(token)
  // *************************** //

  return (
    <div className="flex flex-col p-4 w-full h-full">
      <div className="flex justify-between items-center mb-20">
        <h1>Studio</h1>
      </div>
      <Card className="overflow-hidden flex-col justify-center mx-10 bg-gray-400 h-[800px]">
        <CardTitle>
          <div className="mx-auto bg-black rounded-full h-[15rem] w-[15rem]"></div>{' '}
        </CardTitle>
        <CardTitle className="text-center">TripleMother42</CardTitle>{' '}
        <CardContent>
          <div className="text-center">
            {' '}
            <h1>Integrate Footer</h1>
            <Link href={url}>
              <Youtube />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default User
