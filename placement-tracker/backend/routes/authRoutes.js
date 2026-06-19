// routes/authRoutes.js
// Defines all authentication-related API endpoints

const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register -> create a new account
router.post("/register", registerUser);

// POST /api/auth/login -> authenticate and receive a JWT
router.post("/login", loginUser);

// GET /api/auth/me -> get logged-in user's profile (requires valid JWT)
router.get("/me", protect, getMe);

module.exports = router;
