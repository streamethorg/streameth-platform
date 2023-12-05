'use client'
import { useContext, useEffect } from 'react'
import {
  useContractRead,
  useContractWrite,
  useAccount,
  Address,
  useWaitForTransaction,
  useSwitchNetwork,
  useNetwork,
} from 'wagmi'
import CastrABI from '@/contracts/Castr-abi'
import { Button } from '@/components/Form/Button'
import { ConnectKitButton } from 'connectkit'
import { ModalContext } from '@/context/ModalContext'
import { base } from 'viem/chains'
import Image from 'next/image'
import Link from 'next/link'

export const MintSuccess = ({ hash }: { hash: string }) => {
  return (
    <div className="p-10 w-[400px] md:w-[600px] flex flex-col items-center justify-center">
      <Image
        width={150}
        height={150}
        src="/success.png"
        alt="success"
      />
      <h3 className="text-3xl mt-2 font-bold">Mint Successful</h3>
      <Link
        href={`https://basescan.org/tx/${hash}`}
        target="_blank"
        rel="noopener"
        className="pt-4 text-left whitespace-nowrap underline text-blue">
        View Tx on Base Scan
      </Link>
    </div>
  )
}

const MintButton = ({ address }: { address: string }) => {
  const { address: userAddress, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { openModal } = useContext(ModalContext)
  // const { data: mintPrice } = useContractRead({
  //   address: address as Address,
  //   abi: CastrABI,
  //   functionName: 'mintPrice',
  //   args: [],
  // })

  const {
    data: transaction,
    writeAsync: mint,
    error: mintError,
  } = useContractWrite({
    address: address as Address,
    abi: CastrABI,
    functionName: 'subscribe',
    args: [userAddress],
  })

  const { data, isLoading } = useWaitForTransaction({
    hash: transaction?.hash,
  })

  useEffect(() => {
    if (mintError) {
      openModal(
        <div className="p-10 w-[400px] md:w-[600px] text-center">
          {mintError.message}
        </div>
      )
    }
    if (data) {
      openModal(<MintSuccess hash={data?.transactionHash} />)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mintError])

  const onSwitchNetwork = () => {
    switchNetwork?.(base.id)
  }

  return chain?.id !== base.id || !isConnected ? (
    <ConnectKitButton.Custom>
      {({ show }) => {
        return (
          <Button
            variant={'default'}
            onClick={
              !isConnected
                ? show
                : chain?.id !== base?.id
                ? onSwitchNetwork
                : show
            }
            className="ml-4 hover:text-white">
            <span className="md:hidden">
              {!isConnected
                ? 'SUBSCRIBE'
                : chain?.id !== base?.id && 'Wrong Network'}
            </span>
            <span className="hidden md:block">
              {!isConnected
                ? 'Connect Wallet to collect this livestream'
                : chain?.id !== base?.id && 'Wrong Network'}
            </span>
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  ) : (
    <Button
      variant={'default'}
      onClick={() => mint()}
      isLoading={isLoading}
      className="ml-4 hover:text-white">
      <span className="md:hidden">SUBSCRIBE</span>
      <span className="hidden md:block">collect this livestream</span>
    </Button>
  )
}

export default MintButton
