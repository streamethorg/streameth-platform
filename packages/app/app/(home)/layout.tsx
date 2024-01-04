import Image from 'next/image'
const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-screen h-screen bg-white ">
      <div className="z-[99999999] bg-accent sticky top-0 p-4 shadow-md">
        <div>
          <Image
            className="hidden md:block"
            src="/logo_dark.png"
            alt="Streameth logo"
            width={176}
            height={46}
          />
          <Image
            className="block md:hidden aspect-square h-full p-1"
            src="/logo.png"
            alt="Streameth logo"
            height={64}
            width={64}
          />
        </div>
      </div>
      <div className="h-[calc(100%-54px)] flex flex-col p-2 md:p-4 overflow-scroll">
        {children}
      </div>
    </div>
  )
}

export default Layout
