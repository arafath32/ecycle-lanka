const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const Item = require('../models/Item');

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

// Environmental impact — total platform stats
router.get('/impact', async (req, res) => {
  try {
    const result = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalCO2Saved: { $sum: '$environmentalImpact.co2Saved' },
          totalEnergySaved: { $sum: '$environmentalImpact.energySaved' },
          totalWaterSaved: { $sum: '$environmentalImpact.waterSaved' },
          totalWeightDiverted: { $sum: '$environmentalImpact.weightDiverted' },
          totalItems: { $sum: 1 },
        },
      },
    ]);

    const impact = result[0] || {
      totalCO2Saved: 0,
      totalEnergySaved: 0,
      totalWaterSaved: 0,
      totalWeightDiverted: 0,
      totalItems: 0,
    };

    res.status(200).json({ impact });
  } catch (error) {
    console.log('Impact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// /:id comes LAST among GET routes
router.get('/:id', getItemById);

router.post('/', protect, upload.array('images', 5), createItem);
router.put('/:id', protect, upload.array('images', 5), updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;