const Activity = require('../models/Activity');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Get all activities
const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .populate('customerId', 'name company')
      .sort({ performedAt: -1 });
    sendSuccess(res, activities, 'Activities retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// Log an activity
const logActivity = async (req, res, next) => {
  try {
    const { type, description, customerId, performedBy, performedAt } = req.body;
    const activity = await Activity.create({
      type,
      description,
      customerId,
      performedBy,
      performedAt: performedAt || Date.now()
    });
    sendSuccess(res, activity, 'Activity logged successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Get activities for a customer
const getActivitiesByCustomerId = async (req, res, next) => {
  try {
    const activities = await Activity.find({ customerId: req.params.customerId })
      .populate('customerId', 'name company')
      .sort({ performedAt: -1 });
    sendSuccess(res, activities, 'Customer activities retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivities,
  logActivity,
  getActivitiesByCustomerId
};
