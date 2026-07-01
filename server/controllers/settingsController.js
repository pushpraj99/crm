const Customer = require('../models/Customer');
const Lead     = require('../models/Lead');
const Deal     = require('../models/Deal');
const Activity = require('../models/Activity');
const Settings = require('../models/Settings');
const nodemailer = require('nodemailer');

// @desc  Export all CRM data as JSON
// @route GET /api/settings/export
exports.exportData = async (req, res) => {
  try {
    const [customers, leads, deals, activities] = await Promise.all([
      Customer.find().lean(),
      Lead.find().lean(),
      Deal.find().lean(),
      Activity.find().lean()
    ]);

    const exportBundle = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: { customers, leads, deals, activities }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="smart-crm-export-${Date.now()}.json"`);
    res.status(200).json(exportBundle);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Import CRM data from JSON
// @route POST /api/settings/import
exports.importData = async (req, res) => {
  try {
    const { data, mode = 'merge' } = req.body;  // mode: 'merge' | 'replace'

    if (!data) return res.status(400).json({ success: false, message: 'No data provided' });

    const results = { customers: 0, leads: 0, deals: 0, activities: 0 };

    if (mode === 'replace') {
      await Promise.all([
        Customer.deleteMany({}),
        Lead.deleteMany({}),
        Deal.deleteMany({}),
        Activity.deleteMany({})
      ]);
    }

    if (data.customers?.length) {
      const docs = data.customers.map(({ _id, __v, ...rest }) => rest);
      await Customer.insertMany(docs, { ordered: false }).catch(() => {});
      results.customers = docs.length;
    }
    if (data.leads?.length) {
      const docs = data.leads.map(({ _id, __v, ...rest }) => rest);
      await Lead.insertMany(docs, { ordered: false }).catch(() => {});
      results.leads = docs.length;
    }
    if (data.deals?.length) {
      const docs = data.deals.map(({ _id, __v, ...rest }) => rest);
      await Deal.insertMany(docs, { ordered: false }).catch(() => {});
      results.deals = docs.length;
    }
    if (data.activities?.length) {
      const docs = data.activities.map(({ _id, __v, ...rest }) => rest);
      await Activity.insertMany(docs, { ordered: false }).catch(() => {});
      results.activities = docs.length;
    }

    res.status(200).json({ success: true, message: 'Data imported successfully', data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Download a timestamped backup bundle
// @route GET /api/settings/backup
exports.downloadBackup = async (req, res) => {
  try {
    const [customers, leads, deals, activities] = await Promise.all([
      Customer.find().lean(),
      Lead.find().lean(),
      Deal.find().lean(),
      Activity.find().lean()
    ]);

    const backup = {
      backupAt: new Date().toISOString(),
      version: '1.0',
      schema: 'smart-crm-backup',
      data: { customers, leads, deals, activities },
      stats: {
        customers: customers.length,
        leads: leads.length,
        deals: deals.length,
        activities: activities.length
      }
    };

    const filename = `smart-crm-backup-${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).json(backup);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get CRM stats for settings overview
// @route GET /api/settings/stats
exports.getStats = async (req, res) => {
  try {
    const [customers, leads, deals, activities] = await Promise.all([
      Customer.countDocuments(),
      Lead.countDocuments(),
      Deal.countDocuments(),
      Activity.countDocuments()
    ]);
    res.status(200).json({ success: true, data: { customers, leads, deals, activities } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get SMTP email settings
// @route GET /api/settings/smtp
exports.getSmtpSettings = async (req, res) => {
  try {
    const doc = await Settings.findOne({ key: 'smtp' });
    const defaults = {
      smtpHost: '',
      smtpPort: 587,
      smtpSecure: false,
      smtpUser: '',
      smtpPassword: '',
      smtpFromEmail: ''
    };

    if (!doc) {
      return res.status(200).json({ success: true, data: defaults });
    }

    // Mask password
    const settings = { ...doc.value };
    if (settings.smtpPassword) {
      settings.smtpPassword = '••••••••••••••••';
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Save SMTP email settings
// @route PUT /api/settings/smtp
exports.saveSmtpSettings = async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpSecure, smtpUser, smtpPassword, smtpFromEmail } = req.body;
    let finalPassword = smtpPassword;

    const existingDoc = await Settings.findOne({ key: 'smtp' });

    // Handle password masking logic
    if (finalPassword === '••••••••••••••••' || finalPassword === '') {
      if (existingDoc && existingDoc.value?.smtpPassword) {
        finalPassword = existingDoc.value.smtpPassword;
      } else {
        finalPassword = '';
      }
    }

    const settingsValue = {
      smtpHost: smtpHost || '',
      smtpPort: parseInt(smtpPort) || 587,
      smtpSecure: smtpSecure === true,
      smtpUser: smtpUser || '',
      smtpPassword: finalPassword,
      smtpFromEmail: smtpFromEmail || ''
    };

    const doc = await Settings.findOneAndUpdate(
      { key: 'smtp' },
      { key: 'smtp', value: settingsValue },
      { upsert: true, new: true }
    );

    const clientSettings = { ...doc.value };
    if (clientSettings.smtpPassword) {
      clientSettings.smtpPassword = '••••••••••••••••';
    }

    res.status(200).json({ success: true, message: 'SMTP settings saved successfully', data: clientSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Send a test email using SMTP config
// @route POST /api/settings/smtp/test
exports.testSmtpSettings = async (req, res) => {
  try {
    const { email, settings } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Test email recipient is required' });
    }

    let smtpConfig = { ...settings };
    
    // Resolve password if masked
    if (smtpConfig.smtpPassword === '••••••••••••••••' || !smtpConfig.smtpPassword) {
      const doc = await Settings.findOne({ key: 'smtp' });
      if (doc && doc.value?.smtpPassword) {
        smtpConfig.smtpPassword = doc.value.smtpPassword;
      }
    }

    // Build Transporter
    const transporter = nodemailer.createTransport({
      host: smtpConfig.smtpHost,
      port: parseInt(smtpConfig.smtpPort) || 587,
      secure: smtpConfig.smtpSecure === true,
      auth: {
        user: smtpConfig.smtpUser,
        pass: smtpConfig.smtpPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await transporter.verify();

    // Send Test Email
    const fromAddress = smtpConfig.smtpFromEmail || `Smart CRM <${smtpConfig.smtpUser}>`;
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: 'Smart CRM — SMTP Connection Test',
      text: `Hello,\n\nThis is a test email from your Smart CRM application. Your SMTP integration is working successfully!\n\nDetails:\nHost: ${smtpConfig.smtpHost}\nPort: ${smtpConfig.smtpPort}\nUser: ${smtpConfig.smtpUser}\n\nRegards,\nSmart CRM Team`,
      html: `<div style="font-family: sans-serif; padding: 24px; color: #1e1b4b; background-color: #f5f3ff; border-radius: 16px;">
        <h2 style="color: #7c3aed; margin-top: 0;">Smart CRM Connection Test</h2>
        <p>Hello,</p>
        <p>This is a test email confirming that your <strong>Smart CRM SMTP Connection</strong> is fully operational!</p>
        <hr style="border: 0; border-top: 1px solid #e0d9fb; margin: 20px 0;" />
        <ul style="list-style: none; padding: 0;">
          <li><strong>Host:</strong> ${smtpConfig.smtpHost}</li>
          <li><strong>Port:</strong> ${smtpConfig.smtpPort}</li>
          <li><strong>Secure:</strong> ${smtpConfig.smtpSecure ? 'SSL/TLS' : 'StartTLS'}</li>
          <li><strong>User:</strong> ${smtpConfig.smtpUser}</li>
        </ul>
        <hr style="border: 0; border-top: 1px solid #e0d9fb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #8b83c4;">This is an automated system email. Please do not reply directly.</p>
      </div>`
    });

    res.status(200).json({ success: true, message: `Test email sent successfully to ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: `SMTP verification failed: ${error.message}` });
  }
};
