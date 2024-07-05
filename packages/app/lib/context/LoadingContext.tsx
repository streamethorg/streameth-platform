'use client'
import { useState, createContext } from 'react'
import Image from 'next/image'
export const LoadingContext = createContext<{
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isLoading: true,
  setIsLoading: () => {},
})

export const LoadingContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <LoadingModal isLoading={false} />
      {children}
    </LoadingContext.Provider>
  )
}

const LoadingModal = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999999999999999999] flex flex-col items-center justify-center space-y-2 bg-white">
        {/* <div className="w-20 h-20 border-4 border-black rounded-full animate-spin"></div> */}
        <Image
          src="/logo.png"
          alt="Streameth logo"
          width={100}
          height={100}
          className="animate-pulse"
        />
        <p className="animate-pulse text-xl font-bold">Loading...</p>
      </div>
    )
  }
}
