'use client'
import Image from 'next/image'
import MintButton from '@/components/misc/MintButton'
import nft from '@/public/Base-house.jpg'
import ComponentWrapper from './ComponentWrapper'
import SectionTitle from './SectionTitle'
import { Button } from '@/components/Form/Button'
import { usePathname } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit'

const NFTMintComponent = () => {
  const pathname = usePathname()
  const [whitelistAddress, setWhitelistAddress] =
    useState<[{ address: string }]>()
  const [isLoadingWhitelist, setIsLoadingWhitelist] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState<
    boolean | undefined
  >(false)
  const { address, isConnected } = useAccount()
  console.log(whitelistAddress)

  function isAddressFound(targetAddress: `0x${string}` | undefined) {
    if (!isLoadingWhitelist && whitelistAddress && targetAddress) {
      return whitelistAddress.some(
        (entry) =>
          entry.address.toLowerCase() === targetAddress.toLowerCase()
      )
    }
  }
  const whitelist = async () => {
    setIsLoadingWhitelist(false)
    fetch('https://streameth-dev.up.railway.app')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to get whitelist addresses')
        }
        return response.json()
      })
      .then((responseData) => {
        setWhitelistAddress(responseData.data)
      })
      .catch((err) => {
        console.error('An error occurred', err)
      })
  }
  useEffect(() => {
    whitelist()
  }, [])

  useEffect(() => {
    if (whitelistAddress) {
      const alreadyMinted = isAddressFound(address)
      setIsWhitelisted(alreadyMinted)
    }
  }, [whitelistAddress, address])

  const addWhitelistAddress = async () => {
    if (!isAddressFound(address)) {
      const data = { address: address }
      fetch('https://streameth-dev.up.railway.app/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create data on the server')
          }
          return response.json()
        })
        .then((responseData) => {
          setIsWhitelisted(true)
          alert('Addresses added successfully')
          console.log(responseData)
        })
        .catch((error) => {
          console.error('An error occurred:', error)
        })
    }
  }

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
            {isWhitelisted || isAddressFound(address) ? (
              <p className="py-4 w-fit px-2 bg-base text-xl">
                Address already whitelisted
              </p>
            ) : (
              // <Button
              //   onClick={addWhitelistAddress}
              //   className="!mt-5 !mx-0 uppercase text-xl">
              //   Whitelist address
              // </Button>
              <ConnectKitButton.Custom>
                {({ show }) => {
                  return (
                    <Button
                      onClick={
                        !isConnected ? show : addWhitelistAddress
                      }
                      className={`hover:text-base text-xl hover:text-xl p-2`}>
                      {' '}
                      {!isConnected
                        ? 'Connect wallet to add address to whitelist'
                        : 'Whitelist Address'}
                    </Button>
                  )
                }}
              </ConnectKitButton.Custom>
            )}
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
