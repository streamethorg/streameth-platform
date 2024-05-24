'use client'
import { Button } from '@/components/ui/button'
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth'
import { deleteSession, storeSession } from '@/lib/actions/auth'
import { apiUrl } from '@/lib/utils/utils'
import { Loader2 } from 'lucide-react'

interface ConnectWalletButtonProps {
  className?: string
  btnText?: string
}

export const ConnectWalletButton = ({
  btnText = 'Sign in',
  className,
}: ConnectWalletButtonProps) => {
  const { ready, authenticated } = usePrivy()

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
    },
    onError: (error) => {
      storeSession({
        token: '',
        address: '',
      })
    },
  })

  const { logout } = useLogout({
    onSuccess: () => {
      storeSession({
        token: '',
        address: '',
      })
    },
  })

  return (
    <Button
      onClick={authenticated ? logout : login}
      className={className}>
      {!ready ? (
        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
      ) : authenticated ? (
        'Sign Out'
      ) : (
        btnText
      )}
    </Button>
  )
}
