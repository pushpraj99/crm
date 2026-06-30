const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Lead name is required'], 
      trim: true 
    },
    email: { 
      type: String, 
      trim: true, 
      lowercase: true 
    },
    phone: { 
      type: String, 
      trim: true 
    },
    source: { 
      type: String, 
      enum: ['web', 'referral', 'cold-call', 'social'], 
      default: 'web' 
    },
    status: { 
      type: String, 
      enum: ['new', 'contacted', 'qualified', 'lost'], 
      default: 'new' 
    },
    assignedTo: { 
      type: String, 
      trim: true 
    },
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Customer',
      default: null
    }
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

module.exports = mongoose.model('Lead', LeadSchema);
