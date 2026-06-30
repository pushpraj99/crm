const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Customer name is required'], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Customer email is required'], 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    phone: { 
      type: String, 
      trim: true 
    },
    company: { 
      type: String, 
      trim: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'prospect'], 
      default: 'prospect' 
    },
    tags: [{ 
      type: String, 
      trim: true 
    }],
    notes: { 
      type: String 
    }
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('Customer', CustomerSchema);
