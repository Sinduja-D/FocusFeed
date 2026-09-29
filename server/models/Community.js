const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a community name'],
    trim: true,
    unique: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  interest: {
    type: String,
    enum: ['Technology', 'Science', 'Education', 'Sports', 'Art', 'Entertainment', 'Personal Stories', 'Social Causes'],
    required: true
  },
  members: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Reverse populate with virtuals
communitySchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'community'
});

module.exports = mongoose.model('Community', communitySchema);