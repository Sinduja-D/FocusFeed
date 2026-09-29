const express = require('express');
const router = express.Router();
const { getCollaborations, createCollaboration, getCollaboration, joinCollaboration, contributeToCollaboration, generateVideo, publishCollaboration } = require('../controllers/collaborationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCollaborations);
router.post('/', protect, createCollaboration);
router.get('/:id', getCollaboration);
router.post('/:id/join', protect, joinCollaboration);
router.post('/:id/contribute', protect, contributeToCollaboration);
router.post('/:id/generate-video', protect, generateVideo);
router.post('/:id/publish', protect, publishCollaboration);

module.exports = router;