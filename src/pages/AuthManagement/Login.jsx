import React, { useState } from "react";
import {Box,Button,Card,CardContent,Checkbox,CircularProgress,FormControlLabel,IconButton,InputAdornment,Link,TextField,Typography,Alert,Stack} from "@mui/material";
import {Visibility,VisibilityOff,LockOutlined} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AuthManagement.css";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({email: "",password: "",rememberMe: false});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    //===========================================
    // Handle Input Change
    //===========================================

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    //===========================================
    // Login
    //===========================================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login({email: formData.email,password: formData.password,rememberMe: formData.rememberMe});
            navigate("/dashboard");
        }
        catch (err) {
            setError(
                err?.response?.data?.message ||

                "Invalid username or password."

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

                        <LockOutlined
                            color="primary"
                            sx={{
                                fontSize: 60
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >

                            Seller Portal

                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >

                            Sign in to continue

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

                    <form onSubmit={handleSubmit}>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
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
                                        onChange={handleChange}
                                        name="rememberMe"
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
                            size="large"
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

                    </form>

                </CardContent>

            </Card>

        </Box>

    );

};

export default Login;