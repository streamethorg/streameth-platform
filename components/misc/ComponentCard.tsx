"use client";

const ComponentCard = ({
  children,
  title,
  date,
  streatch,
}: {
  streatch?: boolean;
  title?: string;
  date?: Date;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`${streatch && "h-full"} shadow rounded flex flex-col bg-base`}
    >
      {title && (
        <div className="flex font-bold flex-row rounded-t border-b-2 border-accent text-main-text p-3 px-4 uppercase ">
          {title}
          {date && <div className="pl-3 text-right text-accent">{date.toLocaleDateString()}</div>}
        </div>
      )}
      <div className="p-4 flex flex-col h-full">{children}</div>
    </div>
  );
};

export default ComponentCard;
