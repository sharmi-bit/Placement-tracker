// models/Application.js
// Mongoose schema/model for a single Job Application entry

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // Reference to the User who owns this application
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Speeds up queries that filter applications by user
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    jobRole: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },
    applicationDate: {
      type: Date,
      required: [true, "Application date is required"],
    },
    status: {
      type: String,
      enum: [
        "Applied",
        "Online Assessment",
        "Interview Scheduled",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

module.exports = mongoose.model("Application", applicationSchema);
