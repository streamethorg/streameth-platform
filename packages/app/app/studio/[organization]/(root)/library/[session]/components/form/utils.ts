import { IExtendedSession } from '@/lib/types';
import * as z from 'zod';
import { sessionSchema } from '@/lib/schema';

export const createSessionUpdatePayload = (
  values: z.infer<typeof sessionSchema>,
  session: IExtendedSession
) => ({
  session: {
    ...values,
    _id: session._id,
    organizationId: session.organizationId,
    eventId: session.eventId,
    stageId: session.stageId,
    start: session.start ?? Number(new Date()),
    end: session.end ?? Number(new Date()),
    speakers: session.speakers ?? [],
    type: session.type,
  },
});
