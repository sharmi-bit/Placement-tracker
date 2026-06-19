// middleware/authMiddleware.js
// Protects routes by verifying the JWT sent in the Authorization header

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Expecting header format: "Authorization: Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token part after "Bearer "
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key; throws if invalid/expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the logged-in user (without password) to the request object
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: "User not found, authorization denied" });
      }

      next(); // Token valid -> proceed to the actual route handler
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
