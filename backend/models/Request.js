const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
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

    
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    
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