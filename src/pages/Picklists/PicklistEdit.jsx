import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    Refresh
} from "@mui/icons-material";

import PicklistForm from "./PicklistForm";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const PICKLIST_API_URL = `${API_BASE_URL}/api/Picklist`;

/* =========================================================
   HELPERS
========================================================= */

const getField = (object, fields, fallback = null) => {
    if (!object || typeof object !== "object") {
        return fallback;
    }

    for (const field of fields) {
        if (
            object[field] !== undefined &&
            object[field] !== null
        ) {
            return object[field];
        }
    }

    return fallback;
};

const getPicklistId = (picklist) =>
    getField(picklist, [
        "picklistId",
        "PicklistId",
        "pickListId",
        "PickListId",
        "id",
        "Id"
    ]);

const extractPicklist = (responseData) => {
    if (Array.isArray(responseData)) {
        return null;
    }

    if (!responseData || typeof responseData !== "object") {
        return null;
    }

    // Supports common API response wrappers.
    const wrappedData = getField(responseData, [
        "data",
        "Data",
        "result",
        "Result",
        "picklist",
        "Picklist"
    ]);

    if (wrappedData && typeof wrappedData === "object") {
        if (Array.isArray(wrappedData)) {
            return null;
        }

        return wrappedData;
    }

    return responseData;
};

const getErrorMessage = (error, fallback) => {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    return (
        getField(responseData, [
            "message",
            "Message",
            "title",
            "Title",
            "error",
            "Error"
        ], null) ||
        error?.message ||
        fallback
    );
};

/* =========================================================
   PICKLIST EDIT
========================================================= */

const PicklistEdit = ({
    picklistId: suppliedPicklistId,
    apiUrl = PICKLIST_API_URL,

    orders = [],
    warehouses = [],
    products = [],
    statuses,

    onCancel,
    onUpdated,

    redirectAfterUpdate = true
}) => {
    const navigate = useNavigate();
    const params = useParams();

    const picklistId =
        suppliedPicklistId ??
        params.picklistId ??
        params.id;

    const [picklist, setPicklist] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    /* =====================================================
       LOAD PICKLIST
    ===================================================== */

    const fetchPicklist = useCallback(async (signal) => {
        if (
            picklistId === undefined ||
            picklistId === null ||
            String(picklistId).trim() === ""
        ) {
            setError("Picklist ID is required.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${apiUrl}/${encodeURIComponent(picklistId)}`,
                { signal }
            );

            const result = extractPicklist(response.data);

            if (!result) {
                setPicklist(null);
                setError("Picklist was not found.");
                return;
            }

            const responseId = getPicklistId(result);

            if (
                responseId !== null &&
                String(responseId) !== String(picklistId)
            ) {
                setPicklist(null);
                setError(
                    "The API returned a picklist that does not match the requested ID."
                );
                return;
            }

            setPicklist(result);
        } catch (requestError) {
            if (
                requestError?.name === "CanceledError" ||
                requestError?.code === "ERR_CANCELED"
            ) {
                return;
            }

            setPicklist(null);

            setError(
                requestError?.response?.status === 404
                    ? "Picklist not found."
                    : getErrorMessage(
                        requestError,
                        "Failed to load picklist details."
                    )
            );
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    }, [apiUrl, picklistId]);

    useEffect(() => {
        const controller = new AbortController();

        fetchPicklist(controller.signal);

        return () => controller.abort();
    }, [fetchPicklist]);

    /* =====================================================
       UPDATE PICKLIST
    ===================================================== */

    const handleUpdate = async (payload) => {
        if (
            picklistId === undefined ||
            picklistId === null ||
            String(picklistId).trim() === ""
        ) {
            setError("Cannot update without a picklist ID.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const response = await axios.put(
                `${apiUrl}/${encodeURIComponent(picklistId)}`,
                payload
            );

            const updatedPicklist =
                extractPicklist(response.data) || {
                    ...picklist,
                    ...payload
                };

            setPicklist(updatedPicklist);

            setSuccessMessage("Picklist updated successfully.");
            setSnackbarOpen(true);

            if (typeof onUpdated === "function") {
                await onUpdated(updatedPicklist);
            }

            if (redirectAfterUpdate) {
                navigate("/picklists");
            }
        } catch (requestError) {
            const message = getErrorMessage(
                requestError,
                "Failed to update picklist."
            );

            setError(message);

            // Let PicklistForm display the error.
            throw new Error(message);
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const handleCancel = () => {
        if (typeof onCancel === "function") {
            onCancel();
            return;
        }

        navigate("/picklists");
    };

    const handleRetry = () => {
        const controller = new AbortController();

        fetchPicklist(controller.signal);
    };

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading picklist details...
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       ERROR / NOT FOUND STATE
    ===================================================== */

    if (!picklist) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 4 },
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error || "Picklist details are unavailable."}
                </Alert>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleCancel}
                    >
                        Back to Picklists
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={handleRetry}
                    >
                        Retry
                    </Button>
                </Box>
            </Paper>
        );
    }

    /* =====================================================
       MAIN RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", pb: 3 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 },
                    mb: 3,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        justifyContent: "space-between",
                        gap: 2
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Edit Picklist
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Update picklist details and save your changes.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Back
                    </Button>
                </Box>
            </Paper>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <PicklistForm
                mode="edit"
                picklist={picklist}
                orders={orders}
                warehouses={warehouses}
                products={products}
                statuses={statuses}
                loading={saving}
                onCancel={handleCancel}
                onSubmit={handleUpdate}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                message={successMessage}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            />
        </Box>
    );
};

export default PicklistEdit;

