import { Card, CardContent } from '@/components/ui/card'
import CreateEventForm from './components/createEventForm'

const CreateEventPage = ({
  searchParams: { step },
}: {
  searchParams: {
    step: string
  }
}) => {
  return (
    <div>
      <Card className="max-w-4xl mx-auto">
        <CardContent>
          <CreateEventForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateEventPage
