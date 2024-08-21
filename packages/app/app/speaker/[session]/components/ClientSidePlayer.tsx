'use client';

import { PlayerWithControls } from '@/components/ui/Player';

export default function ClientSidePlayer({ name, thumbnail, src }: any) {
  return <PlayerWithControls name={name} thumbnail={thumbnail} src={src} />;
}
