const Lead = require('../models/Lead');
const Activity = require('../models/Activity');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Get all leads
const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find()
      .populate('customerId', 'name company status')
      .sort({ createdAt: -1 });
    sendSuccess(res, leads, 'Leads retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// Create a lead
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, source, status, assignedTo, customerId } = req.body;
    const lead = await Lead.create({
      name,
      email,
      phone,
      source,
      status,
      assignedTo,
      customerId: customerId || null
    });

    if (customerId) {
      await Activity.create({
        type: 'note',
        description: `New lead added: ${name} (Source: ${source})`,
        customerId,
        performedBy: 'System'
      });
    }

    sendSuccess(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Update lead (status/details)
const updateLead = async (req, res, next) => {
  try {
    const { status } = req.body;
    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead) {
      return sendError(res, 'Lead not found', 404);
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // If status changed and we have a customer associated, log activity
    if (status && status !== oldLead.status && lead.customerId) {
      await Activity.create({
        type: 'note',
        description: `Lead status updated from '${oldLead.status}' to '${status}'`,
        customerId: lead.customerId,
        performedBy: 'System'
      });
    }

    sendSuccess(res, lead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

// Delete lead
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return sendError(res, 'Lead not found', 404);
    }

    if (lead.customerId) {
      await Activity.create({
        type: 'note',
        description: `Lead deleted: ${lead.name}`,
        customerId: lead.customerId,
        performedBy: 'System'
      });
    }

    sendSuccess(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead
};
