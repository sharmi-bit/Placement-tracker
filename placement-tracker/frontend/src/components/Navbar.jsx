// src/components/Navbar.jsx
// Top navigation bar shown on all authenticated pages.

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Applications", path: "/applications" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--color-base-900)",
        borderColor: "var(--color-base-700)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, var(--color-accent-500), var(--color-teal-500))" }}
            >
              PT
            </div>
            <span
              className="text-base font-semibold hidden sm:block"
              style={{ color: "var(--color-base-200)" }}
            >
              Placement Tracker
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ label, path }) => {
              const active = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{
                    color: active ? "var(--color-accent-400)" : "var(--color-base-400)",
                    backgroundColor: active ? "var(--color-base-800)" : "transparent",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <span
              className="text-sm hidden sm:block"
              style={{ color: "var(--color-base-400)" }}
            >
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 border cursor-pointer"
              style={{
                color: "var(--color-rose-500)",
                borderColor: "var(--color-base-700)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = "rgba(244,63,94,0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
