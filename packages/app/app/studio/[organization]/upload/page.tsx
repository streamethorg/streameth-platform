import { fetchEvents } from '@/lib/services/eventService'
import { studioPageParams } from '@/lib/types'
import SwitchEvent from './components/SwitchEvent'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UploadCloud } from 'lucide-react'

const Upload = async ({ params }: studioPageParams) => {
  const events = await fetchEvents({
    organizationSlug: params.organization,
  })

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <UploadCloud size={65} />
      Please choose an event first before proceeding to the next
      step...
      <div className="flex gap-5 mt-5">
        <SwitchEvent events={events} />
        <Link href="/studio/create">
          <Button>Create An Event</Button>
        </Link>
      </div>
    </div>
  )
}

export default Upload
