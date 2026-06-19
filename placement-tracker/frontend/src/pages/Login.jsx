// src/pages/Login.jsx
// Login page — authenticates user and stores JWT in localStorage via AuthContext.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data.user, data.token); // saves to context + localStorage
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: "var(--color-base-800)",
    borderColor: "var(--color-base-600)",
    color: "var(--color-base-200)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-base-950)" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4"
            style={{ background: "linear-gradient(135deg, var(--color-accent-500), var(--color-teal-500))" }}
          >
            PT
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-base-200)" }}>
            Welcome back
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-base-400)" }}>
            Sign in to your Placement Tracker
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            backgroundColor: "var(--color-base-900)",
            borderColor: "var(--color-base-700)",
          }}
        >
          {/* Error */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-lg text-sm border"
              style={{
                backgroundColor: "rgba(244,63,94,0.1)",
                borderColor: "rgba(244,63,94,0.3)",
                color: "var(--color-rose-500)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--color-base-400)" }}>
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@email.com"
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--color-accent-500)"}
                onBlur={e => e.target.style.borderColor = "var(--color-base-600)"}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--color-base-400)" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--color-accent-500)"}
                onBlur={e => e.target.style.borderColor = "var(--color-base-600)"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white mt-1 transition-opacity disabled:opacity-60 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, var(--color-accent-500), var(--color-teal-500))",
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--color-base-400)" }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium transition-colors"
              style={{ color: "var(--color-accent-400)" }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
