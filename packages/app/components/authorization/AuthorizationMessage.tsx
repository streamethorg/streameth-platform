'use client'
import React, { useEffect } from 'react'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

import LoginBackground from '@/public/login-background.png'
import Image from 'next/image'

import { usePrivy } from '@privy-io/react-auth'
import { toast } from 'sonner'

const AuthorizationMessage = () => {
  const { ready, authenticated, login } = usePrivy()

  useEffect(() => {
    if (ready && !authenticated) {
      login()
    }
    if (authenticated) {
      toast.message('Redirecting to Studio')
    }
  }, [ready, authenticated])

  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="w-1/2 h-full flex flex-col items-center justify-center">
        <Card className="max-w-[500px] shadow-none ">
          <CardHeader className="text-center">
            <CardTitle>Welcome to StreamETH</CardTitle>
            <CardDescription>Log-in / Sign-up</CardDescription>
            <div className="w-full pt-[20px] flex items-center justify-center">
              <ConnectWalletButton />
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="w-1/2 h-full bg-primary relative">
        <Image
          quality={100}
          alt="login background"
          src={LoginBackground}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div></div>
    </div>
  )
}

export default AuthorizationMessage
