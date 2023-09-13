import { useSIWE, ConnectKitButton } from 'connectkit'
import { PropsWithChildren } from 'react'

export function AdminWrapper(props: PropsWithChildren) {
  const { data, isSignedIn } = useSIWE()

  return (
    <div className="flex flex-col p-4 w-full">
      <div className="flex justify-end">
        <ConnectKitButton />
      </div>
      <div>
        {!isSignedIn && (
          <p>You need to sign in to access these pages</p>
        )}
        {isSignedIn && props.children}
      </div>
    </div>
  )
}
