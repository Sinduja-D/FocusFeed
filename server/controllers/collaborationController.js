const Collaboration = require('../models/Collaboration');
const Contribution = require('../models/Contribution');
const Post = require('../models/Post');
const User = require('../models/User');
const Community = require('../models/Community');
const Notification = require('../models/Notification');
const { generateVideo } = require('../services/videoService');

// Create collaboration
exports.createCollaboration = async (req, res) => {
  try {
    const { title, description, purpose, interests } = req.body;
    const userId = req.user.id;

    // Create collaboration
    const collaboration = new Collaboration({
      title,
      description,
      purpose,
      interests,
      creator: userId,
      status: 'Open',
      contributors: [{ user: userId, status: 'Accepted', joinedAt: new Date() }]
    });

    await collaboration.save();

    // Create notification for followers
    const followers = await User.find({ _id: { $ne: userId } });
    const notifications = followers.map(follower => new Notification({
      user: follower._id,
      type: 'Collaboration Invitation',
      message: `${req.user.name} started a new collaboration: ${title}`,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      data: { collaboration }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create collaboration',
      error: error.message
    });
  }
};

// Get all collaborations
exports.getCollaborations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, interest } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (interest) query.interests = { $in: [interest] };

    const collaborations = await Collaboration.find(query)
      .populate('creator', 'name profileImage')
      .populate('contributors.user', 'name profileImage')
      .populate('submissions', 'content media status createdAt')
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
      .populate('creator', 'name profileImage bio')
      .populate('contributors.user', 'name profileImage bio')
      .populate('submissions', 'content media status createdAt');

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

// Join collaboration
exports.joinCollaboration = async (req, res) => {
  try {
    const collaborationId = req.params.id;
    const userId = req.user.id;

    const collaboration = await Collaboration.findById(collaborationId);
    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }

    // Check if user is already a contributor
    const existingContributor = collaboration.contributors.find(
      c => c.user.toString() === userId
    );

    if (existingContributor) {
      return res.status(400).json({
        success: false,
        message: 'You are already a contributor to this collaboration'
      });
    }

    // Add user as contributor
    collaboration.contributors.push({
      user: userId,
      status: 'active',
      joinedAt: new Date()
    });

    await collaboration.save();

    // Create notification for collaboration creator
    const notification = new Notification({
      user: collaboration.creator,
      type: 'collaboration_join',
      title: 'New Collaborator',
      message: `${req.user.name} joined your collaboration`,
      data: { collaborationId, userId }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { collaboration }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to join collaboration',
      error: error.message
    });
  }
};

// Leave collaboration
exports.leaveCollaboration = async (req, res) => {
  try {
    const collaborationId = req.params.id;
    const userId = req.user.id;

    const collaboration = await Collaboration.findById(collaborationId);
    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }

    // Remove user from contributors
    collaboration.contributors = collaboration.contributors.filter(
      c => c.user.toString() !== userId
    );

    await collaboration.save();

    // Create notification for collaboration creator
    const notification = new Notification({
      user: collaboration.creator,
      type: 'collaboration_leave',
      title: 'Collaborator Left',
      message: `${req.user.name} left your collaboration`,
      data: { collaborationId, userId }
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { collaboration }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to leave collaboration',
      error: error.message
    });
  }
};

// Update collaboration
exports.updateCollaboration = async (req, res) => {
  try {
    const { title, description, purpose, interests, status } = req.body;
    const collaborationId = req.params.id;
    const userId = req.user.id;

    const collaboration = await Collaboration.findById(collaborationId);
    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }

    // Check if user is the creator
    if (collaboration.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the collaboration creator can update it'
      });
    }

    // Update collaboration
    if (title) collaboration.title = title;
    if (description) collaboration.description = description;
    if (purpose) collaboration.purpose = purpose;
    if (interests) collaboration.interests = interests;
    if (status) collaboration.status = status;
    collaboration.updatedAt = new Date();

    await collaboration.save();

    res.status(200).json({
      success: true,
      data: { collaboration }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update collaboration',
      error: error.message
    });
  }
};

// Delete collaboration
exports.deleteCollaboration = async (req, res) => {
  try {
    const collaborationId = req.params.id;
    const userId = req.user.id;

    const collaboration = await Collaboration.findById(collaborationId);
    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }

    // Check if user is the creator
    if (collaboration.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the collaboration creator can delete it'
      });
    }

    await Collaboration.findByIdAndDelete(collaborationId);

    res.status(200).json({
      success: true,
      message: 'Collaboration deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete collaboration',
      error: error.message
    });
  }
};

// Contribute to collaboration
exports.contributeToCollaboration = async (req, res) => {
  try {
    const collaborationId = req.params.id;
    const userId = req.user.id;
    const { content, consent, reusePermission } = req.body;
    const media = req.file;

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
      message: 'Failed to contribute to collaboration',
      error: error.message
    });
  }
};

// Generate video for collaboration
exports.generateVideo = async (req, res) => {
  try {
    const collaborationId = req.params.id;
    const userId = req.user.id;

    const collaboration = await Collaboration.findById(collaborationId);
    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }

    // Check if user is the creator
    if (collaboration.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the collaboration creator can generate a video'
      });
    }

    // Generate video
    const videoUrl = await generateVideo(collaborationId);

    // Update collaboration
    collaboration.finalVideo = videoUrl;
    collaboration.videoGeneratedAt = new Date();
    await collaboration.save();

    res.status(200).json({
      success: true,
      data: { videoUrl }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate video',
      error: error.message
    });
  }
};

// Publish collaboration
exports.publishCollaboration = async (req, res) => {
  try {
    const collaborationId = req.params.id;
    const userId = req.user.id;

    const collaboration = await Collaboration.findById(collaborationId);
    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found'
      });
    }

    // Check if user is the creator
    if (collaboration.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the collaboration creator can publish it'
      });
    }

    // Update collaboration status
    collaboration.status = 'Completed';
    collaboration.publishedAt = new Date();
    await collaboration.save();

    // Create post from collaboration
    const post = new Post({
      author: userId,
      content: `Check out our completed collaboration: ${collaboration.title}`,
      collaboration: collaborationId,
      aiLabel: 'Human Created',
      moderationStatus: 'SAFE'
    });

    await post.save();

    // Create notification for all contributors
    const notifications = collaboration.contributors.map(contributor => new Notification({
      user: contributor.user,
      type: 'collaboration_published',
      title: 'Collaboration Published',
      message: `The collaboration "${collaboration.title}" has been completed and published`,
      data: { collaborationId, postId: post._id }
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      success: true,
      data: { collaboration, post }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to publish collaboration',
      error: error.message
    });
  }
};