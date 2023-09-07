'use client'
import { ConnectKitButton } from 'connectkit'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

const ChatBar = ({ conversationId }: { conversationId: string }) => {
  const [isLoading, setIsLoading] = useState(true)

  const { isDisconnected, address: userAddress, isConnecting } = useAccount()

  useEffect(() => {
    if (isConnecting) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [isConnecting])

  if (isLoading) {
    return <div>Loading</div>
  }
  return (
    <div className="relative flex flex-col min-h-[96rem] lg:h-full">
      {isDisconnected ? (
        <>
          <iframe className="h-full" src={`https://stingray-app-u9f8x.ondigitalocean.app/${conversationId}?isCastr=${true}`} />
          <p className=" p-4 m-auto w-full text-center">
            Connect your wallet to chat
            <ConnectKitButton />
          </p>
        </>
      ) : (
        <iframe
          className="h-full"
          src={`https://stingray-app-u9f8x.ondigitalocean.app/${conversationId}?isCastr=${false}&address=${userAddress}`}
        />
      )}
    </div>
  )
}

export default ChatBar
