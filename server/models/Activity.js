const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    // Core legacy fields (kept for backward compatibility)
    type: {
      type: String,
      enum: ['call', 'email', 'meeting', 'note', 'task', 'demo', 'follow-up', 'other'],
      default: 'note'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
    },
    performedBy: {
      type: String,
      default: 'System User',
      trim: true
    },
    performedAt: {
      type: Date,
      default: Date.now
    },

    // New enhanced fields
    title: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      enum: ['sales', 'support', 'marketing', 'internal', 'other'],
      default: 'other'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed', 'cancelled'],
      default: 'completed'
    },
    contactName: {
      type: String,
      trim: true,
      default: ''
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    activityDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', ActivitySchema);
