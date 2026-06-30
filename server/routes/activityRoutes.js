const express = require('express');
const router  = express.Router();
const {
  getActivities,
  logActivity,
  updateActivity,
  deleteActivity,
  getActivitiesByCustomerId
} = require('../controllers/activityController');

router.get('/',                           getActivities);
router.post('/',                          logActivity);
router.put('/:id',                        updateActivity);
router.delete('/:id',                     deleteActivity);
router.get('/customer/:customerId',       getActivitiesByCustomerId);

module.exports = router;
