const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  collaboration: {
    type: mongoose.Schema.ObjectId,
    ref: 'Collaboration',
    required: true
  },
  contributor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  media: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  moderator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  moderatorComment: {
    type: String,
    default: ''
  },
  consent: {
    type: Boolean,
    default: false
  },
  reusePermission: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contribution', contributionSchema);