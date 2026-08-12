import React, { useState } from "react";
import {Alert,Box,Button,Card,CardContent,CircularProgress,IconButton,InputAdornment,MenuItem,Link,Stack,TextField,Typography} from "@mui/material";
import axios from "axios";
import {PersonAdd,Visibility,VisibilityOff} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({firstName: "",lastName: "",username: "",email: "",phoneNumber: "",password: "",confirmPassword: "", role: "Seller",});

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

const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
    }

    try {
        const response = await axios.post(
            "http://localhost:7203/api/AuthManagement/register",
            {
                sellerId: 0,
                fullName: formData.fullName,
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                mobile: formData.mobile,
                role: formData.role || "Seller",
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Registration response:", response.data);
        setSuccess( response.data?.message || "Registration successful.");
        setTimeout(() => {
            navigate("/login");
        }, 1500);
    } catch (error) {
        console.error("Registration error:",error.response?.data || error.message);
        setError(error.response?.data?.message ||"Registration failed.");
    } finally {
        setLoading(false);
    }
};

 return (
  <Box className="auth-container">
    <Card className="auth-card auth-large-card">
      <CardContent>

        {/* =========================================
            Header
        ========================================= */}

        <Stack
          spacing={2}
          alignItems="center"
          mb={3}
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

        {/* =========================================
            Error Message
        ========================================= */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* =========================================
            Success Message
        ========================================= */}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
          >
            {success}
          </Alert>
        )}

        {/* =========================================
            Registration Form
        ========================================= */}

        <form onSubmit={handleSubmit}>

          {/* Seller ID */}

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

          {/* Full Name */}

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

          {/* Username */}

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

          {/* Email */}

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

          {/* Mobile */}

          <TextField
            fullWidth
            margin="normal"
            label="Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            placeholder="Enter mobile number"
            autoComplete="tel"
            inputProps={{
              maxLength: 15,
            }}
          />

          {/* Password */}

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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
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
            }}
          />

          {/* Confirm Password */}

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
                    type="button"
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

          {/* Role */}

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

          {/* Register Button */}

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

          {/* Login Link */}

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