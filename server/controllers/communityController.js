const Community = require('../models/Community');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create community
exports.createCommunity = async (req, res) => {
  try {
    const { name, description, interest } = req.body;
    const userId = req.user.id;

    // Check if community name already exists
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({
        success: false,
        message: 'Community name already exists'
      });
    }

    // Create community
    const community = new Community({
      name,
      description,
      interest,
      members: [userId],
      admins: [userId]
    });

    await community.save();

    // Create notification for followers
    const followers = await User.find({ _id: { $ne: userId } });
    const notifications = followers.map(follower => new Notification({
      user: follower._id,
      type: 'Community Activity',
      message: `${req.user.name} created a new community: ${name}`,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      data: { community }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create community',
      error: error.message
    });
  }
};

// Get all communities
exports.getCommunities = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, interest, isPrivate } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (interest) query.interests = { $in: [interest] };
    if (isPrivate !== undefined) query.isPrivate = isPrivate === 'true';

    const communities = await Community.find(query)
      .populate('admins', 'name profileImage')
      .populate('members', 'name profileImage')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ membersCount: -1 });

    const total = await Community.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        communities,
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
      message: 'Failed to load communities',
      error: error.message
    });
  }
};

// Get community by ID
exports.getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('admins', 'name profileImage bio')
      .populate('members', 'name profileImage bio')
      .populate('posts', 'content author createdAt likes comments shares');

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { community }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load community',
      error: error.message
    });
  }
};

// Join community
exports.joinCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user.id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is already a member
    const existingMember = community.members.some(member => member.toString() === userId);

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this community'
      });
    }

    // Add user as member
    community.members.push(userId);

    await community.save();

    // Create notification for community creator
    const notification = new Notification({
      user: community.creator,
      type: 'Community Activity',
      message: `${req.user.name} joined your community`,
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { community }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to join community',
      error: error.message
    });
  }
};

// Leave community
exports.leaveCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user.id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Remove user from members
    community.members = community.members.filter(member => member.toString() !== userId);
    community.admins = community.admins.filter(admin => admin.toString() !== userId);

    await community.save();

    // Create notification for community creator
    const notification = new Notification({
      user: community.creator,
      type: 'Community Activity',
      message: `${req.user.name} left your community`,
    });

    await notification.save();

    res.status(200).json({
      success: true,
      data: { community }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to leave community',
      error: error.message
    });
  }
};

// Update community
exports.updateCommunity = async (req, res) => {
  try {
    const { name, description, interests, isPrivate } = req.body;
    const communityId = req.params.id;
    const userId = req.user.id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is the creator or admin
    const userRole = community.members.find(m => m.user.toString() === userId)?.role;
    if (userRole !== 'admin' && community.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only community admins can update it'
      });
    }

    // Update community
    if (name) community.name = name;
    if (description) community.description = description;
    if (interests) community.interests = interests;
    if (isPrivate !== undefined) community.isPrivate = isPrivate;
    community.updatedAt = new Date();

    await community.save();

    res.status(200).json({
      success: true,
      data: { community }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update community',
      error: error.message
    });
  }
};

// Delete community
exports.deleteCommunity = async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.user.id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    // Check if user is the creator
    if (community.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the community creator can delete it'
      });
    }

    await Community.findByIdAndDelete(communityId);

    res.status(200).json({
      success: true,
      message: 'Community deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete community',
      error: error.message
    });
  }
};

// Get community posts
exports.getCommunityPosts = async (req, res) => {
  try {
    const communityId = req.params.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Community not found'
      });
    }

    const posts = await Post.find({ community: communityId })
      .populate('author', 'name profileImage')
      .populate('community', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ community: communityId });

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
      message: 'Failed to load community posts',
      error: error.message
    });
  }
};