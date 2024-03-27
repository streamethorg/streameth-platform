import * as z from 'zod'

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
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
  accentColor: z.string().min(1, { message: 'color is required' }),
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
  name: z.string().min(1, { message: 'Name is required' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' }),
  coverImage: z.string().optional(),
  assetId: z.string(),
})

export const organizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logo: z.string().min(1, 'Logo is required'),
  email: z.string().email(),
  banner: z.string().optional(),
})

export const supportSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  telegram: z.string().optional(),
  email: z.string().optional(),
})
