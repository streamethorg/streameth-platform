'use client'
import WalletSignIn from '@/components/misc/WalletSignIn'
import Link from 'next/link'
import Image from 'next/image'
import img from '@/public/logo.png'
import { SocialIcon } from 'react-social-icons'

export default function Navbar() {
  return (
    <header className=" flex flex-row bg-base border-b border-primary w-full ml-auto p-4 py-2 ">
      <div className=" flex items-center w-20">
        <Link href="/" className="">
          <span className="sr-only">Logo</span>
          <Image src={img} alt="Logo" width={50} />
        </Link>
      </div>
      <div className="flex flex-row items-center justify-end  w-full">
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
  )
}
