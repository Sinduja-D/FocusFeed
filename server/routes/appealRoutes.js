const express = require('express');

const router = express.Router();

const {
  createAppeal,
  getUserAppeals,
  getAppeal,
  updateAppeal,
  deleteAppeal,
  markAppealAsRead,
  markAllAppealsAsRead
} = require('../controllers/appealController');

const { protect } = require('../middleware/authMiddleware');

// Create appeal
router.post('/', protect, createAppeal);

// Get my appeals
router.get('/my', protect, getUserAppeals);

// Mark all my appeals as read
router.put('/read-all', protect, markAllAppealsAsRead);

// Get single appeal
router.get('/:id', protect, getAppeal);

// Update appeal
router.put('/:id', protect, updateAppeal);

// Delete appeal
router.delete('/:id', protect, deleteAppeal);

// Mark single appeal as read
router.put('/:id/read', protect, markAppealAsRead);

module.exports = router;