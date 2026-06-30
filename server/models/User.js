const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'agent', 'viewer'],
      default: 'agent'
    },
    loginHistory: [
      {
        ip:        { type: String, default: 'Unknown' },
        userAgent: { type: String, default: 'Unknown' },
        loginAt:   { type: Date, default: Date.now }
      }
    ],
    passwordPolicy: {
      minLength:           { type: Number, default: 6 },
      requireNumbers:      { type: Boolean, default: false },
      requireSpecialChars: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

// Encrypt password using bcryptjs before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match entered password to hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
