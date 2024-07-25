import React from 'react';

const TitleTextItem = ({
  title,
  text,
}: {
  title: string;
  text?: string | number;
}) => {
  return (
    <div className="flex items-center gap-2">
      <p className="font-semibold">{title}</p>
      <p>{text}</p>
    </div>
  );
};

export default TitleTextItem;
