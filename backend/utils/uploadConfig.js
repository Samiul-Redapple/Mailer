const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create attachments directory if it doesn't exist
const attachmentsDir = path.join(__dirname, '../uploads/attachments');
if (!fs.existsSync(attachmentsDir)) {
  fs.mkdirSync(attachmentsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Store attachments in the attachments directory, other files in uploads
    if (file.fieldname === 'attachment') {
      cb(null, attachmentsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter based on file type
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'file') {
    // For Excel files
    const allowedFileTypes = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedFileTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed for email lists'));
    }
  } else if (file.fieldname === 'attachment') {
    // For email attachments - allow common file types
    // You can customize this list based on your requirements
    const allowedFileTypes = [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
      '.ppt', '.pptx', '.txt', '.csv', '.zip', 
      '.jpg', '.jpeg', '.png', '.gif'
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedFileTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('This file type is not allowed as an email attachment'));
    }
  } else {
    cb(null, true);
  }
};

// Configure multer upload for Excel files
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Helper function to clean up attachment files
const cleanupAttachment = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`Attachment deleted: ${filePath}`);
      return true;
    } catch (err) {
      console.error(`Error deleting attachment: ${filePath}`, err);
      return false;
    }
  }
  return false;
};

module.exports = {
  upload,
  uploadsDir,
  attachmentsDir,
  cleanupAttachment
};