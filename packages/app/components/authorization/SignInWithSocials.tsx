'use client'
import { Button } from '../ui/button'
import farcasterLogo from '@/public/farcaster-transparent-white.png'
import lensLogo from '@/public/lens-green.png'
import twitterLogo from '@/public/twitter-white.png'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { useLoginWithEmail, usePrivy } from '@privy-io/react-auth'
import { useState } from 'react'
import { Input } from '../ui/input'
const SignInWithSocials = () => {
  // Local State
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  // Privy
  const { ready, authenticated } = usePrivy()
  const { sendCode, loginWithCode } = useLoginWithEmail()
  return (
    <div className="flex flex-col w-full space-y-4">
      <Dialog>
        <DialogTrigger>
          <Button
            disabled
            className="w-full bg-white text-black rounded-xl border">
            Continue with Google
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col gap-4">
            {/* Prompt your user to enter their email address */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              {/* Once an email has been entered, send the OTP to it on click */}
              <Button onClick={() => sendCode({ email })}>
                Send Code
              </Button>
            </div>
            <div className="flex gap-2">
              {/* Prompt your user to enter the OTP */}
              <Input
                placeholder="Enter OTP"
                onChange={(e) => setCode(e.currentTarget.value)}
              />
              {/* Once an OTP has been entered, submit it to Privy on click */}
              <Button onClick={() => loginWithCode({ code })}>
                Log in
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Button
        disabled
        className="flex flex-row w-full bg-[#8A63D2] text-white rounded-xl border">
        <Image
          src={farcasterLogo}
          alt="farcaster logo "
          width={24}
          height={24}
        />
        <p className="mx-2">Continue with Farcaster</p>
      </Button>
      <Button
        disabled
        className="flex flex-row w-full bg-black text-white rounded-xl border">
        <Image
          src={twitterLogo}
          alt="twitter logo "
          width={20}
          height={20}
        />
        <p className="mx-2">Continue with Twitter</p>
      </Button>
      {/* <Button className="flex flex-row w-full bg-black text-white rounded-xl border">
        <Image
          src={lensLogo}
          alt="lens logo "
          width={24}
          height={24}
        />
        <p className="mx-2">Continue with Lens</p>
      </Button> */}
    </div>
  )
}

export default SignInWithSocials
