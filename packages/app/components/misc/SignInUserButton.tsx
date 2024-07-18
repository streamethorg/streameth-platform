'use client'
import { Button } from '@/components/ui/button'
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth'
import { deleteSession, storeSession } from '@/lib/actions/auth'
import { apiUrl } from '@/lib/utils/utils'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface SignInUserButtonProps {
  className?: string
  btnText?: string
}

export const SignInUserButton = ({
  btnText = 'Sign in',
  className,
}: SignInUserButtonProps) => {
  const { ready, authenticated } = usePrivy()
  const [isLoading, setIsLoading] = useState(false)

  const getSession = async () => {
    const privyToken = localStorage.getItem('privy:token')
    const token = privyToken ? JSON.parse(privyToken) : null
    const res = await fetch(`${apiUrl()}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        token: token,
      }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    const resData = await res.json()
    storeSession({
      token: resData?.data?.token,
      address: resData?.data?.user?.walletAddress,
    })
  }

  const { login } = useLogin({
    onComplete: () => {
      getSession()
      setIsLoading(false)
    },
    onError: (error) => {
      deleteSession()
      setIsLoading(false)
    },
  })

  const { logout } = useLogout({
    onSuccess: () => {
      deleteSession()
      setIsLoading(false)
    },
  })

  const handleClick = () => {
    setIsLoading(true)
    if (authenticated) {
      logout()
    } else {
      login()
    }
  }

  return (
    <Button
      onClick={handleClick}
      className={className}
      disabled={!ready || isLoading}>
      {!ready || isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : authenticated ? (
        'Sign Out'
      ) : (
        btnText
      )}
    </Button>
  )
}
