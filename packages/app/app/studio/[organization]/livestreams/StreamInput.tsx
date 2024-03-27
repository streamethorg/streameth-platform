'use client'
import { copyToClipboard } from '@/lib/utils/utils'
import { Copy } from 'lucide-react'

const StreamInput = ({
  label,
  text = '',
}: {
  label: string
  text?: string
}) => (
  <div className="flex justify-between items-center pr-2 w-[450px] bg-muted rounded-lg">
    <div className="flex gap-1 items-center text-muted-foreground">
      <div className="border-r border-red p-2 text-sm">
        <p>{label}</p>
      </div>
      <p className="text-sm">{text}</p>
    </div>
    <Copy
      onClick={() => copyToClipboard(text)}
      className="text-muted-foreground w-5 h-5 cursor-pointer"
    />
  </div>
)
export default StreamInput
