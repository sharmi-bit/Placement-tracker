// src/components/ApplicationTable.jsx
// Renders the list of job applications as a responsive table with
// status badges and edit / delete action buttons.

const STATUS_STYLES = {
  "Applied":            { bg: "rgba(99,102,241,0.15)",  text: "var(--color-accent-400)" },
  "Online Assessment":  { bg: "rgba(245,158,11,0.15)",  text: "var(--color-amber-500)"  },
  "Interview Scheduled":{ bg: "rgba(20,184,166,0.15)",  text: "var(--color-teal-400)"   },
  "Selected":           { bg: "rgba(34,197,94,0.15)",   text: "#4ade80"                 },
  "Rejected":           { bg: "rgba(244,63,94,0.15)",   text: "var(--color-rose-500)"   },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES["Applied"];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text,
               fontFamily: "var(--font-mono-data)" }}
    >
      {status}
    </span>
  );
};

const ApplicationTable = ({ applications, onEdit, onDelete }) => {
  if (applications.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-xl border"
        style={{ borderColor: "var(--color-base-700)",
                 backgroundColor: "var(--color-base-900)" }}
      >
        <div className="text-5xl mb-4">📋</div>
        <p className="text-base font-medium" style={{ color: "var(--color-base-200)" }}>
          No applications yet
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--color-base-400)" }}>
          Click "Add Application" to start tracking
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--color-base-700)",
               backgroundColor: "var(--color-base-900)" }}
    >
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-base-700)",
                         backgroundColor: "var(--color-base-800)" }}>
              {["Company", "Role", "Date", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-base-400)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app, idx) => (
              <tr
                key={app._id}
                style={{
                  borderBottom: idx < applications.length - 1
                    ? "1px solid var(--color-base-800)" : "none",
                }}
                onMouseEnter={e =>
                  e.currentTarget.style.backgroundColor = "var(--color-base-800)"}
                onMouseLeave={e =>
                  e.currentTarget.style.backgroundColor = "transparent"}
              >
                <td className="px-5 py-3.5 font-medium"
                    style={{ color: "var(--color-base-200)" }}>
                  {app.companyName}
                </td>
                <td className="px-5 py-3.5"
                    style={{ color: "var(--color-base-400)" }}>
                  {app.jobRole}
                </td>
                <td className="px-5 py-3.5"
                    style={{ color: "var(--color-base-400)",
                             fontFamily: "var(--font-mono-data)", fontSize: "0.8rem" }}>
                  {new Date(app.applicationDate).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(app)}
                      className="px-3 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer"
                      style={{ color: "var(--color-accent-400)",
                               borderColor: "var(--color-base-600)",
                               backgroundColor: "transparent" }}
                      onMouseEnter={e =>
                        e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.1)"}
                      onMouseLeave={e =>
                        e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(app._id)}
                      className="px-3 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer"
                      style={{ color: "var(--color-rose-500)",
                               borderColor: "var(--color-base-600)",
                               backgroundColor: "transparent" }}
                      onMouseEnter={e =>
                        e.currentTarget.style.backgroundColor = "rgba(244,63,94,0.1)"}
                      onMouseLeave={e =>
                        e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y" style={{ borderColor: "var(--color-base-700)" }}>
        {applications.map((app) => (
          <div key={app._id} className="p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium" style={{ color: "var(--color-base-200)" }}>
                  {app.companyName}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "var(--color-base-400)" }}>
                  {app.jobRole}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-xs" style={{ color: "var(--color-base-400)",
                                             fontFamily: "var(--font-mono-data)" }}>
              {new Date(app.applicationDate).toLocaleDateString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
              })}
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onEdit(app)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium border cursor-pointer"
                style={{ color: "var(--color-accent-400)",
                         borderColor: "var(--color-base-600)",
                         backgroundColor: "transparent" }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(app._id)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium border cursor-pointer"
                style={{ color: "var(--color-rose-500)",
                         borderColor: "var(--color-base-600)",
                         backgroundColor: "transparent" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationTable;
