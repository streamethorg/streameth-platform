const Card = ({ children, isAvailable = true }: { children: React.ReactNode; isAvailable?: boolean }) => (
  <div className={` flex flex-col rounded-md p-2 shadow box-border ${isAvailable ? 'cursor-pointer bg-base' : 'bg-gray-200'}`}>{children}</div>
)

export default Card
