import { Button } from '@/components/ui/button';
import { Card, CardDescription } from '@/components/ui/card';
import { formatDuration } from '@/lib/utils/time';
import { Trash2 } from 'lucide-react';
import { useClipContext } from '../../ClipContext';
import { convertSecondsToUnix } from '@/lib/utils/utils';
import { createMarkerAction } from '@/lib/actions/marker';
import { IHighlight } from '@/lib/types';
import { useState } from 'react';
const HighlightCard = ({
  organizationId,
  stageId,
  highlight,
  onDelete,
}: {
  organizationId: string;
  stageId: string;
  highlight: IHighlight;
  onDelete: (index: number) => void;
}) => {
  const { setStartTime, setEndTime, timeReference, videoRef } =
    useClipContext();
  const [isCreatingMarker, setIsCreatingMarker] = useState(false);

  const handlePreview = () => {
    if (!videoRef.current) return;
    setStartTime({
      unix: convertSecondsToUnix(timeReference, highlight.start),
      displayTime: highlight.start,
    });
    setEndTime({
      unix: convertSecondsToUnix(timeReference, highlight.end),
      displayTime: highlight.end,
    });
    videoRef.current.currentTime = highlight.start;
    videoRef.current.play();
  };

  const handleCreateMarker = async () => {
    setIsCreatingMarker(true);
    await createMarkerAction({
      marker: {
        startClipTime: highlight.start,
        endClipTime: highlight.end,
        start: highlight.start,
        end: highlight.end,
        name: highlight.title,
        description: highlight.title,
        organizationId: organizationId,
        stageId: stageId,
        date: new Date().toISOString(),
        color: 'blue',
      },
    });
    setIsCreatingMarker(false);
  };

  return (
    <Card className="w-full max-w-2xl  p-4 shadow-none space-y-2">
      <p className="truncate text-md ">{highlight.title}</p>
      <CardDescription>
        {formatDuration(highlight.start * 1000)} -{' '}
        {formatDuration(highlight.end * 1000)}
      </CardDescription>
      <div className="flex justify-start gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handlePreview();
          }}
        >
          Preview
        </Button>
        <Button
          variant="outline"
          size="sm"
          loading={isCreatingMarker}
          onClick={() => {
            handleCreateMarker();
          }}
        >
          Save
        </Button>
        <Button
          className="ml-auto"
          variant="outline"
          size="sm"
          onClick={() => {
            console.log('delete');
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default HighlightCard;
