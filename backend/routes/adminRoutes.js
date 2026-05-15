const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  deleteUser,
  getAllItems,
  approveItem,
  rejectItem,
  getDashboardStats,
  toggleUserStatus,
  adminDeleteItem,
  getReports,
} = require('../controllers/adminController');

// Stats
router.get('/stats', protect, adminOnly, getDashboardStats);

// Users
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.patch('/users/:id/toggle-status', protect, adminOnly, toggleUserStatus);

// Listings — frontend uses 'listings' not 'items'
router.get('/listings', protect, adminOnly, getAllItems);
router.patch('/listings/:id/approve', protect, adminOnly, approveItem);
router.patch('/listings/:id/reject', protect, adminOnly, rejectItem);
router.delete('/listings/:id', protect, adminOnly, adminDeleteItem);

// Reports
router.get('/reports', protect, adminOnly, getReports);

module.exports = router;