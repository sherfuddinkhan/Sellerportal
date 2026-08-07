import React, { useState } from "react";
import {Alert,Box,Button,Card,CardContent,CircularProgress,IconButton,InputAdornment,Link,Stack,TextField,Typography} from "@mui/material";
import axios from "axios";
import {PersonAdd,Visibility,VisibilityOff} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import apiService from "../../ApiService/apiService";

import "./AuthManagement.css";

const Register = () => {
  const navigate = useNavigate();

  // =========================================
  // State
  // =========================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // =========================================
  // Handle Input Change
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // Register
  // =========================================

 const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
    }

    try {

        const response = await axios.post(
            "https://localhost:5001/api/auth/register",
            {
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
            }
        );

        setSuccess(
            response.data.message || "Registration successful."
        );

        setTimeout(() => {
            navigate("/login");
        }, 1500);

    } catch (error) {

        setError(
            error.response?.data?.message ||
            "Registration failed."
        );

    } finally {

        setLoading(false);

    }
};

  return (
    <Box className="auth-container">
      <Card className="auth-card auth-large-card">
        <CardContent>
          <Stack spacing={2} alignItems="center" mb={3}>
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

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

            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              autoComplete="tel"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
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
              }}
            />

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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
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
              }}
            />

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
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;