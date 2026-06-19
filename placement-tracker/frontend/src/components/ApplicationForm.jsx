// src/components/ApplicationForm.jsx
// Modal form for creating or editing a job application.
// Pass `initialData` prop to enter edit mode (pre-fills the fields).

import { useState, useEffect } from "react";

const STATUS_OPTIONS = [
  "Applied",
  "Online Assessment",
  "Interview Scheduled",
  "Selected",
  "Rejected",
];

const EMPTY_FORM = {
  companyName: "",
  jobRole: "",
  applicationDate: "",
  status: "Applied",
};

const ApplicationForm = ({ initialData, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  // When editing: populate form with existing application data
  useEffect(() => {
    if (initialData) {
      setForm({
        companyName: initialData.companyName || "",
        jobRole: initialData.jobRole || "",
        // Format ISO date string to YYYY-MM-DD for the <input type="date">
        applicationDate: initialData.applicationDate
          ? new Date(initialData.applicationDate).toISOString().split("T")[0]
          : "",
        status: initialData.status || "Applied",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Close modal when clicking outside the form card
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const inputStyle = {
    backgroundColor: "var(--color-base-800)",
    borderColor: "var(--color-base-600)",
    color: "var(--color-base-200)",
  };

  const labelStyle = { color: "var(--color-base-400)" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(10,14,20,0.85)", backdropFilter: "blur(4px)" }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: "var(--color-base-900)",
          borderColor: "var(--color-base-700)",
        }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--color-base-700)" }}
        >
          <h2 className="text-lg font-semibold" style={{ color: "var(--color-base-200)" }}>
            {initialData ? "Edit Application" : "Add Application"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-colors cursor-pointer"
            style={{ color: "var(--color-base-400)" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--color-base-800)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Company Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={labelStyle}>
              Company Name <span style={{ color: "var(--color-rose-500)" }}>*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
              placeholder="e.g. Google, TCS, Infosys"
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--color-accent-500)"}
              onBlur={e => e.target.style.borderColor = "var(--color-base-600)"}
            />
          </div>

          {/* Job Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={labelStyle}>
              Job Role <span style={{ color: "var(--color-rose-500)" }}>*</span>
            </label>
            <input
              type="text"
              name="jobRole"
              value={form.jobRole}
              onChange={handleChange}
              required
              placeholder="e.g. Software Engineer, Data Analyst"
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "var(--color-accent-500)"}
              onBlur={e => e.target.style.borderColor = "var(--color-base-600)"}
            />
          </div>

          {/* Application Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={labelStyle}>
              Application Date <span style={{ color: "var(--color-rose-500)" }}>*</span>
            </label>
            <input
              type="date"
              name="applicationDate"
              value={form.applicationDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
              style={{ ...inputStyle, colorScheme: "dark" }}
              onFocus={e => e.target.style.borderColor = "var(--color-accent-500)"}
              onBlur={e => e.target.style.borderColor = "var(--color-base-600)"}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={labelStyle}>
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors cursor-pointer"
              style={{ ...inputStyle, colorScheme: "dark" }}
              onFocus={e => e.target.style.borderColor = "var(--color-accent-500)"}
              onBlur={e => e.target.style.borderColor = "var(--color-base-600)"}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer"
              style={{
                color: "var(--color-base-400)",
                borderColor: "var(--color-base-600)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--color-base-800)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity cursor-pointer disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, var(--color-accent-500), var(--color-teal-500))",
              }}
            >
              {loading ? "Saving…" : initialData ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
