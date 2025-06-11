const express = require('express');
const router = express.Router();
const { upload } = require('../utils/uploadConfig');
const { sendBulkEmail, getEmailAddresses } = require('../controllers/emailController');

// Email sending endpoint with support for both Excel file and attachment
router.post('/send', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'attachment', maxCount: 1 }
]), sendBulkEmail);

// Get stored email addresses
router.get('/addresses', getEmailAddresses);

module.exports = router;