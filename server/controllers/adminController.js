const User = require('../models/User');
const Post = require('../models/Post');
const Report = require('../models/Report');
const Appeal = require('../models/Appeal');
const Collaboration = require('../models/Collaboration');
const Contribution = require('../models/Contribution');
const Community = require('../models/Community');
const Notification = require('../models/Notification');
const { generateToken } = require('../utils/generateToken');
const { scoreEngagement } = require('../utils/scoring');

// Get admin dashboard data
exports.getDashboard = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalPosts = await Post.countDocuments();
    const flaggedPosts = await Post.countDocuments({ moderationStatus: 'REVIEW' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const pendingAppeals = await Appeal.countDocuments({ status: 'pending' });
    const fakeAccounts = await User.countDocuments({ riskLevel: 'high' });
    const unusualEngagement = await Post.countDocuments({ isUnusual: true });

    // Get recent activity
    const recentActivity = [
      {
        type: 'user',
        title: 'New user registered',
        description: 'John Doe joined the platform',
        timestamp: new Date(),
        status: 'resolved'
      },
      {
        type: 'post',
        title: 'Post flagged for review',
        description: 'Post by Jane Smith reported for harassment',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'pending'
      },
      {
        type: 'report',
        title: 'Report resolved',
        description: 'Harassment report against post #12345 resolved',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: 'resolved'
      },
      {
        type: 'appeal',
        title: 'New appeal submitted',
        description: 'User appealed content restriction decision',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'pending'
      },
      {
        type: 'moderation',
        title: 'Content moderated',
        description: 'Inappropriate content removed from platform',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        status: 'resolved'
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeUsers,
          totalPosts,
          flaggedPosts,
          pendingReports,
          pendingAppeals,
          fakeAccounts,
          unusualEngagement
        },
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load dashboard data',
      error: error.message
    });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status, riskLevel } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (status) query.status = status;
    if (riskLevel) query.riskLevel = riskLevel;

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
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
      message: 'Failed to load users',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status, riskLevel, riskFactors } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, status, riskLevel, riskFactors },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log user action
    const logEntry = {
      action: 'user_updated',
      user: req.user.id,
      targetUser: user._id,
      details: { name, email, role, status, riskLevel }
    };

    // In a real app, save this to a log collection

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Ban user
exports.banUser = async (req, res) => {
  try {
    const { reason, duration } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'banned',
        banReason: reason,
        banDuration: duration,
        bannedAt: new Date()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create notification for banned user
    const notification = new Notification({
      user: user._id,
      type: 'account_banned',
      title: 'Account Banned',
      message: `Your account has been banned. Reason: ${reason}`,
      data: { reason, duration }
    });

    await notification.save();

    // Log user action
    const logEntry = {
      action: 'user_banned',
      user: req.user.id,
      targetUser: user._id,
      details: { reason, duration }
    };

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to ban user',
      error: error.message
    });
  }
};

// Unban user
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'active',
        banReason: null,
        banDuration: null,
        bannedAt: null
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create notification for unbanned user
    const notification = new Notification({
      user: user._id,
      type: 'account_unbanned',
      title: 'Account Unbanned',
      message: 'Your account has been unbanned and you can now access the platform.'
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unban user',
      error: error.message
    });
  }
};

// Make user admin
exports.makeAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create notification for promoted user
    const notification = new Notification({
      user: user._id,
      type: 'role_changed',
      title: 'Promoted to Admin',
      message: 'You have been promoted to admin role.'
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to promote user',
      error: error.message
    });
  }
};

// Remove admin role
exports.removeAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'user' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create notification for demoted user
    const notification = new Notification({
      user: user._id,
      type: 'role_changed',
      title: 'Admin Role Removed',
      message: 'Your admin role has been removed.'
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove admin role',
      error: error.message
    });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, moderationStatus, aiLabel, author } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { 'author.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (moderationStatus) query.moderationStatus = moderationStatus;
    if (aiLabel) query.aiLabel = aiLabel;
    if (author) query['author._id'] = author;

    const posts = await Post.find(query)
      .populate('author', 'name email profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        posts,
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
      message: 'Failed to load posts',
      error: error.message
    });
  }
};

// Get post by ID
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email profileImage')
      .populate('likes', 'name profileImage')
      .populate('comments', 'content author createdAt');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load post',
      error: error.message
    });
  }
};

// Moderate post
exports.moderatePost = async (req, res) => {
  try {
    const { action, reason, adminComment } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    let moderationStatus = post.moderationStatus;
    let moderationAction = null;

    switch (action) {
      case 'approve':
        moderationStatus = 'SAFE';
        moderationAction = 'approved';
        break;
      case 'restrict':
        moderationStatus = 'RESTRICTED';
        moderationAction = 'restricted';
        break;
      case 'remove':
        await Post.findByIdAndDelete(req.params.id);
        moderationAction = 'removed';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid moderation action'
        });
    }

    // Update post if not removed
    if (action !== 'remove') {
      post.moderationStatus = moderationStatus;
      post.moderationReason = reason;
      post.adminComment = adminComment;
      post.moderatedAt = new Date();
      await post.save();
    }

    // Create notification for post author
    const notification = new Notification({
      user: post.author,
      type: 'post_moderated',
      title: 'Post Moderated',
      message: `Your post has been ${moderationAction}. Reason: ${reason}`,
      data: { action, reason, adminComment }
    });

    await notification.save();

    // Log moderation action
    const logEntry = {
      action: 'post_moderated',
      user: req.user.id,
      post: post._id,
      details: { action, reason, adminComment }
    };

    res.status(200).json({
      success: true,
      data: { post }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to moderate post',
      error: error.message
    });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Create notification for post author
    const notification = new Notification({
      user: post.author,
      type: 'post_deleted',
      title: 'Post Deleted',
      message: 'Your post has been deleted by an administrator.'
    });

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete post',
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
      .populate({ path: 'post', select: 'content author createdAt', populate: { path: 'author', select: 'name email profileImage' } })
      .populate('reportedBy', 'name email profileImage')
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

// Get report by ID
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('post', 'content author createdAt')
        .populate('reportedBy', 'name email profileImage');

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

// Resolve report
exports.resolveReport = async (req, res) => {
  try {
    const { action, reason, adminComment } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update report status
    report.status = 'Resolved';
    report.resolution = {
      action,
      reason,
      adminComment,
      moderator: req.user.id,
      resolvedAt: new Date()
    };
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
        }
      }
    }

    // Create notification for report user
    const notification = new Notification({
      user: report.reportedBy,
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
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update report status
    report.status = 'Rejected';
    report.resolution = {
      action: 'rejected',
      reason,
      adminComment,
      moderator: req.user.id,
      resolvedAt: new Date()
    };
    await report.save();

    // Create notification for report user
    const notification = new Notification({
      user: report.reportedBy,
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

// Get moderation queue
exports.getModerationQueue = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    const items = await Post.find(query)
      .populate('author', 'name email profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        items,
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
      message: 'Failed to load moderation queue',
      error: error.message
    });
  }
};

// Moderate item in queue
exports.moderateItem = async (req, res) => {
  try {
    const { action, reason, adminComment } = req.body;
    const item = await Post.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    let moderationStatus = item.moderationStatus;
    let moderationAction = null;

    switch (action) {
      case 'approve':
        moderationStatus = 'SAFE';
        moderationAction = 'approved';
        break;
      case 'restrict':
        moderationStatus = 'RESTRICTED';
        moderationAction = 'restricted';
        break;
      case 'remove':
        await Post.findByIdAndDelete(req.params.id);
        moderationAction = 'removed';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid moderation action'
        });
    }

    // Update item if not removed
    if (action !== 'remove') {
      item.moderationStatus = moderationStatus;
      item.moderationReason = reason;
      item.adminComment = adminComment;
      item.moderatedAt = new Date();
      await item.save();
    }

    // Create notification for item author
    const notification = new Notification({
      user: item.author,
      type: 'item_moderated',
      title: 'Item Moderated',
      message: `Your item has been ${moderationAction}. Reason: ${reason}`,
      data: { action, reason, adminComment }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { item }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to moderate item',
      error: error.message
    });
  }
};

// Get fake accounts
exports.getFakeAccounts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, riskLevel, status } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    if (riskLevel) query.riskLevel = riskLevel;
    if (status) query.status = status;

    const accounts = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        accounts,
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
      message: 'Failed to load fake accounts',
      error: error.message
    });
  }
};

// Get fake account by ID
exports.getFakeAccount = async (req, res) => {
  try {
    const account = await User.findById(req.params.id).select('-password');
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { account }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load fake account',
      error: error.message
    });
  }
};

// Verify account
exports.verifyAccount = async (req, res) => {
  try {
    const account = await User.findByIdAndUpdate(
      req.params.id,
      { 
        riskLevel: 'low',
        riskFactors: [],
        verificationStatus: 'verified',
        verifiedAt: new Date()
      },
      { new: true }
    ).select('-password');

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Create notification for verified user
    const notification = new Notification({
      user: account._id,
      type: 'account_verified',
      title: 'Account Verified',
      message: 'Your account has been verified and is no longer considered suspicious.'
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { account }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to verify account',
      error: error.message
    });
  }
};

// Ban fake account
exports.banAccount = async (req, res) => {
  try {
    const { reason, duration } = req.body;
    const account = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'banned',
        banReason: reason,
        banDuration: duration,
        bannedAt: new Date()
      },
      { new: true }
    ).select('-password');

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Create notification for banned user
    const notification = new Notification({
      user: account._id,
      type: 'account_banned',
      title: 'Account Banned',
      message: `Your account has been banned. Reason: ${reason}`,
      data: { reason, duration }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { account }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to ban account',
      error: error.message
    });
  }
};

// Get engagement data
exports.getEngagementData = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, unusual, highEngagement, recent } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { 'post.content': { $regex: search, $options: 'i' } },
        { 'post.author.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (unusual === 'true') query.isUnusual = true;
    if (highEngagement === 'true') query.engagementScore = { $gt: 80 };
    if (recent === 'true') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: sevenDaysAgo };
    }

    const engagementData = await Post.find(query)
      .populate('author', 'name email profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ engagementScore: -1 });

    const total = await Post.countDocuments(query);

    // Score engagement for each post
    const scoredData = engagementData.map(post => {
      const score = scoreEngagement(post);
      return {
        ...post.toObject(),
        engagementScore: score,
        isUnusual: score > 80
      };
    });

    res.status(200).json({
      success: true,
      data: {
        engagementData: scoredData,
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
      message: 'Failed to load engagement data',
      error: error.message
    });
  }
};

// Get all collaborations
exports.getCollaborations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;

    const collaborations = await Collaboration.find(query)
      .populate('creator', 'name email profileImage')
      .populate('contributors.user', 'name profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Collaboration.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        collaborations,
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
      message: 'Failed to load collaborations',
      error: error.message
    });
  }
};

// Get collaboration by ID
exports.getCollaboration = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id)
      .populate('creator', 'name email profileImage')
      .populate('contributors.user', 'name profileImage')
      .populate('contributions', 'content media status createdAt');

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { collaboration }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load collaboration',
      error: error.message
    });
  }
};

// Moderate collaboration
exports.moderateCollaboration = async (req, res) => {
  try {
    const { action, reason, adminComment } = req.body;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }

    let collaborationStatus = collaboration.status;
    let moderationAction = null;

    switch (action) {
      case 'approve':
        collaborationStatus = 'Open';
        moderationAction = 'approved';
        break;
      case 'restrict':
        collaborationStatus = 'Restricted';
        moderationAction = 'restricted';
        break;
      case 'remove':
        await Collaboration.findByIdAndDelete(req.params.id);
        moderationAction = 'removed';
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid moderation action'
        });
    }

    // Update collaboration if not removed
    if (action !== 'remove') {
      collaboration.status = collaborationStatus;
      collaboration.moderationReason = reason;
      collaboration.adminComment = adminComment;
      collaboration.moderatedAt = new Date();
      await collaboration.save();
    }

    // Create notification for collaboration creator
    const notification = new Notification({
      user: collaboration.creator,
      type: 'collaboration_moderated',
      title: 'Collaboration Moderated',
      message: `Your collaboration has been ${moderationAction}. Reason: ${reason}`,
      data: { action, reason, adminComment }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { collaboration }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to moderate collaboration',
      error: error.message
    });
  }
};

// Get all appeals
exports.getAppeals = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
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

    const appeals = await Appeal.find(query)
    .populate({ path: 'post', select: 'content author createdAt', populate: { path: 'author', select: 'name email profileImage' } })
    .populate('appealedBy', 'name email profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Appeal.countDocuments(query);

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
      .populate('appealedBy', 'name email profileImage');

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

// Resolve appeal
exports.resolveAppeal = async (req, res) => {
  try {
    const { action, reason, adminComment } = req.body;
    const appeal = await Appeal.findById(req.params.id);

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found'
      });
    }

    // Update appeal status
    appeal.status = 'Resolved';
    appeal.resolution = {
      action,
      reason,
      adminComment,
      moderator: req.user.id,
      resolvedAt: new Date()
    };
    await appeal.save();

    // Update original item based on action
    if (appeal.post) {
      const post = await Post.findById(appeal.post);
      if (post) {
        if (action === 'restore') {
          post.moderationStatus = 'SAFE';
          post.moderationReason = null;
          post.adminComment = null;
          await post.save();
        }
      }
    }

    // Create notification for appeal user
    const notification = new Notification({
      user: appeal.appealedBy,
      type: 'appeal_resolved',
      title: 'Appeal Resolved',
      message: `Your appeal has been resolved. Action taken: ${action}.`,
      data: { action, reason, adminComment }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { appeal }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resolve appeal',
      error: error.message
    });
  }
};

// Reject appeal
exports.rejectAppeal = async (req, res) => {
  try {
    const { reason, adminComment } = req.body;
    const appeal = await Appeal.findById(req.params.id);

    if (!appeal) {
      return res.status(404).json({
        success: false,
        message: 'Appeal not found'
      });
    }

    // Update appeal status
    appeal.status = 'Rejected';
    appeal.resolution = {
      action: 'rejected',
      reason,
      adminComment,
      moderator: req.user.id,
      resolvedAt: new Date()
    };
    await appeal.save();

    // Create notification for appeal user
    const notification = new Notification({
      user: appeal.appealedBy,
      type: 'appeal_rejected',
      title: 'Appeal Rejected',
      message: `Your appeal has been rejected. Reason: ${reason}`,
      data: { reason, adminComment }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { appeal }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject appeal',
      error: error.message
    });
  }
};

// Get safety data
exports.getSafetyData = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, riskLevel, moderationStatus, aiLabel } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { 'post.content': { $regex: search, $options: 'i' } },
        { 'post.author.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (riskLevel) query.riskLevel = riskLevel;
    if (moderationStatus) query.moderationStatus = moderationStatus;
    if (aiLabel) query.aiLabel = aiLabel;

    const safetyData = await Post.find(query)
      .populate('author', 'name email profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ riskScore: -1 });

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        safetyData,
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
      message: 'Failed to load safety data',
      error: error.message
    });
  }
};