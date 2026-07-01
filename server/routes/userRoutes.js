const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllUsers,
  getMe,
  updateMe,
  changeUserRole,
  deleteUser,
  createUser
} = require('../controllers/userController');

router.get('/',         protect, getAllUsers);    // GET  /api/users
router.post('/',        protect, createUser);     // POST /api/users
router.get('/me',       protect, getMe);          // GET  /api/users/me
router.put('/me',       protect, updateMe);       // PUT  /api/users/me
router.put('/:id/role', protect, changeUserRole); // PUT  /api/users/:id/role
router.delete('/:id',   protect, deleteUser);     // DELETE /api/users/:id

module.exports = router;
