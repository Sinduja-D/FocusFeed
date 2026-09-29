const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true
  },
  reason: {
    type: String,
    enum: ['Harassment', 'Spam', 'False Information', 'Fake Account', 'AI Manipulation', 'Harmful Content', 'Hidden Advertisement', 'Other'],
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  adminDecision: {
    type: String,
    enum: ['No Action', 'Content Removed', 'Account Suspended', 'Other'],
    default: 'No Action'
  },
  adminComment: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);