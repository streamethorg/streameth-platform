import { cn } from '@/lib/utils/utils'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { fetchOrganization } from '@/lib/services/organizationService'
import {
  AvatarImage,
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import Logo from '@/public/logo.png'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import NavigationItem from './NavigationItem'
import { Radio, Videotape, Settings } from 'lucide-react'

const navigationItems = [
  {
    title: 'Events',
    navigationPath: 'events',
    icon: <Radio />,
  },
  {
    title: 'Videos',
    navigationPath: 'videos',
    icon: <Videotape />,
  },
  {
    title: 'Settings',
    navigationPath: 'settings',
    icon: <Settings />,
  },
]

const Navigation = async ({
  organizationSlug,
}: {
  organizationSlug: string
}) => {
  const organization = await fetchOrganization({ organizationSlug })
  if (!organization) return null
  return (
    <div
      className={cn(
        'overflow-auto w-full max-w-[250px] h-full border-r border-border flex flex-col text-foreground'
      )}>
      <div className="flex flex-col space-y-2 p-4 justify-between items-center border-b border-border">
        <Avatar className="">
          <AvatarImage
            src={organization?.logo}
            alt={organization.name}
          />
          <AvatarFallback>
            {organization.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>

        <h3 className="text-2xl font-bold">{organization.name}</h3>
        <Badge variant={'outline'}>
          <Link href={`/archive?organization=${organization.slug}`}>
            Organization page
          </Link>
        </Badge>
      </div>
      <Accordion type="single" collapsible>
        {navigationItems.map((item, index) => (
          <NavigationItem key={index} {...item} />
        ))}
      </Accordion>
    </div>
  )
}

export default Navigation
