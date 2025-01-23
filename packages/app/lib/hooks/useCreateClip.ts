'use client';

import { createClipAction, createSessionAction } from '@/lib/actions/sessions';
import { useState, useEffect } from 'react';
import { useClipContext } from '@/app/studio/[organization]/(no-side-bar)/clips/[stageId]/ClipContext';
import { clipSchema } from '@/lib/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { useMarkersContext } from '@/app/studio/[organization]/(no-side-bar)/clips/[stageId]/sidebar/markers/markersContext';
import { useClipsSidebar } from '@/app/studio/[organization]/(no-side-bar)/clips/[stageId]/sidebar/clips/ClipsContext';
import { useTrimmControlsContext } from '@/app/studio/[organization]/(no-side-bar)/clips/[stageId]/Timeline/TrimmControlsContext';

export const useCreateClip = () => {
  const { stageId, setIsCreatingClip, videoRef, clipUrl } =
    useClipContext();
  const { startTime, endTime } = useTrimmControlsContext();

  const { markers, selectedMarkerId, setSelectedMarkerId, organizationId } =
    useMarkersContext();
  const { fetchSessions } = useClipsSidebar();

  const [isCreateClip, setIsCreateClip] = useState(false);

  const form = useForm<z.infer<typeof clipSchema>>({
    resolver: zodResolver(clipSchema),
    defaultValues: {
      name: '',
      description: 'No description',
      start: new Date().getTime(),
      end: new Date().getTime(),
      organizationId: organizationId,
      stageId: stageId,
      speakers: [],
      startClipTime: startTime,
      endClipTime: endTime,
      captionEnabled: false,
      introAnimation: '',
      outroAnimation: '',
      selectedAspectRatio: '16:9',
      pretalxSessionCode: '',
    },
  });

  const checkEditorOptions = (values: z.infer<typeof clipSchema>) => {
    return (
      values.captionEnabled ||
      Boolean(values.introAnimation) ||
      Boolean(values.outroAnimation) ||
      values.selectedAspectRatio !== '16:9'
    );
  };

  const handlePreview = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
      videoRef.current.play();
      console.log('🔄 Preview started');
    }
  };

  const handleClearMarker = () => {
    setSelectedMarkerId('');
    form.reset({
      name: '',
      description: 'No description',
      start: new Date().getTime(),
      end: new Date().getTime(),
      organizationId: organizationId,
      stageId: stageId,
      speakers: [],
    });
    console.log('🔄 Marker cleared');
  };

  const selectedMarker = markers.find(
    (marker) => marker._id === selectedMarkerId
  );

  useEffect(() => {
    console.log('form', form.getValues());
  }, [form]);

  useEffect(() => {
    if (selectedMarker) {
      form.reset({
        name: selectedMarker.name ?? '',
        description: selectedMarker.description ?? 'No description',
        start: selectedMarker.start,
        end: selectedMarker.end,
        startClipTime: startTime,
        endClipTime: endTime,
        organizationId: organizationId,
        stageId: stageId,
        speakers:
          selectedMarker.speakers?.map((speaker) => ({
            ...speaker,
            organizationId: speaker?.organizationId?.toString(),
            eventId: speaker?.eventId?.toString(),
          })) ?? [],
        pretalxSessionCode: selectedMarker.pretalxSessionCode,
      });
      console.log('🔄 Marker data reset');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarker]);

  const handleCreateClip = async (values: z.infer<typeof clipSchema>) => {
    setIsCreateClip(true);

    if (endTime < startTime) {
      setIsCreateClip(false);
      console.error('🚨 End time must be greater than start time');
      return toast.error('End time must be greater than start time');
    }

    const mainClipSession = {
      name: values.name,
      description: values.description,
      speakers: values?.speakers,
      startClipTime: startTime,
      endClipTime: endTime,
      start: values.start,
      end: values.end,
      organizationId,
      stageId,
      pretalxSessionCode: values.pretalxSessionCode,
    };

    try {
      const session = await createSessionAction({
        session: { ...mainClipSession, type: SessionType.clip },
      });

      if (!session || !session._id) {
        throw new Error('Failed to create session');
      }

      const mainClipData = {
        start: startTime,
        end: endTime,
        sessionId: session._id,
        organizationId,
        clipUrl: clipUrl,
      };

      const hasEditorOptions = checkEditorOptions(values);

      if (hasEditorOptions) {
        const events = [
          ...(values.outroAnimation
            ? [{ videoUrl: values.outroAnimation, label: 'outro' }]
            : []),
          ...(values.introAnimation
            ? [{ videoUrl: values.introAnimation, label: 'intro' }]
            : []),
          { sessionId: session._id as string, label: 'main' },
        ];

        const clipCreationOptions = {
          ...mainClipData,
          isEditorEnabled: true,
          editorOptions: {
            events,
            captionEnabled: values.captionEnabled,
            selectedAspectRatio: values.selectedAspectRatio as string,
            frameRate: 30,
            captionPosition: 'bottom',
            captionLinesPerPage: 2,
            captionColor: values.captionColor || '#000000',
            captionFont: 'Arial',
          },
        };
        await createClipAction(clipCreationOptions);
      } else {
        await createClipAction({ ...mainClipData, isEditorEnabled: false });
      }

      toast.success('Clip created');
      setIsCreatingClip(false);
      fetchSessions();
    } catch (error) {
      console.error('🚨 Error creating clip:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error creating clip'
      );
    } finally {
      setIsCreateClip(false);
    }
  };

  return {
    form,
    isCreateClip,
    handleCreateClip,
    handleClearMarker,
    handlePreview,
  };
};
