'use client';

import { createClipAction, createSessionAction } from '@/lib/actions/sessions';
import { Card } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import { useClipContext } from '../ClipContext';
import { clipSchema } from '@/lib/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import useSearchParams from '@/lib/hooks/useSearchParams';
import { fetchSession } from '@/lib/services/sessionService';
import { IExtendedSession, IExtendedStage } from '@/lib/types';
import { SessionType } from 'streameth-new-server/src/interfaces/session.interface';
import { fetchStage } from '@/lib/services/stageService';
import CreateClipForm from './CreateClipForm';
import { useMarkersContext } from '../sidebar/markers/markersContext';

const CreateClipButton = ({}: {}) => {
  const { stageId, setIsCreatingClip, startTime, endTime, videoRef, clipUrl } =
    useClipContext();

  const { markers, selectedMarkerId, setSelectedMarkerId, organizationId } =
    useMarkersContext();

  const [isCreateClip, setIsCreateClip] = useState(false);
  const [sessionRecording, setSessionRecording] =
    useState<IExtendedSession | null>(null);
  const [stage, setStage] = useState<IExtendedStage | null>(null);
  const { searchParams } = useSearchParams();

  const sessionId = searchParams?.get('sessionId');

  const getSession = async () => {
    if (!sessionId) return;
    try {
      const session = await fetchSession({ session: sessionId });
      if (!session) {
        toast.error('Failed to fetch session');
        console.error('🚨 Session fetch failed');
        return;
      }
      setSessionRecording(session);
      console.log('🔄 Session fetched successfully');
    } catch (error) {
      console.error('🚨 Error fetching session:', error);
      toast.error('Failed to fetch session data');
    }
  };

  const getStage = async () => {
    if (!stageId) return;
    try {
      const stageData = await fetchStage({ stage: stageId });
      if (!stageData) {
        toast.error('Failed to fetch stage');
        console.error('🚨 Stage fetch failed');
        return;
      }
      setStage(stageData);
      console.log('🔄 Stage fetched successfully');
    } catch (error) {
      console.error('🚨 Error fetching stage:', error);
      toast.error('Failed to fetch stage data');
    }
  };

  useEffect(() => {
    getSession();
    getStage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handlePreview = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime.displayTime;
      videoRef.current.play();
      console.log('🔄 Preview started');
    }
  };

  const selectedMarker = markers.find(
    (marker) => marker._id === selectedMarkerId
  );
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
      startClipTime: startTime.displayTime,
      endClipTime: endTime.displayTime,
      captionEnabled: false,
      introAnimation: '',
      outroAnimation: '',
      selectedAspectRatio: '16:9',
      pretalxSessionCode: '',
    },
  });

  // Check for caption and animations
  const checkEditorOptions = (values: z.infer<typeof clipSchema>) => {
    return (
      values.captionEnabled ||
      Boolean(values.introAnimation) ||
      Boolean(values.outroAnimation) ||
      values.selectedAspectRatio !== '16:9'
    );
  };
  const hasEditorOptions = checkEditorOptions(form.getValues());

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

  useEffect(() => {
    if (selectedMarker) {
      form.reset({
        name: selectedMarker.name ?? '',
        description: selectedMarker.description ?? 'No description',
        start: selectedMarker.start,
        end: selectedMarker.end,
        startClipTime: startTime.displayTime,
        endClipTime: endTime.displayTime,
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
    if (!stage?.streamSettings?.playbackId || !sessionRecording?.assetId) {
      setIsCreateClip(false);
      console.error('🚨 Missing required data for clip creation');
      return toast.error('Missing required data for clip creation');
    }

    if (endTime.unix < startTime.unix) {
      setIsCreateClip(false);
      console.error('🚨 End time must be greater than start time');
      return toast.error('End time must be greater than start time');
    }

    const mainClipSession = {
      name: values.name,
      description: values.description,
      speakers: values?.speakers,
      startClipTime: startTime.unix,
      endClipTime: endTime.unix,
      start: values.start,
      end: values.end,
      organizationId,
      stageId,
      pretalxSessionCode: values.pretalxSessionCode,
    };

    const sessionType = hasEditorOptions
      ? SessionType.editorClip
      : SessionType.clip;

    try {
      const session = await createSessionAction({
        session: { ...mainClipSession, type: SessionType.clip },
      });

      if (!session || !session._id) {
        throw new Error('Failed to create session');
      }

      const mainClipData = {
        start: startTime.displayTime,
        end: endTime.displayTime,
        sessionId: session._id,
        organizationId,
        clipUrl: clipUrl,
      };

      if (hasEditorOptions) {
        const events = [
          ...(values.outroAnimation
            ? [
                {
                  videoUrl: values.outroAnimation,
                  label: 'outro',
                },
              ]
            : []),
          ...(values.introAnimation
            ? [
                {
                  videoUrl: values.introAnimation,
                  label: 'intro',
                },
              ]
            : []),
          {
            sessionId: session._id as string,
            label: 'main',
          },
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
        console.log(
          'Creating clip with options:',
          JSON.stringify(clipCreationOptions, null, 2)
        );
        // Call createClipAction with the prepared editor options
        await createClipAction(clipCreationOptions);
        console.log('🔄 Clip created with editor options');
      } else {
        console.log(
          'Creating clip without editor options:',
          JSON.stringify(mainClipData, null, 2)
        );
        await createClipAction({ ...mainClipData, isEditorEnabled: false });
        console.log('🔄 Clip created without editor options');
      }

      toast.success('Clip created');
      setIsCreatingClip(false);
    } catch (error) {
      console.error('🚨 Error creating clip:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error creating clip'
      );
    } finally {
      setIsCreateClip(false);
    }
  };

  return (
    <Card className="border-none rounded-none shadow-none">
      <CreateClipForm
        form={form}
        handleCreateClip={handleCreateClip}
        handleClearMarker={handleClearMarker}
        organizationId={organizationId}
        isCreateClip={isCreateClip}
        handlePreview={handlePreview}
      />
    </Card>
  );
};

export default CreateClipButton;
