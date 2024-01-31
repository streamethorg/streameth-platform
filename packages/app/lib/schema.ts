import * as z from 'zod'

// Image URL validation
const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/

export const formSchema = z.object({
  organizationId: z
    .string()
    .min(2, {
      message: 'Organization name must be at least 2 characters long.',
    })
    .max(50, {
      message:
        'Organization name must be no more than 50 characters long.',
    }),
  eventName: z
    .string()
    .min(2, {
      message: 'Event name must be at least 2 characters long.',
    })
    .max(50, {
      message: 'Event name must be no more than 50 characters long.',
    }),
  eventDescription: z.string().min(2, {
    message: 'Event description must be at least 2 characters long.',
  }),
  startDate: z.string(),
  startTime: z.string(),
  endDate: z.string(),
  endTime: z.string(),
  eventLocation: z
    .string()
    .min(2, {
      message: 'Event location must be at least 2 characters long.',
    })
    .max(50, {
      message:
        'Event location must be no more than 50 characters long.',
    }),
  eventLogo: z.string().regex(imageUrlRegex, { message: 'Required' }),
  eventBanner: z
    .string()
    .regex(imageUrlRegex, { message: 'Required' }),
  eventCover: z
    .string()
    .regex(imageUrlRegex, { message: 'Required' }),
  eventColor: z
    .string()
    .min(2, {
      message: 'Event color must be at least 2 characters long.',
    })
    .max(50, {
      message: 'Event color must be no more than 50 characters long.',
    }),
})


const GSheetConfigSchema = z.object({
  sheetId: z.string().optional(),
  apiKey: z.string().optional(),
  driveId: z.string().optional(),
  driveApiKey: z.string().optional(),
});

const PretalxConfigSchema = z.object({
  url: z.string(),
  apiToken: z.string(),
});

const IDataImporterSchema = z.union([
  z.object({ type: z.literal("gsheet"), config: GSheetConfigSchema }),
  z.object({ type: z.literal("pretalx"), config: PretalxConfigSchema }),
]);

const IPluginsSchema = z.object({
  disableChat: z.boolean(),
  hideSchedule: z.boolean().optional(),
  hideSpeaker: z.boolean().optional(),
});


export const eventSchema = z.object({
  ...formSchema.shape,
  dataImporter: z.array(IDataImporterSchema).optional(),
  plugins: IPluginsSchema.optional(),
  unlisted: z.boolean().optional(),
  archiveMode: z.boolean().optional(),
});



const IStreamSettingsSchema = z.object({
  streamId: z.string(),
});

const IPluginSchema = z.object({
  name: z.string(),
});


export const StageSchema = z.object({
  name: z.string().min(1, {"message": "Required"}),
  eventId: z.string(),
  streamSettings: IStreamSettingsSchema,
  plugins: z.array(IPluginSchema).optional(),
  order: z.number().optional(),
});


// Sessions

// Define a schema for the speaker
const speakerSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  eventId: z.string(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  website: z.string().optional(),
  photo: z.string().optional(),
  company: z.string().optional(),
});

// Define the Zod schema for session validation
export const sessionSchema = z.object({
  name: z.string().max(255),
  description: z.string(),
  start: z.number().optional(),
  end: z.number().optional(),
  stageId: z.string().optional(),
  speakers: z.array(speakerSchema).optional(),
  source: z.object({
    streamUrl: z.string().optional(),
    start: z.number().optional(),
    end: z.number().optional(),
  }).optional(),
  playback: z.object({
    livepeerId: z.string().optional(),
    videoUrl: z.string().optional(),
    ipfsHash: z.string().optional(),
    format: z.string().optional(),
    duration: z.number().optional(),
  }).optional(),
  videoUrl: z.string().optional(),
  playbackId: z.string().optional(),
  assetId: z.string().optional(),
  eventId: z.string().optional(),
  track: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  slug: z.string().optional(),
  organizationId: z.string().optional(),
  eventSlug: z.string().optional(),
});
