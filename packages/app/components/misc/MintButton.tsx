'use client'
import { useContext, useEffect, useState } from 'react'
import {
  useContractRead,
  useContractWrite,
  useAccount,
  Address,
  useWaitForTransaction,
  useSwitchNetwork,
  useNetwork,
} from 'wagmi'
import CastrABI from '@/lib/contracts/Castr-abi'
import { Button } from '@/components/ui/button'
import { ConnectKitButton } from 'connectkit'
import { ModalContext } from '@/lib/context/ModalContext'
import { base } from 'viem/chains'
import Image from 'next/image'
import Link from 'next/link'

export const MintSuccess = ({ hash }: { hash: string }) => {
  return (
    <div className="p-10 w-[400px] lg:w-[600px] flex flex-col items-center justify-center">
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

const MintButton = ({
  address,
  className = '',
  mintText = 'MINT',
}: {
  address: string
  className?: string
  mintText?: string
}) => {
  const { address: userAddress, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { openModal } = useContext(ModalContext)

  const { data: mintUserBalance } = useContractRead({
    address: address as Address,
    abi: CastrABI,
    functionName: 'balanceOf',
    args: [userAddress],
  })

  const hasMinted = Number(mintUserBalance) > 0

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
        <div className="p-10 w-[400px] lg:w-[600px] text-center">
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
            onClick={
              !isConnected
                ? show
                : chain?.id !== base?.id
                ? onSwitchNetwork
                : show
            }
            className={`hover:text-base uppercase text-xl hover:text-xl p-2 ${className}`}>
            {!isConnected
              ? mintText
                ? mintText
                : 'Login to Mint '
              : chain?.id !== base?.id && 'Click and switch to Base'}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  ) : (
    <div className="flex flex-row justify-center">
      <Button
        variant={'default'}
        onClick={() => !hasMinted && mint()}
        // isLoading={isLoading}
        className={`w-full uppercase p-2 border ${className}`}>
        {hasMinted
          ? 'Successfully Minted'
          : mintText
          ? mintText
          : 'MINT LIVESTREAM'}
      </Button>
    </div>
  )
}

export default MintButton
