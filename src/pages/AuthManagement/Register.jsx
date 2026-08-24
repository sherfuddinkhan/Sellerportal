import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import axios from "axios";

import {
  PersonAdd,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import "./AuthManagement.css";

const Register = () => {
  const navigate = useNavigate();

  // =========================================================
  // State
  // =========================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    sellerId: 0,
    fullName: "",
    userName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "Seller",
  });

  // =========================================================
  // Handle Input Change
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // Handle Register
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // =======================================================
    // Validation
    // =======================================================

    if (!formData.fullName.trim()) {
      setError("Full Name is required.");
      return;
    }

    if (!formData.userName.trim()) {
      setError("Username is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!formData.mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // =======================================================
    // Start Loading
    // =======================================================

    setLoading(true);

    try {
      // =====================================================
      // Request Payload
      // =====================================================

      const payload = {
        sellerId: Number(formData.sellerId) || 0,
        fullName: formData.fullName.trim(),
        userName: formData.userName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        mobile: formData.mobile.trim(),
        role: formData.role || "Seller",
      };

      console.log("Registration payload:", payload);

      // =====================================================
      // React → Node.js
      //
      // React:
      // http://localhost:5173
      //
      // Node:
      // http://localhost:5000
      // =====================================================

      const response = await axios.post(
        "http://localhost:5000/api/AuthManagement/register",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // =====================================================
      // Success Response
      // =====================================================

      console.log(
        "Registration response:",
        response.data
      );

      setSuccess(
        response.data?.message ||
          "Registration successful."
      );

      // =====================================================
      // Clear Password Fields
      // =====================================================

      setFormData((previous) => ({
        ...previous,
        password: "",
        confirmPassword: "",
      }));

      // =====================================================
      // Redirect to Login
      // =====================================================

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      // =====================================================
      // Error Handling
      // =====================================================

      console.error(
        "Registration error:",
        err.response?.data || err.message
      );

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (
        typeof err.response?.data === "string"
      ) {
        setError(err.response.data);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Component
  // =========================================================

  return (
    <Box className="auth-container">
      <Card className="auth-card auth-large-card">
        <CardContent>

          {/* =================================================
              Header
          ================================================= */}

          <Stack
            spacing={2}
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <PersonAdd
              color="primary"
              sx={{ fontSize: 60 }}
            />

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Create Account
            </Typography>

            <Typography color="text.secondary">
              Register to Seller Portal
            </Typography>
          </Stack>

          {/* =================================================
              Error
          ================================================= */}

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* =================================================
              Success
          ================================================= */}

          {success && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          )}

          {/* =================================================
              Registration Form
          ================================================= */}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* =================================================
                Seller ID
            ================================================= */}

            <TextField
              fullWidth
              margin="normal"
              label="Seller ID"
              name="sellerId"
              type="number"
              value={formData.sellerId}
              onChange={handleChange}
              helperText="Enter 0 for a new seller"
            />

            {/* =================================================
                Full Name
            ================================================= */}

            <TextField
              fullWidth
              margin="normal"
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
            />

            {/* =================================================
                Username
            ================================================= */}

            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              autoComplete="username"
            />

            {/* =================================================
                Email
            ================================================= */}

            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            {/* =================================================
                Mobile
            ================================================= */}

            <TextField
              fullWidth
              margin="normal"
              label="Mobile Number"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="Enter mobile number"
              autoComplete="tel"
              slotProps={{
                htmlInput: {
                  maxLength: 15,
                },
              }}
            />

            {/* =================================================
                Password
            ================================================= */}

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        type="button"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowPassword(
                            (previous) => !previous
                          )
                        }
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* =================================================
                Confirm Password
            ================================================= */}

            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        type="button"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) => !previous
                          )
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* =================================================
                Role
            ================================================= */}

            <TextField
              fullWidth
              select
              margin="normal"
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem value="Seller">
                Seller
              </MenuItem>

              <MenuItem value="Admin">
                Admin
              </MenuItem>

              <MenuItem value="Manager">
                Manager
              </MenuItem>
            </TextField>

            {/* =================================================
                Register Button
            ================================================= */}

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                "Register"
              )}
            </Button>

            {/* =================================================
                Login
            ================================================= */}

            <Typography
              align="center"
              sx={{ mt: 3 }}
            >
              Already have an account?

              <Link
                component={RouterLink}
                to="/login"
                sx={{ ml: 1 }}
              >
                Login
              </Link>
            </Typography>

          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;