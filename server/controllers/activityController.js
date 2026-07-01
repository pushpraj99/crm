const Activity = require('../models/Activity');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// @desc  Get all activities
// @route GET /api/activities
const getActivities = async (req, res, next) => {
  try {
    const { category, priority, status, type, search, limit = 100, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { contactName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { performedBy: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .populate('customerId', 'name company')
        .sort({ performedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Activity.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: activities,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Create / Log an activity
// @route POST /api/activities
const logActivity = async (req, res, next) => {
  try {
    const {
      type, description, customerId, performedBy, performedAt,
      title, category, priority, status, contactName, company, activityDate
    } = req.body;

    const activity = await Activity.create({
      type: type || 'note',
      description: description || title || '',
      customerId: customerId || null,
      performedBy: performedBy || (req.user?.name) || 'System',
      performedAt: performedAt || Date.now(),
      title: title || '',
      category: category || 'other',
      priority: priority || 'medium',
      status: status || 'completed',
      contactName: contactName || '',
      company: company || '',
      activityDate: activityDate || Date.now()
    });

    const populated = await activity.populate('customerId', 'name company');
    sendSuccess(res, populated, 'Activity logged successfully', 201);
  } catch (error) {
    next(error);
  }
};


const updateActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('customerId', 'name company');

    if (!activity) return sendError(res, 'Activity not found', 404);
    sendSuccess(res, activity, 'Activity updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc  Delete an activity
// @route DELETE /api/activities/:id
const deleteActivity = async (req, res, next) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) return sendError(res, 'Activity not found', 404);
    sendSuccess(res, null, 'Activity deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc  Get activities for a specific customer
// @route GET /api/activities/customer/:customerId
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

module.exports = { getActivities, logActivity, updateActivity, deleteActivity, getActivitiesByCustomerId };
