const express = require('express');
const router = express.Router();
const { upload } = require('../utils/uploadConfig');
const { sendBulkEmail, getEmailAddresses } = require('../controllers/emailController');

// Email sending endpoint
router.post('/send', upload.single('file'), sendBulkEmail);

// Get stored email addresses
router.get('/addresses', getEmailAddresses);

module.exports = router;