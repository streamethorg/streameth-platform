import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const FeaturedEvents = () => {
  const events = [
    {
      id: 1,
      title: 'Event 1',
      date: '2024-08-01',
      image: 'https://via.placeholder.com/300x200',
    },
    // Add more events as needed
  ]

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event, index) => (
        <Card
          key={event.id}
          className="overflow-hidden transition-all animate-in fade-in zoom-in duration-300 ease-out hover:scale-105 hover:cursor-pointer"
          style={{ animationDelay: `${index * 150}ms` }}>
          <CardHeader className="p-0">
            <img
              src={event.image}
              alt={event.title}
              className="h-48 w-full object-cover"
            />
          </CardHeader>
          <CardContent className="p-5">
            <CardTitle className="mb-2 text-xl font-bold">
              {event.title}
            </CardTitle>
            <CardDescription>{event.date}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default FeaturedEvents
