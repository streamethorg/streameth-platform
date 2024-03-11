import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import CheckAuthorization from '@/components/authorization/CheckAuthorization'
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage'

const StudioLayout = async (props: { children: React.ReactNode }) => {
  const isAuthorized = await CheckAuthorization()
  if (!isAuthorized) {
    return <AuthorizationMessage />
  }

  const pages = [
    {
      name: 'Videography',
      href: 'https://info.streameth.org/stream-eth-studio',
      bgColor: 'bg-muted ',
    },
    {
      name: 'Product',
      href: 'https://info.streameth.org/services',
      bgColor: 'bg-muted ',
    },
  ]

  return (
    <div className="w-screen h-screen">
      <HomePageNavbar pages={pages} showSearchBar={false} />
      <div className="top-[74px] flex flex-col h-[calc(100vh-74px)]">
        {props.children}
      </div>
    </div>
  )
}

export default StudioLayout
