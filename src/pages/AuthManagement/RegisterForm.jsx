import React, { useState } from "react";

import {Box,Button,Card,CardContent,Checkbox,CircularProgress,FormControlLabel,IconButton,InputAdornment,Link,TextField,Typography,Alert,Stack} from "@mui/material";
import {Visibility,VisibilityOff} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

const RegisterForm = ({
    onSubmit,
    loading = false,
    error = "",
    success = "",
    title = "Create Account",
    subtitle = "Register a new Seller Portal account"
}) => {

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
    // Submit
    //=========================================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {

            return;

        }

        if (onSubmit) {

            onSubmit(formData);

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
                    align="center"
                    fontWeight="bold"
                >

                    {title}

                </Typography>

                <Typography
                    variant="body2"
                    align="center"
                    color="text.secondary"
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

            <Grid
                container
                spacing={2}
            >

                <Grid item xs={12} md={6}>

                    <TextField
                        fullWidth
                        required
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />

                </Grid>

                <Grid item xs={12} md={6}>

                    <TextField
                        fullWidth
                        required
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />

                </Grid>

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        required
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />

                </Grid>

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        required
                        type="email"
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                </Grid>

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />

                </Grid>

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        required
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

                </Grid>

                <Grid item xs={12}>

                    <TextField
                        fullWidth
                        required
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
                            formData.password !== formData.confirmPassword
                        }
                        helperText={

                            formData.confirmPassword !== "" &&
                            formData.password !== formData.confirmPassword

                                ?

                                "Passwords do not match"

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

                </Grid>

            </Grid>

            <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 4 }}
                disabled={
                    loading ||
                    (
                        formData.confirmPassword !== "" &&
                        formData.password !== formData.confirmPassword
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

        </Box>

    );

};

export default RegisterForm;