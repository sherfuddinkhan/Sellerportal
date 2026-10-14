
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save,
    Inventory2,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   NODE.JS PROXY API
========================================================= */

const PICKLIST_API = "http://localhost:5000/api/Picklist";

/* =========================================================
   INITIAL FORM
========================================================= */

const createInitialForm = () => ({
    picklistCode: "",
    destination: "BENGALURU",
    shippingPackageCodes: "",
    sellerId: "6",
    customerId: "3"
});

/* =========================================================
   PICKLIST CREATE
========================================================= */

const PicklistCreate = ({
    apiUrl = PICKLIST_API,
    onCancel,
    onCreated,
    redirectAfterCreate = true
}) => {
    const navigate = useNavigate();

    const [form, setForm] = useState(createInitialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* =====================================================
       HANDLE FIELD CHANGE
    ===================================================== */

    const handleChange = (field, value) => {
        setForm((previous) => ({
            ...previous,
            [field]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: ""
        }));

        setError("");
        setSuccess("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const nextErrors = {};

        if (!form.picklistCode.trim()) {
            nextErrors.picklistCode = "Picklist code is required.";
        } else if (form.picklistCode.trim().length > 50) {
            nextErrors.picklistCode =
                "Picklist code cannot exceed 50 characters.";
        }

        if (!form.destination.trim()) {
            nextErrors.destination = "Destination is required.";
        } else if (form.destination.trim().length > 20) {
            nextErrors.destination =
                "Destination cannot exceed 20 characters.";
        }

        if (!form.shippingPackageCodes.trim()) {
            nextErrors.shippingPackageCodes =
                "Enter at least one shipping package code.";
        }

        const sellerId = Number(form.sellerId);
        const customerId = Number(form.customerId);

        if (!Number.isInteger(sellerId) || sellerId <= 0) {
            nextErrors.sellerId = "Enter a valid Seller ID.";
        }

        if (!Number.isInteger(customerId) || customerId <= 0) {
            nextErrors.customerId = "Enter a valid Customer ID.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    /* =====================================================
       BUILD SHIPPING PACKAGE STRING
       Example input: SP-20, SP-21
       API value: ["SP-20","SP-21"] as a JSON string
    ===================================================== */

    const buildShippingPackageCodes = () => {
        const codes = form.shippingPackageCodes
            .split(/[\n,]+/)
            .map((code) => code.trim())
            .filter(Boolean);

        return JSON.stringify([...new Set(codes)]);
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setForm(createInitialForm());
        setErrors({});
        setError("");
        setSuccess("");
    };

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        if (typeof onCancel === "function") {
            onCancel();
            return;
        }

        navigate("/picklists");
    };

    /* =====================================================
       SUBMIT PICKLIST
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (submitting || !validateForm()) {
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");

        const payload = {
            picklistCode: form.picklistCode.trim(),
            destination: form.destination.trim(),
            shippingPackageCodes: buildShippingPackageCodes(),
            sellerId: Number(form.sellerId),
            customerId: Number(form.customerId)
        };

        try {
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                timeout: 15000
            });

            const responseData = response.data;
            const createdPicklist =
                responseData?.data ??
                responseData?.result ??
                responseData ??
                payload;

            setSuccess("Picklist created successfully.");

            if (typeof onCreated === "function") {
                onCreated(createdPicklist);
            }

            if (redirectAfterCreate) {
                navigate(
                    `/picklists/view/${encodeURIComponent(
                        payload.picklistCode
                    )}`
                );
            }
        } catch (err) {
            console.error("CREATE PICKLIST ERROR:", {
                url: apiUrl,
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });

            const responseData = err.response?.data;

            if (
                err.response?.status === 409 ||
                err.response?.status === 400
            ) {
                setError(
                    responseData?.message ||
                    responseData?.title ||
                    responseData?.error ||
                    "The server rejected the request. Check the picklist code and submitted fields."
                );
            } else if (err.response?.status === 404) {
                setError(
                    "Picklist API returned 404. Check the Node proxy POST /api/Picklist route."
                );
            } else if (!err.response) {
                setError(
                    "Cannot connect to the Node proxy. Ensure your Node server is running on http://localhost:5000."
                );
            } else {
                setError(
                    responseData?.message ||
                    responseData?.title ||
                    responseData?.error ||
                    err.message ||
                    "Failed to create picklist."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: "auto" }}>
            {/* HEADER */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <IconButton
                        onClick={handleCancel}
                        disabled={submitting}
                        aria-label="Go back"
                    >
                        <ArrowBack />
                    </IconButton>

                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Create Picklist
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Create a shipping picklist for a seller and customer.
                        </Typography>
                    </Box>
                </Stack>

                <Button
                    variant="outlined"
                    startIcon={<RestartAlt />}
                    onClick={handleReset}
                    disabled={submitting}
                >
                    Reset Form
                </Button>
            </Stack>

            {/* ALERTS */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {/* FORM */}

            <Box component="form" onSubmit={handleSubmit}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 2 }}
                        >
                            <Inventory2 color="primary" />

                            <Typography variant="h6" fontWeight={700}>
                                Picklist Information
                            </Typography>
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            {/* PICKLIST CODE */}

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Picklist Code"
                                    placeholder="Example: PL-TN-0003"
                                    value={form.picklistCode}
                                    onChange={(event) =>
                                        handleChange(
                                            "picklistCode",
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(errors.picklistCode)}
                                    helperText={
                                        errors.picklistCode ||
                                        "Enter a unique picklist code."
                                    }
                                    inputProps={{ maxLength: 50 }}
                                />
                            </Grid>

                            {/* DESTINATION */}

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Destination"
                                    placeholder="Example: BENGALURU"
                                    value={form.destination}
                                    onChange={(event) =>
                                        handleChange(
                                            "destination",
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(errors.destination)}
                                    helperText={
                                        errors.destination ||
                                        "Enter the destination."
                                    }
                                    inputProps={{ maxLength: 20 }}
                                />
                            </Grid>

                            {/* SELLER ID */}

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Seller ID"
                                    value={form.sellerId}
                                    onChange={(event) =>
                                        handleChange(
                                            "sellerId",
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(errors.sellerId)}
                                    helperText={
                                        errors.sellerId ||
                                        "Seller ID must be a positive integer."
                                    }
                                    inputProps={{ min: 1, step: 1 }}
                                />
                            </Grid>

                            {/* CUSTOMER ID */}

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Customer ID"
                                    value={form.customerId}
                                    onChange={(event) =>
                                        handleChange(
                                            "customerId",
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(errors.customerId)}
                                    helperText={
                                        errors.customerId ||
                                        "Customer ID must be a positive integer."
                                    }
                                    inputProps={{ min: 1, step: 1 }}
                                />
                            </Grid>

                            {/* SHIPPING PACKAGE CODES */}

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    multiline
                                    minRows={3}
                                    label="Shipping Package Codes"
                                    placeholder={"SP-20\nSP-21"}
                                    value={form.shippingPackageCodes}
                                    onChange={(event) =>
                                        handleChange(
                                            "shippingPackageCodes",
                                            event.target.value
                                        )
                                    }
                                    error={Boolean(
                                        errors.shippingPackageCodes
                                    )}
                                    helperText={
                                        errors.shippingPackageCodes ||
                                        "Enter one code per line or separate codes with commas."
                                    }
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* ACTIONS */}

                <Paper
                    variant="outlined"
                    sx={{
                        mt: 3,
                        p: 2,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            submitting
                                ? <CircularProgress size={18} color="inherit" />
                                : <Save />
                        }
                        disabled={submitting}
                    >
                        {submitting ? "Creating..." : "Create Picklist"}
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default PicklistCreate;
