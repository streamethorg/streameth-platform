require('dotenv').config();

const requiredVariables = [
  'NEXT_PUBLIC_API_URL',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CLIENT_ID',
  'AUTH_RESEND_KEY',
  'NEXTAUTH_URL',
  'AUTH_SECRET',
  'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
  'SERVICE_ACCOUNT_PRIVATE_KEY',
  'SERVICE_ACCOUNT_EMAIL',
  'NEXT_PUBLIC_LIVEPEER_API_KEY',
  'NEXT_PUBLIC_SPACE_STORAGE_URL',
  'GOOGLE_OAUTH_SECRET',
  'TWITTER_CONSUMER_KEY',
  'TWITTER_CONSUMER_SECRET',
  'TWITTER_CALLBACK_URL',
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_TOKEN_SECRET',
  'GOOGLE_OAUTH_URL',
  'NEXT_PUBLIC_CORS_PROXY_URL',
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    console.error(
      `Error: The ${variable} environment variable is empty or undefined`
    );
    process.exit(1);
  }
}

console.info('All Variables are available');
