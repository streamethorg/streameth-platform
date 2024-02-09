import { cookies } from 'next/headers'
import CreateOrganization from './components/CreateOrganizationForm'
import UserOrganizations from './components/UserOrganizations'
import { ConnectWalletButton } from '@/components/misc/ConnectWalletButton'

const Studio = async () => {
  const userSession = cookies().get('user-session')
  if (!userSession?.value) {
    return (
      <div className="flex flex-col items-center h-screen justify-center">
        <h3>
          You do not have access to this page, Sign in to continue
        </h3>
        <ConnectWalletButton />
      </div>
    )
  }

  return (
    <div className="flex flex-col p-4 h-full w-full">
      <div className="flex justify-between items-center mb-20">
        <h1>Studio</h1>
        <CreateOrganization />
      </div>
      <UserOrganizations />
    </div>
  )
}

export default Studio
