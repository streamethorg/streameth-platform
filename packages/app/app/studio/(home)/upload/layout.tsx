import CheckAuthorization from '@/components/authorization/CheckAuthorization'
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    organization: string
    event: string
  }
}) => {
  const isAuthorized = CheckAuthorization()

  if (!isAuthorized) {
    return <AuthorizationMessage />
  }

  return <div>{children}</div>
}

export default Layout
