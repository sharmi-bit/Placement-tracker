// routes/applicationRoutes.js
// Defines all job application API endpoints (all routes require authentication)

const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getDashboardStats,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");

// Apply JWT protection to every route defined below in this router
router.use(protect);

// GET /api/applications/stats/dashboard -> dashboard summary counts
// NOTE: defined BEFORE "/:id" so "stats" is not mistaken for an :id param
router.get("/stats/dashboard", getDashboardStats);

// GET /api/applications -> list all applications (supports ?search= and ?status=)
// POST /api/applications -> create a new application
router.route("/").get(getApplications).post(createApplication);

// GET /api/applications/:id -> get one application
// PUT /api/applications/:id -> update one application
// DELETE /api/applications/:id -> delete one application
router
  .route("/:id")
  .get(getApplicationById)
  .put(updateApplication)
  .delete(deleteApplication);

module.exports = router;
