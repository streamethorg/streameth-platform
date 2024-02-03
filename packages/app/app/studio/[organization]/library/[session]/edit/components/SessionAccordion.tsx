'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ImageUpload from '@/components/misc/form/imageUpload'
import { sessionSchema } from '@/lib/schema'
import { ISessionModel } from 'streameth-new-server/src/interfaces/session.interface'

const SessionAccordion = ({
  session,
}: {
  session: ISessionModel
}) => {
  const form = useForm<z.infer<typeof sessionSchema>>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: session.name,
      description: session.description,
      coverImage: session.coverImage,
      assetId: session.assetId,
      videoUrl: session.videoUrl,
      playbackId: session.playbackId,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof sessionSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Name</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <ImageUpload
                  path={`sessions`}
                  {...field}
                  onChange={field.onChange}
                  aspectRatio={16 / 9}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name={`speakers`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Speaker</FormLabel>
              <FormControl>
                <AddSpeakersInput
                  speakers={field.value}
                  eventId={session.eventSlug ?? ''}
                />
              </FormControl>
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="assetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="playbackId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Playback ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Save changes
        </Button>
      </form>
    </Form>
  )
}

export default SessionAccordion
