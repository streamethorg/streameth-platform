import { Button } from '../ui/button'
import farcasterLogo from '@/public/farcaster-transparent-white.png'
import lensLogo from '@/public/lens-green.png'
import twitterLogo from '@/public/twitter-white.png'
import Image from 'next/image'
const SignInWithSocials = () => {
  return (
    <div className="flex flex-col w-full space-y-4">
      <Button
        disabled
        className="w-full bg-white text-black rounded-xl border">
        Continue with Google
      </Button>
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
