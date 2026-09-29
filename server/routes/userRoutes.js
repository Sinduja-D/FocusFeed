const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateInterests, updatePrivacy, updateSafety } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/interests', protect, updateInterests);
router.put('/privacy', protect, updatePrivacy);
router.put('/safety', protect, updateSafety);

module.exports = router;