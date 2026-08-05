import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Link,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    LockReset
} from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";

import authService from "./authService";

import "./AuthManagement.css";

const ForgotPassword = () => {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    //=========================================
    // Submit
    //=========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");

        try {

            setLoading(true);

            await authService.forgotPassword({

                email

            });

            setSuccess(

                "Password reset instructions have been sent to your email."

            );

        }
        catch (err) {

            setError(

                err?.response?.data?.message ||

                "Unable to process your request."

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

                            Forgot Password

                        </Typography>

                        <Typography
                            color="text.secondary"
                            align="center"
                        >

                            Enter your registered email address.
                            We'll send you password reset instructions.

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
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
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

                                    "Send Reset Link"

                            }

                        </Button>

                        <Typography
                            align="center"
                            mt={3}
                        >

                            Remember your password?

                            <Link
                                component={RouterLink}
                                to="/login"
                                sx={{ ml: 1 }}
                            >

                                Back to Login

                            </Link>

                        </Typography>

                    </form>

                </CardContent>

            </Card>

        </Box>

    );

};

export default ForgotPassword;