const express = require('express');

const router = express.Router();

const {
  createReport,
  getReports,
  getUserReports,
  getReport,
  updateReport,
  deleteReport,
  resolveReport,
  rejectReport,
  markReportAsRead,
  markAllReportsAsRead
} = require('../controllers/reportController');

const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createReport);

router.get('/', protect, admin, getReports);

router.get('/my', protect, getUserReports);

router.put('/read-all', protect, markAllReportsAsRead);

router.get('/:id', protect, getReport);

router.put('/:id', protect, updateReport);

router.delete('/:id', protect, deleteReport);

router.put('/:id/resolve', protect, admin, resolveReport);

router.put('/:id/reject', protect, admin, rejectReport);

router.put('/:id/read', protect, markReportAsRead);

module.exports = router;