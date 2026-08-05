import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

const ChangePasswordForm = ({
    onSubmit,
    loading = false,
    error = "",
    success = "",
    title = "Change Password",
    subtitle = "Update your account password."
}) => {

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
    // Submit
    //=========================================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {

            return;

        }

        if (onSubmit) {

            onSubmit({

                currentPassword: formData.currentPassword,

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
                label="Current Password"
                name="currentPassword"
                type={
                    showCurrentPassword
                        ? "text"
                        : "password"
                }
                value={formData.currentPassword}
                onChange={handleChange}
                InputProps={{
                    endAdornment:

                        <InputAdornment position="end">

                            <IconButton
                                edge="end"
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
                required
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
                InputProps={{
                    endAdornment:

                        <InputAdornment position="end">

                            <IconButton
                                edge="end"
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
                        ? "Passwords do not match."
                        : ""
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

                        "Change Password"

                }

            </Button>

        </Box>

    );

};

export default ChangePasswordForm;