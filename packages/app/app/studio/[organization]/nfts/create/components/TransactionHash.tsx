import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const TransactionHash = ({ hash }: { hash: string }) => {
  return (
    <Link
      target="_blank"
      rel="noopener"
      className="text-blue text-sm mt-1 flex items-center gap-1"
      href={`https://sepolia.basescan.org/tx/${hash}`}>
      View on Base Scan <ExternalLinkIcon className="w-4 h-4" />
    </Link>
  )
}

export default TransactionHash
