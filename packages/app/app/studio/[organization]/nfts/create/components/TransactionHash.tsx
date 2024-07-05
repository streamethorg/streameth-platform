import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const TransactionHash = ({ hash }: { hash: string }) => {
  return (
    <Link
      target="_blank"
      rel="noopener"
      className="mt-1 flex items-center gap-1 text-sm text-blue"
      href={`https://basescan.org/tx/${hash}`}>
      View on Base Scan <ExternalLinkIcon className="h-4 w-4" />
    </Link>
  )
}

export default TransactionHash
