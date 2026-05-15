const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Smartphones & Tablets',
        'Laptops & Computers',
        'TV & Audio',
        'Cameras & Photography',
        'Gaming',
        'Computer Parts',
        'Printers & Scanners',
        'Other Electronics',
      ],
    },

    condition: {
  type: String,
  required: true,
  enum: [
    'Working',
    'Working - Fair',
    'Working - Good',
    'Working - Excellent',
    'Not Working',
    'Partially Working',
    'For Parts / Not Working',
  ],
},

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'sold', 'rejected'],
      default: 'pending',
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    isFree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;