'use client'
import Link from 'next/link'
import Image from 'next/image'
import img from '@/public/logo.png'
import { SocialIcon } from 'react-social-icons'
import ColorComponent from '@/app/utils/ColorComponent'
import colors from '@/app/constants/colors'
import { usePathname } from 'next/navigation'
import { ConnectWalletButton } from '../ConnectWalletButton'

export default function Navbar() {
  const pathname = usePathname()
  const isAdminPage = pathname.includes('/admin')
  return (
    <ColorComponent accentColor={colors.accent}>
      <header className=" flex flex-row bg-base border-b border-primary w-full ml-auto  p-4 py-2 top-0 h-16 lg:h-20 sticky z-40">
        <div className=" flex items-center w-20">
          <Link href="/" className="">
            <span className="sr-only">Logo</span>
            <Image src={img} alt="Logo" width={50} />
          </Link>
        </div>
        <div className="flex flex-row items-center gap-3 justify-end w-full">
          <Link href={isAdminPage ? '/' : '/admin'} className="font-ubuntu font-bold text-accent">
            {isAdminPage ? 'Home' : 'Admin'}
          </Link>

          <div>
            <SocialIcon url={`https://twitter.com/streameth`} target="_blank" bgColor="#fff" fgColor={colors.accent} />
            <SocialIcon url={`https://github.com/streamethorg/streameth-platform`} target="_blank" bgColor="#fff" fgColor={colors.accent} />
          </div>
          <ConnectWalletButton />
        </div>
      </header>
    </ColorComponent>
  )
}
