const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validateRequest');
const {
  getCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  sendCustomerEmail
} = require('../controllers/customerController');

router.route('/')
  .get(getCustomers)
  .post(validateRequest(['name', 'email']), createCustomer);

router.route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

// Send email to a specific customer
router.post('/:id/email', sendCustomerEmail);

module.exports = router;
