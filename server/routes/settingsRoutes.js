const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/auth');
const {
  exportData,
  importData,
  downloadBackup,
  getStats,
  getSmtpSettings,
  saveSmtpSettings,
  testSmtpSettings
} = require('../controllers/settingsController');

router.get('/export',    protect, exportData);
router.post('/import',   protect, importData);
router.get('/backup',    protect, downloadBackup);
router.get('/stats',     protect, getStats);
router.get('/smtp',      protect, getSmtpSettings);
router.put('/smtp',      protect, saveSmtpSettings);
router.post('/smtp/test', protect, testSmtpSettings);

module.exports = router;
