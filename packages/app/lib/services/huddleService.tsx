import { RoomInfo } from '@huddle01/web-core/types';

type IRoomResponseData = {
  roomId: string;
  meetingLink: string;
};

type IRoomResponse = {
  message: string;
  data: IRoomResponseData;
};

export async function createHuddleRoom({
  title,
  hostWallets,
}: {
  title: string;
  hostWallets: string[];
}): Promise<IRoomResponse> {
  const authToken = process.env.HUDDLE_API_KEY;

  if (!authToken) {
    throw 'No auth token';
  }

  try {
    const response = await fetch(
      'https://api.huddle01.com/api/v1/create-room',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': authToken,
        },
        body: JSON.stringify({ title, hostWallets }),
      }
    );

    if (response.ok) {
      return await response.json();
    } else {
      throw await response.json();
    }
  } catch (e) {
    console.error('Unexpected error:', e);
    throw e;
  }
}
