const { default: axios } = require('axios');
const fs = require('fs/promises');

const buildAuthURI = async () => {
  const authURL = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  // build the oauth2 url parameters
  authURL.searchParams.append('client_id', process.env.CLIENT_ID);
  authURL.searchParams.append('redirect_uri', 'http://localhost:3000/auth/callback');
  authURL.searchParams.append('response_type', 'code');
  authURL.searchParams.append('scope', 'https://www.googleapis.com/auth/gmail.compose');
  authURL.searchParams.append('access_type', 'offline');

  return authURL.href;
};

const getAccessToken = async (authCode, clientId, clientSecret) => {
  const params = {
    code: authCode,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: 'http://localhost:3000/auth/callback',
    grant_type: 'authorization_code',
  };

  const response = await axios.post(
    'https://oauth2.googleapis.com/token',
    params,
  );

  if (response.status === 200) {
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiryTimestamp: Date.now() + (response.data.expires_in * 1000),
    };
  }

  return null;
};

const refreshAccessToken = async (refreshCode, clientId, clientSecret) => {
  const params = {
    refresh_token: refreshCode,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  };

  const response = await axios.post(
    'https://oauth2.googleapis.com/token',
    params,
  );

  if (response.status === 200) {
    return {
      accessToken: response.data.access_token,
      expiryTimestamp: Date.now() + (response.data.expires_in * 1000),
    };
  }

  return null;
};

const storeCreds = async ({ accessToken, expiryTimestamp, refreshToken }) => {
  await fs.writeFile('access.json', JSON.stringify({ accessToken, expiryTimestamp }));
  await fs.writeFile('refresh.json', JSON.stringify({ refreshToken }));
};

const getAccessCreds = async () => {
  const credsStr = await fs.readFile('access.json', { encoding: 'utf-8' });

  try {
    return JSON.parse(credsStr);
  } catch (e) {
    return null;
  }
};

const getRefreshCreds = async () => {
  const credsStr = await fs.readFile('refresh.json', { encoding: 'utf-8' });

  try {
    return JSON.parse(credsStr);
  } catch (e) {
    return null;
  }
};

module.exports = {
  buildAuthURI,
  getAccessToken,
  refreshAccessToken,
  storeCreds,
  getAccessCreds,
  getRefreshCreds,
};
