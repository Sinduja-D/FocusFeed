const Report = require('../models/Report');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create report
exports.createReport = async (req, res) => {
  try {
    const { postId, reason, description } = req.body;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user has already reported this post
    const existingReport = await Report.findOne({ 
      user: userId, 
      post: postId,
      status: { $in: ['pending', 'resolved'] }
    });

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this post'
      });
    }

    // Create report
    const report = new Report({
      user: userId,
      post: postId,
      reason,
      description,
      status: 'pending'
    });

    await report.save();

    // Update post moderation status
    post.moderationStatus = 'REVIEW';
    post.reportedAt = new Date();
    await post.save();

    // Create notification for moderators
    const notification = new Notification({
      type: 'new_report',
      title: 'New Report Submitted',
      message: `A new report has been submitted for post ${postId}`,
      data: { reportId: report._id, postId }
    });

    await notification.save();

    res.status(201).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create report',
      error: error.message
    });
  }
};

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, reason } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { 'post.content': { $regex: search, $options: 'i' } },
        { 'post.author.name': { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (reason) query.reason = reason;

    const reports = await Report.find(query)
      .populate('post', 'content author createdAt')
      .populate('user', 'name email')
      .populate('moderator', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        reports,
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
      message: 'Failed to load reports',
      error: error.message
    });
  }
};

// Get user's reports
exports.getUserReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.id;

    const reports = await Report.find({ user: userId })
      .populate('post', 'content author createdAt')
      .populate('moderator', 'name')
      .populate('resolution', 'action reason adminComment')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      data: {
        reports,
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
      message: 'Failed to load reports',
      error: error.message
    });
  }
};

// Get report by ID
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('post', 'content author createdAt')
      .populate('user', 'name email')
      .populate('moderator', 'name')
      .populate('resolution', 'action reason adminComment');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load report',
      error: error.message
    });
  }
};

// Update report
exports.updateReport = async (req, res) => {
  try {
    const { reason, description } = req.body;
    const reportId = req.params.id;
    const userId = req.user.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user is the report author
    if (report.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the report author can update it'
      });
    }

    // Check if report is still pending
    if (report.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a resolved or rejected report'
      });
    }

    // Update report
    if (reason) report.reason = reason;
    if (description) report.description = description;
    report.updatedAt = new Date();

    await report.save();

    res.status(200).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update report',
      error: error.message
    });
  }
};

// Delete report
exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Check if user is the report author
    if (report.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the report author can delete it'
      });
    }

    // Check if report is still pending
    if (report.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a resolved or rejected report'
      });
    }

    await Report.findByIdAndDelete(reportId);

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete report',
      error: error.message
    });
  }
};

// Resolve report
exports.resolveReport = async (req, res) => {
  try {
    const { action, reason, adminComment } = req.body;
    const reportId = req.params.id;
    const moderatorId = req.user.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update report status
    report.status = 'resolved';
    report.resolution = {
      action,
      reason,
      adminComment,
      moderator: moderatorId,
      resolvedAt: new Date()
    };
    report.updatedAt = new Date();

    await report.save();

    // Update post moderation status based on action
    if (report.post) {
      const post = await Post.findById(report.post);
      if (post) {
        if (action === 'remove') {
          await Post.findByIdAndDelete(report.post);
        } else if (action === 'restrict') {
          post.moderationStatus = 'RESTRICTED';
          post.moderationReason = reason;
          post.adminComment = adminComment;
          await post.save();
        } else {
          post.moderationStatus = 'SAFE';
          post.moderationReason = null;
          post.adminComment = null;
          await post.save();
        }
      }
    }

    // Create notification for report user
    const notification = new Notification({
      user: report.user,
      type: 'report_resolved',
      title: 'Report Resolved',
      message: `Your report has been resolved. Action taken: ${action}.`,
      data: { action, reason, adminComment }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resolve report',
      error: error.message
    });
  }
};

// Reject report
exports.rejectReport = async (req, res) => {
  try {
    const { reason, adminComment } = req.body;
    const reportId = req.params.id;
    const moderatorId = req.user.id;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update report status
    report.status = 'rejected';
    report.resolution = {
      action: 'rejected',
      reason,
      adminComment,
      moderator: moderatorId,
      resolvedAt: new Date()
    };
    report.updatedAt = new Date();

    await report.save();

    // Create notification for report user
    const notification = new Notification({
      user: report.user,
      type: 'report_rejected',
      title: 'Report Rejected',
      message: `Your report has been rejected. Reason: ${reason}`,
      data: { reason, adminComment }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject report',
      error: error.message
    });
  }
};

// Mark report as read
exports.markReportAsRead = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { readAt: new Date() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { report }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark report as read',
      error: error.message
    });
  }
};

// Mark all reports as read
exports.markAllReportsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Report.updateMany(
      { user: userId, readAt: { $exists: false } },
      { $set: { readAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: 'All reports marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to mark reports as read',
      error: error.message
    });
  }
};