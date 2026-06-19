// src/pages/Dashboard.jsx
// Dashboard — shows stat cards (total / selected / rejected / pending)
// and a quick view of the 5 most recent applications.

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardStats, getApplications } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

// Status badge colours reused from ApplicationTable
const STATUS_STYLES = {
  "Applied":             { bg: "rgba(99,102,241,0.15)",  text: "var(--color-accent-400)" },
  "Online Assessment":   { bg: "rgba(245,158,11,0.15)",  text: "var(--color-amber-500)"  },
  "Interview Scheduled": { bg: "rgba(20,184,166,0.15)",  text: "var(--color-teal-400)"   },
  "Selected":            { bg: "rgba(34,197,94,0.15)",   text: "#4ade80"                 },
  "Rejected":            { bg: "rgba(244,63,94,0.15)",   text: "var(--color-rose-500)"   },
};

const StatCard = ({ label, value, icon, accent }) => (
  <div
    className="rounded-xl border p-5 flex items-center gap-4"
    style={{
      backgroundColor: "var(--color-base-900)",
      borderColor: "var(--color-base-700)",
    }}
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
      style={{ backgroundColor: `${accent}18` }}
    >
      {icon}
    </div>
    <div>
      <p
        className="text-3xl font-bold"
        style={{
          color: accent,
          fontFamily: "var(--font-mono-data)",
        }}
      >
        {value ?? "—"}
      </p>
      <p className="text-sm mt-0.5" style={{ color: "var(--color-base-400)" }}>
        {label}
      </p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, appsRes] = await Promise.all([
          getDashboardStats(),
          getApplications(),
        ]);
        setStats(statsRes.data);
        // Show only the 5 most recent applications
        setRecent(appsRes.data.applications.slice(0, 5));
      } catch (err) {
        setError("Failed to load dashboard data. Please refresh.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: "Total Applications", value: stats?.total,    icon: "📋", accent: "var(--color-accent-400)" },
    { label: "Selected",           value: stats?.selected, icon: "✅", accent: "#4ade80"                 },
    { label: "Rejected",           value: stats?.rejected, icon: "❌", accent: "var(--color-rose-500)"   },
    { label: "Pending",            value: stats?.pending,  icon: "⏳", accent: "var(--color-amber-500)"  },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-base-950)" }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-base-200)" }}>
            Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-base-400)" }}>
            Here's a snapshot of your placement progress.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 px-4 py-3 rounded-lg text-sm border"
            style={{
              backgroundColor: "rgba(244,63,94,0.1)",
              borderColor: "rgba(244,63,94,0.3)",
              color: "var(--color-rose-500)",
            }}
          >
            {error}
          </div>
        )}

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border p-5 h-24 animate-pulse"
                style={{
                  backgroundColor: "var(--color-base-900)",
                  borderColor: "var(--color-base-700)",
                }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>
        )}

        {/* Recent applications */}
        <div
          className="rounded-xl border"
          style={{
            backgroundColor: "var(--color-base-900)",
            borderColor: "var(--color-base-700)",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--color-base-700)" }}
          >
            <h2 className="font-semibold text-sm" style={{ color: "var(--color-base-200)" }}>
              Recent Applications
            </h2>
            <Link
              to="/applications"
              className="text-xs font-medium transition-colors"
              style={{ color: "var(--color-accent-400)" }}
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="divide-y" style={{ borderColor: "var(--color-base-700)" }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-5 py-4 flex justify-between animate-pulse">
                  <div className="flex flex-col gap-2">
                    <div className="h-3.5 w-32 rounded"
                         style={{ backgroundColor: "var(--color-base-700)" }} />
                    <div className="h-3 w-24 rounded"
                         style={{ backgroundColor: "var(--color-base-800)" }} />
                  </div>
                  <div className="h-6 w-20 rounded-full"
                       style={{ backgroundColor: "var(--color-base-700)" }} />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14">
              <p className="text-sm" style={{ color: "var(--color-base-400)" }}>
                No applications yet —{" "}
                <Link to="/applications" style={{ color: "var(--color-accent-400)" }}>
                  add your first one
                </Link>
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--color-base-800)" }}>
              {recent.map((app) => {
                const badgeStyle = STATUS_STYLES[app.status] || STATUS_STYLES["Applied"];
                return (
                  <div
                    key={app._id}
                    className="flex items-center justify-between px-5 py-3.5 transition-colors"
                    onMouseEnter={e =>
                      e.currentTarget.style.backgroundColor = "var(--color-base-800)"}
                    onMouseLeave={e =>
                      e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div>
                      <p className="text-sm font-medium"
                         style={{ color: "var(--color-base-200)" }}>
                        {app.companyName}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-base-400)" }}>
                        {app.jobRole} ·{" "}
                        <span style={{ fontFamily: "var(--font-mono-data)" }}>
                          {new Date(app.applicationDate).toLocaleDateString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </span>
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.text,
                        fontFamily: "var(--font-mono-data)",
                      }}
                    >
                      {app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
};

export default Dashboard;
