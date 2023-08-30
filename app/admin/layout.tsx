'use client'

import SiweContext from '@/components/context/SiweContext'
import { PropsWithChildren } from 'react'
import { ConnectKitButton, useSIWE } from 'connectkit'

export default function AdminLayout(props: PropsWithChildren) {
  return (
    <SiweContext {...props}>
      <AdminWrapper>{props.children}</AdminWrapper>
    </SiweContext>
  )
}

export function AdminWrapper(props: PropsWithChildren) {
  const { data, isSignedIn } = useSIWE()

  if (!isSignedIn) {
    return (
      <div className="flex justify-center mt-10">
        <p>You need to sign in to access these pages</p> <br />
        <ConnectKitButton />
      </div>
    )
  }

  return (
    <div>
      <ConnectKitButton />
      {props.children}
    </div>
  )
}
