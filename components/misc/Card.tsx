const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col rounded-md h-full p-4 shadow box-border bg-base">
    {children}
  </div>
);

export default Card;
