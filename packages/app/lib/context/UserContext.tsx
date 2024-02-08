'use client'
import { useState, createContext, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useSIWE } from 'connectkit'
import { fetchUserAction } from '../actions/users'
import { IExtendedOrganization, IExtendedUser } from '../types'

export const UserContext = createContext<{
  selectedOrganization: IExtendedOrganization | undefined
  setSelectedOrganization: React.Dispatch<
    React.SetStateAction<IExtendedOrganization | undefined>
  >
  userOrganizations: IExtendedOrganization[] | undefined
}>({
  selectedOrganization: undefined,
  setSelectedOrganization: () => {},
  userOrganizations: [],
})

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { address } = useAccount()
  const [isFetchingUser, setIsFetchingUser] = useState(false)
  const [userData, setUserData] = useState<IExtendedUser>()
  const [selectedOrganization, setSelectedOrganization] = useState<
    IExtendedOrganization | undefined
  >()
  const [userOrganizations, setUserOrganizations] = useState<
    IExtendedOrganization[] | undefined
  >([])
  const { isSignedIn } = useSIWE()

  useEffect(() => {
    const getUserData = async () => {
      setIsFetchingUser(true)
      try {
        const userData = await fetchUserAction({
          userId: address as string,
        })
        setUserData(userData)
        setIsFetchingUser(false)
      } catch (error) {
        setIsFetchingUser(false)
        console.error(error)
      }
    }
    if (isSignedIn && address) getUserData()
  }, [isSignedIn, address])

  useEffect(() => {
    if (userData && !isFetchingUser && isSignedIn) {
      setSelectedOrganization(userData?.organizations[0])
      setUserOrganizations(userData?.organizations)
    }
    if (!isSignedIn) {
      setSelectedOrganization(undefined)
      setUserOrganizations([])
    }
  }, [address, userData, isSignedIn, isFetchingUser])

  return (
    <UserContext.Provider
      value={{
        selectedOrganization,
        setSelectedOrganization,
        userOrganizations,
      }}>
      {children}
    </UserContext.Provider>
  )
}
