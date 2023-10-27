const ComponentWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(19,21,23,0.48)',
      }}
    className="my-2 md:my-4 before:relative w-full z-[1] backdrop-blur-sm  rounded-xl p-2 md:p-4 text-white ">
        {children}
    </div>
  )
}


export default ComponentWrapper