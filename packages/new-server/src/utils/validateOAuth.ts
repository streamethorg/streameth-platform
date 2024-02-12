import { IGoogleAuth } from '@interfaces/auth.interface';
import { google } from 'googleapis';

const SCOPES = 'https://www.googleapis.com/auth/userinfo.profile';

async function createOAuthClient() {
  const oAuthSecret: IGoogleAuth = JSON.parse(process.env.OAUTH_SECRET);
  const clientId = oAuthSecret.web.client_id;
  const clientSecret = oAuthSecret.web.client_secret;
  const redirectUrls = oAuthSecret.web.redirect_uris[1];

  return new google.auth.OAuth2(clientId, clientSecret, redirectUrls);
}

export async function validateOAuth() {
  const oAuthClient = await createOAuthClient();

  const authUrl = oAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return authUrl;
}

export default validateOAuth;
