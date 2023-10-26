import { z } from 'zod'

export const EventFormSchema = z.object({
  name: z.string().min(2, 'Event Name is required'),
  description: z.string().min(10, 'Description is required'),
  location: z.string().min(2, 'Location is required'),
  logo: z.string().min(1, 'Logo is required'),
  eventCover: z.string().min(1, 'Event Cover is required'),
  banner: z.string().min(1, 'Banner is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  start: z.string().datetime().min(2, 'Start Date is required'),
  end: z.string().datetime().min(2, 'End Date is required'),
  archiveMode: z.boolean(),
  accentColor: z.string().optional(),
  website: z.string().optional(),
})
