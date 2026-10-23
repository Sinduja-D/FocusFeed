const express = require('express');
const router = express.Router();
const { getPosts, createPost, getPost, likePost, commentOnPost, sharePost, savePost, reportPost } = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/postUpload');

router.get('/', optionalAuth, getPosts);
router.post('/', protect, upload.fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'video', maxCount: 1 }
]), createPost);
router.get('/:id', getPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);
router.post('/:id/share', protect, sharePost);
router.post('/:id/save', protect, savePost);
router.post('/:id/report', protect, reportPost);

module.exports = router;