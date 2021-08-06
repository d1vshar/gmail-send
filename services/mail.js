const { default: axios } = require('axios');
const { getRefreshCreds, refreshAccessToken, storeCreds } = require('./auth');

const sendMailWithCreds = async ({ to, subject, body }, creds) => {
  let token = creds.accessToken;

  if (Date.now() >= creds.expiryTimestamp) {
    const { refreshToken } = await getRefreshCreds();

    const { accessToken, expiryTimestamp } = await refreshAccessToken(
      refreshToken,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
    );

    token = accessToken;

    await storeCreds({ accessToken, expiryTimestamp, refreshToken });
  }

  const mail = `To: ${to}\nSubject: ${subject}\n\n${body}`;

  const base64Mail = Buffer.from(mail).toString('base64');
  const payload = {
    raw: base64Mail,
  };

  const response = await axios.post(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (response.status === 200) return true;
  return false;
};

module.exports = sendMailWithCreds;
