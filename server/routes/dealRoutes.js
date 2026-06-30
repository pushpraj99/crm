const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const {
  getDeals,
  createDeal,
  updateDeal,
  deleteDeal
} = require('../controllers/dealController');

router.route('/')
  .get(getDeals)
  .post(validateRequest(['title', 'value', 'customerId']), createDeal);

router.route('/:id')
  .put(updateDeal)
  .delete(deleteDeal);

module.exports = router;
