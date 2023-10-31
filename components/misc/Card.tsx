const Card = ({
  children,
}: {
  children: React.ReactNode
  isAvailable?: boolean
}) => (
  <div className="h-full p-2 bg-base rounded-xl text-white uppercase">
    {children}
  </div>
)

export default Card
