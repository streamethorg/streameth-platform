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
    className="flex justify-between overflow-hidden items-center pr-2 bg-muted rounded-lg">
    <div className="flex gap-1 items-center text-muted-foreground">
      <div className="border-r border-red p-2 text-sm">
        <p>{label}</p>
      </div>
      <p className="text-sm overflow-auto">{text}</p>
    </div>
    <Copy
      onClick={() => copyToClipboard(text)}
      className="text-primary w-5 h-5 cursor-pointer"
    />
  </div>
)
export default CopyText
