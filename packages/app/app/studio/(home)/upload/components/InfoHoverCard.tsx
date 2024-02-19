import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Info } from 'lucide-react'

const InfoHoverCard = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Info size={18} strokeWidth={2} />
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
