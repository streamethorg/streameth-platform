import * as z from 'zod'

export const formSchema = z.object({
  name: z.string().min(1, 'name is required'),
  description: z.string(),
  start: z.date(),
  end: z.date(),
  location: z.string(),
  logo: z.string().optional(),
  banner: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  eventCover: z.string().optional(),
  archiveMode: z.boolean().optional(),
  website: z.string().optional(),
  timezone: z.string().min(1, 'timezone is required'),
  accentColor: z.string().optional(),
  unlisted: z.boolean().optional(),
  enableVideoDownloader: z.boolean().optional(),
})

const GSheetConfigSchema = z.object({
  sheetId: z.string().optional(),
  apiKey: z.string().optional(),
  driveId: z.string().optional(),
  driveApiKey: z.string().optional(),
})

const PretalxConfigSchema = z.object({
  url: z.string(),
  apiToken: z.string(),
})

const IDataImporterSchema = z.union([
  z.object({ type: z.literal('gsheet'), config: GSheetConfigSchema }),
  z.object({
    type: z.literal('pretalx'),
    config: PretalxConfigSchema,
  }),
])

const IPluginsSchema = z.object({
  disableChat: z.boolean(),
  hideSchedule: z.boolean().optional(),
  hideSpeaker: z.boolean().optional(),
})

export const eventSchema = z.object({
  ...formSchema.shape,
  dataImporter: z.array(IDataImporterSchema).optional(),
  plugins: IPluginsSchema.optional(),
  unlisted: z.boolean().optional(),
  archiveMode: z.boolean().optional(),
})

const IStreamSettingsSchema = z.object({
  streamId: z.string(),
})

const IPluginSchema = z.object({
  name: z.string(),
})

export const StageSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  eventId: z.string(),
  streamSettings: IStreamSettingsSchema,
  plugins: z.array(IPluginSchema).optional(),
  order: z.number().optional(),
  organizationId: z.string(),
})

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
})

export const sessionSchema = z.object({
  name: z.string().max(255),
  description: z.string(),
  start: z.number().optional(),
  end: z.number().optional(),
  // stageId: z.string(),
  // speakers: z.array(speakerSchema).optional(),
  // source: z
  //   .object({
  //     streamUrl: z.string().optional(),
  //     start: z.number().optional(),
  //     end: z.number().optional(),
  //   })
  //   .optional(),
  // playback: z
  //   .object({
  //     livepeerId: z.string().optional(),
  //     videoUrl: z.string().optional(),
  //     ipfsHash: z.string().optional(),
  //     format: z.string().optional(),
  //     duration: z.number().optional(),
  //   })
  //   .optional(),
  videoUrl: z.string().optional(),
  playbackId: z.string().optional(),
  assetId: z.string().optional(),
  // eventId: z.string(),
  // track: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  // slug: z.string().optional(),
  // organizationId: z.string().optional(),
  // eventSlug: z.string().optional(),
})

export const organizationSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  logo: z.string(),
  location: z.string(),
  accentColor: z.string().optional(),
  slug: z.string().optional(),
})

export const videoUploadSchema = z.object({
  name: z.string(),
  description: z.string(),
  thumbnail: z.string(),
  uploadYoutube: z.boolean(),
  slug: z.string().optional(),
})
