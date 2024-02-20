import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
} from '@/components/ui/card'
import CreateOrganizationForm from '../components/CreateOrganizationForm'

const CreateOrganization = () => {
  return (
    <div className="w-full h-full p-4">
      <Card className="max-w-4xl m-auto border-secondary">
        <CardHeader>
          <CardTitle>Create an organization</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateOrganizationForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateOrganization
