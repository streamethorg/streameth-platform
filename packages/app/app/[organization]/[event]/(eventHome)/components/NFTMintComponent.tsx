'use client'
import Image from 'next/image'
import MintButton from '@/components/misc/MintButton'
import nft from '@/public/Base-house.jpg'
import ComponentWrapper from './ComponentWrapper'
import SectionTitle from './SectionTitle'
import { Button } from '@/components/Form/Button'
import { usePathname } from 'next/navigation'

const NFTMintComponent = () => {
  const pathname = usePathname()
  return (
    pathname.includes('si_her') && (
      <ComponentWrapper sectionId="nft">
        <div className="  flex-col md:flex-row justify-center">
          <div className="w-full p-2">
            <SectionTitle title="Attention Event Attendees!" />
            <p className="text-xl">
              We&apos;re thrilled you joined us for the SI HER DEFI:
              AFRICA. As a token of our gratitude, we&apos;re
              conducting an exclusive airdrop for participants. To
              ensure you don&apos;t miss out, kindly click on the
              Whitelist address button to submit your wallet address.
              Your submitted wallet address will be used solely for
              the purpose of the airdrop. Thank you for being a part
              of our community!
            </p>
            <Button className="!mt-5 !mx-0 uppercase text-xl">
              Whitelist address
            </Button>
          </div>
          {/* <div className="flex flex-col w-full md:w-[40%] p-2 bg-base shadow rounded-lg justify-center items-center">
          {/* <Image alt="nft image" src={nft}></Image>
        <MintButton address="0x3afa8ecae2503f6a892d40b9a0d905ece7a7219b" />
        </div> */}
        </div>
      </ComponentWrapper>
    )
  )
}

export default NFTMintComponent
