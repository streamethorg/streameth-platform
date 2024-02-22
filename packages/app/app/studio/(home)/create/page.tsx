import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
} from '@/components/ui/card'
import CreateOrganizationForm from '../components/CreateOrganizationForm'

const CreateOrganization = () => {
  return (
    <div className="w-full h-full p-4 flex">
      <Card className="max-w-3xl w-full m-auto border-secondary shadow-none">
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
