import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDate } from '@/lib/utils/time'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisVertical } from 'lucide-react'
import { IExtendedStage } from '@/lib/types'

const LivestreamCard = ({
  name,
  thumbnail,
  date,
  showDate = true,
  link,
  DropdownMenuItems,
  livestream,
}: {
  name: string
  thumbnail: string
  date: string
  showDate?: boolean
  link: string
  DropdownMenuItems?: React.ReactNode
  livestream: IExtendedStage
}) => {
  return (
    <div className="flex flex-row md:flex-col space-y-2 w-full min-h-full uppercase rounded-xl">
      <div className="flex-none my-auto w-1/4 md:w-full">
        <Link href={link}>
          <Thumbnail imageUrl={thumbnail} />
        </Link>
      </div>
      <div className="flex-grow ml-4 md:ml-0">
        <CardHeader className="p-1 mt-1 rounded shadow-none md:py-0 lg:py-0 md:px-1 lg:px-1 lg:shadow-none">
          <Link href={link}>
            <CardTitle className="overflow-hidden text-sm capitalize hover:underline line-clamp-2">
              {name}
            </CardTitle>
          </Link>
          {showDate && (
            <div className="flex justify-between items-center">
              <CardDescription className="text-xs">
                {livestream.isMultipleDate && livestream.streamEndDate
                  ? `${formatDate(
                      new Date(date),
                      'ddd. MMM. D, YYYY, h:mm a'
                    )} - ${formatDate(
                      new Date(livestream.streamEndDate),
                      'ddd. MMM. D, YYYY, h:mm a'
                    )}`
                  : formatDate(
                      new Date(date),
                      'ddd. MMM. D, YYYY, h:mm a'
                    )}
              </CardDescription>
            </div>
          )}
        </CardHeader>
        {DropdownMenuItems && (
          <DropdownMenu>
            <DropdownMenuTrigger className="z-10">
              <EllipsisVertical className="mt-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {DropdownMenuItems}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

export default LivestreamCard
