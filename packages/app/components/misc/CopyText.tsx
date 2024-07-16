'use client';
import { copyToClipboard } from '@/lib/utils/utils';
import { Copy } from 'lucide-react';

const CopyText = ({
  label,
  text = '',
  width = '450px',
}: {
  label: string;
  text?: string;
  width?: string;
}) => (
  <div
    style={{ width: width }}
    className="bg-muted flex items-center justify-between overflow-hidden rounded-lg pr-2"
  >
    <div className="text-muted-foreground flex items-center gap-1">
      <div className="border-red border-r p-2 text-sm">
        <p>{label}</p>
      </div>
      <p className="overflow-auto text-sm">{text}</p>
    </div>
    <Copy
      onClick={() => copyToClipboard(text)}
      className="text-primary h-5 w-5 cursor-pointer"
    />
  </div>
);
export default CopyText;
