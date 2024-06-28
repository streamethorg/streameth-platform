'use client'
import { toast } from 'sonner'
import { Copy } from 'lucide-react'

export default function TextPlaceholder({ text }: { text: string }) {
  const handleCopy = (item: string) => {
    navigator.clipboard.writeText(item)
    toast.success('Copied to your clipboard')
  }

  return (
    <div
      className="flex items-center hover:bg-gray-200 group w-full border rounded-xl"
      onClick={() => handleCopy(text)}>
      <span className="flex-1 m-2 rounded cursor-pointer truncate">
        {text}
      </span>
      <Copy className="p-1 mr-2 opacity-0 group-hover:opacity-100">
        Copy to clipboard
      </Copy>
    </div>
  )
}
