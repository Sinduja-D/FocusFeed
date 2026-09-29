const Contribution = require('../models/Contribution');
const Collaboration = require('../models/Collaboration');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create contribution
exports.createContribution = async (req, res) => {
  try {
    const { collaborationId, content, consent, reusePermission } = req.body;
    const userId = req.user.id;
    const media = req.file;

    // Check if collaboration exists
    const collaboration = await Collaboration.findById(collaborationId);
    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }

    // Check if user is a contributor
    const isContributor = collaboration.contributors.some(
      c => c.user.toString() === userId
    );

    if (!isContributor) {
      return res.status(403).json({
        success: false,
        message: 'Only contributors can make contributions'
      });
    }

    // Create contribution
    const contribution = new Contribution({
      collaboration: collaborationId,
      author: userId,
      content,
      media: media ? media.path : null,
      consent,
      reusePermission,
      status: 'pending'
    });

    await contribution.save();

    // Update collaboration
    collaboration.contributions.push(contribution._id);
    collaboration.updatedAt = new Date();
    await collaboration.save();

    // Create notification for collaboration creator
    const notification = new Notification({
      user: collaboration.creator,
      type: 'new_contribution',
      title: 'New Contribution',
      message: `${req.user.name} made a new contribution to your collaboration`,
      data: { collaborationId, contributionId: contribution._id }
    });

    await notification.save();

    res.status(201).json({
      success: true,
      data: { contribution }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create contribution',
      error: error.message
    });
  }
};

// Get all contributions
exports.getContributions = async (req, res) => {
  try {
    const { page = 1, limit = 10, collaboration, status, author } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (collaboration) query.collaboration = collaboration;
    if (status) query.status = status;
    if (author) query.author = author;

    const contributions = await Contribution.find(query)
      .populate('collaboration', 'title')
      .populate('author', 'name profileImage')
      .populate('moderator', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Contribution.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        contributions,
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
      message: 'Failed to load contributions',
      error: error.message
    });
  }
};

// Get contribution by ID
exports.getContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id)
      .populate('collaboration', 'title description')
      .populate('author', 'name profileImage')
      .populate('moderator', 'name')
      .populate('approval', 'action reason adminComment');

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { contribution }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load contribution',
      error: error.message
    });
  }
};

// Update contribution
exports.updateContribution = async (req, res) => {
  try {
    const { content, consent, reusePermission } = req.body;
    const contributionId = req.params.id;
    const userId = req.user.id;

    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Check if user is the author
    if (contribution.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the contribution author can update it'
      });
    }

    // Check if contribution is still pending
    if (contribution.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update an approved or rejected contribution'
      });
    }

    // Update contribution
    if (content) contribution.content = content;
    if (consent !== undefined) contribution.consent = consent;
    if (reusePermission !== undefined) contribution.reusePermission = reusePermission;
    contribution.updatedAt = new Date();

    await contribution.save();

    res.status(200).json({
      success: true,
      data: { contribution }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update contribution',
      error: error.message
    });
  }
};

// Delete contribution
exports.deleteContribution = async (req, res) => {
  try {
    const contributionId = req.params.id;
    const userId = req.user.id;

    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Check if user is the author
    if (contribution.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the contribution author can delete it'
      });
    }

    // Check if contribution is still pending
    if (contribution.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an approved or rejected contribution'
      });
    }

    await Contribution.findByIdAndDelete(contributionId);

    // Update collaboration
    const collaboration = await Collaboration.findById(contribution.collaboration);
    if (collaboration) {
      collaboration.contributions = collaboration.contributions.filter(
        c => c.toString() !== contributionId
      );
      collaboration.updatedAt = new Date();
      await collaboration.save();
    }

    res.status(200).json({
      success: true,
      message: 'Contribution deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete contribution',
      error: error.message
    });
  }
};

// Approve contribution
exports.approveContribution = async (req, res) => {
  try {
    const { reason, adminComment } = req.body;
    const contributionId = req.params.id;
    const moderatorId = req.user.id;

    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Update contribution status
    contribution.status = 'approved';
    contribution.approval = {
      action: 'approved',
      reason,
      adminComment,
      moderator: moderatorId,
      approvedAt: new Date()
    };
    contribution.updatedAt = new Date();

    await contribution.save();

    // Create notification for contribution author
    const notification = new Notification({
      user: contribution.author,
      type: 'contribution_approved',
      title: 'Contribution Approved',
      message: `Your contribution has been approved. Reason: ${reason}`,
      data: { contributionId, reason, adminComment }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { contribution }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve contribution',
      error: error.message
    });
  }
};

// Reject contribution
exports.rejectContribution = async (req, res) => {
  try {
    const { reason, adminComment } = req.body;
    const contributionId = req.params.id;
    const moderatorId = req.user.id;

    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    // Update contribution status
    contribution.status = 'rejected';
    contribution.approval = {
      action: 'rejected',
      reason,
      adminComment,
      moderator: moderatorId,
      rejectedAt: new Date()
    };
    contribution.updatedAt = new Date();

    await contribution.save();

    // Create notification for contribution author
    const notification = new Notification({
      user: contribution.author,
      type: 'contribution_rejected',
      title: 'Contribution Rejected',
      message: `Your contribution has been rejected. Reason: ${reason}`,
      data: { contributionId, reason, adminComment }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { contribution }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject contribution',
      error: error.message
    });
  }
};