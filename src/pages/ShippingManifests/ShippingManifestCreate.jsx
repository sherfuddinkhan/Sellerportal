// ShippingManifestCreate.jsx

import React, { useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Snackbar,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    LocalShipping,
    Refresh,
    Save
} from "@mui/icons-material";

import ShippingManifestForm from "./ShippingManifestForm";

/* =========================================================
   API CONFIGURATION
========================================================= */

const DEFAULT_API_URL = "/api/ShippingManifest";

/* =========================================================
   RESPONSE HELPERS
========================================================= */

const extractManifest = (response) => {
    const payload = response?.data;

    if (!payload) {
        return null;
    }

    return (
        payload.data ??
        payload.Data ??
        payload.manifest ??
        payload.Manifest ??
        payload.result ??
        payload.Result ??
        payload
    );
};

const extractErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    return (
        responseData?.message ??
        responseData?.Message ??
        responseData?.error ??
        responseData?.title ??
        error?.message ??
        "Failed to create shipping manifest."
    );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ShippingManifestCreate = ({
    apiUrl = DEFAULT_API_URL,
    onCreated,
    onCancel,
    onSuccess,
    embedded = false,
    title = "Create Shipping Manifest",
    subtitle = "Enter shipment, carrier, and delivery information."
}) => {
    const [loading, setLoading] = useState(false);
    const [createdManifest, setCreatedManifest] = useState(null);

    const [notification, setNotification] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const showNotification = (
        message,
        severity = "success"
    ) => {
        setNotification({
            open: true,
            severity,
            message
        });
    };

    const handleNotificationClose = (_, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    /* =====================================================
       CREATE SHIPPING MANIFEST
    ===================================================== */

    const handleCreate = async (formData) => {
        if (loading) {
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ...formData
            };

            const response = await axios.post(
                apiUrl,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const manifest = extractManifest(response);

            setCreatedManifest(manifest);

            showNotification(
                "Shipping manifest created successfully.",
                "success"
            );

            if (typeof onCreated === "function") {
                onCreated(manifest, response);
            }

            if (typeof onSuccess === "function") {
                onSuccess(manifest, response);
            }

            return manifest;
        } catch (error) {
            console.error(
                "CREATE SHIPPING MANIFEST ERROR:",
                error
            );

            showNotification(
                extractErrorMessage(error),
                "error"
            );

            throw error;
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setCreatedManifest(null);

        showNotification(
            "Form reset. Enter the new shipment details.",
            "info"
        );
    };

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        if (loading) {
            return;
        }

        if (typeof onCancel === "function") {
            onCancel();
        }
    };

    /* =====================================================
       SUCCESS VIEW
    ===================================================== */

    if (createdManifest) {
        const manifestNumber =
            createdManifest.manifestNumber ??
            createdManifest.ManifestNumber ??
            createdManifest.shippingManifestNumber ??
            createdManifest.ShippingManifestNumber ??
            "Created successfully";

        return (
            <Box>
                <Paper
                    elevation={embedded ? 0 : 2}
                    sx={{
                        p: { xs: 2, sm: 4 },
                        borderRadius: 3,
                        textAlign: "center"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 2
                        }}
                    >
                        <LocalShipping
                            color="success"
                            sx={{ fontSize: 56 }}
                        />
                    </Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        Shipping Manifest Created
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                    >
                        The shipping manifest has been created
                        successfully.
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 3 }}
                    >
                        Manifest: {manifestNumber}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={() => {
                                setCreatedManifest(null);
                                handleReset();
                            }}
                        >
                            Create Another
                        </Button>

                        {onCancel && (
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={handleCancel}
                            >
                                Back to List
                            </Button>
                        )}
                    </Box>
                </Paper>

                <Snackbar
                    open={notification.open}
                    autoHideDuration={5000}
                    onClose={handleNotificationClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right"
                    }}
                >
                    <Alert
                        severity={notification.severity}
                        onClose={handleNotificationClose}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Box>
        );
    }

    /* =====================================================
       CREATE FORM
    ===================================================== */

    return (
        <Box>
            <Paper
                elevation={embedded ? 0 : 2}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3
                }}
            >
                {/* HEADER */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: "primary.light",
                                color: "primary.contrastText"
                            }}
                        >
                            <LocalShipping fontSize="large" />
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
                            >
                                {subtitle}
                            </Typography>
                        </Box>
                    </Box>

                    {onCancel && (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Back
                        </Button>
                    )}
                </Box>

                {/* FORM */}

                <ShippingManifestForm
                    mode="create"
                    title=""
                    onSubmit={handleCreate}
                    onCancel={onCancel ? handleCancel : undefined}
                    onReset={handleReset}
                    loading={loading}
                    saving={loading}
                    submitLabel="Create Manifest"
                    showReset={true}
                    showCancel={Boolean(onCancel)}
                />

                {/* LOADING OVERLAY */}

                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            mt: 2
                        }}
                    >
                        <CircularProgress size={20} />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Creating shipping manifest...
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* NOTIFICATION */}

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleNotificationClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={notification.severity}
                    onClose={handleNotificationClose}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ShippingManifestCreate;

