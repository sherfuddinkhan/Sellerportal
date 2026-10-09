import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
    Stack
} from "@mui/material";

import {
    Edit,
    ArrowBack,
    Refresh
} from "@mui/icons-material";

import ShippingManifestForm from "./ShippingManifestForm";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL = "/api/ShippingManifest";

/* =========================================================
   RESPONSE HELPERS
========================================================= */

const extractManifest = (responseData) => {
    if (!responseData) return null;

    if (Array.isArray(responseData)) {
        return null;
    }

    if (responseData.data && !Array.isArray(responseData.data)) {
        return responseData.data;
    }

    if (responseData.Data && !Array.isArray(responseData.Data)) {
        return responseData.Data;
    }

    if (responseData.manifest) {
        return responseData.manifest;
    }

    if (responseData.Manifest) {
        return responseData.Manifest;
    }

    if (responseData.result && !Array.isArray(responseData.result)) {
        return responseData.result;
    }

    if (responseData.Result && !Array.isArray(responseData.Result)) {
        return responseData.Result;
    }

    return responseData;
};

const getManifestId = (manifest) =>
    manifest?.shippingManifestId ??
    manifest?.ShippingManifestId ??
    manifest?.manifestId ??
    manifest?.ManifestId ??
    manifest?.id ??
    manifest?.Id ??
    manifest?.shippingManifestID ??
    manifest?.ShippingManifestID ??
    null;

/* =========================================================
   COMPONENT
========================================================= */

const ShippingManifestEdit = ({
    id,
    manifestId,
    manifest: initialManifest = null,
    onUpdated,
    onCancel,
    apiUrl = API_URL,
    embedded = false
}) => {
    const requestedId = id ?? manifestId ?? getManifestId(initialManifest);

    const [manifest, setManifest] = useState(initialManifest);
    const [loading, setLoading] = useState(!initialManifest);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const showNotice = (message, severity = "success") => {
        setNotice({
            open: true,
            message,
            severity
        });
    };

    const closeNotice = () => {
        setNotice((previous) => ({
            ...previous,
            open: false
        }));
    };

    /* =====================================================
       FETCH MANIFEST
    ===================================================== */

    const fetchManifest = async () => {
        if (requestedId === null || requestedId === undefined || requestedId === "") {
            setError("A valid shipping manifest ID is required.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${apiUrl}/${encodeURIComponent(requestedId)}`
            );

            const result = extractManifest(response.data);

            if (!result || typeof result !== "object") {
                throw new Error("Shipping manifest was not found.");
            }

            setManifest(result);
        } catch (err) {
            console.error(
                "GET SHIPPING MANIFEST ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load shipping manifest."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialManifest) {
            setManifest(initialManifest);
            setLoading(false);
            setError("");
            return;
        }

        fetchManifest();

        // Fetch again when the requested ID or endpoint changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestedId, apiUrl, initialManifest]);

    /* =====================================================
       UPDATE MANIFEST
    ===================================================== */

    const handleUpdate = async (formData) => {
        const currentId = getManifestId(manifest) ?? requestedId;

        if (
            currentId === null ||
            currentId === undefined ||
            currentId === ""
        ) {
            showNotice(
                "Cannot update: shipping manifest ID is missing.",
                "error"
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                ...manifest,
                ...formData
            };

            const response = await axios.put(
                `${apiUrl}/${encodeURIComponent(currentId)}`,
                payload
            );

            const updatedManifest =
                response.data && typeof response.data === "object"
                    ? extractManifest(response.data)
                    : null;

            const result = updatedManifest
                ? { ...payload, ...updatedManifest }
                : payload;

            setManifest(result);

            showNotice(
                "Shipping manifest updated successfully.",
                "success"
            );

            if (typeof onUpdated === "function") {
                onUpdated(result);
            }
        } catch (err) {
            console.error(
                "UPDATE SHIPPING MANIFEST ERROR:",
                err.response?.data || err.message
            );

            const message =
                err.response?.data?.message ||
                err.response?.data?.Message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to update shipping manifest.";

            setError(message);

            showNotice(message, "error");
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading shipping manifest...
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error && !manifest) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={fetchManifest}
                    >
                        Retry
                    </Button>

                    {onCancel && (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={onCancel}
                        >
                            Back
                        </Button>
                    )}
                </Stack>
            </Paper>
        );
    }

    /* =====================================================
       MAIN RENDER
    ===================================================== */

    const content = (
        <>
            {!embedded && (
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
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Edit color="primary" />

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Edit Shipping Manifest
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Update shipment and delivery details.
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={fetchManifest}
                            disabled={saving}
                        >
                            Refresh
                        </Button>

                        {onCancel && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<ArrowBack />}
                                onClick={onCancel}
                                disabled={saving}
                            >
                                Back
                            </Button>
                        )}
                    </Stack>
                </Box>
            )}

            {error && manifest && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <ShippingManifestForm
                key={String(getManifestId(manifest) ?? requestedId)}
                manifest={manifest}
                mode="edit"
                loading={false}
                saving={saving}
                onSubmit={handleUpdate}
                onCancel={onCancel}
                submitLabel="Update Manifest"
                showReset
            />

            <Snackbar
                open={notice.open}
                autoHideDuration={5000}
                onClose={closeNotice}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={closeNotice}
                    severity={notice.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notice.message}
                </Alert>
            </Snackbar>
        </>
    );

    if (embedded) {
        return content;
    }

    return (
        <Box
            sx={{
                width: "100%",
                p: { xs: 1, sm: 2, md: 3 }
            }}
        >
            {content}
        </Box>
    );
};

export default ShippingManifestEdit;

