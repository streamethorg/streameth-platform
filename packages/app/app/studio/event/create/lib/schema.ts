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
  eventDescription: z
    .string()
    .min(2, {
      message:
        'Event description must be at least 2 characters long.',
    })
    .max(500, {
      message:
        'Event description must be no more than 500 characters long.',
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
