'use client'

import { toast } from 'sonner'
import { Copy } from 'lucide-react'

const CopyItem = ({
  item,
  itemName,
}: {
  item: string
  itemName: string
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(item)
    toast.success(`Copied ${itemName} to your clipboard`)
  }

  return (
    <div
      className="group flex cursor-pointer items-center hover:bg-gray-200"
      onClick={handleCopy}>
      <span className="m-2 truncate">{item}</span>
      <Copy className="mr-2 p-1 opacity-0 group-hover:opacity-100" />
    </div>
  )
}

export default CopyItem
