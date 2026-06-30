const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  getLoginHistory,
  changePassword,
  changeEmail,
  updatePasswordPolicy
} = require('../controllers/authController');

router.post('/register',              register);
router.post('/login',                 login);
router.get('/me',                     protect, getMe);
router.get('/login-history',          protect, getLoginHistory);
router.put('/change-password',        protect, changePassword);
router.put('/change-email',           protect, changeEmail);
router.put('/password-policy',        protect, updatePasswordPolicy);

module.exports = router;
