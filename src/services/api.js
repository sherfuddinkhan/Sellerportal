import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5001/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   Request Interceptor
============================ */

api.interceptors.request.use(
  (config) => {
    // Read JWT token
    const token = localStorage.getItem("token");

    // Add Authorization header automatically
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ============================
   Response Interceptor
============================ */

api.interceptors.response.use(
  (response) => {
    // Return successful response
    return response;
  },
  (error) => {
    // Handle Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to Login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;