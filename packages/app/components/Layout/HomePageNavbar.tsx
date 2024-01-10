import Image from 'next/image'
import SearchBar from '@/components/misc/SearchBar'
import Link from 'next/link'

const HomePageNavbar = () => {
  return (
    <div className="z-[99999999] sticky top-0 p-4 border-b flex flex-row items-center">
      <div className=" md:flex-initial">
        {/* Logo for larger screens */}
        <Link href="/">
          <Image
            className="hidden md:block"
            src="/logo_dark.png"
            alt="Streameth logo"
            width={230}
            height={40}
          />
          {/* Logo for smaller screens */}
          <Image
            className="block md:hidden aspect-square h-full p-1"
            src="/logo.png"
            alt="Streameth logo"
            height={64}
            width={64}
          />
        </Link>
      </div>

      {/* Search bar in the middle */}
      <div className="flex-grow mx-2 flex justify-center">
        <SearchBar />
      </div>

      {/* Placeholder div for balancing the layout */}
      <div className="flex-1 md:flex-initial hidden md:block"></div>
    </div>
  )
}

export default HomePageNavbar
