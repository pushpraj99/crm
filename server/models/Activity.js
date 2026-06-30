const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    type: { 
      type: String, 
      enum: ['call', 'email', 'meeting', 'note'], 
      required: [true, 'Activity type is required'] 
    },
    description: { 
      type: String, 
      required: [true, 'Activity description is required'], 
      trim: true 
    },
    customerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Customer', 
      required: [true, 'Customer reference is required'] 
    },
    performedBy: { 
      type: String, 
      default: 'System User', 
      trim: true 
    },
    performedAt: { 
      type: Date, 
      default: Date.now 
    }
  }
);

module.exports = mongoose.model('Activity', ActivitySchema);
