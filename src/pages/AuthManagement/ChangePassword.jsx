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
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    Lock,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import authService from "./authService";

import "./AuthManagement.css";

const ChangePassword = () => {

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const [showNewPassword, setShowNewPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({

        currentPassword: "",

        newPassword: "",

        confirmPassword: ""

    });

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
    // Change Password
    //=========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");

        if (formData.newPassword !== formData.confirmPassword) {

            setError("New Password and Confirm Password must match.");

            return;

        }

        try {

            setLoading(true);

            await authService.changePassword({

                currentPassword: formData.currentPassword,

                newPassword: formData.newPassword

            });

            setSuccess("Password changed successfully.");

            setFormData({

                currentPassword: "",

                newPassword: "",

                confirmPassword: ""

            });

        }
        catch (err) {

            setError(

                err?.response?.data?.message ||

                "Unable to change password."

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

                        <Lock
                            color="primary"
                            sx={{
                                fontSize: 60
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >

                            Change Password

                        </Typography>

                        <Typography
                            color="text.secondary"
                            align="center"
                        >

                            Update your account password.

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
                            label="Current Password"
                            name="currentPassword"
                            type={
                                showCurrentPassword
                                    ? "text"
                                    : "password"
                            }
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                            InputProps={{
                                endAdornment:

                                    <InputAdornment position="end">

                                        <IconButton
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    !showCurrentPassword
                                                )
                                            }
                                        >

                                            {

                                                showCurrentPassword

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
                            label="New Password"
                            name="newPassword"
                            type={
                                showNewPassword
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
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                        >

                                            {

                                                showNewPassword

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

                                    "Change Password"

                            }

                        </Button>

                    </form>

                </CardContent>

            </Card>

        </Box>

    );

};

export default ChangePassword;