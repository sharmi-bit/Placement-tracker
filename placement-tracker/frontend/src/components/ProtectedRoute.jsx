// src/components/ProtectedRoute.jsx
// Wraps private pages. Redirects to /login if no valid auth token is found.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  // While restoring auth state from localStorage, render nothing to avoid flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor: "var(--color-base-950)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
               style={{ borderColor: "var(--color-accent-500)", borderTopColor: "transparent" }} />
          <p style={{ color: "var(--color-base-400)" }} className="text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  // Not logged in — send to login page
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
