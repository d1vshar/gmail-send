const open = require('open');
const { buildAuthURI, getAccessToken, storeCreds } = require('../services/auth');

const auth = async (_req, res, next) => {
  try {
    const uri = await buildAuthURI();
    // open the auth uri in default browser for user to give consent
    open(uri);

    return res.status(200).json({ oauth2_uri: uri });
  } catch (e) {
    return next(e);
  }
};

const authCallback = async (req, res, next) => {
  try {
    if (req.query.code !== undefined) {
      const creds = await getAccessToken(
        req.query.code,
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
      );

      if (creds) {
        await storeCreds(creds);
        return res.status(200).json({ status: '200', message: 'AUTHORIZED' });
      }
    }

    return res.status(401).json({ status: '401', message: 'NOT AUTHORIZED' });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  auth,
  authCallback,
};
