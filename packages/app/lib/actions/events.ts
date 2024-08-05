'use server';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEvent,
  syncEventImport,
} from '@/lib/services/eventService';
import { cookies } from 'next/headers';
import { IExtendedEvent } from '../types';
import { IEvent } from 'streameth-new-server/src/interfaces/event.interface';
import { revalidatePath } from 'next/cache';
import GoogleSheetService from '@/lib/services/googleSheetService';
import GoogleDriveService from '@/lib/services/googleDriveService';
export const createEventAction = async ({ event }: { event: IEvent }) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }
  const response = await createEvent({
    event: { ...event, unlisted: true },
    authToken,
  });

  if (!response) {
    throw new Error('Error creating event');
  }
  revalidatePath('/studio');
  return response;
};

export const updateEventAction = async ({
  event,
}: {
  event: IExtendedEvent;
}) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }

  // TODO
  // @ts-ignore
  delete event.createdAt;
  // @ts-ignore
  delete event.updatedAt;
  // @ts-ignore
  delete event.__v;

  const response = await updateEvent({
    event: { ...event },
    authToken,
  });
  if (!response) {
    throw new Error('Error updating event');
  }
  revalidatePath('/studio');
  return response;
};

export const deleteEventAction = async ({
  eventId,
  organizationId,
}: {
  eventId: string;
  organizationId: string;
}) => {
  const authToken = cookies().get('user-session')?.value;

  if (!authToken) {
    throw new Error('No user session found');
  }

  const response = await deleteEvent({
    eventId,
    organizationId,
    authToken,
  });
  if (!response) {
    throw new Error('Error deleting event');
  }
  revalidatePath('/studio');
  return response;
};

export const signUp = async (
  prevState: {
    message: string;
    success: boolean;
  },
  formData: FormData
) => {
  const email = formData.get('email') as string;
  const eventId = formData.get('eventId') as string;

  const event = await fetchEvent({ eventId });
  if (!event) return { message: 'Failed to sign up', success: false };
  if (
    !event.dataImporter ||
    event.dataImporter.length === 0 ||
    event.dataImporter[0].type !== 'gsheet' ||
    !event.dataImporter[0].config.sheetId
  )
    return { message: 'Failed to sign up', success: false };

  try {
    const googleSheetService = new GoogleSheetService(
      event.dataImporter[0].config.sheetId
    );

    await googleSheetService.appendData('Email Sign-Ups', [
      [new Date().toString(), email],
    ]);

    return { message: 'Signed up successfully', success: true };
  } catch (error) {
    console.error('Error appending data to Google Sheets:', error);
    return { message: 'Failed to sign up', success: false };
  }
};

export const syncEventImportAction = async ({
  eventId,
  organizationId,
}: {
  eventId: string;
  organizationId: string;
}) => {
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }

  const response = await syncEventImport({
    eventId,
    organizationId,
    authToken,
  });
  if (!response) {
    throw new Error('Error syncing event');
  }
  revalidatePath('/studio');
  return response;
};

export const createGoogleSheetAction = async ({
  eventName,
}: {
  eventName: string;
}) => {
  const templateSheetId = '1VaukqmViY09M_xuXT3GkaY6sAet5KeKZmjMuhT_C-kc';
  const authToken = cookies().get('user-session')?.value;
  if (!authToken) {
    throw new Error('No user session found');
  }

  const googleDriveService = new GoogleDriveService();
  const sheetId = await googleDriveService.copyFile(templateSheetId, eventName);

  if (!sheetId) {
    throw new Error('Error creating Google Sheet');
  }

  return sheetId;
};
