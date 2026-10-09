// ReversePickupAddressCreate.jsx

import React, { useState } from "react";
import axios from "axios";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Breadcrumbs,
    Link,
    Alert,
    Snackbar,
    CircularProgress,
    Divider
} from "@mui/material";

import {
    ArrowBack,
    Save,
    RestartAlt,
    LocationOn
} from "@mui/icons-material";

import ReversePickupAddressForm from "./ReversePickupAddressForm";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    process.env.REACT_APP_API_URL || ""
).replace(/\/+$/, "");

const DEFAULT_ENDPOINT = `${API_BASE_URL}/api/ReversePickupAddress`;

/* =========================================================
   REVERSE PICKUP ADDRESS CREATE
========================================================= */

const ReversePickupAddressCreate = ({
    endpoint = DEFAULT_ENDPOINT,
    onSuccess,
    onCancel,
    onCreated,
    navigateBack,
    title = "Create Reverse Pickup Address",
    showBreadcrumbs = true,
    showHeader = true,
    showCard = true,
    initialValues = {},
    addressTypes = [
        { value: "Home", label: "Home" },
        { value: "Office", label: "Office" },
        { value: "Warehouse", label: "Warehouse" },
        { value: "Other", label: "Other" }
    ],
    countries = [
        { value: "India", label: "India" }
    ]
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [createdAddress, setCreatedAddress] = useState(null);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [formResetKey, setFormResetKey] = useState(0);

    /* =====================================================
       API ERROR HANDLER
    ===================================================== */

    const getApiErrorMessage = (err) => {
        const data = err?.response?.data;

        if (typeof data === "string" && data.trim()) {
            return data;
        }

        if (data?.message) {
            return data.message;
        }

        if (data?.title) {
            return data.title;
        }

        if (data?.errors && typeof data.errors === "object") {
            return Object.values(data.errors)
                .flat()
                .filter(Boolean)
                .join(" ");
        }

        if (err?.response?.status === 400) {
            return "Invalid address information. Please check the form.";
        }

        if (err?.response?.status === 401) {
            return "You are not authorized to create this address.";
        }

        if (err?.response?.status === 403) {
            return "You do not have permission to create this address.";
        }

        if (err?.response?.status === 404) {
            return "The reverse pickup address API endpoint was not found.";
        }

        if (err?.response?.status === 409) {
            return "This address conflicts with an existing record.";
        }

        if (err?.response?.status >= 500) {
            return "A server error occurred while creating the address.";
        }

        if (err?.request && !err?.response) {
            return "Unable to connect to the server. Please check your API URL and network connection.";
        }

        return err?.message || "Failed to create reverse pickup address.";
    };

    /* =====================================================
       CREATE ADDRESS
    ===================================================== */

    const handleCreate = async (formData) => {
        if (loading) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post(
                endpoint,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                }
            );

            const responseData = response?.data ?? null;

            setCreatedAddress(responseData);
            setSuccess(
                responseData?.message ||
                "Reverse pickup address created successfully."
            );
            setNotificationOpen(true);

            if (typeof onSuccess === "function") {
                onSuccess(responseData);
            }

            if (typeof onCreated === "function") {
                onCreated(responseData);
            }
        } catch (err) {
            console.error(
                "CREATE REVERSE PICKUP ADDRESS ERROR:",
                err
            );

            setError(getApiErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setError("");
        setSuccess("");
        setCreatedAddress(null);
        setFormResetKey((previous) => previous + 1);
    };

    /* =====================================================
       CANCEL / BACK
    ===================================================== */

    const handleCancel = () => {
        if (typeof onCancel === "function") {
            onCancel();
            return;
        }

        if (typeof navigateBack === "function") {
            navigateBack();
            return;
        }

        if (typeof window !== "undefined") {
            window.history.back();
        }
    };

    /* =====================================================
       FORM CONTENT
    ===================================================== */

    const formContent = (
        <Box>
            {error && (
                <Alert
                    severity="error"
                    onClose={() => setError("")}
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                >
                    {success}
                </Alert>
            )}

            <ReversePickupAddressForm
                key={formResetKey}
                mode="create"
                initialValues={initialValues}
                onSubmit={handleCreate}
                onCancel={handleCancel}
                onReset={handleReset}
                loading={loading}
                submitting={loading}
                error={error}
                success={success}
                addressTypes={addressTypes}
                countries={countries}
                submitLabel="Create Address"
                showActions={true}
                showCancelButton={true}
                disabled={loading}
            />
        </Box>
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", p: { xs: 1, sm: 2, md: 3 } }}>
            {/* BREADCRUMBS */}

            {showBreadcrumbs && (
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link
                        component="button"
                        underline="hover"
                        color="inherit"
                        onClick={handleCancel}
                        sx={{ cursor: "pointer" }}
                    >
                        Reverse Pickup Addresses
                    </Link>

                    <Typography color="text.primary">
                        Create Address
                    </Typography>
                </Breadcrumbs>
            )}

            {/* HEADER */}

            {showHeader && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        mb: 3
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "primary.main",
                                color: "primary.contrastText"
                            }}
                        >
                            <LocationOn />
                        </Box>

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                {title}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                Enter the contact and location details
                                for the reverse pickup address.
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Back
                    </Button>
                </Box>
            )}

            {/* FORM */}

            {showCard ? (
                <Card
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        overflow: "visible"
                    }}
                >
                    <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                        >
                            Address Information
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Provide the required information below.
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        {formContent}
                    </CardContent>
                </Card>
            ) : (
                formContent
            )}

            {/* LOADING INDICATOR */}

            {loading && (
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 2 }}
                >
                    <CircularProgress size={20} />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Creating reverse pickup address...
                    </Typography>
                </Stack>
            )}

            {/* SUCCESS NOTIFICATION */}

            <Snackbar
                open={notificationOpen}
                autoHideDuration={5000}
                onClose={() => setNotificationOpen(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setNotificationOpen(false)}
                >
                    {success || "Address created successfully."}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReversePickupAddressCreate;

