const Card = ({
  children,
}: {
  children: React.ReactNode
  isAvailable?: boolean
}) => (
  <div className="h-full p-2 bg-white transition-all rounded-xl hover:shadow-xl uppercase">
    {children}
  </div>
)

export default Card
