// controllers/applicationController.js
// Contains business logic for managing job applications (CRUD + stats + search/filter)

const Application = require("../models/Application");

// @route   POST /api/applications
// @desc    Create a new job application entry
// @access  Private
const createApplication = async (req, res) => {
  try {
    const { companyName, jobRole, applicationDate, status } = req.body;

    if (!companyName || !jobRole || !applicationDate) {
      return res.status(400).json({
        message: "Please provide companyName, jobRole, and applicationDate",
      });
    }

    const application = await Application.create({
      userId: req.user._id, // Tied to the logged-in user from authMiddleware
      companyName,
      jobRole,
      applicationDate,
      status: status || "Applied",
    });

    res.status(201).json({ message: "Application created successfully", application });
  } catch (error) {
    console.error("Create application error:", error.message);
    res.status(500).json({ message: "Server error creating application", error: error.message });
  }
};

// @route   GET /api/applications
// @desc    Get all applications for the logged-in user, with optional search & filter
// @query   search (company name substring), status (exact match)
// @access  Private
const getApplications = async (req, res) => {
  try {
    const { search, status } = req.query;

    // Always scope the query to the logged-in user
    const query = { userId: req.user._id };

    // Optional search by company name (case-insensitive partial match)
    if (search) {
      query.companyName = { $regex: search, $options: "i" };
    }

    // Optional exact-match filter by status
    if (status && status !== "All") {
      query.status = status;
    }

    const applications = await Application.find(query).sort({ applicationDate: -1 });

    res.status(200).json({ count: applications.length, applications });
  } catch (error) {
    console.error("Get applications error:", error.message);
    res.status(500).json({ message: "Server error fetching applications", error: error.message });
  }
};

// @route   GET /api/applications/:id
// @desc    Get a single application by ID
// @access  Private
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id, // Ensure the user can only access their own data
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ application });
  } catch (error) {
    console.error("Get application by ID error:", error.message);
    res.status(500).json({ message: "Server error fetching application", error: error.message });
  }
};

// @route   PUT /api/applications/:id
// @desc    Update an existing application
// @access  Private
const updateApplication = async (req, res) => {
  try {
    const { companyName, jobRole, applicationDate, status } = req.body;

    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update only the fields provided in the request body
    if (companyName !== undefined) application.companyName = companyName;
    if (jobRole !== undefined) application.jobRole = jobRole;
    if (applicationDate !== undefined) application.applicationDate = applicationDate;
    if (status !== undefined) application.status = status;

    const updatedApplication = await application.save();

    res.status(200).json({
      message: "Application updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application error:", error.message);
    res.status(500).json({ message: "Server error updating application", error: error.message });
  }
};

// @route   DELETE /api/applications/:id
// @desc    Delete an application
// @access  Private
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete application error:", error.message);
    res.status(500).json({ message: "Server error deleting application", error: error.message });
  }
};

// @route   GET /api/applications/stats/dashboard
// @desc    Get aggregated counts for the dashboard (total/selected/rejected/pending)
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Application.countDocuments({ userId });
    const selected = await Application.countDocuments({ userId, status: "Selected" });
    const rejected = await Application.countDocuments({ userId, status: "Rejected" });

    // "Pending" = everything that hasn't reached a final outcome yet
    const pending = await Application.countDocuments({
      userId,
      status: { $in: ["Applied", "Online Assessment", "Interview Scheduled"] },
    });

    res.status(200).json({
      total,
      selected,
      rejected,
      pending,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error.message);
    res.status(500).json({ message: "Server error fetching dashboard stats", error: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getDashboardStats,
};
