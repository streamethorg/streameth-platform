import ClientOnly from '@/app/utils/ClientOnly'
import { useSIWE, ConnectKitButton } from 'connectkit'
import { PropsWithChildren } from 'react'

export function AdminWrapper(props: PropsWithChildren) {
  const { data, isSignedIn } = useSIWE()

  return (
    <ClientOnly>
      <div className="flex flex-col p-4 w-full">
        <div className="flex justify-end">
          <ConnectKitButton />
        </div>
        <div>
          {!isSignedIn && <div>You need to sign in to access these pages</div>}
          {isSignedIn && props.children}
        </div>
      </div>
    </ClientOnly>
  )
}
