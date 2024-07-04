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
      className="group flex w-full items-center rounded-xl border hover:bg-gray-200"
      onClick={() => handleCopy(text)}>
      <span className="m-2 flex-1 cursor-pointer truncate rounded">
        {text}
      </span>
      <Copy className="mr-2 p-1 opacity-0 group-hover:opacity-100">
        Copy to clipboard
      </Copy>
    </div>
  )
}
