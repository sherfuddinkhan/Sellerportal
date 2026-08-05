import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Link,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

const LoginForm = ({
    onSubmit,
    loading = false,
    error = "",
    title = "Login",
    subtitle = "Sign in to continue"
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({

        email: "",

        password: "",

        rememberMe: false

    });

    //=========================================
    // Handle Change
    //=========================================

    const handleChange = (e) => {

        const {

            name,

            value,

            checked,

            type

        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]:

                type === "checkbox"

                    ? checked

                    : value

        }));

    };

    //=========================================
    // Submit
    //=========================================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (onSubmit) {

            onSubmit(formData);

        }

    };

    return (

        <Box
            component="form"
            onSubmit={handleSubmit}
        >

            <Stack spacing={1} mb={3}>

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

            <TextField
                fullWidth
                required
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
            />

            <TextField
                fullWidth
                required
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
                InputProps={{

                    endAdornment:

                        <InputAdornment position="end">

                            <IconButton
                                edge="end"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
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

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={1}
            >

                <FormControlLabel
                    control={

                        <Checkbox
                            checked={formData.rememberMe}
                            name="rememberMe"
                            onChange={handleChange}
                        />

                    }
                    label="Remember Me"
                />

                <Link
                    component={RouterLink}
                    to="/forgot-password"
                    underline="hover"
                >

                    Forgot Password?

                </Link>

            </Box>

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

                        "Login"

                }

            </Button>

            <Typography
                align="center"
                mt={3}
            >

                Don't have an account?

                <Link
                    component={RouterLink}
                    to="/register"
                    sx={{ ml: 1 }}
                >

                    Register

                </Link>

            </Typography>

        </Box>

    );

};

export default LoginForm;