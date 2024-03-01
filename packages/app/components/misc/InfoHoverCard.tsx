import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Info, LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent } from 'react'

type IconType = ForwardRefExoticComponent<LucideProps> & {
  displayName?: string
}

const InfoHoverCard = ({
  title,
  description,
  size = 24,
  stroke = 2,
  Icon = Info,
  iconColor,
  iconClassName,
}: {
  title: string
  description: string
  size?: number
  stroke?: number
  Icon?: IconType
  iconColor?: string
  iconClassName?: string
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Icon
          className={iconClassName}
          color={iconColor}
          size={size}
          strokeWidth={stroke}
        />
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
