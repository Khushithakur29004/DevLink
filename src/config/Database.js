const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONNECTION_SECRET, {
      // These options are no longer needed in newer versions of Mongoose
      // but keeping them won't hurt
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    return conn;
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    throw err; // Propagate error to be handled by the global error handler
  }
};

module.exports = connectDB;
   