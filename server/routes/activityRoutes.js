const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const {
  getActivities,
  logActivity,
  getActivitiesByCustomerId
} = require('../controllers/activityController');

router.route('/')
  .get(getActivities)
  .post(validateRequest(['type', 'description', 'customerId']), logActivity);

router.route('/:customerId')
  .get(getActivitiesByCustomerId);

module.exports = router;
