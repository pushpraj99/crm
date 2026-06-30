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
    
    // Check role permission
    const isPrivileged = req.user && (req.user.role === 'admin' || req.user.role === 'manager');
    const finalAssignedTo = isPrivileged ? assignedTo : '';

    const lead = await Lead.create({
      name,
      email,
      phone,
      source,
      status,
      assignedTo: finalAssignedTo,
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

    try {
      const { createNotification } = require('./notificationController');
      if (req.user) {
        await createNotification(req.user._id, 'Lead Created', `Lead "${name}" created.`, 'info');
      }
    } catch (e) {
      console.error(e);
    }

    sendSuccess(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Update lead (status/details)
const updateLead = async (req, res, next) => {
  try {
    const { status, assignedTo } = req.body;
    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead) {
      return sendError(res, 'Lead not found', 404);
    }

    // Role check if attempting to change assignment
    if (assignedTo !== undefined && assignedTo !== oldLead.assignedTo) {
      const isPrivileged = req.user && (req.user.role === 'admin' || req.user.role === 'manager');
      if (!isPrivileged) {
        return sendError(res, 'Only Admin and Manager roles can assign or change agents on leads', 403);
      }
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

    try {
      const { createNotification } = require('./notificationController');
      if (req.user) {
        if (status && status !== oldLead.status) {
          await createNotification(req.user._id, 'Lead Status Updated', `Lead "${lead.name}" status updated to ${status}.`, 'info');
        } else if (assignedTo && assignedTo !== oldLead.assignedTo) {
          await createNotification(req.user._id, 'Lead Agent Assigned', `Lead "${lead.name}" assigned to agent: ${assignedTo}.`, 'info');
        }
      }
    } catch (e) {
      console.error(e);
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
