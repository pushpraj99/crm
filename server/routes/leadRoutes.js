const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const {
  getLeads,
  createLead,
  updateLead,
  deleteLead
} = require('../controllers/leadController');

router.route('/')
  .get(getLeads)
  .post(validateRequest(['name']), createLead);

router.route('/:id')
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
