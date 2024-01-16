import { Button } from '@/components/ui/button'
import Link from 'next/link'

const HeroHeader = () => {
  return (
    <div className="flex flex-col space-y-4  lg:flex-row w-full p-4">
      <div className="flex flex-col w-full lg:w-1/2 justify-center space-y-4 lg:space-y-8">
        <p className="text-2xl lg:text-4xl font-bold text-background max-w-[600px]">
          The best solution for your Web3 virtual or hybrid event
        </p>
        <p className=" text-background max-w-[600px] lg:text-lg">
          Create fully customized video experiences your audience will
          show up for. Host your next all hands, AMA, webinar, or
          training in minutes with StreamETH.
        </p>
        <div className="flex flex-row space-x-4">
          <Link href="https://info.streameth.org/contact-us">
            <Button>Host your event</Button>
          </Link>
          <Link href="https://info.streameth.org/services">
            <Button variant="secondary">Learn More</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-1/2">
        <video
          className="rounded-md"
          autoPlay
          muted
          loop
          id="myVideo"
          src="https://info.streameth.org/lib_wsURRdlMczHRgWBe/flg97ceotxfdu8qb.mp4"
        />
      </div>
    </div>
  )
}

export default HeroHeader
