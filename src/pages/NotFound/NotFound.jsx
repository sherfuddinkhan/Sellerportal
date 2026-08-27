// =========================================================
// NotFound.jsx
// =========================================================

import React from "react";

import {
    Box,
    Button,
    Container,
    Paper,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Dashboard,
    Home,
    SearchOff,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =========================================================
// COMPONENT
// =========================================================

const NotFound = () => {
    const navigate = useNavigate();

    // =========================================================
    // GO BACK
    // =========================================================

    const handleGoBack = () => {
        navigate(-1);
    };

    // =========================================================
    // GO HOME
    // =========================================================

    const handleGoHome = () => {
        navigate("/");
    };

    // =========================================================
    // GO DASHBOARD
    // =========================================================

    const handleDashboard = () => {
        navigate("/dashboard");
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                px: 2,
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        p: {
                            xs: 3,
                            sm: 5,
                        },
                        textAlign: "center",
                        borderRadius: 3,
                    }}
                >
                    {/* =================================================
                        ICON
                       ================================================= */}

                    <Box
                        sx={{
                            width: 100,
                            height: 100,
                            mx: "auto",
                            mb: 3,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "action.hover",
                        }}
                    >
                        <SearchOff
                            sx={{
                                fontSize: 55,
                                color: "text.secondary",
                            }}
                        />
                    </Box>

                    {/* =================================================
                        404
                       ================================================= */}

                    <Typography
                        variant="h1"
                        fontWeight="bold"
                        sx={{
                            fontSize: {
                                xs: "4rem",
                                sm: "6rem",
                            },
                            lineHeight: 1,
                            mb: 1,
                        }}
                    >
                        404
                    </Typography>

                    {/* =================================================
                        TITLE
                       ================================================= */}

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                    >
                        Page Not Found
                    </Typography>

                    {/* =================================================
                        DESCRIPTION
                       ================================================= */}

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            maxWidth: 450,
                            mx: "auto",
                            mb: 4,
                        }}
                    >
                        The page you are looking for
                        doesn't exist, has been moved,
                        or the URL may be incorrect.
                    </Typography>

                    {/* =================================================
                        ACTION BUTTONS
                       ================================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1.5,
                            flexWrap: "wrap",
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleGoBack}
                        >
                            Go Back
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<Home />}
                            onClick={handleGoHome}
                        >
                            Home
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Dashboard />}
                            onClick={
                                handleDashboard
                            }
                        >
                            Dashboard
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default NotFound;