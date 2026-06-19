// src/pages/Applications.jsx
// Full applications management page — list, search, filter, add, edit, delete.

import { useState, useEffect, useCallback } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/api";
import Navbar from "../components/Navbar";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationTable from "../components/ApplicationTable";

const STATUS_FILTERS = [
  "All",
  "Applied",
  "Online Assessment",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search + filter state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null); // null = add mode

  // Delete confirm state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== "All") params.status = statusFilter;
      const { data } = await getApplications(params);
      setApplications(data.applications);
    } catch (err) {
      setError("Failed to load applications. Please refresh.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Re-fetch whenever search or filter changes
  useEffect(() => {
    const delay = setTimeout(fetchApplications, 300); // debounce search
    return () => clearTimeout(delay);
  }, [fetchApplications]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // ---- Add ----
  const handleAdd = async (formData) => {
    setFormLoading(true);
    try {
      await createApplication(formData);
      setShowForm(false);
      showSuccess("Application added successfully!");
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add application.");
    } finally {
      setFormLoading(false);
    }
  };

  // ---- Edit ----
  const handleEditOpen = (app) => {
    setEditingApp(app);
    setShowForm(true);
  };

  const handleEdit = async (formData) => {
    setFormLoading(true);
    try {
      await updateApplication(editingApp._id, formData);
      setShowForm(false);
      setEditingApp(null);
      showSuccess("Application updated successfully!");
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update application.");
    } finally {
      setFormLoading(false);
    }
  };

  // ---- Delete ----
  const handleDeleteConfirm = (id) => setConfirmDeleteId(id);

  const handleDelete = async () => {
    try {
      await deleteApplication(confirmDeleteId);
      setConfirmDeleteId(null);
      showSuccess("Application deleted.");
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete application.");
      setConfirmDeleteId(null);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingApp(null);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-base-950)" }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-base-200)" }}>
              Applications
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-base-400)" }}>
              {loading ? "Loading…" : `${applications.length} application${applications.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => { setEditingApp(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, var(--color-accent-500), var(--color-teal-500))",
            }}
          >
            <span className="text-base leading-none">+</span> Add Application
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm border flex items-center justify-between"
            style={{
              backgroundColor: "rgba(244,63,94,0.1)",
              borderColor: "rgba(244,63,94,0.3)",
              color: "var(--color-rose-500)",
            }}
          >
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-4 text-lg leading-none cursor-pointer">×</button>
          </div>
        )}
        {successMsg && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm border"
            style={{
              backgroundColor: "rgba(34,197,94,0.1)",
              borderColor: "rgba(34,197,94,0.3)",
              color: "#4ade80",
            }}
          >
            {successMsg}
          </div>
        )}

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search input */}
          <div className="relative flex-1">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: "var(--color-base-400)" }}
            >
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company name…"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--color-base-900)",
                borderColor: "var(--color-base-700)",
                color: "var(--color-base-200)",
              }}
              onFocus={e => e.target.style.borderColor = "var(--color-accent-500)"}
              onBlur={e => e.target.style.borderColor = "var(--color-base-700)"}
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border text-sm outline-none cursor-pointer"
            style={{
              backgroundColor: "var(--color-base-900)",
              borderColor: "var(--color-base-700)",
              color: "var(--color-base-200)",
              colorScheme: "dark",
              minWidth: "160px",
            }}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "var(--color-accent-500)", borderTopColor: "transparent" }}
              />
              <p className="text-sm" style={{ color: "var(--color-base-400)" }}>
                Loading applications…
              </p>
            </div>
          </div>
        ) : (
          <ApplicationTable
            applications={applications}
            onEdit={handleEditOpen}
            onDelete={handleDeleteConfirm}
          />
        )}
      </main>

      {/* Add / Edit modal */}
      {showForm && (
        <ApplicationForm
          initialData={editingApp}
          onSubmit={editingApp ? handleEdit : handleAdd}
          onClose={closeForm}
          loading={formLoading}
        />
      )}

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(10,14,20,0.85)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-base-900)",
              borderColor: "var(--color-base-700)",
            }}
          >
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h3 className="text-center font-semibold mb-2" style={{ color: "var(--color-base-200)" }}>
              Delete Application
            </h3>
            <p className="text-center text-sm mb-6" style={{ color: "var(--color-base-400)" }}>
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border cursor-pointer"
                style={{
                  color: "var(--color-base-400)",
                  borderColor: "var(--color-base-600)",
                  backgroundColor: "transparent",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer"
                style={{ backgroundColor: "var(--color-rose-500)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
