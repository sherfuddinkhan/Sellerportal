
import React, { useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Divider,
    CircularProgress,
    Alert,
    Stack
} from "@mui/material";

import {
    Save,
    ArrowBack,
    RestartAlt,
    Inventory2,
    Add
} from "@mui/icons-material";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    manifestId: "",
    packageId: "",
    putawayLocation: "",
    quantity: "",
    status: "Pending"
};

/* =========================================================
   DEFAULT STATUS OPTIONS
========================================================= */

const DEFAULT_STATUS_OPTIONS = [
    "Pending",
    "In Progress",
    "Completed",
    "Cancelled"
];

/* =========================================================
   MANIFEST PACKAGES PUTAWAY CREATE
========================================================= */

const ManifestPackagesPutawayCreate = ({
    onSubmit,
    onCancel,
    loading = false,
    error = "",
    successMessage = "",
    statusOptions = DEFAULT_STATUS_OPTIONS,
    title = "Create Manifest Package Putaway"
}) => {

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setValidationErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setSubmitError("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const errors = {};

        if (
            formData.manifestId === "" ||
            !Number.isInteger(Number(formData.manifestId)) ||
            Number(formData.manifestId) <= 0
        ) {
            errors.manifestId =
                "Enter a valid positive Manifest ID";
        }

        if (
            formData.packageId === "" ||
            !Number.isInteger(Number(formData.packageId)) ||
            Number(formData.packageId) <= 0
        ) {
            errors.packageId =
                "Enter a valid positive Package ID";
        }

        if (!String(formData.putawayLocation || "").trim()) {
            errors.putawayLocation =
                "Putaway location is required";
        }

        if (
            formData.quantity === "" ||
            !Number.isFinite(Number(formData.quantity)) ||
            Number(formData.quantity) <= 0
        ) {
            errors.quantity =
                "Quantity must be greater than zero";
        }

        if (
            !formData.status ||
            !statusOptions.includes(formData.status)
        ) {
            errors.status = "Select a valid putaway status";
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       HANDLE FORM SUBMISSION
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitError("");

        if (!validateForm()) {
            return;
        }

        if (typeof onSubmit !== "function") {
            setSubmitError(
                "The onSubmit handler has not been configured."
            );
            return;
        }

        const payload = {
            manifestId: Number(formData.manifestId),
            packageId: Number(formData.packageId),
            putawayLocation: formData.putawayLocation.trim(),
            quantity: Number(formData.quantity),
            status: formData.status
        };

        try {
            await onSubmit(payload);
        } catch (err) {
            setSubmitError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.message ||
                "Failed to create putaway record."
            );
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setFormData({
            ...initialFormData
        });

        setValidationErrors({});
        setSubmitError("");
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
                width: "100%"
            }}
        >
            {/* HEADER */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            borderRadius: 2,
                            p: 1.5
                        }}
                    >
                        <Inventory2 />
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
                            Enter the details to create a putaway record.
                        </Typography>
                    </Box>
                </Stack>

                {typeof onCancel === "function" && (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Back
                    </Button>
                )}
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* ERROR AND SUCCESS MESSAGES */}

            {(error || submitError) && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setSubmitError("")}
                >
                    {submitError || error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {successMessage}
                </Alert>
            )}

            {/* CREATE FORM */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <Grid container spacing={3}>

                    {/* MANIFEST ID */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Manifest ID"
                            name="manifestId"
                            value={formData.manifestId}
                            onChange={handleChange}
                            error={Boolean(
                                validationErrors.manifestId
                            )}
                            helperText={
                                validationErrors.manifestId
                            }
                            disabled={loading}
                            inputProps={{ min: 1, step: 1 }}
                        />
                    </Grid>

                    {/* PACKAGE ID */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Package ID"
                            name="packageId"
                            value={formData.packageId}
                            onChange={handleChange}
                            error={Boolean(
                                validationErrors.packageId
                            )}
                            helperText={
                                validationErrors.packageId
                            }
                            disabled={loading}
                            inputProps={{ min: 1, step: 1 }}
                        />
                    </Grid>

                    {/* PUTAWAY LOCATION */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Putaway Location"
                            name="putawayLocation"
                            value={formData.putawayLocation}
                            onChange={handleChange}
                            placeholder="Enter bin or storage location"
                            error={Boolean(
                                validationErrors.putawayLocation
                            )}
                            helperText={
                                validationErrors.putawayLocation
                            }
                            disabled={loading}
                        />
                    </Grid>

                    {/* QUANTITY */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            error={Boolean(
                                validationErrors.quantity
                            )}
                            helperText={
                                validationErrors.quantity
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0.01,
                                step: "any"
                            }}
                        />
                    </Grid>

                    {/* STATUS */}

                    <Grid item xs={12}>
                        <TextField
                            select
                            fullWidth
                            required
                            label="Putaway Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            error={Boolean(
                                validationErrors.status
                            )}
                            helperText={
                                validationErrors.status
                            }
                            disabled={loading}
                        >
                            {statusOptions.map((status) => (
                                <MenuItem
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* FORM ACTIONS */}

                <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    justifyContent="flex-end"
                    spacing={2}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </Button>

                    {typeof onCancel === "function" && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <Add />
                            )
                        }
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Putaway"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default ManifestPackagesPutawayCreate;

