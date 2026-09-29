const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user interests
// @route   PUT /api/users/interests
// @access  Private
exports.updateInterests = async (req, res, next) => {
  try {
    const { interests } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { interests },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user privacy settings
// @route   PUT /api/users/privacy
// @access  Private
exports.updatePrivacy = async (req, res, next) => {
  try {
    const { privacySettings } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { privacySettings },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user safety settings
// @route   PUT /api/users/safety
// @access  Private
exports.updateSafety = async (req, res, next) => {
  try {
    const { safetySettings } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { safetySettings },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};