const express = require('express');

const router = express.Router();

const {
  getDashboard,
  getUsers,
  getPosts,
  getReports,
  getModerationQueue,
  getFakeAccounts,
  getEngagementData,
  getCollaborations,
  getAppeals,
  getSafetyData
  ,moderatePost
  ,deletePost
  ,resolveReport
  ,rejectReport
  ,moderateItem
  ,verifyAccount
  ,banAccount
  ,moderateCollaboration
  ,resolveAppeal
  ,rejectAppeal
} = require('../controllers/adminController');

const { protect, admin } = require('../middleware/authMiddleware');

// Dashboard
router.get('/dashboard', protect, admin, getDashboard);

// Users
router.get('/users', protect, admin, getUsers);

// Posts
router.get('/posts', protect, admin, getPosts);

// Reports
router.get('/reports', protect, admin, getReports);

// Moderation
router.get('/moderation', protect, admin, getModerationQueue);

// Fake accounts
router.get('/fake-accounts', protect, admin, getFakeAccounts);

// Engagement
router.get('/engagement', protect, admin, getEngagementData);

// Collaborations
router.get('/collaborations', protect, admin, getCollaborations);

// Appeals
router.get('/appeals', protect, admin, getAppeals);

// Safety
router.get('/safety', protect, admin, getSafetyData);

router.post('/posts/:id/moderate', protect, admin, moderatePost);
router.delete('/posts/:id', protect, admin, deletePost);
router.post('/reports/:id/resolve', protect, admin, resolveReport);
router.post('/reports/:id/reject', protect, admin, rejectReport);
router.post('/moderation/:id/action', protect, admin, moderateItem);
router.post('/fake-accounts/:id/verify', protect, admin, verifyAccount);
router.post('/fake-accounts/:id/ban', protect, admin, banAccount);
router.post('/collaborations/:id/moderate', protect, admin, moderateCollaboration);
router.post('/appeals/:id/resolve', protect, admin, resolveAppeal);
router.post('/appeals/:id/reject', protect, admin, rejectAppeal);

module.exports = router;