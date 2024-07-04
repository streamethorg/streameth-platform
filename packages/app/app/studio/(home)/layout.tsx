import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import CheckAuthorization from '@/components/authorization/CheckAuthorization'
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage'
import Support from '@/components/misc/Support'

const StudioLayout = async (props: { children: React.ReactNode }) => {
  const isAuthorized = await CheckAuthorization()
  if (!isAuthorized) {
    return <AuthorizationMessage />
  }

  return (
    <div className="h-screen w-screen">
      <HomePageNavbar
        pages={[]}
        showLogo={true}
        showSearchBar={false}
      />
      <div className="top-[74px] flex h-[calc(100vh-74px)] flex-col">
        {props.children}
        <Support />
      </div>
    </div>
  )
}

export default StudioLayout
