const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    });

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);

    // Retry logic if connection fails
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Handle unexpected MongoDB connection issues
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB Disconnected! Attempting to reconnect...');
  connectDB();
});

module.exports = connectDB;
