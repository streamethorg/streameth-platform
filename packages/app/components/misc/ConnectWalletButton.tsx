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
      deleteSession()
    },
  })

  const { logout } = useLogout({
    onSuccess: () => {
      deleteSession()
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
;[
  {
    guid: 'c0105a4c-9b81-558a-b4a2-b193c27d482f',
    id: 307,
    code: 'ZQWHEL',
    public_name: 'Stanley Qiufan CHEN',
    avatar:
      'https://cfp.ducttape.events/media/avatars/WechatIMG44_mGHjpPV.jpeg',
    biography:
      'Chen Qiufan (a.k.a. Stanley Chan) is an award-winning speculative fiction author, creative producer, research fellow, and early investor. His works include Waste Tide and AI 2041: Ten Visions for Our Future (co-authored with Dr. Kai-Fu Lee).',
    answers: [],
  },
]
