const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRequest,
  getRequests,
  getRequestById,
  getMyRequests,
  updateRequestStatus,
  deleteRequest,
} = require('../controllers/requestController');

// Public — anyone can browse requests
router.get('/', getRequests);

// Must be before /:id
router.get('/my-requests', protect, getMyRequests);

// Single request — public
router.get('/:id', getRequestById);

// Protected — login required
router.post('/', protect, createRequest);
router.put('/:id/status', protect, updateRequestStatus);
router.delete('/:id', protect, deleteRequest);

module.exports = router;