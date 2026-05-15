// We import our Item model — we need it to create and query items in MongoDB
const Item = require('../models/Item');

// We import multer — this handles file uploads (item images).
// When a user posts an e-waste item, they attach photos.
// Multer intercepts the request, saves the images, and gives us the filenames.
const multer = require('multer');

// We import path — to get the file extension (.jpg, .png etc.)
const path = require('path');

// ─────────────────────────────────────────
// MULTER CONFIGURATION
// This tells multer where to save images and what to name them.
// ─────────────────────────────────────────
const storage = multer.diskStorage({
  // 'destination' tells multer which folder to save uploaded images.
  // We save to the 'uploads' folder we created earlier.
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  // 'filename' gives each uploaded file a unique name.
  // We combine: fieldname + current timestamp + original extension
  // Example: "images-1714000000000.jpg"
  // The timestamp makes sure two files never have the same name.
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 'fileFilter' controls what file types are allowed.
// We only accept image files — no PDFs, no executables, nothing else.
// This protects our server from malicious file uploads.
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  // Check the file extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  // Check the file mimetype (the actual file type, not just the name)
  // Both must match — this prevents renaming "virus.exe" to "image.jpg"
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // accept the file
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create the multer upload instance with our settings.
// limits.fileSize = 5MB maximum per image — prevents huge uploads.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ─────────────────────────────────────────
// CREATE ITEM
// Runs when a logged-in user posts a new e-waste listing.
// ─────────────────────────────────────────
const createItem = async (req, res) => {
  try {
    // Extract item details from the request body
    const { title, description, category, condition, price, location, isFree } = req.body;

    // Check all required fields are present
    if (!title || !description || !category || !condition || !location) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // req.files contains the uploaded images (array because multiple allowed).
    // We map over them to get just the filenames — we store filenames not full paths.
    // Example: ['images-1714000000000.jpg', 'images-1714000000001.jpg']
    const images = req.files ? req.files.map((file) => file.filename) : [];

    // We convert isFree to a real boolean using JSON.parse()
// because form-data sends everything as strings — "false" !== false
const isFreeBoolean = JSON.parse(isFree || false);

const item = new Item({
  title,
  description,
  category,
  condition,
  price: isFreeBoolean ? 0 : Number(price), // Number() converts "5000" string to 5000
  images,
  seller: req.user._id,
  location,
  isFree: isFreeBoolean,
  status: 'approved',
});

    // Save the item to MongoDB
    await item.save();

    res.status(201).json({
      message: 'Item posted successfully, waiting for admin approval',
      item,
    });
  } catch (error) {
    console.log('Create item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// GET ALL APPROVED ITEMS
// Runs when anyone visits the marketplace page.
// Only shows approved items — pending/rejected items are hidden from public.
// ─────────────────────────────────────────
const getItems = async (req, res) => {
  try {
    // req.query contains URL parameters like ?category=Laptops&location=Colombo
    // This allows filtering without changing the route URL.
    const { category, condition, location, search } = req.query;

    // We build a 'filter' object dynamically.
    // We always filter by status: approved — public only sees approved items.
    const filter = { status: 'approved' };

    // If category is provided in the URL, add it to the filter.
    // Example: GET /api/items?category=Laptops
    if (category) filter.category = category;

    // If condition is provided, add it to the filter.
    if (condition) filter.condition = condition;

    // If location is provided, add it to the filter.
    if (location) filter.location = location;

    // If search text is provided, search in title and description.
    // '$regex' is MongoDB's way of doing a text search (like SQL LIKE).
    // 'i' means case-insensitive — "laptop" matches "Laptop" or "LAPTOP".
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Find all items matching the filter.
    // '.populate('seller', 'name email')' replaces the seller ID with
    // the actual seller's name and email — so the frontend can display
    // "Posted by Arafath" instead of "Posted by 69e212d9..."
    // '.sort({ createdAt: -1 })' sorts newest items first (-1 = descending).
    const items = await Item.find(filter)
      .populate('seller', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ items });
  } catch (error) {
    console.log('Get items error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// GET SINGLE ITEM
// Runs when a user clicks on a specific listing to view details.
// ─────────────────────────────────────────
const getItemById = async (req, res) => {
  try {
    // req.params.id is the item ID from the URL.
    // Example: GET /api/items/69e212d92040dfa410f61394
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name email profileImage');

    // If no item found with that ID, return 404 Not Found
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json({ item });
  } catch (error) {
    console.log('Get item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// UPDATE ITEM
// Runs when a seller edits their own listing.
// ─────────────────────────────────────────
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Security check — only the seller who posted this item can edit it.
    // We compare the item's seller ID with the logged-in user's ID.
    // .toString() converts MongoDB ObjectId to a plain string for comparison.
    if (item.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    // Extract updated fields from request body
    const { title, description, category, condition, price, location, isFree } = req.body;

    // Update only the fields that were sent — keep old values for the rest.
    // This is called a 'partial update' — we don't require all fields again.
    item.title = title || item.title;
    item.description = description || item.description;
    item.category = category || item.category;
    item.condition = condition || item.condition;
    item.price = price || item.price;
    item.location = location || item.location;
    item.isFree = isFree !== undefined ? isFree : item.isFree;

    // If new images were uploaded, add them to existing images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.filename);
      item.images = [...item.images, ...newImages];
    }

    // When a seller edits their item, reset status to pending.
    // Admin needs to re-approve the updated listing.
    item.status = 'pending';

    await item.save();

    res.status(200).json({ message: 'Item updated successfully', item });
  } catch (error) {
    console.log('Update item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// DELETE ITEM
// Runs when a seller deletes their own listing.
// ─────────────────────────────────────────
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only the seller OR an admin can delete a listing
    if (
      item.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    // findByIdAndDelete() finds and removes in one operation
    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.log('Delete item error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────
// GET MY ITEMS
// Runs when a logged-in user wants to see only their own listings.
// ─────────────────────────────────────────
const getMyItems = async (req, res) => {
  try {
    // Filter by seller = logged-in user's ID
    // This shows all statuses (pending, approved, rejected) — only to the owner
    const items = await Item.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ items });
  } catch (error) {
    console.log('Get my items error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// Export all functions
module.exports = {
  upload,
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
};