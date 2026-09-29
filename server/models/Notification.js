const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Report Decision', 'Appeal Decision', 'Collaboration Invitation', 'Contribution Approved', 'Contribution Rejected', 'Collaboration Published', 'Community Activity', 'account_banned', 'account_unbanned', 'role_changed', 'post_moderated', 'post_deleted', 'report_resolved', 'report_rejected', 'item_moderated', 'account_verified', 'collaboration_moderated', 'appeal_resolved', 'appeal_rejected'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedPost: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
  relatedCollaboration: {
    type: mongoose.Schema.ObjectId,
    ref: 'Collaboration'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for notifications by user and read status
notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);