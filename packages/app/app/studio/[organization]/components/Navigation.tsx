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
        'overflow-auto bg-[#251571]  w-full max-w-[250px] h-full border-r border-border flex flex-col text-foreground'
      )}>
      <div className="flex space-y-2 p-4 gap-2 text-white items-center border-b border-border">
        <Avatar className="">
          <AvatarImage
            src="/logo.png"
            alt="Streameth Studio"
            width={40}
            height={35}
          />
        </Avatar>
        <div>
          <h3 className="font-bold text-2xl">StreamETH</h3>
          <p className="font-medium text-sm tracking-wider">STUDIO</p>
        </div>
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
