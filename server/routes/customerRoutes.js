const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const {
  getCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

router.route('/')
  .get(getCustomers)
  .post(validateRequest(['name', 'email']), createCustomer);

router.route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
