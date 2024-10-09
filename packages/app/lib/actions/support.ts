'use server';

import { createSupportTicket } from '../services/supportService';

export const createSupportTicketAction = async ({
  message,
  telegram,
  email,
  image,
}: {
  message: string;
  telegram?: string;
  email?: string;
  image?: string;
}) => {
  const response = await createSupportTicket({
    message,
    telegram,
    email,
    image,
  });

  if (!response) {
    throw new Error('Error creating support ticket');
  }

  return response;
};
