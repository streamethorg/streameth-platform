import { cn } from '@/lib/utils/utils'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { fetchOrganization } from '@/lib/services/organizationService'

const Navigation = ({
  organizationSlug,
}: {
  organizationSlug: string
}) => {
  const organization = fetchOrganization({ organizationSlug })
  return (
    <div
      className={cn(
        'overflow-auto w-full max-w-[250px] h-full border-r border-border flex flex-col text-foreground'
      )}>
      <div className="flex flex-row p-2 justify-between items-center border-b border-border">
        <h3 className="text-2xl font-bold mt-4 mb-2 ">
          Event settings
        </h3>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem title="General" value="events">
          Library
        </AccordionItem>
        <AccordionItem title="videos" value="videos">
          Library
        </AccordionItem>
        <AccordionItem title="audio" value="audio">
          Settings
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Navigation
