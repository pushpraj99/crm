const Deal = require('../models/Deal');
const Activity = require('../models/Activity');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Get all deals
const getDeals = async (req, res, next) => {
  try {
    const deals = await Deal.find()
      .populate('customerId', 'name company status')
      .sort({ createdAt: -1 });
    sendSuccess(res, deals, 'Deals retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// Create a deal
const createDeal = async (req, res, next) => {
  try {
    const { title, value, stage, customerId, expectedCloseDate, notes } = req.body;
    const deal = await Deal.create({
      title,
      value,
      stage,
      customerId,
      expectedCloseDate,
      notes
    });

    // Log creation activity
    await Activity.create({
      type: 'note',
      description: `New deal created: "${title}" (Value: $${value})`,
      customerId,
      performedBy: 'System'
    });

    sendSuccess(res, deal, 'Deal created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Update deal (stage/details)
const updateDeal = async (req, res, next) => {
  try {
    const { stage } = req.body;
    const oldDeal = await Deal.findById(req.params.id);
    if (!oldDeal) {
      return sendError(res, 'Deal not found', 404);
    }

    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // If stage changed, log activity
    if (stage && stage !== oldDeal.stage) {
      await Activity.create({
        type: 'note',
        description: `Deal "${deal.title}" stage updated from '${oldDeal.stage}' to '${stage}'`,
        customerId: deal.customerId,
        performedBy: 'System'
      });
    }

    sendSuccess(res, deal, 'Deal updated successfully');
  } catch (error) {
    next(error);
  }
};

// Delete deal
const deleteDeal = async (req, res, next) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) {
      return sendError(res, 'Deal not found', 404);
    }

    await Activity.create({
      type: 'note',
      description: `Deal deleted: "${deal.title}"`,
      customerId: deal.customerId,
      performedBy: 'System'
    });

    sendSuccess(res, null, 'Deal deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDeals,
  createDeal,
  updateDeal,
  deleteDeal
};
