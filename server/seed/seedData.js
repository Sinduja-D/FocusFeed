require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Community = require('../models/Community');
const Collaboration = require('../models/Collaboration');
const Contribution = require('../models/Contribution');
const Report = require('../models/Report');
const Appeal = require('../models/Appeal');
const Notification = require('../models/Notification');

const ensureDemoMedia = async () => {
  const imagePost = await Post.findOne({ interest: 'Art' });
  if (imagePost && (!imagePost.image || imagePost.image === 'default.jpg')) {
    imagePost.image = 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85';
    await imagePost.save();
  }

  const videoPost = await Post.findOne({ interest: 'Sports' });
  if (videoPost && !videoPost.video) {
    videoPost.video = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
    await videoPost.save();
  }
};

const createDemoUsers = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@focusfeed.com' });
  if (existingAdmin) return { admin: existingAdmin };

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@focusfeed.com',
    password: 'Admin@123',
    ageGroup: 'adult',
    role: 'admin',
    interests: ['Technology', 'Science'],
    bio: 'Administrator of FocusFeed'
  });

  const user1 = await User.create({
    name: 'John Doe',
    email: 'john@focusfeed.com',
    password: 'John@123',
    ageGroup: 'adult',
    interests: ['Technology', 'Education'],
    bio: 'Tech enthusiast and educator'
  });

  const user2 = await User.create({
    name: 'Jane Smith',
    email: 'jane@focusfeed.com',
    password: 'Jane@123',
    ageGroup: 'teen',
    interests: ['Art', 'Entertainment'],
    bio: 'Digital artist and content creator'
  });

  const user3 = await User.create({
    name: 'Alex Johnson',
    email: 'alex@focusfeed.com',
    password: 'Alex@123',
    ageGroup: 'adult',
    interests: ['Sports', 'Social Causes'],
    bio: 'Sports coach and community organizer'
  });

  return { admin, users: [user1, user2, user3] };
};

const createDemoContent = async () => {
  const { admin, users } = await createDemoUsers();
  const [john, jane, alex] = users || [];

  if (!admin) {
    const existingAdmin = await User.findOne({ email: 'admin@focusfeed.com' });
    if (!existingAdmin) {
      throw new Error('Admin user could not be created.');
    }
  }

  const existingPosts = await Post.countDocuments();
  if (existingPosts > 0) {
    console.log('Posts already exist; skipping post seed.');
    return { admin, users };
  }

  const techCommunity = await Community.create({
    name: 'Tech Innovators',
    description: 'A community for technology enthusiasts and innovators',
    interest: 'Technology',
    members: [john, jane, alex].filter(Boolean),
    admins: [admin]
  });

  const artCommunity = await Community.create({
    name: 'Digital Artists',
    description: 'A community for digital artists and designers',
    interest: 'Art',
    members: [jane].filter(Boolean),
    admins: [admin]
  });

  const post1 = await Post.create({
    author: john,
    content: 'Just launched my new tech blog focusing on AI and machine learning. Check it out!',
    interest: 'Technology',
    audience: 'Public',
    creationType: 'Human Created',
    aiLabel: 'Human Created',
    moderationStatus: 'SAFE',
    factStatus: 'Not Reviewed',
    sponsored: false,
    likes: [jane?._id, alex?._id].filter(Boolean),
    comments: [
      { user: jane?._id, text: 'Looks great! Will definitely check it out.' },
      { user: alex?._id, text: 'Nice work! Keep it up.' }
    ].filter(comment => comment.user),
    shares: 5
  });

  const post2 = await Post.create({
    author: jane,
    content: 'Created a new digital art piece inspired by nature. What do you think?',
    image: 'default.jpg',
    interest: 'Art',
    audience: 'Public',
    creationType: 'Human Created',
    aiLabel: 'Human Created',
    moderationStatus: 'SAFE',
    factStatus: 'Not Reviewed',
    sponsored: false,
    likes: [john?._id, alex?._id].filter(Boolean),
    comments: [{ user: john?._id, text: 'Beautiful! Love the colors.' }].filter(comment => comment.user),
    shares: 3
  });

  const post3 = await Post.create({
    author: alex,
    content: 'Organizing a local sports event for underprivileged kids. Join us if you can!',
    interest: 'Sports',
    audience: 'Community',
    creationType: 'Human Created',
    aiLabel: 'Human Created',
    moderationStatus: 'SAFE',
    factStatus: 'Not Reviewed',
    sponsored: false,
    likes: [john?._id, jane?._id].filter(Boolean),
    comments: [
      { user: john?._id, text: 'Great initiative! How can I help?' },
      { user: jane?._id, text: 'Count me in!' }
    ].filter(comment => comment.user),
    shares: 8
  });

  const post4 = await Post.create({
    author: john,
    content: 'New research shows that AI can help detect diseases earlier than traditional methods.',
    interest: 'Science',
    audience: 'Public',
    creationType: 'AI Assisted',
    aiLabel: 'AI Assisted',
    moderationStatus: 'SAFE',
    factStatus: 'Under Review',
    sponsored: true,
    likes: [jane?._id, alex?._id].filter(Boolean),
    comments: [{ user: jane?._id, text: 'Fascinating! Do you have a link to the study?' }].filter(comment => comment.user),
    shares: 12
  });

  const post5 = await Post.create({
    author: jane,
    content: 'Here\'s a tutorial on creating digital art using AI tools. Check it out!',
    interest: 'Entertainment',
    audience: 'Public',
    creationType: 'AI Generated',
    aiLabel: 'AI Generated',
    moderationStatus: 'SAFE',
    factStatus: 'Not Reviewed',
    sponsored: false,
    likes: [john?._id, alex?._id].filter(Boolean),
    comments: [{ user: john?._id, text: 'Great tutorial! Very helpful.' }].filter(comment => comment.user),
    shares: 7
  });

  const collaboration = await Collaboration.create({
    title: 'Community Tech Project',
    description: 'A collaborative project to develop a tech solution for local schools',
    purpose: 'To provide educational technology resources to underprivileged schools',
    creator: john,
    contributors: [
      { user: john, status: 'Accepted' },
      { user: jane, status: 'Pending' },
      { user: alex, status: 'Accepted' }
    ],
    status: 'In Progress'
  });

  await Contribution.create({
    collaboration,
    contributor: john,
    content: 'I can develop the mobile app component of the project',
    media: 'default.jpg',
    status: 'Approved',
    consent: true,
    reusePermission: true
  });

  await Contribution.create({
    collaboration,
    contributor: alex,
    content: 'I can help with the hardware setup and installation',
    media: 'default.jpg',
    status: 'Pending',
    consent: true,
    reusePermission: false
  });

  await Report.create({
    reportedBy: jane,
    post: post4,
    reason: 'False Information',
    description: 'This claim about AI detecting diseases seems exaggerated and not supported by evidence',
    status: 'Under Review'
  });

  await Appeal.create({
    appealedBy: john,
    post: post4,
    decision: 'Content Restricted',
    reason: 'I believe my post about AI in healthcare is accurate and well-researched',
    status: 'Pending'
  });

  await Notification.create({
    user: john,
    type: 'Report Decision',
    message: 'Your post has been reviewed and marked as safe',
    relatedPost: post4,
    read: false
  });

  await Notification.create({
    user: jane,
    type: 'Collaboration Invitation',
    message: 'You have been invited to join a new collaboration',
    relatedCollaboration: collaboration,
    read: false
  });

  await Notification.create({
    user: alex,
    type: 'Contribution Approved',
    message: 'Your contribution to the collaboration has been approved',
    relatedCollaboration: collaboration,
    read: false
  });

  return { admin, users };
};

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
      throw new Error('MONGO_URI and JWT_SECRET must be set in server/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    const adminExists = await User.exists({ email: 'admin@focusfeed.com' });
    const postCount = await Post.countDocuments();

    if (adminExists && postCount > 0) {
      await ensureDemoMedia();
      console.log('Required demo data already exists: admin + posts.');
      return;
    }

    console.log('Creating missing default demo data...');
    await createDemoContent();
    await ensureDemoMedia();
    console.log('Seed data created successfully.');
  } catch (error) {
    console.error('Seed error:', error.message);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

const seedIfEmpty = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be set in server/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    const adminExists = await User.exists({ email: 'admin@focusfeed.com' });
    const postCount = await Post.countDocuments();

    if (!adminExists || postCount === 0) {
      console.log('Missing focusfeed admin or posts. Running demo seeding...');
      await createDemoContent();
      await ensureDemoMedia();
      console.log('Seed data created successfully.');
      return;
    }

    await ensureDemoMedia();
    console.log('Demo data already exists in MongoDB.');
  } catch (error) {
    console.error('seedIfEmpty error:', error.message);
    throw error;
  }
};

module.exports = { seedData, seedIfEmpty };

if (require.main === module) {
  seedData();
}
