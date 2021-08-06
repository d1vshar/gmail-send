const express = require('express');
const { authCallback, auth } = require('../controllers/auth');

const router = express.Router();

// route to start the auth process
router.get('/', auth);

// route that oauth server will redirect to on success or error
// this will also process the response and get access + refresh token
router.get('/callback', authCallback);

module.exports = router;
