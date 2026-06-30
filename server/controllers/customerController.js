const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Activity = require('../models/Activity');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Get all customers (with search, status filter, and pagination)
const getCustomers = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    sendSuccess(res, {
      customers,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum
      }
    }, 'Customers retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// Create a customer
const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, company, status, tags, notes } = req.body;
    
    // Check if email already exists
    const existing = await Customer.findOne({ email });
    if (existing) {
      return sendError(res, 'Customer with this email already exists', 400);
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      status,
      tags,
      notes
    });

    // Automatically create a 'note' activity log for creation
    await Activity.create({
      type: 'note',
      description: `Customer account created: ${name}`,
      customerId: customer._id,
      performedBy: 'System'
    });

    try {
      const { createNotification } = require('./notificationController');
      if (req.user) {
        await createNotification(req.user._id, 'Customer Created', `Customer "${name}" was created successfully.`, 'success');
      }
    } catch (e) {
      console.error(e);
    }

    sendSuccess(res, customer, 'Customer created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Get customer by ID (with details populated)
const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return sendError(res, 'Customer not found', 404);
    }

    // Fetch associated data
    const leads = await Lead.find({ customerId: customer._id });
    const deals = await Deal.find({ customerId: customer._id });
    const activities = await Activity.find({ customerId: customer._id }).sort({ performedAt: -1 });

    sendSuccess(res, {
      customer,
      leads,
      deals,
      activities
    }, 'Customer details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// Update customer
const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return sendError(res, 'Customer not found', 404);
    }

    // Log update activity
    await Activity.create({
      type: 'note',
      description: `Customer information updated: ${customer.name}`,
      customerId: customer._id,
      performedBy: 'System'
    });

    sendSuccess(res, customer, 'Customer updated successfully');
  } catch (error) {
    next(error);
  }
};

// Delete customer
const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return sendError(res, 'Customer not found', 404);
    }

    // Clean up or disassociate related data
    await Lead.updateMany({ customerId: customer._id }, { $set: { customerId: null } });
    await Deal.deleteMany({ customerId: customer._id });
    await Activity.deleteMany({ customerId: customer._id });

    sendSuccess(res, null, 'Customer and associated deals/activities deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};
