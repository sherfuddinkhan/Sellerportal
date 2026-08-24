import React, { useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
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
    LockOutlined,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";

import {
    Link as RouterLink,
    useNavigate
} from "react-router-dom";

import "./AuthManagement.css";


const API_URL = "http://localhost:5000/api";


const Login = () => {

    const navigate = useNavigate();

    // =========================================================
    // FORM DATA
    // =========================================================

    const [formData, setFormData] = useState({
        userName: "",
        password: "",
        rememberMe: false
    });


    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

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


    // =========================================================
    // LOGIN
    // POST http://localhost:5000/api/auth/login
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!formData.userName.trim()) {

            setError("Please enter your username.");

            return;
        }


        if (!formData.password) {

            setError("Please enter your password.");

            return;
        }


        try {

            setLoading(true);


            console.log("LOGIN REQUEST:");

            console.log({
                userName: formData.userName,
                password: formData.password
            });


            // =================================================
            // CALL NODE PROXY
            // =================================================

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    },

                    body: JSON.stringify({
                        userName: formData.userName.trim(),
                        password: formData.password
                    })
                }
            );


            // =================================================
            // READ RESPONSE
            // =================================================

            const data = await response.json();


            console.log("LOGIN RESPONSE:");

            console.log(data);


            // =================================================
            // CHECK ERROR
            // =================================================

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Invalid username or password."
                );
            }


            // =================================================
            // SAVE TOKEN
            // =================================================

            if (data?.token) {

                localStorage.setItem(
                    "token",
                    data.token
                );
            }


            // =================================================
            // SAVE REFRESH TOKEN
            // =================================================

            if (data?.refreshToken) {

                localStorage.setItem(
                    "refreshToken",
                    data.refreshToken
                );
            }


            // =================================================
            // SAVE USER
            // =================================================

            if (data?.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }


            // =================================================
            // SAVE COMPLETE LOGIN RESPONSE
            // =================================================

            localStorage.setItem(
                "loginResponse",
                JSON.stringify(data)
            );


            // =================================================
            // REMEMBER ME
            // =================================================

            if (formData.rememberMe) {

                localStorage.setItem(
                    "rememberMe",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "rememberMe"
                );
            }


            // =================================================
            // LOGIN SUCCESS
            // =================================================

            console.log(
                "LOGIN SUCCESSFUL"
            );


          // 1. Your authentication logic here (e.g., API call)
    // 2. Set token/auth state in localStorage or context
    localStorage.setItem("isAuthenticated", "true");

    // 3. Redirect to Dashboard (which renders inside MainLayout)
    navigate("/dashboard", { replace: true });


        } catch (err) {

            console.error(
                "LOGIN ERROR:",
                err
            );


            setError(
                err?.message ||
                "Unable to login. Please try again."
            );


        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <Box className="auth-container">

            <Card className="auth-card">

                <CardContent>

                    {/* =================================================
                        HEADER
                    ================================================= */}

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


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>

                    )}


                    {/* =================================================
                        LOGIN FORM
                    ================================================= */}

                    <form onSubmit={handleSubmit}>

                        {/* =================================================
                            USERNAME
                        ================================================= */}

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Username"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

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
                            autoComplete="current-password"

                            InputProps={{
                                endAdornment: (

                                    <InputAdornment position="end">

                                        <IconButton
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (prev) => !prev
                                                )
                                            }
                                            edge="end"
                                        >

                                            {showPassword ? (

                                                <VisibilityOff />

                                            ) : (

                                                <Visibility />

                                            )}

                                        </IconButton>

                                    </InputAdornment>
                                )
                            }}
                        />


                        {/* =================================================
                            REMEMBER + FORGOT PASSWORD
                        ================================================= */}

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={1}
                        >

                            <FormControlLabel

                                control={

                                    <Checkbox
                                        checked={
                                            formData.rememberMe
                                        }
                                        onChange={
                                            handleChange
                                        }
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


                        {/* =================================================
                            LOGIN BUTTON
                        ================================================= */}

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3 }}
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (

                                <CircularProgress
                                    size={24}
                                    color="inherit"
                                />

                            ) : (

                                "Login"

                            )}

                        </Button>


                        {/* =================================================
                            REGISTER
                        ================================================= */}

                        <Typography
                            align="center"
                            mt={3}
                        >

                            Don't have an account?

                            <Link
                                component={RouterLink}
                                to="/register"
                                sx={{
                                    ml: 1
                                }}
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