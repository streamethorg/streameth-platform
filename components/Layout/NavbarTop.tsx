'use client'
import Link from 'next/link'
import Image from 'next/image'
import img from '@/public/logo.png'
import { SocialIcon } from 'react-social-icons'
import ColorComponent from '@/app/utils/ColorComponent'
import colors from '@/constants/colors'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const isAdminPage = pathname.includes('/admin')
  return (
    <ColorComponent accentColor={colors.accent}>
      <header className="sticky top-0 flex flex-row bg-base border-b border-primary w-full ml-auto  p-4 py-2 top-0 h-16 lg:h-20">
        <div className=" flex items-center w-20">
          <Link href="/" className="">
            <span className="sr-only">Logo</span>
            <Image src={img} alt="Logo" width={50} />
          </Link>
        </div>
        <div className="flex flex-row items-center justify-end w-full">
          {/* <Link href={isAdminPage ? '/' : '/admin'}>
            <div className="border-2 text-accent font-bold border-accent hover:bg-accent hover:text-white rounded-md p-1 lg:px-4 lg:py-2 m-2">
              <span className="text-sm">{isAdminPage ? 'Home' : 'Admin Page'}</span>
            </div>
          </Link> */}
          <SocialIcon url={`https://twitter.com/streameth`} target="_blank" bgColor="#fff" fgColor="#1DA1F2" className={` "h-8 w-8"`} />
          <SocialIcon
            url={`https://github.com/streamethorg/streameth-platform`}
            target="_blank"
            bgColor="#fff"
            fgColor="#000"
            className={`"h-8 w-8"`}
          />
        </div>
      </header>
    </ColorComponent>
  )
}
