const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    // What the buyer is looking for
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Detailed description of what they need
    // Example: "Need iPhone 11 screen, original only, not cracked"
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Category helps sellers filter requests relevant to them
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

    // Maximum budget the buyer is willing to pay
    // Sellers know if they can match the price before contacting
    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    // Location helps nearby sellers respond faster
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // The buyer who posted this request
    // Links to User model just like Item seller field
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Status tracks the lifecycle of a request
    // 'open'   = still looking for a seller
    // 'filled' = found what they needed
    // 'closed' = no longer needed
    status: {
      type: String,
      enum: ['open', 'filled', 'closed'],
      default: 'open',
    },

    // Urgency helps sellers prioritize
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },

    // Contact preference — how the buyer wants to be reached
    contactMethod: {
      type: String,
      enum: ['Phone', 'WhatsApp', 'Email', 'In-App'],
      default: 'WhatsApp',
    },

    // Contact info — phone number or email
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;