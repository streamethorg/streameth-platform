import Image from 'next/image'
import SearchBar from '@/components/misc/SearchBar'

const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-screen h-screen bg-white ">
      <div className="z-[99999999] bg-accent sticky top-0 p-4 shadow-md flex flex-row">
        <div>
          <Image
            className="hidden md:block"
            src="/logo_dark.png"
            alt="Streameth logo"
            width={230}
            height={40}
          />
          <Image
            className="block md:hidden aspect-square h-full p-1"
            src="/logo.png"
            alt="Streameth logo"
            height={64}
            width={64}
          />
        </div>
        <div className="flex-grow flex flex-row justify-center items-center">
          <div className="w-full  z-50 bg-transparent ">
            <SearchBar />
          </div>
        </div>
      </div>
      <div className="h-[calc(100%-54px)] flex flex-col p-2 md:p-4 overflow-scroll">
        {children}
      </div>
    </div>
  )
}

export default Layout
