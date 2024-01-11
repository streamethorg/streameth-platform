import * as z from 'zod'

// Image URL validation
const imageUrlRegex = /\.(jpeg|jpg|gif|png)$/

export const formSchema = z.object({
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
  id: z.string(),
  name: z.string(),
  eventId: z.string(), // Replace with the actual schema if IEvent['id'] is different
  streamSettings: IStreamSettingsSchema,
  plugins: z.array(IPluginSchema).optional(),
  order: z.number().optional(),
});
