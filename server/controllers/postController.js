const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const aiModerationService = require('../services/aiModerationService');
const feedRecommendationService = require('../services/feedRecommendationService');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const { interest, focusMode, discoveryLevel, author } = req.query;
    
    // Get user preferences if logged in
    let userPreferences = null;
    if (req.user) {
      userPreferences = await User.findById(req.user.id).select('interests');
    }

    // Build query
    let query = {};
    
    // Filter by interest if provided
    if (interest) {
      query.interest = interest;
    }
    if (author) {
      query.author = author;
    }
    
    // Apply recommendation logic if user is logged in
    if (userPreferences && focusMode && discoveryLevel && !author) {
      // Get all posts first
      const posts = await Post.find(query).populate('author', 'name profileImage');
      
      // Apply recommendation service
      const recommendedPosts = feedRecommendationService.recommendPosts(
        posts, 
        userPreferences.interests, 
        focusMode, 
        discoveryLevel,
        req.user.id
      );
      
      return res.status(200).json({
        success: true,
        count: recommendedPosts.length,
        data: recommendedPosts
      });
    }
    
    // Default to all posts if no user preferences
    const posts = await Post.find(query).populate('author', 'name profileImage');
    
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    req.body.author = req.user.id;

    if (req.files?.image?.[0]) {
      req.body.image = `/uploads/images/${req.files.image[0].filename}`;
    }

    if (req.files?.video?.[0]) {
      req.body.video = `/uploads/videos/${req.files.video[0].filename}`;
    }
    
    // Set default values
    if (!req.body.interest) {
      req.body.interest = 'Technology'; // Default interest
    }
    
    if (!req.body.audience) {
      req.body.audience = 'Public'; // Default audience
    }
    
    if (!req.body.creationType) {
      req.body.creationType = 'Human Created'; // Default creation type
    }
    
    // Run AI moderation
    const moderationResult = await aiModerationService.moderateContent(req.body.content);
    
    // Apply moderation result
    req.body.moderationStatus = moderationResult.status;
    req.body.moderationReason = moderationResult.reason;
    
    // Create post
    const post = await Post.create(req.body);
    
    // Populate author
    await post.populate('author', 'name profileImage');
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name profileImage');
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(req.user.id);
    
    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(like => like.toString() !== req.user.id.toString());
    } else {
      // Like
      post.likes.push(req.user.id);
    }
    
    await post.save();

    if (!alreadyLiked && post.author.toString() !== req.user.id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'Community Activity',
        message: `${req.user.name} liked your post`,
        relatedPost: post._id
      });
    }
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Comment on a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.commentOnPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ success: false, message: 'Please provide a comment' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Add comment
    const comment = {
      user: req.user.id,
      text
    };
    
    post.comments.push(comment);
    await post.save();

    if (post.author.toString() !== req.user.id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'Community Activity',
        message: `${req.user.name} commented on your post`,
        relatedPost: post._id
      });
    }
    
    // Populate comment author
    await post.populate('comments.user', 'name profileImage');
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Report a post
// @route   POST /api/posts/:id/report
// @access  Private
exports.reportPost = async (req, res, next) => {
  try {
    const { reason, description } = req.body;
    
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Please provide a reason for reporting' });
    }
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    
    // Create report
    const report = {
      reportedBy: req.user.id,
      post: req.params.id,
      reason,
      description
    };
    
    // Save report (we'll create the Report model later)
    // For now, just return success
    res.status(201).json({
      success: true,
      message: 'Post reported successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Share a post
// @route   POST /api/posts/:id/share
// @access  Private
exports.sharePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// @desc    Save or unsave a post
// @route   POST /api/posts/:id/save
// @access  Private
exports.savePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).select('_id');
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const user = await User.findById(req.user.id);
    const saved = user.savedPosts.some(savedPost => savedPost.toString() === post._id.toString());

    if (saved) {
      user.savedPosts = user.savedPosts.filter(savedPost => savedPost.toString() !== post._id.toString());
    } else {
      user.savedPosts.push(post._id);
    }

    await user.save();
    res.status(200).json({ success: true, saved: !saved });
  } catch (err) {
    next(err);
  }
};