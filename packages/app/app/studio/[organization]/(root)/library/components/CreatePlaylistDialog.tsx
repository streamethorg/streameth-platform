'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createPlaylistAction, updatePlaylistAction } from '@/lib/actions/playlists';
import { PlusIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { getFormSubmitStatus } from '@/lib/utils/utils';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { Switch } from '@/components/ui/switch';
import { IPlaylist } from 'streameth-new-server/src/interfaces/playlist.interface';

const PlaylistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});

type PlaylistFormData = z.infer<typeof PlaylistSchema>;

interface CreatePlaylistDialogProps {
  playlist?: IPlaylist;
  trigger?: React.ReactNode;
}

export function CreatePlaylistDialog({ playlist, trigger }: CreatePlaylistDialogProps) {
  const params = useParams();
  const { organization } = useOrganization(params.organization as string);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<PlaylistFormData>({
    resolver: zodResolver(PlaylistSchema),
    defaultValues: {
      name: playlist?.name || '',
      description: playlist?.description || '',
      isPublic: playlist?.isPublic || false,
    },
  });

  const handleModalClose = () => {
    setOpen(false);
    form.reset();
  };

  const onSubmit = async (values: PlaylistFormData) => {
    if (!organization?._id) return;
    
    setIsLoading(true);
    try {
      if (playlist) {
        // Update existing playlist
        await updatePlaylistAction({
          playlist: values,
          organizationId: organization._id,
          playlistId: playlist._id?.toString() as string,
        });
        toast.success('Playlist updated successfully');
      } else {
        // Create new playlist
        await createPlaylistAction({
          playlist: {
            ...values,
            organizationId: organization._id,
          },
        });
        toast.success('Playlist created successfully');
      }
      router.refresh();
      handleModalClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save playlist';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Playlist
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{playlist ? 'Edit' : 'Create New'} Playlist</DialogTitle>
              <DialogDescription>
                {playlist ? 'Update your playlist details.' : 'Create a new playlist to organize your sessions.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter playlist name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter playlist description (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Public Playlist</FormLabel>
                      <FormDescription>
                        Make this playlist visible to everyone
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={getFormSubmitStatus(form) || isLoading}
                loading={isLoading}
              >
                {playlist ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 