const Card = ({ children, isAvailable = true }: { children: React.ReactNode; isAvailable?: boolean }) => (
  <div className={`flex flex-col rounded-md h-full p-4 shadow box-border ${isAvailable ? 'cursor-pointer bg-base' : 'bg-gray-200'}`}>{children}</div>
)

export default Card
