import { config } from '@config';
import { google } from 'googleapis';

const oAuthSecret: any = JSON.parse(config.oauthSecret);
const clientId = oAuthSecret.web.client_id;
const clientSecret = oAuthSecret.web.client_secret;
const redirectUris = oAuthSecret.web.redirect_uris;

async function createOAuthClient() {
  const environment = process.env.NODE_ENV;
  const eEnv: Record<string, number> = {
    production: 0,
    development: 1,
    preview: 2,
  };
  const redirectUri = redirectUris![eEnv[environment] ?? 0]; // Assuming you are production if no ENV is choicen

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export default createOAuthClient;

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
