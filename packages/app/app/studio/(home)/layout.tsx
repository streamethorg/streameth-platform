import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import CheckAuthorization from '@/components/authorization/CheckAuthorization'
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage'

const StudioLayout = async (props: { children: React.ReactNode }) => {
  const isAuthorized = await CheckAuthorization()
  if (!isAuthorized) {
    return <AuthorizationMessage />
  }

  return (
    <div className="w-screen h-screen">
      <HomePageNavbar
        pages={[]}
        showLogo={true}
        showSearchBar={false}
      />
      <div className="top-[74px] flex flex-col h-[calc(100vh-74px)]">
        {props.children}
      </div>
    </div>
  )
}

export default StudioLayout
