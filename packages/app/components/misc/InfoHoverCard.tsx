import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Info } from 'lucide-react'

const InfoHoverCard = ({
  title,
  description,
  size = 24,
  stroke = 2,
}: {
  title: string
  description: string
  size?: number
  stroke?: number
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Info size={size} strokeWidth={stroke} />
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-sm">{description}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default InfoHoverCard
