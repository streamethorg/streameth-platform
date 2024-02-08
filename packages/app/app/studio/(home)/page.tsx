import { cookies } from 'next/headers'
import CreateOrganization from './components/CreateOrganizationForm'
import UserOrganizations from './components/UserOrganizations'

const Studio = async () => {
  const userSession = cookies().get('user-session')
  if (!userSession?.value) {
    return <>Unauthorized</>
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
