import ClientOnly from '@/app/utils/ClientOnly'
import { useSIWE } from 'connectkit'
import { PropsWithChildren } from 'react'

export function AdminWrapper(props: PropsWithChildren) {
  const { data, isSignedIn } = useSIWE()

  return (
    <ClientOnly>
      <div className="p-4">
        {!isSignedIn && <div className="flex items-center justify-center h-[calc(100vh-7rem)]">You need to sign in to access these pages</div>}
        {isSignedIn && props.children}
      </div>
    </ClientOnly>
  )
}
