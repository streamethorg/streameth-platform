const Card = ({
  bgColor = 'bg-base',
  children,
}: {
  bgColor?: string
  children: React.ReactNode
  isAvailable?: boolean
}) => (
  <div
    style={{
      backgroundColor: bgColor,
      color: bgColor ? 'white' : 'black',
    }}
    className={`sm:h-full p-2 ${
      bgColor ? bgColor : 'bg-base'
    } text-white transition-all rounded-xl hover:shadow-xl uppercase`}>
    {children}
  </div>
)

export default Card
