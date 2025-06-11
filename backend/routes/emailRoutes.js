const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { sendBulkEmail } = require('../controllers/emailController');

router.post('/send', upload.single('file'), sendBulkEmail);

module.exports = router;