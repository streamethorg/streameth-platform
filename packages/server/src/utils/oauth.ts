import { google } from 'googleapis';

async function createOAuthClient() {
  const oAuthSecret: any = JSON.parse(process.env.OAUTH_SECRET || '');
  const clientId = oAuthSecret.web.client_id;
  const clientSecret = oAuthSecret.web.client_secret;
  const redirectUris = oAuthSecret.web.redirect_uris;

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
