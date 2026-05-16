
const User = require('../models/User');
const Item = require('../models/Item');
const Request = require('../models/Request');


const getAllUsers = async (req, res) => {
  try {
    // Find all users but never send passwords — even to admin.
    // '-password' means exclude the password field from results.
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (error) {
    console.log('Get all users error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// DELETE USER
// Admin can remove a user from the system.
// Example: spam accounts, fake sellers.
// ─────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves accidentally.
    // req.user is the logged-in admin — req.params.id is the target user.
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    // Also delete all items posted by this user.
    // If we don't do this, their items stay in the database with
    // a seller ID that no longer exists — called 'orphaned data'.
    await Item.deleteMany({ seller: req.params.id });

    res.status(200).json({ message: 'User and their listings deleted successfully' });
  } catch (error) {
    console.log('Delete user error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// GET ALL ITEMS (ADMIN VIEW)
// Admin sees ALL items regardless of status —
// pending, approved, rejected, sold — everything.
// This is different from the public route which only shows approved.
// ─────────────────────────────────────────
const getAllItems = async (req, res) => {
  try {
    // req.query.status lets admin filter by status if needed.
    // Example: GET /api/admin/items?status=pending
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const items = await Item.find(filter)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ items });
  } catch (error) {
    console.log('Admin get items error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// APPROVE ITEM
// Admin reviews a pending listing and approves it.
// Once approved it becomes visible to all buyers on the marketplace.
// ─────────────────────────────────────────
const approveItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Simply change the status to approved and save.
    // Once saved, the public GET /api/items route will include this item.
    item.status = 'approved';
    await item.save();

    res.status(200).json({ message: 'Item approved successfully', item });
  } catch (error) {
    console.log('Approve item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// REJECT ITEM
// Admin rejects a listing that violates rules.
// Example: non-electronic items, fake listings, inappropriate content.
// ─────────────────────────────────────────
const rejectItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // We also save the rejection reason so the seller knows why.
    // req.body.reason is optional — admin may or may not provide it.
    item.status = 'rejected';
    await item.save();

    res.status(200).json({ message: 'Item rejected successfully', item });
  } catch (error) {
    console.log('Reject item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// GET DASHBOARD STATS
// Admin dashboard shows key numbers at a glance.
// Like a summary card at the top of the admin panel.
// ─────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try {
    // We run all these database counts at the same time using Promise.all.
    // Instead of waiting for each one to finish before starting the next,
    // Promise.all runs them all simultaneously — much faster.
    const [
      totalUsers,
      totalItems,
      pendingItems,
      approvedItems,
      rejectedItems,
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Item.countDocuments({ status: 'pending' }),
      Item.countDocuments({ status: 'approved' }),
      Item.countDocuments({ status: 'rejected' }),
    ]);

    res.status(200).json({
      stats: {
        totalUsers,
        totalItems,
        pendingItems,
        approvedItems,
        rejectedItems,
      },
    });
  } catch (error) {
    console.log('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// TOGGLE USER STATUS
// Admin can activate or deactivate a user account
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Flip the isActive status — if true make false, if false make true
    // We add isActive field dynamically here
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    console.log('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ADMIN DELETE ITEM
// Admin deletes any listing directly
const adminDeleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.log('Admin delete item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// GET REPORTS
// Basic report stats for admin report page
const getReports = async (req, res) => {
  try {
    const [
      totalUsers,
      totalItems,
      pendingItems,
      approvedItems,
      rejectedItems,
      soldItems,
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Item.countDocuments({ status: 'pending' }),
      Item.countDocuments({ status: 'approved' }),
      Item.countDocuments({ status: 'rejected' }),
      Item.countDocuments({ status: 'sold' }),
    ]);

    res.status(200).json({
      reports: {
        totalUsers,
        totalItems,
        pendingItems,
        approvedItems,
        rejectedItems,
        soldItems,
      },
    });
  } catch (error) {
    console.log('Get reports error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};
// ─────────────────────────────────────────
// GET ANALYTICS DATA
// Provides all chart data for the dashboard
// ─────────────────────────────────────────
const getAnalytics = async (req, res) => {
  try {
    // Run all queries simultaneously using Promise.all for speed
    const [
      totalUsers,
      totalItems,
      totalRequests,
      pendingItems,
      approvedItems,
      rejectedItems,
      soldItems,

      // Items grouped by category — for pie chart
      itemsByCategory,

      // Items grouped by month — for line chart
      itemsByMonth,

      // Users registered per month — for line chart
      usersByMonth,

      // Requests grouped by urgency — for bar chart
      requestsByUrgency,

    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Request.countDocuments(),
      Item.countDocuments({ status: 'pending' }),
      Item.countDocuments({ status: 'approved' }),
      Item.countDocuments({ status: 'rejected' }),
      Item.countDocuments({ status: 'sold' }),

      // MongoDB aggregation — groups items by category and counts each
      Item.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Groups items by year-month — shows activity over time
      Item.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 } // last 12 months
      ]),

      // Groups users by year-month
      User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),

      // Groups requests by urgency level
      Request.aggregate([
        { $group: { _id: '$urgency', count: { $sum: 1 } } }
      ]),
    ]);

    // Format month data for recharts
    // Converts { _id: { year: 2026, month: 5 }, count: 3 }
    // into { month: 'May 2026', items: 3 }
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const formattedItemsByMonth = itemsByMonth.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      items: item.count
    }));

    const formattedUsersByMonth = usersByMonth.map(item => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      users: item.count
    }));

    // Format category data for pie chart
    const formattedByCategory = itemsByCategory.map(item => ({
      name: item._id || 'Other',
      value: item.count
    }));

    // Format urgency data for bar chart
    const formattedByUrgency = requestsByUrgency.map(item => ({
      urgency: item._id || 'Medium',
      count: item.count
    }));

    res.status(200).json({
      analytics: {
        overview: {
          totalUsers,
          totalItems,
          totalRequests,
          pendingItems,
          approvedItems,
          rejectedItems,
          soldItems,
        },
        itemsByCategory: formattedByCategory,
        itemsByMonth: formattedItemsByMonth,
        usersByMonth: formattedUsersByMonth,
        requestsByUrgency: formattedByUrgency,
      }
    });
  } catch (error) {
    console.log('Analytics error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllItems,
  approveItem,
  rejectItem,
  getDashboardStats,
  toggleUserStatus,
  adminDeleteItem,
  getReports,
  getAnalytics,
};