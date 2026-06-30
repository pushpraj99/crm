const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper: generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

// Helper: get IP
const getClientIp = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
  req.connection?.remoteAddress ||
  'Unknown';

// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ success: false, message: 'User already exists with this email' });

    // First user ever → auto-admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'agent';

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // Record login history (keep last 20 entries)
    user.loginHistory.unshift({
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'] || 'Unknown',
      loginAt: new Date()
    });
    if (user.loginHistory.length > 20) user.loginHistory = user.loginHistory.slice(0, 20);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/auth/login-history
exports.getLoginHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('loginHistory');
    res.status(200).json({ success: true, data: user.loginHistory || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Please provide currentPassword and newPassword' });
    if (newPassword.length < 8)
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/auth/change-email
exports.changeEmail = async (req, res) => {
  try {
    const { newEmail, password } = req.body;
    if (!newEmail || !password)
      return res.status(400).json({ success: false, message: 'Please provide newEmail and password' });

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Password is incorrect' });

    const emailTaken = await User.findOne({ email: newEmail.toLowerCase() });
    if (emailTaken && emailTaken._id.toString() !== user._id.toString())
      return res.status(400).json({ success: false, message: 'Email is already in use' });

    user.email = newEmail.toLowerCase().trim();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Email changed successfully', data: { email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/auth/password-policy
exports.updatePasswordPolicy = async (req, res) => {
  try {
    const { minLength, requireNumbers, requireSpecialChars } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { 'passwordPolicy.minLength': minLength, 'passwordPolicy.requireNumbers': requireNumbers, 'passwordPolicy.requireSpecialChars': requireSpecialChars } },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Password policy updated', data: user.passwordPolicy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
