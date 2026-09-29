const express = require('express');
const router = express.Router();
const { getCommunities, createCommunity, getCommunity, joinCommunity } = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCommunities);
router.post('/', protect, createCommunity);
router.get('/:id', getCommunity);
router.post('/:id/join', protect, joinCommunity);

module.exports = router;