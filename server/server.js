const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));

const { protect } = require('./middleware/auth');
app.use('/api/customers',  protect, require('./routes/customerRoutes'));
app.use('/api/leads',      protect, require('./routes/leadRoutes'));
app.use('/api/deals',      protect, require('./routes/dealRoutes'));
app.use('/api/activities', protect, require('./routes/activityRoutes'));
app.use('/api/settings',   protect, require('./routes/settingsRoutes'));
app.use('/api/notifications', protect, require('./routes/notificationRoutes'));


// Status endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CRM API is healthy and running',
    timestamp: new Date()
  });
});

// Fallback route
app.use('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
