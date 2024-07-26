import { google } from 'googleapis';

export const getYoutubeClient = (accessToken: string) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });
};

export const generateGoogleAccessToken = async (code: string): Promise<any> => {
  const OAUTH_SECRET = process.env.OAUTH_SECRET || '';
  const oAuthSecret: any = JSON.parse(OAUTH_SECRET);
  const clientId = oAuthSecret.web.client_id;
  const clientSecret = oAuthSecret.web.client_secret;
  const tokenUri = oAuthSecret.web.token_uri;
  const redirectUri = oAuthSecret.web.redirect_uri;
  try {
    const response = await fetch(tokenUri, {
      method: 'POST',
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const data = await response.json();

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: data.access_token,
    });
    const youtube = getYoutubeClient(data.access_token);

    // Use YouTube Data API to get channel details
    const channelResponse = await youtube.channels.list({
      part: ['snippet'],
      mine: true,
    });

    const channel = channelResponse.data.items?.[0];
    const user = {
      channelId: channel?.id,
      name: channel?.snippet?.title,
      thumbnail: channel?.snippet?.thumbnails?.default?.url,
    };

    return { ...data, ...user };
  } catch (error) {
    console.error('error in generateGoogleAccessToken', error);
  }
};

export const isStreamingEnabled = async (accessToken: string) => {
  const youtube = getYoutubeClient(accessToken);

  try {
    const response = await youtube.liveBroadcasts.list({
      part: ['id'],
      mine: true,
    });

    return response?.data?.items?.length
      ? response?.data?.items?.length > 0
      : false;
  } catch (error) {
    console.error('Error checking live broadcasts:', error);
    return false;
  }
};
