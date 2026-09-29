const express = require('express');
const router = express.Router();
const { approveContribution, rejectContribution } = require('../controllers/contributionController');
const { protect, admin } = require('../middleware/authMiddleware');

router.put('/:id/approve', protect, admin, approveContribution);
router.put('/:id/reject', protect, admin, rejectContribution);

module.exports = router;