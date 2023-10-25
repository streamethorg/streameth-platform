const Card = ({ children }: { children: React.ReactNode; isAvailable?: boolean }) => (
  <div className="border shadow rounded p-2 border-neutral-200 hover:bg-gray-100 transition-colors">{children}</div>
)

export default Card
