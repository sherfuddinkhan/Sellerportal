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


// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api";


// =========================================================
// LOGIN COMPONENT
// =========================================================

const Login = () => {

    const navigate = useNavigate();


    // =========================================================
    // STATE
    // =========================================================

    const [formData, setFormData] = useState({
        userName: "",
        password: "",
        rememberMe: false
    });


    const [showPassword, setShowPassword] =
        useState(false);


    const [loading, setLoading] =
        useState(false);


    const [error, setError] =
        useState("");


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


        setFormData((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };


    // =========================================================
    // LOGIN
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // =====================================================
        // VALIDATION
        // =====================================================

        if (!formData.userName.trim()) {

            setError(
                "Please enter your username."
            );

            return;
        }


        if (!formData.password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            console.log(
                "=========================================="
            );

            console.log(
                "LOGIN REQUEST"
            );

            console.log(
                "Username:",
                formData.userName.trim()
            );


            // =================================================
            // NODE API
            // =================================================
            //
            // React:
            // http://localhost:5173
            //
            // Node:
            // http://localhost:5000
            //
            // Route:
            // /api/AuthManagement/login
            //
            // =================================================

            const response = await fetch(
                `${API_URL}/AuthManagement/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"
                    },

                    body: JSON.stringify({
                        userName:
                            formData.userName.trim(),

                        password:
                            formData.password
                    })
                }
            );


            // =================================================
            // RESPONSE INFORMATION
            // =================================================

            console.log(
                "HTTP STATUS:",
                response.status
            );

            console.log(
                "HTTP STATUS TEXT:",
                response.statusText
            );

            console.log(
                "CONTENT TYPE:",
                response.headers.get(
                    "content-type"
                )
            );


            // =================================================
            // READ RESPONSE AS TEXT
            // =================================================
            //
            // We read text first so JSON.parse errors
            // cannot hide the actual backend response.
            //
            // =================================================

            const responseText =
                await response.text();


            console.log(
                "RAW SERVER RESPONSE:",
                responseText
            );


            // =================================================
            // PARSE JSON
            // =================================================

            let data = null;


            if (responseText) {

                try {

                    data =
                        JSON.parse(
                            responseText
                        );

                } catch (jsonError) {

                    console.error(
                        "JSON PARSE ERROR:",
                        jsonError
                    );


                    throw new Error(
                        response.ok
                            ? "Server returned an invalid response."
                            : `Server returned HTTP ${response.status}: ${responseText}`
                    );
                }
            }


            // =================================================
            // HTTP ERROR
            // =================================================

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    `Login failed. HTTP ${response.status}.`
                );
            }


            // =================================================
            // EMPTY RESPONSE
            // =================================================

            if (!data) {

                throw new Error(
                    "Login succeeded but the server returned an empty response."
                );
            }


            // =================================================
            // LOG LOGIN RESPONSE
            // =================================================

            console.log(
                "LOGIN RESPONSE:",
                data
            );


            // =================================================
            // TOKEN
            // =================================================

            if (data?.token) {

                localStorage.setItem(
                    "token",
                    data.token
                );
            }


            // =================================================
            // REFRESH TOKEN
            // =================================================

            if (data?.refreshToken) {

                localStorage.setItem(
                    "refreshToken",
                    data.refreshToken
                );
            }


            // =================================================
            // USER
            // =================================================

            if (data?.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        data.user
                    )
                );
            }


            // =================================================
            // COMPLETE LOGIN RESPONSE
            // =================================================

            localStorage.setItem(
                "loginResponse",
                JSON.stringify(data)
            );


            // =================================================
            // AUTHENTICATION FLAG
            // =================================================

            localStorage.setItem(
                "isAuthenticated",
                "true"
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
            // SUCCESS
            // =================================================

            console.log(
                "LOGIN SUCCESSFUL"
            );


            console.log(
                "REDIRECTING TO DASHBOARD"
            );


            // =================================================
            // REDIRECT
            // =================================================

            navigate(
                "/dashboard",
                {
                    replace: true
                }
            );


        } catch (err) {

            console.error(
                "=========================================="
            );

            console.error(
                "LOGIN ERROR:",
                err
            );

            console.error(
                "=========================================="
            );


            setError(
                err?.message ||
                "Unable to connect to server. Please try again."
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
                            sx={{
                                mb: 2
                            }}
                            onClose={() =>
                                setError("")
                            }
                        >
                            {error}
                        </Alert>

                    )}


                    {/* =================================================
                        LOGIN FORM
                    ================================================= */}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        {/* =================================================
                            USERNAME
                        ================================================= */}

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Username"
                            name="userName"
                            value={
                                formData.userName
                            }
                            onChange={
                                handleChange
                            }
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
                            value={
                                formData.password
                            }
                            onChange={
                                handleChange
                            }
                            required
                            autoComplete="current-password"

                            InputProps={{
                                endAdornment: (

                                    <InputAdornment
                                        position="end"
                                    >

                                        <IconButton
                                            type="button"
                                            edge="end"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
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
                            REMEMBER ME + FORGOT PASSWORD
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
                            sx={{
                                mt: 3
                            }}
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

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};


export default Login;
