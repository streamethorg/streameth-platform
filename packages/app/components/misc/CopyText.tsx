'use client'
import { copyToClipboard } from '@/lib/utils/utils'
import { Copy } from 'lucide-react'

const CopyText = ({
  label,
  text = '',
  width = '450px',
}: {
  label: string
  text?: string
  width?: string
}) => (
  <div
    style={{ width: width }}
    className="flex items-center justify-between overflow-hidden rounded-lg bg-muted pr-2">
    <div className="flex items-center gap-1 text-muted-foreground">
      <div className="border-red border-r p-2 text-sm">
        <p>{label}</p>
      </div>
      <p className="overflow-auto text-sm">{text}</p>
    </div>
    <Copy
      onClick={() => copyToClipboard(text)}
      className="h-5 w-5 cursor-pointer text-primary"
    />
  </div>
)
export default CopyText
