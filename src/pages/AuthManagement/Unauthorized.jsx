import React from "react";

import {Box,Button,Card,CardContent,Typography} from "@mui/material";
import {Block,Home,ArrowBack} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import "./AuthManagement.css";
const Unauthorized = () => {
    const navigate = useNavigate();
    //=========================================
    // Navigation
    //=========================================
    const handleGoHome = () => {
        navigate("/dashboard");
    };

    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <Box className="auth-container">

            <Card
                className="auth-card"
                sx={{
                    maxWidth: 550
                }}
            >

                <CardContent>

                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        textAlign="center"
                        py={4}
                    >

                        <Block
                            color="error"
                            sx={{
                                fontSize: 90,
                                mb: 2
                            }}
                        />

                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            color="error"
                            gutterBottom
                        >

                            403

                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                        >

                            Access Denied

                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                maxWidth: 420,
                                mb: 4
                            }}
                        >

                            You don't have permission to access this page.
                            Please contact your administrator if you believe
                            this is a mistake.

                        </Typography>

                        <Box
                            display="flex"
                            gap={2}
                            flexWrap="wrap"
                            justifyContent="center"
                        >

                            <Button
                                variant="contained"
                                startIcon={<Home />}
                                onClick={handleGoHome}
                            >

                                Dashboard

                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={handleGoBack}
                            >

                                Go Back

                            </Button>

                        </Box>

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );

};

export default Unauthorized;