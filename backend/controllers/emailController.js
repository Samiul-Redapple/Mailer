const EmailLog = require('../models/EmailLog');
const xlsx = require('xlsx');
const transporter = require('../utils/mailer');
const path = require('path');

exports.sendBulkEmail = async (req, res) => {
  try {
    let emailList = [];
    let subject = req.body.subject;
    let body = req.body.body;

    if (req.file) {
      const file = xlsx.readFile(req.file.path);
      const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
      emailList = data.map(row => row.Email);
    } else {
      emailList = req.body.emails.split(',').map(e => e.trim());
    }

    const results = [];
    for (const email of emailList) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject,
          html: body,
        });
        results.push({ email, status: 'sent' });
      await EmailLog.create({ email, subject, body, status: 'sent' });
      } catch (err) {
        results.push({ email, status: 'failed', error: err.message });
      await EmailLog.create({ email, subject, body, status: 'failed', error: err.message });
      }
    }
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};