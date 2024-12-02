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
    console.log('Validating token...');
    const oauth2Client = new google.auth.OAuth2(
      config.oauth.google.clientId,
      config.oauth.google.secretKey,
    );

    console.log('Verifying ID token...');
    const tokens = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: config.oauth.google.clientId,
    });

    console.log('Getting token payload...');
    const payload = tokens.getPayload();
    console.log('Token payload:', payload);

    if (!payload) {
      console.error('No payload in token');
      throw new Error('Invalid token payload');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      console.error(
        'Token expired. Current time:',
        currentTime,
        'Expiry:',
        payload.exp,
      );
      throw new Error('Token expired');
    }

    if (!payload.email) {
      console.error('No email in token payload:', payload);
      throw new Error('No email in token');
    }

    console.log('Token validation successful. Email:', payload.email);
    return {
      isValid: true,
      userId: payload['sub'],
      email: payload['email'],
    };
  } catch (e) {
    console.error('Error validating token:', e);
    if (e instanceof Error) {
      console.error('Error details:', e.message);
      if (e.message.includes('Invalid token signature')) {
        throw new Error('Invalid or expired token');
      }
      if (e.message.includes('Token used too late')) {
        throw new Error('Token expired');
      }
      // Throw the original error message for better debugging
      throw e;
    }
    throw new Error('Token validation failed');
  }
};
