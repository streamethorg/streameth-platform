'use client';

import { HuddleIframe } from '@huddle01/iframe';

const HuddlePlayer = ({
  roomUrl,
  projectId,
}: {
  roomUrl: string;
  projectId: string;
}) => {
  return (
    <HuddleIframe
      roomUrl={`https://iframe.huddle01.com/${roomUrl}/lobby`}
      className="w-full aspect-video"
      projectId={projectId}
    />
  );
};

export default HuddlePlayer;
