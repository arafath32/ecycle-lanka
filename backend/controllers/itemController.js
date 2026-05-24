const Item = require('../models/Item');
const multer = require('multer');
const path = require('path');

// Environmental impact data per category
const impactData = {
  'Smartphones & Tablets': { co2Saved: 0.8, energySaved: 120, waterSaved: 240, weightDiverted: 0.3 },
  'Laptops & Computers': { co2Saved: 3.2, energySaved: 322, waterSaved: 190, weightDiverted: 2.5 },
  'TV & Audio': { co2Saved: 4.5, energySaved: 450, waterSaved: 300, weightDiverted: 8.0 },
  'Cameras & Photography': { co2Saved: 1.2, energySaved: 150, waterSaved: 180, weightDiverted: 0.8 },
  'Gaming': { co2Saved: 1.5, energySaved: 200, waterSaved: 160, weightDiverted: 1.2 },
  'Computer Parts': { co2Saved: 2.0, energySaved: 280, waterSaved: 210, weightDiverted: 1.8 },
  'Printers & Scanners': { co2Saved: 3.5, energySaved: 380, waterSaved: 250, weightDiverted: 5.0 },
  'Other Electronics': { co2Saved: 1.0, energySaved: 100, waterSaved: 150, weightDiverted: 1.0 },
  'Mobile Phones': { co2Saved: 0.8, energySaved: 120, waterSaved: 240, weightDiverted: 0.3 },
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// CREATE ITEM
const createItem = async (req, res) => {
  try {
    const { title, description, category, condition, price, location, isFree } = req.body;

    if (!title || !description || !category || !condition || !location) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const images = req.files ? req.files.map((file) => file.filename) : [];
    const isFreeBoolean = JSON.parse(isFree || false);

    // Calculate environmental impact
    const impact = impactData[category] || {
      co2Saved: 1.0, energySaved: 100, waterSaved: 150, weightDiverted: 1.0
    };

    const item = new Item({
      title,
      description,
      category,
      condition,
      price: isFreeBoolean ? 0 : Number(price),
      images,
      seller: req.user._id,
      location,
      isFree: isFreeBoolean,
      status: 'approved',
      environmentalImpact: impact,
    });

    await item.save();

    res.status(201).json({
      message: 'Item posted successfully',
      item,
    });
  } catch (error) {
    console.log('Create item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// GET ALL APPROVED ITEMS
const getItems = async (req, res) => {
  try {
    const { category, condition, location, search } = req.query;
    const filter = { status: 'approved' };

    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (location) filter.location = location;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(filter)
      .populate('seller', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ items });
  } catch (error) {
    console.log('Get items error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// GET SINGLE ITEM
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name email profileImage');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ item });
  } catch (error) {
    console.log('Get item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// UPDATE ITEM
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    const { title, description, category, condition, price, location, isFree } = req.body;

    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;
    item.condition = condition || item.condition;
    item.price = price || item.price;
    item.location = location || item.location;
    item.isFree = isFree !== undefined ? isFree : item.isFree;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      item.images = [...item.images, ...newImages];
    }

    item.status = 'approved';
    await item.save();

    res.status(200).json({ message: 'Item updated successfully', item });
  } catch (error) {
    console.log('Update item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// DELETE ITEM
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (
      item.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.log('Delete item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// GET MY ITEMS
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id })
      .sort({ createdAt: -1 });
    res.status(200).json({ items });
  } catch (error) {
    console.log('Get my items error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

module.exports = {
  upload,
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
};