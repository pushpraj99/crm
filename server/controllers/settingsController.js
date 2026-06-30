const Customer = require('../models/Customer');
const Lead     = require('../models/Lead');
const Deal     = require('../models/Deal');
const Activity = require('../models/Activity');

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
