import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY!;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET!;
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN!;
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET!;

export const createOAuth = () => {
  return new OAuth({
    consumer: {
      key: TWITTER_CONSUMER_KEY,
      secret: TWITTER_CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
    },
  });
};

export const getUserProfileImage = async (username: string) => {
  const url = `https://api.twitter.com/1.1/users/show.json?screen_name=${username}`;
  const method = 'GET';

  const oauth = createOAuth();

  const token = {
    key: TWITTER_ACCESS_TOKEN,
    secret: TWITTER_ACCESS_TOKEN_SECRET,
  };

  const requestData = {
    url,
    method,
  };

  const headers = oauth.toHeader(oauth.authorize(requestData, token));

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...headers,
        'content-type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const userData = await response.json();
    console.log('userData', userData);
    const profileImageUrl = userData.profile_image_url_https;

    return profileImageUrl;
  } catch (error) {
    console.error('Error fetching user profile image:', error);
  }
};
