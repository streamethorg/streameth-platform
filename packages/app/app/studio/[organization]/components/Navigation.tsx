import { cn } from '@/lib/utils/utils'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { fetchOrganization } from '@/lib/services/organizationService'
import Logo from '@/public/studio_logo.png'
import NavigationItem from './NavigationItem'
import { Radio, Videotape, Video, Settings, Home } from 'lucide-react'
import Image from 'next/image'
const navigationItems = [
  {
    title: 'Home',
    navigationPath: '',
    icon: <Home />,
  },
  {
    title: 'Events',
    navigationPath: 'event',
    icon: <Videotape />,
  },
  {
    title: 'Library',
    navigationPath: 'library',
    icon: <Videotape />,
  },
  {
    title: 'Livestreams',
    navigationPath: 'livestreams',
    icon: <Radio />,
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
        'bg-primary overflow-auto w-full max-w-[250px] h-full border-r border-border flex flex-col text-black'
      )}>
      <Image
        className="p-4"
        src={Logo}
        alt="Logo"
        width={160}
        height={80}
      />

      <Accordion type="single" className="p-4 space-y-4" collapsible>
        {navigationItems.map((item, index) => (
          <NavigationItem
            organization={organizationSlug}
            key={index}
            {...item}
          />
        ))}
      </Accordion>
    </div>
  )
}

export default Navigation
