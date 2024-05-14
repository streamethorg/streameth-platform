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
import Link from 'next/link'
const AuthorizationMessage = () => {
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex flex-col justify-center items-center w-1/2 h-full">
        <Card className="shadow-none max-w-[500px]">
          <CardHeader className="text-center">
            <CardTitle>Welcome to StreamETH</CardTitle>
            <CardDescription>
              Connect your wallet to continue.
            </CardDescription>
            <div className="flex justify-center items-center w-full pt-[20px]">
              <ConnectWalletButton />
            </div>
          </CardHeader>

          <div className="flex flex-row justify-between items-center px-4 my-4 space-x-2">
            <p className="w-full border" />
            <div>OR</div>
            <p className="w-full border" />
          </div>
          <CardContent>
            <SignInWithSocials />
            <p className="mt-4 text-sm">
              By signing up you agree to the{' '}
              <Link className="underline" href="/terms">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link className="underline" href="/privacy">
                Privacy Policy
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="relative w-1/2 h-full bg-primary">
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
          className="object-cover w-full h-full"
        /> */}
      </div>
      <div></div>
    </div>
  )
}

export default AuthorizationMessage
