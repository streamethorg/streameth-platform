const ComponentWrapper = ({
  sectionId,
  children,
}: {
  sectionId?: string
  children: React.ReactNode
}) => {
  return (
    <div
      id={sectionId}
      className="my-2 md:my-4 bg-background-50 before:relative w-full z-[1] backdrop-blur-sm  rounded-xl p-2 md:p-4 text-white ">
      {children}
    </div>
  )
}

export default ComponentWrapper
