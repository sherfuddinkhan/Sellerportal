import React, { useState } from "react";

import {Box,Button,Card,CardContent,Checkbox,CircularProgress,FormControlLabel,IconButton,InputAdornment,Link,TextField,Typography,Alert,Stack} from "@mui/material";
import {Visibility,VisibilityOff,LockOutlined} from "@mui/icons-material";

import {PersonAdd,Visibility,VisibilityOff} from "@mui/icons-material";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import authService from "./authService";

import "./AuthManagement.css";

const Register = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({

        firstName: "",

        lastName: "",

        username: "",

        email: "",

        phoneNumber: "",

        password: "",

        confirmPassword: ""

    });

    //=========================================
    // Handle Change
    //=========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));

    };

    //=========================================
    // Register
    //=========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");

        if (formData.password !== formData.confirmPassword) {

            setError("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            await authService.register({

                firstName: formData.firstName,

                lastName: formData.lastName,

                username: formData.username,

                email: formData.email,

                phoneNumber: formData.phoneNumber,

                password: formData.password

            });

            setSuccess("Registration successful.");

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        }
        catch (err) {

            setError(

                err?.response?.data?.message ||

                "Registration failed."

            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <Box className="auth-container">

            <Card className="auth-card auth-large-card">

                <CardContent>

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

                        <Typography
                            color="text.secondary"
                        >

                            Register to Seller Portal

                        </Typography>

                    </Stack>

                    {

                        error &&

                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >

                            {error}

                        </Alert>

                    }

                    {

                        success &&

                        <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                        >

                            {success}

                        </Alert>

                    }

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
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />

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
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">

                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >

                                            {

                                                showPassword

                                                    ?

                                                    <VisibilityOff />

                                                    :

                                                    <Visibility />

                                            }

                                        </IconButton>

                                    </InputAdornment>
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
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">

                                        <IconButton
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >

                                            {

                                                showConfirmPassword

                                                    ?

                                                    <VisibilityOff />

                                                    :

                                                    <Visibility />

                                            }

                                        </IconButton>

                                    </InputAdornment>
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            type="submit"
                            disabled={loading}
                        >

                            {

                                loading

                                    ?

                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />

                                    :

                                    "Register"

                            }

                        </Button>

                        <Typography
                            align="center"
                            mt={3}
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