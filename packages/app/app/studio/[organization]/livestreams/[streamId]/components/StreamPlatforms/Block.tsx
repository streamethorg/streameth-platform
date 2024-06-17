import React, { useState } from 'react'
import { SiX, SiYoutube } from 'react-icons/si'
import { Radio } from 'lucide-react'
import CreateCustomStream from './CustomRtmp'

interface StreamTargetItem {
  title: string
  icon: JSX.Element
  onClick?: () => JSX.Element
}

const StreamTarget: StreamTargetItem[] = [
  {
    title: 'X',
    icon: <SiX size={35} />,
  },
  {
    title: 'YouTube',
    icon: <SiYoutube size={45} color="#ff0000" />,
  },
  {
    title: 'Custom RTMP',
    icon: <Radio size={50} />,
    onClick: () => <CreateCustomStream />,
  },
]

const Block = ({
  index,
  item,
  handleClick,
}: {
  index: number
  item: StreamTargetItem
  handleClick: () => void
}) => {
  return (
    <div
      key={index}
      className="flex flex-col justify-between items-center py-4 bg-white rounded shadow transition-colors hover:bg-gray-100 hover:cursor-pointer"
      onClick={handleClick}>
      <span className="my-auto">{item.icon}</span>
      <span className="text-black">{item.title}</span>
    </div>
  )
}

const IconGrid: React.FC = () => {
  const [SelectedComponent, setSelectedComponent] =
    useState<JSX.Element | null>(null)

  const handleBlockClick = (item: StreamTargetItem) => {
    if (item.onClick) {
      setSelectedComponent(item.onClick())
    }
  }

  return (
    <div>
      {SelectedComponent ? (
        SelectedComponent
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {StreamTarget.map((item, index) => (
            <Block
              key={index}
              index={index}
              item={item}
              handleClick={() => handleBlockClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default IconGrid
