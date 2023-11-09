'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import HomeIcon from '../assets/icons/HomeIcon'
import EventIcon from '../assets/icons/EventIcon'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAccount, useEnsName } from 'wagmi'
import { truncateAddr } from '@/utils'
import MediaIcon from '../assets/icons/MediaIcon'
import makeBlockie from 'ethereum-blockies-base64'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline'

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
    id: '/admin/clips',
    name: 'Clips',
    Icon: PaperClipIcon,
  },
  {
    id: '/admin/studio',
    name: 'Studio',
    Icon: MediaIcon,
  },
]

const AdminSideNav = () => {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { data } = useEnsName({
    address: isConnected ? address : ('' as `0x${string}`),
  })

  function CreateBlockie(username: string) {
    return username ? makeBlockie(username) : makeBlockie('streameth')
  }

  return (
    <div
      className={`${
        isCollapsed ? 'w-[80px]' : 'w-[250px]'
      }  sticky top-20 flex flex-col justify-between bg-background  h-full p-4 border-r`}>
      <div>
        <div className="flex items-center gap-5 border-">
          <Image
            src={CreateBlockie(address as string)}
            alt="avatar"
            width={52}
            height={52}
            className="rounded-full"
          />
          {!isCollapsed && (
            <h2 className="text-lg font-bold">
              {data ?? truncateAddr(address as string) ?? 'Admin'}
            </h2>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-5 justify-start">
          {ADMIN_MENU.map(({ id, name, Icon }) => (
            <Link
              key={id}
              href={id}
              className={`flex items-center gap-2 justify-start p-1 hover:rounded ${
                pathname == id
                  ? `bg-white drop-shadow-card rounded ${
                      isCollapsed ? 'w-full' : 'w-[190px]'
                    }`
                  : ''
              } hover:bg-white hover:outline-1 hover:drop-shadow-card  ${
                isCollapsed ? 'hover:w-fit' : 'hover:w-[190px]'
              }`}>
              <Icon
                width={isCollapsed ? '24' : '19'}
                height={isCollapsed ? '24' : '19'}
              />
              {!isCollapsed && <p>{name}</p>}
            </Link>
          ))}
        </div>
      </div>
      <div
        className="flex justify-end cursor-pointer p-1"
        onClick={() => setIsCollapsed((prev) => !prev)}>
        {isCollapsed ? (
          <ArrowRightIcon width={23} />
        ) : (
          <ArrowLeftIcon width={23} />
        )}
      </div>
    </div>
  )
}

export default AdminSideNav
