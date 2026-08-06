import React, { useState } from "react";
import {Box,Button,Card,CardContent,Checkbox,CircularProgress,FormControlLabel,IconButton,InputAdornment,Link,TextField,Typography,Alert,Stack} from "@mui/material";
import {Visibility,VisibilityOff,LockOutlined} from "@mui/icons-material";
import {LockReset} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import authService from "./authService";
import "./AuthManagement.css";
const ResetPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({email: "",token: "",newPassword: "",confirmPassword: ""});

    //=========================================
    // Handle Change
    //=========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    };

    //=========================================
    // Reset Password
    //=========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");

        if (formData.newPassword !== formData.confirmPassword) {

            setError("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            await authService.resetPassword({

                email: formData.email,

                token: formData.token,

                newPassword: formData.newPassword

            });

            setSuccess("Password reset successfully.");

            setTimeout(() => {

                navigate("/login");

            }, 2000);

        }
        catch (err) {

            setError(

                err?.response?.data?.message ||

                "Password reset failed."

            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <Box className="auth-container">

            <Card className="auth-card">

                <CardContent>

                    <Stack
                        spacing={2}
                        alignItems="center"
                        mb={3}
                    >

                        <LockReset
                            color="primary"
                            sx={{
                                fontSize: 60
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >

                            Reset Password

                        </Typography>

                        <Typography
                            color="text.secondary"
                            align="center"
                        >

                            Enter the reset token sent to your email and choose a new password.

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
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Reset Token"
                            name="token"
                            value={formData.token}
                            onChange={handleChange}
                            required
                            multiline
                            minRows={2}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="New Password"
                            name="newPassword"
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            value={formData.newPassword}
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
                            type="submit"
                            sx={{ mt: 3 }}
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

                                    "Reset Password"

                            }

                        </Button>

                        <Typography
                            align="center"
                            mt={3}
                        >

                            Back to

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

export default ResetPassword;