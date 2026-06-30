const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/auth');
const {
  exportData,
  importData,
  downloadBackup,
  getStats
} = require('../controllers/settingsController');

router.get('/export',   protect, exportData);
router.post('/import',  protect, importData);
router.get('/backup',   protect, downloadBackup);
router.get('/stats',    protect, getStats);

module.exports = router;
