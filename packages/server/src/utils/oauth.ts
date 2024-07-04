import { config } from '@config';
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

export const refreshAccessToken = async (
  refreshToken: string
): Promise<string> => {
  const oauth2Client = new google.auth.OAuth2(
    config.oauth.google.clientId,
    config.oauth.google.secretKey
  );
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });
  const token = await oauth2Client.refreshAccessToken();
  return token.credentials.access_token;
};
