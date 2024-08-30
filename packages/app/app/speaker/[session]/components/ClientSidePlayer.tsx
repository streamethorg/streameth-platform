'use client';

import { PlayerWithControls } from '@/components/ui/Player';
import { Src } from '@livepeer/react';

export default function ClientSidePlayer({
  name,
  thumbnail,
  src,
  caption,
}: {
  name: string;
  thumbnail: string;
  src: Src[];
  caption: string;
}) {
  return (
    <PlayerWithControls
      name={name}
      thumbnail={thumbnail}
      src={src}
      caption={caption}
    />
  );
}
