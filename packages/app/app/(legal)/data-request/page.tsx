'use server'

import { Card, CardTitle, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import Footer from '@/components/Layout/Footer'
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage'
import CheckAuthorization from '@/components/authorization/CheckAuthorization'
import CreateRequestForm from './components/createRequestFrom'

const DataRequest = async () => {
  const year = new Date().getFullYear()

  const isAuthorized = await CheckAuthorization()
  if (!isAuthorized) {
    return <AuthorizationMessage />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-grow items-center justify-center">
        <Card className="my-5 flex w-full max-w-4xl flex-col justify-between bg-gray-100 p-5">
          <CardTitle className="mb-6 ml-4">
            <Image
              src={'/logo.png'}
              alt={'StreamETH logo'}
              width={50}
              height={50}
            />
          </CardTitle>
          <CreateRequestForm />
        </Card>
      </div>
      <Footer active={'data_request'} />
    </div>
  )
}

export default DataRequest
