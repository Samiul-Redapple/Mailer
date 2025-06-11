const mongoose = require('mongoose');

const EmailAddressSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    trim: true
  },
  source: {
    type: String,
    enum: ['excel', 'manual'],
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastUsed: {
    type: Date,
    default: null
  }
});

// Create a compound index to track unique emails per source
EmailAddressSchema.index({ email: 1 }, { unique: false });

module.exports = mongoose.model('EmailAddress', EmailAddressSchema);