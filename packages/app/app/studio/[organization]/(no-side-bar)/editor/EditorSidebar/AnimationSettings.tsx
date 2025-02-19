import React, { useEffect, useState } from 'react';
import { useTimelineContext } from '../context/TimelineContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IExtendedSession } from '@/lib/types';
import { ParseSessionMediaAction } from '@/lib/actions/sessions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useOrganizationContext } from '@/lib/context/OrganizationContext';
import { useSearch } from '@/components/misc/SearchBar/useSearch';
import { Loader2, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import Clip from '../../clips/[stageId]/sidebar/clips/Clip';
import Thumbnail from '@/components/misc/VideoCard/thumbnail';
import { useEditorContext } from '../context/EditorContext';
const AddMediaAssetModal = () => {
  const { addEvent } = useTimelineContext();
  const [isOpen, setIsOpen] = useState(false);
  const { organizationId } = useOrganizationContext();
  const { addSession } = useEditorContext();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    assetType,
    setAssetType,
  } = useSearch(organizationId, true);

  const handleAddEvent = async (session: IExtendedSession) => {
    if (!session.assetId) {
      toast.error('Session has no asset id');
      return;
    }
    const metadata = await ParseSessionMediaAction({
      assetId: session.assetId,
    });
    addSession({
      ...session,
    });
    addEvent({
      id: session._id,
      label: session.name,
      start: 0,
      end: metadata.durationInSeconds,
      timeLineStart: 0,
      timeLineEnd: metadata.durationInSeconds,
      duration: metadata.durationInSeconds,
      url: metadata.videoUrl,
      type: 'media',
      fps: metadata.fps,
    });
    toast.success('Media asset added');
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outlinePrimary">
          <Plus className="w-4 h-4" /> Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-none max-h-[60vh] flex flex-col h-full  w-[80vw]">
        <DialogHeader>
          <DialogTitle>Add Media Asset</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="video" className="h-full w-full">
          <TabsList className="text-xl">
            <TabsTrigger value="video" onClick={() => setAssetType('video')}>
              Video
            </TabsTrigger>
            <TabsTrigger
              value="animation"
              onClick={() => setAssetType('animation')}
            >
              Animation
            </TabsTrigger>
          </TabsList>
          <TabsContent value={assetType} className="h-full w-full">
            <div className="flex flex-col gap-2 h-full w-full">
              <Input
                placeholder="Search for a media asset"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 h-[calc(100%-20%)] w-full overflow-y-scroll">
                {searchResults.map((result) => (
                  <Clip
                    key={result._id}
                    session={result}
                    importSession={() => handleAddEvent(result)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default function AnimationSettings() {
  const { importedSessions, setSelectedSession } = useEditorContext();
  const { addEvent, removeEvent } = useTimelineContext();

  const handleAddEvent = async (session: IExtendedSession) => {
    if (!session.assetId) {
      toast.error('Session has no asset id');
      return;
    }
    const metadata = await ParseSessionMediaAction({
      assetId: session.assetId,
    });
    addEvent({
      id: session._id,
      label: session.name,
      start: 0,
      end: metadata.durationInSeconds,
      timeLineStart: 0,
      timeLineEnd: metadata.durationInSeconds,
      duration: metadata.durationInSeconds,
      url: metadata.videoUrl,
      type: 'media',
      fps: metadata.fps,
    });
  };

  const handleRemoveEvent = (session: IExtendedSession) => {
    removeEvent(session._id);
  };

  return (
    <div className="space-y-6">
      <AddMediaAssetModal />
      <div className="grid grid-cols-3 gap-2">
        {importedSessions.map((session) => (
          <div
            key={session._id}
            className="flex flex-col gap-2 relative w-full h-full"
          >
            <div
              className="w-full h-full relative group cursor-pointer"
              onClick={() => setSelectedSession(session)}
            >
              <Thumbnail imageUrl={session.coverImage} />
              <div className="h-8 flex flex-row justify-end space-x-2 items-center absolute bottom-0 rounded-b-md left-0 right-0 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="default"
                  size="icon"
                  className="w-6 h-6"
                  onClick={() => handleAddEvent(session)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="w-6 h-6"
                  onClick={() => handleRemoveEvent(session)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs font-medium text-ellipsis w-2/3 truncate h-full">
              {session.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
