import React from 'react'

const TitleTextItem = ({
  title,
  text,
}: {
  title: string
  text?: string | number
}) => {
  return (
    <div className="flex gap-2 items-center">
      <p className="font-semibold">{title}</p>
      <p>{text}</p>
    </div>
  )
}

export default TitleTextItem
