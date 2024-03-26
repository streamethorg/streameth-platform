import { cn } from '@/lib/utils/utils'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { fetchOrganization } from '@/lib/services/organizationService'
import Logo from '@/public/studio_logo.png'
import NavigationItem from './NavigationItem'
import { Radio, Videotape, Settings, Home } from 'lucide-react'
import Image from 'next/image'
const navigationItems = [
  {
    title: 'Home',
    navigationPath: '/studio',
    icon: <Home />,
  }, {
    title: 'Events',
    navigationPath: 'events',
    icon: <Videotape />,
  },
  {
    title: 'Library',
    navigationPath: 'videos',
    icon: <Videotape />,
  },
  {
    title: 'Livestreams',
    navigationPath: 'livestreams',
    icon: <Videotape />,
  },
  {
    title: 'NFTS',
    navigationPath: 'nfts',
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
        'bg-primary overflow-auto w-full max-w-[250px] h-full border-r border-border flex flex-col text-foreground'
      )}>
      <div className="flex flex-col p-4  justify-between items-center">
        <Image src={Logo} alt="Logo" width={160} height={80} />
      </div>
      <Accordion type="single" className='p-4 space-y-4' collapsible>
        {navigationItems.map((item, index) => (
          <NavigationItem key={index} {...item} />
        ))}
      </Accordion>
    </div>
  )
}

export default Navigation
