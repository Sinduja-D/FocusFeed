const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },

  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },

  ageGroup: {
    type: String,
    enum: ['child', 'teen', 'adult'],
    required: [true, 'Please select an age group']
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },

  profileImage: {
    type: String,
    default: 'default.jpg'
  },

  savedPosts: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  }],

  interests: [{
    type: String,
    enum: [
      'Technology',
      'Science',
      'Education',
      'Sports',
      'Art',
      'Entertainment',
      'Personal Stories',
      'Social Causes'
    ]
  }],

  privacySettings: {

    profileVisibility: {
      type: String,
      enum: ['Public', 'Community', 'Private'],
      default: 'Public'
    },

    messaging: {
      type: String,
      enum: ['Everyone', 'Followers', 'Nobody'],
      default: 'Everyone'
    },

    comments: {
      type: String,
      enum: ['Everyone', 'Followers', 'Nobody'],
      default: 'Everyone'
    },

    onlineStatus: {
      type: Boolean,
      default: true
    },

    contentReuse: {
      type: Boolean,
      default: false
    }
  },

  safetySettings: {

    contentFiltering: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },

    teenProtection: {
      type: Boolean,
      default: false
    }
  },

  trustStatus: {
    type: String,
    enum: ['Normal', 'Suspicious', 'High Risk'],
    default: 'Normal'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

// Hash password before saving
userSchema.pre('save', async function(next) {

  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Generate JWT token
userSchema.methods.getSignedJwtToken = function() {

  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {

  return await bcrypt.compare(
    enteredPassword,
    this.password
  );

};

module.exports = mongoose.model('User', userSchema);