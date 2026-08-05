import React from "react";

import {
    Box,
    Container,
    Paper,
    Typography
} from "@mui/material";

import {
    Storefront
} from "@mui/icons-material";

import "./AuthManagement.css";

const AuthLayout = ({

    title = "Seller Portal",

    subtitle = "",

    children,

    maxWidth = "sm"

}) => {

    return (

        <Box className="auth-layout">

            {/* Background Overlay */}

            <Box className="auth-overlay">

                <Container
                    maxWidth={maxWidth}
                >

                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="100vh"
                    >

                        <Paper
                            elevation={8}
                            className="auth-paper"
                        >

                            {/* Header */}

                            <Box
                                textAlign="center"
                                mb={4}
                            >

                                <Storefront
                                    color="primary"
                                    sx={{
                                        fontSize: 70,
                                        mb: 1
                                    }}
                                />

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    gutterBottom
                                >

                                    {title}

                                </Typography>

                                {

                                    subtitle &&

                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                    >

                                        {subtitle}

                                    </Typography>

                                }

                            </Box>

                            {/* Body */}

                            {children}

                            {/* Footer */}

                            <Box
                                mt={5}
                                pt={3}
                                borderTop="1px solid #e0e0e0"
                                textAlign="center"
                            >

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >

                                    © {new Date().getFullYear()} Seller Portal

                                </Typography>

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    mt={1}
                                >

                                    Secure Authentication System

                                </Typography>

                            </Box>

                        </Paper>

                    </Box>

                </Container>

            </Box>

        </Box>

    );

};

export default AuthLayout;