import Thumbnail from '@/components/misc/VideoCard/thumbnail'
import { fetchAllSessions } from '@/lib/data'
import Link from 'next/link'

const FeaturedEvents = async () => {
  const events = [
    {
      name: 'Event 1',
      date: '2022-01-01',
      url: 'https://www.google.com',
      thumbnail: 'https://via.placeholder.com/150',
    },
  ]

  return (
    <div className="grid max-h-[500px] grid-cols-3 gap-4">
      {events.map((event) => (
        <Link href={event.thumbnail} key={event.name}>
          <div className="">
            <Thumbnail imageUrl={event.thumbnail} />
            <div>
              <p>{event.name}</p>
              <p>{event.date}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default FeaturedEvents
