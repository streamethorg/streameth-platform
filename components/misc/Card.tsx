const Card = ({ children }: { children: React.ReactNode; isAvailable?: boolean }) => (
  <div className="border shadow rounded p-2 border-neutral-200 ">{children}</div>
)

export default Card
