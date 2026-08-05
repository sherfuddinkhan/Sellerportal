import React, { useState } from "react";

import {Box,Button,Card,CardContent,Checkbox,CircularProgress,FormControlLabel,IconButton,InputAdornment,Link,TextField,Typography,Alert,Stack} from "@mui/material";
import {Visibility,VisibilityOff,LockOutlined} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

const ResetPasswordForm = ({
    onSubmit,
    loading = false,
    error = "",
    success = "",
    title = "Reset Password",
    subtitle = "Enter the reset token and create a new password."
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({

        email: "",

        token: "",

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
    // Submit
    //=========================================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {

            return;

        }

        if (onSubmit) {

            onSubmit({

                email: formData.email,

                token: formData.token,

                newPassword: formData.newPassword

            });

        }

    };

    return (

        <Box
            component="form"
            onSubmit={handleSubmit}
        >

            <Stack
                spacing={1}
                mb={3}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    align="center"
                >

                    {title}

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >

                    {subtitle}

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

            <TextField
                fullWidth
                required
                margin="normal"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
            />

            <TextField
                fullWidth
                required
                margin="normal"
                label="Reset Token"
                name="token"
                value={formData.token}
                onChange={handleChange}
                multiline
                minRows={2}
            />

            <TextField
                fullWidth
                required
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
                InputProps={{
                    endAdornment:

                        <InputAdornment position="end">

                            <IconButton
                                edge="end"
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
                required
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
                error={
                    formData.confirmPassword !== "" &&
                    formData.newPassword !== formData.confirmPassword
                }
                helperText={

                    formData.confirmPassword !== "" &&
                    formData.newPassword !== formData.confirmPassword

                        ?

                        "Passwords do not match."

                        :

                        ""

                }
                InputProps={{
                    endAdornment:

                        <InputAdornment position="end">

                            <IconButton
                                edge="end"
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
                disabled={
                    loading ||
                    (
                        formData.confirmPassword !== "" &&
                        formData.newPassword !== formData.confirmPassword
                    )
                }
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

        </Box>

    );

};

export default ResetPasswordForm;