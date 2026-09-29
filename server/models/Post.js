const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Please add a content'],
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  image: {
    type: String,
    default: ''
  },
  video: {
    type: String,
    default: ''
  },
  interest: {
    type: String,
    enum: ['Technology', 'Science', 'Education', 'Sports', 'Art', 'Entertainment', 'Personal Stories', 'Social Causes'],
    required: true
  },
  audience: {
    type: String,
    enum: ['Public', 'Community', 'Followers'],
    default: 'Public'
  },
  creationType: {
    type: String,
    enum: ['Human Created', 'AI Assisted', 'AI Generated'],
    default: 'Human Created'
  },
  aiLabel: {
    type: String,
    enum: ['Human Created', 'AI Assisted', 'AI Generated', 'AI Origin Uncertain'],
    default: 'Human Created'
  },
  moderationStatus: {
    type: String,
    enum: ['SAFE', 'REVIEW', 'RESTRICTED'],
    default: 'SAFE'
  },
  moderationReason: {
    type: String,
    default: ''
  },
  factStatus: {
    type: String,
    enum: ['Not Reviewed', 'Under Review', 'Supported', 'Disputed', 'Unverified'],
    default: 'Not Reviewed'
  },
  sponsored: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Reverse populate with virtuals
postSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  count: true
});

module.exports = mongoose.model('Post', postSchema);