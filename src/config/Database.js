const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(process.env.DB_CONNECTION_SECRET)
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
};

module.exports = connectDB;
   