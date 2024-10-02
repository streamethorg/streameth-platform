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
  refreshToken: string,
): Promise<string> => {
  const oauth2Client = new google.auth.OAuth2(
    config.oauth.google.clientId,
    config.oauth.google.secretKey,
  );
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });
  const token = await oauth2Client.refreshAccessToken();
  return token.credentials.access_token;
};

export const validateToken = async (
  token: string,
): Promise<{ isValid: boolean; userId: string; email: string }> => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      config.oauth.google.clientId,
      config.oauth.google.secretKey,
    );
    const tokens = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: config.oauth.google.clientId,
    });
    const payload = tokens.getPayload();
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      throw new Error('Token expired');
    }
    return {
      isValid: true,
      userId: payload['sub'],
      email: payload['email'],
    };
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.includes('Invalid token signature')) {
        throw new Error('Invalid or expired token');
      }
      if(e.message.includes('Token used too late')){
        throw new Error('Token expired');
      }
    }
  }
};
