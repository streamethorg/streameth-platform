'use client'
import { useState, createContext } from 'react'

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
      <LoadingModal isLoading={isLoading} />
      {children}
    </LoadingContext.Provider>
  )
}

const LoadingModal = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex justify-center items-center">
        {/* <div className="w-20 h-20 border-4 border-black rounded-full animate-spin"></div> */}
        Loading...
      </div>
    )
  }
}
