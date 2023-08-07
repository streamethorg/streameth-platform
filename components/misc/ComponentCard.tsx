'use client'

const ComponentCard = ({
  children,
  title,
  date,
  streatch = false,
}: {
  streatch?: boolean;
  title?: string;
  date?: Date;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`shadow rounded flex flex-col bg-base`}
    >
      {title && (
        <div className="flex font-bold flex-col md:flex-row rounded-t border-b-2 border-accent text-main-text p-3 px-4 uppercase ">
          {title}
          {date && <div className="pt-2 text-sm md:ml-auto md:text-md md:pt-0 text-gray-400">{date.toDateString()}</div>}
        </div>
      )}
      <div className="p-4 flex flex-col">{children}</div>
    </div>
  )
}

export default ComponentCard
