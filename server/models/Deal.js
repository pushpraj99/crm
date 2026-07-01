const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Deal title is required'], 
      trim: true 
    },
    value: { 
      type: Number, 
      required: [true, 'Deal value is required'], 
      min: [0, 'Deal value cannot be negative'] 
    },
    stage: {
      type: String,
      enum: ['prospecting', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
      default: 'prospecting'
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required']
    },
    expectedCloseDate: { 
      type: Date 
    },
    notes: { 
      type: String 
    },
    assignedTo: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

module.exports = mongoose.model('Deal', DealSchema);
