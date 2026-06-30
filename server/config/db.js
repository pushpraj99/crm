const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    let dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
      console.log('No MONGODB_URI found in environment. Attempting to start mongodb-memory-server...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        dbUri = mongoServer.getUri();
        console.log(`mongodb-memory-server started successfully. URI: ${dbUri}`);
      } catch (err) {
        console.error('Failed to start mongodb-memory-server:', err.message);
        console.error('Please configure MONGODB_URI in server/.env to connect to your MongoDB database.');
        process.exit(1);
      }
    }

    const conn = await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Database connections closed.');
  } catch (error) {
    console.error(`Error closing database: ${error.message}`);
  }
};

module.exports = { connectDB, closeDB };
