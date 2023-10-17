import CreateEditEvent from '../[event]/components/CreateEditEvent'

interface Params {
  event: string
  organization: string
}

const CreateEvent = async ({ params }: { params: Params }) => {
  return (
    <div className="px-4 pb-8">
      <CreateEditEvent organizationId={params.organization} />
    </div>
  )
}

export default CreateEvent
