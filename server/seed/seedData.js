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

};

const createDemoUsers = async () => {
  const admin = await User.findOne({ email: 'admin@focusfeed.com' }) || await User.create({
    name: 'Admin User',
    email: 'admin@focusfeed.com',
    password: 'Admin@123',
    ageGroup: 'adult',
    role: 'admin',
    interests: ['Technology', 'Science'],
    bio: 'Administrator of FocusFeed'
  });

  const user1 = await User.findOne({ email: 'john@focusfeed.com' }) || await User.create({
    name: 'John Doe',
    email: 'john@focusfeed.com',
    password: 'John@123',
    ageGroup: 'adult',
    interests: ['Technology', 'Education'],
    bio: 'Tech enthusiast and educator'
  });

  const user2 = await User.findOne({ email: 'jane@focusfeed.com' }) || await User.create({
    name: 'Jane Smith',
    email: 'jane@focusfeed.com',
    password: 'Jane@123',
    ageGroup: 'teen',
    interests: ['Art', 'Entertainment'],
    bio: 'Digital artist and content creator'
  });

  const user3 = await User.findOne({ email: 'alex@focusfeed.com' }) || await User.create({
    name: 'Alex Johnson',
    email: 'alex@focusfeed.com',
    password: 'Alex@123',
    ageGroup: 'adult',
    interests: ['Sports', 'Social Causes'],
    bio: 'Sports coach and community organizer'
  });

  const demoProfiles = [
    [admin, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=80'],
    [user1, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&h=240&q=80'],
    [user2, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=80'],
    [user3, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=80']
  ];

  for (const [user, profileImage] of demoProfiles) {
    if (!user.profileImage || user.profileImage === 'default.jpg') {
      user.profileImage = profileImage;
      await user.save();
    }
  }

  return { admin, users: [user1, user2, user3] };
};

const ensureDemoPosts = async () => {
  const { users } = await createDemoUsers();
  const posts = [
    ['Technology', 'A small accessibility feature can make a product easier for thousands of people to use. What is one feature you wish more apps included?'],
    ['Science', 'A neighborhood bird-count project is helping researchers track migration changes. Have you noticed new species near you this year?'],
    ['Education', 'I started using short review sessions after class instead of one long study night. It has made revision feel much more manageable.'],
    ['Sports', 'Our weekend running group is setting a relaxed pace for first-time runners. Everyone is welcome, whatever your distance.'],
    ['Art', 'A quick color study from this morning: trying to capture the way sunlight changes a familiar room.'],
    ['Entertainment', 'The best stories leave you thinking about the characters long after the final scene. What have you watched recently that stayed with you?'],
    ['Personal Stories', 'I finally asked for help with a project I had been stuck on. A ten-minute conversation saved me hours of guessing.'],
    ['Social Causes', 'Our campus repair table kept several laptops and headphones out of the waste stream this week. Small fixes add up.'],
    ['Technology', 'Testing a simple reading mode with larger type and fewer distractions. The difference on a long article is surprisingly good.'],
    ['Education', 'Study tip that worked for me: explain the idea out loud before looking at your notes. The gaps become obvious very quickly.'],
    ['Science', 'A local community garden is recording soil temperature and rainfall to understand which plants handle the changing seasons best.'],
    ['Art', 'Made a poster from hand-drawn shapes and two ink colors. Limiting the palette forced me to simplify the composition.'],
    ['Technology', 'A closer look at the tiny components that turn a circuit board into a useful tool.', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85'],
    ['Technology', 'A small robotics team testing a new prototype together in the workshop.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85'],
    ['Technology', 'Ideas move faster when a team can sketch, build, and test them side by side.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=85'],
    ['Science', 'A close-up from a plant-growth observation: the smallest changes are often the most interesting.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=85', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'],
    ['Science', 'A clear night sky makes a wonderful reminder of how much there is left to explore.', 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=85'],
    ['Science', 'A bright lab bench and a fresh set of questions for today’s experiment.', 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=1200&q=85'],
    ['Art', 'Trying a loose brush study with warm light and broad color shapes.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85'],
    ['Art', 'A gallery wall full of different materials, marks, and ways of seeing.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=85'],
    ['Art', 'A short botanical motion study paired with a painted study of color and form.', 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'],
    ['Sports', 'An early training session before the courts get busy.', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85'],
    ['Sports', 'A team huddle before the first whistle. Good energy all around.', 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=85'],
    ['Sports', 'A quiet moment between plays during a weekend game.', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=85']
  ];

  for (const [index, [interest, content, image, video]] of posts.entries()) {
    if (await Post.exists({ content })) continue;
    await Post.create({
      author: users[index % users.length],
      content,
      interest,
      image: image || '',
      video: video || '',
      audience: 'Public',
      creationType: 'Human Created',
      aiLabel: 'Human Created',
      moderationStatus: 'SAFE',
      factStatus: 'Not Reviewed'
    });
  }
};

const ensureDemoNotifications = async () => {
  const { users } = await createDemoUsers();
  const examples = [
    [users[0], 'Report Decision', 'A report on your post has been reviewed'],
    [users[1], 'Collaboration Invitation', 'You have a new collaboration invitation'],
    [users[2], 'Contribution Approved', 'Your contribution has been approved']
  ];

  for (const [user, type, message] of examples) {
    if (!await Notification.exists({ user, message })) {
      await Notification.create({ user, type, message, read: false });
    }
  }
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
      await ensureDemoPosts();
      await ensureDemoNotifications();
      await ensureDemoMedia();
      console.log('Required demo data already exists: admin + posts.');
      return;
    }

    console.log('Creating missing default demo data...');
    await createDemoContent();
    await ensureDemoPosts();
    await ensureDemoNotifications();
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
    }

    await ensureDemoPosts();
    await ensureDemoNotifications();
    await ensureDemoMedia();
    console.log('Demo data is ready.');
  } catch (error) {
    console.error('seedIfEmpty error:', error.message);
    throw error;
  }
};

module.exports = { seedData, seedIfEmpty };

if (require.main === module) {
  seedData();
}
