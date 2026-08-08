import React, { useState } from "react";
import {Alert,Box,Button,Card,CardContent,CircularProgress,IconButton,InputAdornment,Stack,TextField,Typography} from "@mui/material";
import {Lock,Visibility,VisibilityOff} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
const ForgotPasswordForm = ({
    onSubmit,
    loading = false,
    error = "",
    success = "",
    title = "Forgot Password",
    subtitle = "Enter your registered email address to receive password reset instructions."
}) => {

    const [email, setEmail] = useState("");
    //=========================================
    // Submit
    //=========================================

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({
                email
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
        </Box>
    );
};

export default ForgotPasswordForm;