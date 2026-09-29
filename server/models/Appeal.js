const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema({
  appealedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: true
  },
  decision: {
    type: String,
    required: [true, 'Please provide the decision being appealed']
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for the appeal'],
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  adminDecision: {
    type: String,
    enum: ['Restore', 'Keep Restricted', 'Other'],
    default: ''
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

module.exports = mongoose.model('Appeal', appealSchema);