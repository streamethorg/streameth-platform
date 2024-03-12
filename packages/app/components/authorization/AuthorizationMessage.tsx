import React from 'react'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import SignInWithSocials from './SignInWithSocials'
import LoginBackground from '@/public/login-background.png'
import Image from 'next/image'
const AuthorizationMessage = () => {
  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="w-1/2 h-full flex flex-col items-center justify-center">
        <Card className="max-w-[500px] shadow-none ">
          <CardHeader className="text-center">
            <CardTitle>Welcome to StreamETH</CardTitle>
            <CardDescription>
              Connect your wallet to continue.
            </CardDescription>
            <div className="w-full pt-[20px] flex items-center justify-center">
              <ConnectWalletButton />
            </div>
          </CardHeader>

          <div className="my-4 px-4 flex flex-row justify-between items-center space-x-2">
            <p className="w-full border" />
            <div>OR</div>
            <p className="w-full border" />
          </div>
          <CardContent>
            <SignInWithSocials />
          </CardContent>
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
        {/* <img
          src="/login-background.png"
          alt="login background"
          className="w-full h-full object-cover"
        /> */}
      </div>
      <div>
        
      </div>
    </div>
  )
}

export default AuthorizationMessage
