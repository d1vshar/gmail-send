const { getAccessCreds } = require('../services/auth');
const sendMailWithCreds = require('../services/mail');

const sendMail = async (req, res, next) => {
  try {
    const { to, subject, body } = req.body;
    const creds = await getAccessCreds();
    const mail = {
      to,
      subject,
      body,
    };

    if (creds) {
      const result = await sendMailWithCreds(mail, creds);

      if (result) return res.status(200).json({ status: '200', message: 'MAIL SENT' });

      return res.status(400).json({ status: '400', message: 'MAIL NOT SENT' });
    }

    return res.status(401).json({ status: '401', message: 'INVALID CREDENTIALS' });
  } catch (e) {
    return next(e);
  }
};

module.exports = sendMail;
