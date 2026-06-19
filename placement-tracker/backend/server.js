// server.js
// Main entry point for the Placement Tracker backend API

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

// Connect to MongoDB Atlas before starting the server
connectDB();

const app = express();

// ----- Middleware -----

// Enable CORS so the React frontend (different origin/port) can call this API
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

// Parse incoming JSON request bodies into req.body
app.use(express.json());

// ----- Routes -----

// Simple health-check route to confirm the API is running
app.get("/", (req, res) => {
  res.status(200).json({ message: "Placement Tracker API is running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

// ----- 404 Handler (for unmatched routes) -----
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ----- Global Error Handler -----
// Catches any errors passed via next(err) or thrown synchronously in routes
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
