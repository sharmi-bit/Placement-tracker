// config/db.js
// Handles connection to MongoDB Atlas using Mongoose

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB Atlas using the connection string in .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and stop the server process
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
