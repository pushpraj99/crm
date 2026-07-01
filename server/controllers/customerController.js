const Customer = require('../models/Customer');
const Lead = require('../models/Lead');
const Deal = require('../models/Deal');
const Activity = require('../models/Activity');
const Settings = require('../models/Settings');
const nodemailer = require('nodemailer');
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

    // Synchronize company & name updates with cached values in associated Activities
    if (req.body.name || req.body.company) {
      const updateFields = {};
      if (req.body.name) updateFields.contactName = req.body.name;
      if (req.body.company) updateFields.company = req.body.company;
      
      await Activity.updateMany(
        { customerId: customer._id },
        { $set: updateFields }
      );
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

// Send email to a customer using configured SMTP
const sendCustomerEmail = async (req, res, next) => {
  try {
    const { to, subject, body, customerName } = req.body;

    if (!to || !subject || !body) {
      return sendError(res, 'Recipient, subject, and body are required', 400);
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) return sendError(res, 'Customer not found', 404);

    // Load saved SMTP config
    const smtpDoc = await Settings.findOne({ key: 'smtp' });
    if (!smtpDoc || !smtpDoc.value?.smtpHost) {
      return sendError(res, 'SMTP not configured. Please set up SMTP settings first.', 422);
    }
    const cfg = smtpDoc.value;

    const transporter = nodemailer.createTransport({
      host: cfg.smtpHost,
      port: parseInt(cfg.smtpPort) || 587,
      secure: cfg.smtpSecure === true,
      auth: { user: cfg.smtpUser, pass: cfg.smtpPassword },
      tls: { rejectUnauthorized: false }
    });

    const fromAddress = cfg.smtpFromEmail || `Smart CRM <${cfg.smtpUser}>`;
    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 18px;">Message from Smart CRM</h2>
        </div>
        <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #475569; margin-top: 0;">Hello <strong>${customerName || customer.name}</strong>,</p>
          <div style="white-space: pre-line; line-height: 1.7; color: #334155;">${body}</div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">This email was sent from Smart CRM. Please do not reply directly to this message.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to,
      subject,
      text: body,
      html: htmlBody
    });

    // Log the email as a CRM activity
    await Activity.create({
      type: 'email',
      title: `Email: ${subject}`,
      description: body.substring(0, 200),
      customerId: customer._id,
      performedBy: req.user?.name || 'CRM User',
      contactName: customer.name,
      company: customer.company || '',
      status: 'completed',
      activityDate: new Date()
    });

    sendSuccess(res, { to, subject }, `Email sent successfully to ${to}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  sendCustomerEmail
};
