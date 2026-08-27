// =========================================================
// PaymentSettings.jsx
// =========================================================

import React, { useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Divider,
    Alert,
} from "@mui/material";

import {
    AccountBalance,
    CreditCard,
    Security,
} from "@mui/icons-material";

// =========================================================
// CHILD COMPONENTS
// =========================================================

import PaymentGateway from "./PaymentGateway";
import BankDetails from "./BankDetails";

// =========================================================
// TAB PANEL
// =========================================================

const TabPanel = ({
    children,
    value,
    index,
}) => {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`payment-settings-tabpanel-${index}`}
            aria-labelledby={`payment-settings-tab-${index}`}
            sx={{
                width: "100%",
            }}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </Box>
    );
};

// =========================================================
// ACCESSIBILITY PROPS
// =========================================================

const a11yProps = (index) => ({
    id: `payment-settings-tab-${index}`,
    "aria-controls": `payment-settings-tabpanel-${index}`,
});

// =========================================================
// COMPONENT
// =========================================================

const PaymentSettings = () => {
    // =========================================================
    // STATE
    // =========================================================

    const [tabValue, setTabValue] =
        useState(0);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // =========================================================
    // TAB CHANGE
    // =========================================================

    const handleTabChange = (
        event,
        newValue
    ) => {
        setTabValue(newValue);

        // Clear messages when switching tabs
        setSuccessMessage("");
        setErrorMessage("");
    };

    // =========================================================
    // SUCCESS
    // =========================================================

    const handleSuccess = (message) => {
        setSuccessMessage(
            message ||
                "Payment settings saved successfully."
        );

        setErrorMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================================
    // ERROR
    // =========================================================

    const handleError = (message) => {
        setErrorMessage(
            message ||
                "Unable to save payment settings."
        );

        setSuccessMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 1400,
                mx: "auto",
                p: {
                    xs: 1,
                    sm: 2,
                    md: 3,
                },
            }}
        >
            {/* =====================================================
                PAGE HEADER
               ===================================================== */}

            <Box
                sx={{
                    mb: 3,
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        mb: 0.5,
                    }}
                >
                    Payment Settings
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    Configure payment gateways,
                    bank details, and payment
                    processing options.
                </Typography>
            </Box>

            {/* =====================================================
                GLOBAL SUCCESS MESSAGE
               ===================================================== */}

            {successMessage && (
                <Alert
                    severity="success"
                    onClose={() =>
                        setSuccessMessage("")
                    }
                    sx={{
                        mb: 2,
                    }}
                >
                    {successMessage}
                </Alert>
            )}

            {/* =====================================================
                GLOBAL ERROR MESSAGE
               ===================================================== */}

            {errorMessage && (
                <Alert
                    severity="error"
                    onClose={() =>
                        setErrorMessage("")
                    }
                    sx={{
                        mb: 2,
                    }}
                >
                    {errorMessage}
                </Alert>
            )}

            {/* =====================================================
                SETTINGS CARD
               ===================================================== */}

            <Card
                elevation={2}
                sx={{
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                {/* =================================================
                    TABS HEADER
                   ================================================= */}

                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor:
                            "divider",
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={
                            handleTabChange
                        }
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="Payment settings tabs"
                    >
                        {/* =========================================
                            PAYMENT GATEWAY
                           ========================================= */}

                        <Tab
                            icon={
                                <CreditCard />
                            }
                            iconPosition="start"
                            label="Payment Gateway"
                            {...a11yProps(0)}
                        />

                        {/* =========================================
                            BANK DETAILS
                           ========================================= */}

                        <Tab
                            icon={
                                <AccountBalance />
                            }
                            iconPosition="start"
                            label="Bank Details"
                            {...a11yProps(1)}
                        />

                        {/* =========================================
                            PAYMENT SECURITY
                           ========================================= */}

                        <Tab
                            icon={
                                <Security />
                            }
                            iconPosition="start"
                            label="Payment Security"
                            {...a11yProps(2)}
                        />
                    </Tabs>
                </Box>

                {/* =================================================
                    TAB CONTENT
                   ================================================= */}

                <CardContent
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3,
                        },
                    }}
                >
                    {/* =============================================
                        PAYMENT GATEWAY
                       ============================================= */}

                    <TabPanel
                        value={tabValue}
                        index={0}
                    >
                        <PaymentGateway
                            onSuccess={
                                handleSuccess
                            }
                            onError={
                                handleError
                            }
                        />
                    </TabPanel>

                    {/* =============================================
                        BANK DETAILS
                       ============================================= */}

                    <TabPanel
                        value={tabValue}
                        index={1}
                    >
                        <BankDetails
                            onSuccess={
                                handleSuccess
                            }
                            onError={
                                handleError
                            }
                        />
                    </TabPanel>

                    {/* =============================================
                        PAYMENT SECURITY
                       ============================================= */}

                    <TabPanel
                        value={tabValue}
                        index={2}
                    >
                        <Box
                            sx={{
                                p: 3,
                                border: "1px solid",
                                borderColor:
                                    "divider",
                                borderRadius: 2,
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{
                                    mb: 1,
                                }}
                            >
                                Payment Security
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                }}
                            >
                                Configure security
                                options for payment
                                processing.
                            </Typography>

                            <Alert severity="info">
                                Payment security
                                configuration will be
                                available here.
                            </Alert>
                        </Box>
                    </TabPanel>
                </CardContent>
            </Card>

            {/* =====================================================
                SECURITY INFORMATION
               ===================================================== */}

            <Box
                sx={{
                    mt: 3,
                }}
            >
                <Alert
                    severity="warning"
                    icon={<Security />}
                >
                    Keep your API keys, API secrets,
                    webhook secrets, and banking
                    credentials secure. Do not expose
                    sensitive credentials in frontend
                    code or public repositories.
                </Alert>
            </Box>
        </Box>
    );
};

export default PaymentSettings;