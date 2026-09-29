const Appeal = require('../models/Appeal');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create appeal
exports.createAppeal = async (req, res) => {
  try {
    const { postId, decision, reason, description } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user has already appealed this post
    const existingAppeal = await Appeal.findOne({ 
      user: userId, 
      post: postId,
      status: { $in: ['pending', 'resolved'] }
    });

    if (existingAppeal) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an appeal for this post'
      });
    }

    // Create appeal
    const appeal = new Appeal({
      user: userId,
      post: postId,
      decision,
      reason,
      description,
      status: 'pending'
    });

    await appeal.save();

    // Create notification for moderators
    const notification = new Notification({
      type: 'new_appeal',
      title: 'New Appeal Submitted',
      message: `A new appeal has been submitted for post ${postId}`,
      data: { appealId: appeal._id, postId }
    });

    await notification.save();

    res.status(201).json({
      success: true,
      data: { appeal }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create appeal',
      error: error.message
    });
  }
};

// Get user's appeals
exports.getUserAppeals = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    const appeals = await Appeal.find({ user: userId })
      .populate('post', 'content author createdAt')
      .populate('moderator', 'name')
      .populate('resolution', 'action reason adminComment')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Appeal.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        appeals,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load appeals',
      error: error.message
    });
  }
};

// Get appeal by ID
exports.getAppeal = async (req, res) => {
  try {
    const appeal = await Appeal.findById(req.params.id)
      .populate('post', 'content author createdAt')
      .populate('user', 'name email')
      .populate('moderator', 'name')
      .populate('resolution', 'action reason adminComment');

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { appeal }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load appeal',
      error: error.message
    });
  }
};

// Update appeal
exports.updateAppeal = async (req, res) => {
  try {
    const { decision, reason, description } = req.body;
    const appeal = await Appeal.findById(req.params.id);

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found'
      });
    }

    // Check if appeal is still pending
    if (appeal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a resolved or rejected appeal'
      });
    }

    // Update appeal
    appeal.decision = decision || appeal.decision;
    appeal.reason = reason || appeal.reason;
    appeal.description = description || appeal.description;
    appeal.updatedAt = new Date();

    await appeal.save();

    res.status(200).json({
      success: true,
      data: { appeal }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update appeal',
      error: error.message
    });
  }
};

// Delete appeal
exports.deleteAppeal = async (req, res) => {
  try {
    const appeal = await Appeal.findById(req.params.id);

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found'
      });
    }

    // Check if appeal is still pending
    if (appeal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a resolved or rejected appeal'
      });
    }

    await Appeal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Appeal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete appeal',
      error: error.message
    });
  }
};

// Mark appeal as read
exports.markAppealAsRead = async (req, res) => {
  try {
    const appeal = await Appeal.findByIdAndUpdate(
      req.params.id,
      { readAt: new Date() },
      { new: true }
    );

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { appeal }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark appeal as read',
      error: error.message
    });
  }
};

// Mark all appeals as read
exports.markAllAppealsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Appeal.updateMany(
      { user: userId, readAt: { $exists: false } },
      { $set: { readAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: 'All appeals marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark appeals as read',
      error: error.message
    });
  }
};