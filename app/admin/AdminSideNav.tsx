import Link from 'next/link'
import React from 'react'
import HomeIcon from '../assets/icons/HomeIcon'
import EventIcon from '../assets/icons/EventIcon'
import Image from 'next/image'
import DocsIcon from '../assets/icons/DocsIcon'
import { usePathname } from 'next/navigation'
import { useAccount, useEnsName } from 'wagmi'
import { truncateAddr } from '@/utils'

const ADMIN_MENU = [
  {
    id: '/',
    name: 'Home',
    Icon: HomeIcon,
  },
  {
    id: '/admin',
    name: 'My organizations',
    Icon: EventIcon,
  },
  {
    id: '/admin/studio',
    name: 'Studio',
    Icon: EventIcon,
  },
]

const AdminSideNav = () => {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const { data } = useEnsName({
    address: isConnected ? address : ('' as `0x${string}`),
  })

  return (
    <div className="min-w-[275px] flex flex-col justify-between bg-background border-1 px-4 py-5 h-[calc(100vh-10rem)] drop-shadow-card">
      <div>
        <div className="flex items-center gap-5">
          <Image src="/blockie.png" alt="user avatar" width={52} height={52} className="rounded-full" />
          <h2 className="text-lg font-bold">{data ?? truncateAddr(address as string) ?? 'Admin'}</h2>
        </div>

        <div className="flex flex-col gap-1 mt-5 justify-start">
          {ADMIN_MENU.map(({ id, name, Icon }) => (
            <Link
              key={id}
              href={id}
              className={`flex items-center gap-2 justify-start p-1 hover:rounded ${
                pathname == id ? 'bg-white drop-shadow-card w-[220px] rounded' : ''
              } hover:bg-white hover:outline-1 hover:drop-shadow-card hover:w-[220px]`}>
              <Icon />
              <p>{name}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2 justify-start p-1 hover:rounded hover:bg-white hover:outline-1 hover:drop-shadow-card hover:w-[220px]">
          <DocsIcon />
          <Link href="/">Docs</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminSideNav
