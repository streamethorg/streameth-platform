import ClientOnly from '@/app/utils/ClientOnly'
import { useSIWE } from 'connectkit'
import { PropsWithChildren } from 'react'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'
export function AdminWrapper(props: PropsWithChildren) {
  const { data, isSignedIn } = useSIWE()

  return (
    <ClientOnly>
      {!isSignedIn && (
        <div className="p-4 flex flex-col space-y-4 items-center justify-center h-[calc(100vh-7rem)] overflow-hidden">
          You need to sign in to access these pages
          <ConnectWalletButton />
        </div>
      )}
      {isSignedIn && props.children}
    </ClientOnly>
  )
}
