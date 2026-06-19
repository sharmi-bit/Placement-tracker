// src/services/api.js
// Central Axios instance used by the entire app to talk to the backend API.
// Handles attaching the JWT to every request and reacting to auth failures.

import axios from "axios";

// Base URL of the backend Express API.
// In production, set VITE_API_URL in your .env file (see .env.example).
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----- Request Interceptor -----
// Before every request is sent, attach the JWT (if present) as a Bearer token.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----- Response Interceptor -----
// If the backend ever responds with 401 (invalid/expired token), clear local
// auth state and redirect to the login page so the user can re-authenticate.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Avoid redirect loops if we're already on the login/register page
      const publicPaths = ["/login", "/register"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// Auth API calls
// ----------------------------------------------------------------------

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const getCurrentUser = () => api.get("/auth/me");

// ----------------------------------------------------------------------
// Application API calls
// ----------------------------------------------------------------------

// params can include { search, status } as query string filters
export const getApplications = (params = {}) =>
  api.get("/applications", { params });

export const getApplicationById = (id) => api.get(`/applications/${id}`);

export const createApplication = (data) => api.post("/applications", data);

export const updateApplication = (id, data) =>
  api.put(`/applications/${id}`, data);

export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export const getDashboardStats = () => api.get("/applications/stats/dashboard");

export default api;
