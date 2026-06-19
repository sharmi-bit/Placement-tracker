// src/pages/Register.jsx
// Registration page — creates a new account and auto-logs in the user.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await registerUser(form);
      login(data.user, data.token); // auto-login after registration
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
            Create your account
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-base-400)" }}>
            Start tracking your placement journey
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
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Sharmi Sri"
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "var(--color-accent-500)"}
                onBlur={e => e.target.style.borderColor = "var(--color-base-600)"}
              />
            </div>

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
                placeholder="Min. 6 characters"
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
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--color-base-400)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium"
              style={{ color: "var(--color-accent-400)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
