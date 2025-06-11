const EmailLog = require('../models/EmailLog');
const EmailAddress = require('../models/EmailAddress');
const xlsx = require('xlsx');
const transporter = require('../utils/mailer');
const path = require('path');
const fs = require('fs');

exports.sendBulkEmail = async (req, res) => {
  try {
    let emailList = [];
    let subject = req.body.subject;
    let body = req.body.body;

    // Process the input based on whether it's a file or manual input
    if (req.file) {
      try {
        console.log('Processing Excel file:', req.file.path);
        
        // Read the Excel file
        const file = xlsx.readFile(req.file.path);
        const sheetName = file.SheetNames[0];
        const worksheet = file.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        
        // Check if the Excel file has the required 'Email' column
        if (data.length > 0 && !data[0].hasOwnProperty('Email')) {
          return res.status(400).json({ 
            error: 'Invalid Excel format. The first row must contain an "Email" column.' 
          });
        }
        
        // Extract emails from the 'Email' column
        const extractedEmails = data
          .map(row => row.Email)
          .filter(email => email && email.trim() !== '');
        
        console.log(`Extracted ${extractedEmails.length} emails from Excel file`);
        
        // Save extracted emails to database
        for (const email of extractedEmails) {
          if (isValidEmail(email)) {
            try {
              // Use findOneAndUpdate with upsert to avoid duplicates
              await EmailAddress.findOneAndUpdate(
                { email: email.toLowerCase() },
                { 
                  email: email.toLowerCase(),
                  source: 'excel',
                  lastUsed: new Date()
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
              );
            } catch (err) {
              console.error(`Error saving email ${email} to database:`, err);
            }
          }
        }
        
        // Delete the Excel file immediately after processing
        try {
          fs.unlinkSync(req.file.path);
          console.log('Excel file deleted successfully');
        } catch (err) {
          console.error('Error deleting Excel file:', err);
        }
        
        // Use the extracted emails for sending
        emailList = extractedEmails;
        
      } catch (err) {
        console.error('Error processing Excel file:', err);
        return res.status(400).json({ error: 'Could not process the Excel file. Please check the format.' });
      }
    } else if (req.body.emails) {
      // Process manual email input
      const manualEmails = req.body.emails.split(',')
        .map(e => e.trim())
        .filter(email => email !== '');
      
      // Save manual emails to database
      for (const email of manualEmails) {
        if (isValidEmail(email)) {
          try {
            await EmailAddress.findOneAndUpdate(
              { email: email.toLowerCase() },
              { 
                email: email.toLowerCase(),
                source: 'manual',
                lastUsed: new Date()
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
          } catch (err) {
            console.error(`Error saving manual email ${email} to database:`, err);
          }
        }
      }
      
      emailList = manualEmails;
    } else {
      return res.status(400).json({ error: 'No emails provided. Please enter emails or upload an Excel file.' });
    }
    
    // Validate that we have emails to process
    if (emailList.length === 0) {
      return res.status(400).json({ error: 'No valid email addresses found.' });
    }

    console.log(`Sending emails to ${emailList.length} recipients`);
    
    // Send emails and log results
    const results = [];
    for (const email of emailList) {
      try {
        // Validate email format
        if (!isValidEmail(email)) {
          results.push({ email, status: 'failed', error: 'Invalid email format' });
          await EmailLog.create({ 
            email, 
            subject, 
            body, 
            status: 'failed', 
            error: 'Invalid email format'
          });
          continue;
        }
        
        // Send the email
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject,
          html: body,
        });
        
        // Update the EmailAddress lastUsed timestamp
        await EmailAddress.findOneAndUpdate(
          { email: email.toLowerCase() },
          { lastUsed: new Date() }
        );
        
        // Log success
        results.push({ email, status: 'sent' });
        await EmailLog.create({ 
          email, 
          subject, 
          body, 
          status: 'sent'
        });
      } catch (err) {
        // Log failure
        results.push({ email, status: 'failed', error: err.message });
        await EmailLog.create({ 
          email, 
          subject, 
          body, 
          status: 'failed', 
          error: err.message
        });
      }
    }
    
    // Return results to the client
    res.json({ 
      results,
      summary: {
        total: emailList.length,
        sent: results.filter(r => r.status === 'sent').length,
        failed: results.filter(r => r.status === 'failed').length
      }
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

// Get all stored email addresses
exports.getEmailAddresses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;
    const source = req.query.source; // 'excel' or 'manual' or undefined for all
    
    // Build query
    const query = {};
    if (source && ['excel', 'manual'].includes(source)) {
      query.source = source;
    }
    
    // Get total count for pagination
    const total = await EmailAddress.countDocuments(query);
    
    // Get emails with pagination
    const emails = await EmailAddress.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      emails,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching email addresses:', err);
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}