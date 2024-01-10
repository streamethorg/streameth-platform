const Iframe = ({
  organizationId,
  eventId,
}: {
  organizationId: string
  eventId: string
}) => (
  <iframe
    src={`/${organizationId}/${eventId}`}
    className="w-full h-full"
  />
)

export default Iframe
