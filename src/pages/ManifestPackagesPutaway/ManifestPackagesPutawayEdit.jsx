
import React, { useEffect, useState } from "react";

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
    Inventory2
} from "@mui/icons-material";

/* =========================================================
   DEFAULT FORM DATA
========================================================= */

const initialFormData = {
    manifestId: "",
    packageId: "",
    putawayLocation: "",
    quantity: "",
    status: "Pending"
};

/* =========================================================
   STATUS OPTIONS
========================================================= */

const DEFAULT_STATUS_OPTIONS = [
    "Pending",
    "In Progress",
    "Completed",
    "Cancelled"
];

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...keys) => {
    for (const key of keys) {
        if (
            record &&
            record[key] !== undefined &&
            record[key] !== null
        ) {
            return record[key];
        }
    }

    return "";
};

/* =========================================================
   NORMALIZE RECORD
========================================================= */

const normalizeRecord = (record) => ({
    manifestId: getFieldValue(
        record,
        "manifestId",
        "ManifestId"
    ),

    packageId: getFieldValue(
        record,
        "packageId",
        "PackageId"
    ),

    putawayLocation: getFieldValue(
        record,
        "putawayLocation",
        "PutawayLocation",
        "location",
        "Location",
        "binLocation",
        "BinLocation"
    ),

    quantity: getFieldValue(
        record,
        "quantity",
        "Quantity",
        "packageQuantity",
        "PackageQuantity"
    ),

    status: getFieldValue(
        record,
        "status",
        "Status",
        "putawayStatus",
        "PutawayStatus"
    ) || "Pending"
});

/* =========================================================
   MANIFEST PACKAGES PUTAWAY EDIT
========================================================= */

const ManifestPackagesPutawayEdit = ({
    record = null,
    onSubmit,
    onCancel,
    loading = false,
    error = "",
    statusOptions = DEFAULT_STATUS_OPTIONS,
    title = "Edit Manifest Package Putaway"
}) => {

    const [formData, setFormData] = useState(initialFormData);
    const [validationErrors, setValidationErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    /* =====================================================
       LOAD RECORD DATA
    ===================================================== */

    useEffect(() => {
        if (record) {
            setFormData(normalizeRecord(record));
        } else {
            setFormData(initialFormData);
        }

        setValidationErrors({});
        setSubmitError("");
    }, [record]);

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
            formData.manifestId === null
        ) {
            errors.manifestId = "Manifest ID is required";
        }

        if (
            formData.packageId === "" ||
            formData.packageId === null
        ) {
            errors.packageId = "Package ID is required";
        }

        if (!String(formData.putawayLocation || "").trim()) {
            errors.putawayLocation =
                "Putaway location is required";
        }

        if (
            formData.quantity === "" ||
            formData.quantity === null ||
            !Number.isFinite(Number(formData.quantity)) ||
            Number(formData.quantity) <= 0
        ) {
            errors.quantity =
                "Enter a quantity greater than zero";
        }

        if (!String(formData.status || "").trim()) {
            errors.status = "Status is required";
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitError("");

        if (!record) {
            setSubmitError(
                "No putaway record was provided for editing."
            );
            return;
        }

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
            ...formData,
            manifestId: Number(formData.manifestId),
            packageId: Number(formData.packageId),
            quantity: Number(formData.quantity)
        };

        try {
            await onSubmit(payload);
        } catch (err) {
            setSubmitError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.message ||
                "Unable to update the putaway record."
            );
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setFormData(
            record ? normalizeRecord(record) : initialFormData
        );

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
                <Box>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                    >
                        <Inventory2 color="primary" />

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            {title}
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Update the manifest package putaway details.
                    </Typography>
                </Box>

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

            {/* ERROR MESSAGES */}

            {(error || submitError) && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setSubmitError("")}
                >
                    {submitError || error}
                </Alert>
            )}

            {!record && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Select a putaway record before editing.
                </Alert>
            )}

            {/* EDIT FORM */}

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
                            error={Boolean(validationErrors.manifestId)}
                            helperText={validationErrors.manifestId}
                            disabled={loading || !record}
                            inputProps={{ min: 1 }}
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
                            error={Boolean(validationErrors.packageId)}
                            helperText={validationErrors.packageId}
                            disabled={loading || !record}
                            inputProps={{ min: 1 }}
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
                            disabled={loading || !record}
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
                            error={Boolean(validationErrors.quantity)}
                            helperText={validationErrors.quantity}
                            disabled={loading || !record}
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
                            error={Boolean(validationErrors.status)}
                            helperText={validationErrors.status}
                            disabled={loading || !record}
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
                        disabled={loading || !record}
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
                            loading
                                ? <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                                : <Save />
                        }
                        disabled={loading || !record}
                    >
                        {loading ? "Updating..." : "Update Putaway"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default ManifestPackagesPutawayEdit;

