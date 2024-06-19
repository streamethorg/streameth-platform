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
      className="flex items-center cursor-pointer hover:bg-gray-200 group"
      onClick={handleCopy}>
      <span className="m-2 truncate">{item}</span>
      <Copy className="p-1 mr-2 opacity-0 group-hover:opacity-100" />
    </div>
  )
}

export default CopyItem
