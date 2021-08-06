const express = require('express');
const sendMail = require('../controllers/mail');

const router = express.Router();

// route to send mail
router.post('/', sendMail);

module.exports = router;
