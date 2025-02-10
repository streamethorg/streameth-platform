"use client"
import React, { useState } from 'react';
import { SiX, SiYoutube } from 'react-icons/si';
import { Radio } from 'lucide-react';
import CreateCustomStream from './forms/CustomRtmpForm';
import NotFound from '@/app/not-found';
import CreateYoutubeStream from './CreateYoutubeStream';
import { IExtendedOrganization, IExtendedStage } from '@/lib/types';
import { TargetOutput } from 'streameth-new-server/src/interfaces/stage.interface';

interface StreamTargetItem {
  title: string;
  icon: JSX.Element;
  onClick?: () => JSX.Element;
}
const Block = ({
  index,
  item,
  handleClick,
}: {
  index: number;
  item: StreamTargetItem;
  handleClick: () => void;
}) => {
  return (
    <div
      key={index}
      className="flex flex-col justify-between items-center py-4 bg-white rounded shadow transition-colors hover:bg-gray-100 hover:cursor-pointer"
      onClick={handleClick}
    >
      <span className="my-auto">{item.icon}</span>
      <span className="text-black">{item.title}</span>
    </div>
  );
};

const StreamPlatformGrid = ({
  streamId,
  setIsOpen,
  stageId,
  streamTargets,
}: {
  streamId: string;
  setIsOpen: (open: boolean) => void;
  stageId: string;
  streamTargets: TargetOutput[];
}) => {
  const [SelectedComponent, setSelectedComponent] =
    useState<JSX.Element | null>(null);

  const StreamTarget: StreamTargetItem[] = [
    {
      title: 'YouTube',
      icon: <SiYoutube size={45} color="#ff0000" />,
      onClick: () => (
        <CreateYoutubeStream
          stageId={stageId}
          setIsOpen={setIsOpen}
          streamTargets={streamTargets}
        />
      ),
    },
    {
      title: 'Custom RTMP',
      icon: <Radio size={50} />,
      onClick: () => (
        <CreateCustomStream
          streamId={streamId}
          setIsOpen={setIsOpen}
        />
      ),
    },
  ];

  const handleBlockClick = (item: StreamTargetItem) => {
    if (item.onClick) {
      setSelectedComponent(item.onClick());
    }
  };

  return (
    <div>
      {SelectedComponent ? (
        SelectedComponent
      ) : (
        <div className="grid grid-cols-2 gap-2">
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
  );
};

export default StreamPlatformGrid;
