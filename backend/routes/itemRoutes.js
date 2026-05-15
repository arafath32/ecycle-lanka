const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  upload,
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
} = require('../controllers/itemController');

router.get('/', getItems);

// ALL specific routes MUST come before /:id
router.get('/myitems', protect, getMyItems);
router.get('/my-listings', protect, getMyItems);

// /:id comes LAST among GET routes
router.get('/:id', getItemById);

router.post('/', protect, upload.array('images', 5), createItem);
router.put('/:id', protect, upload.array('images', 5), updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;