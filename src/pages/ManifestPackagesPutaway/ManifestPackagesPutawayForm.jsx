import React, { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Stack,
    Divider,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    Inventory2,
    Save,
    RestartAlt,
    ArrowBack
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
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...fields) => {
    for (const field of fields) {
        const value = record?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return "";
};

/* =========================================================
   MAP RECORD TO FORM DATA
========================================================= */

const mapRecordToForm = (record) => {
    if (!record) {
        return { ...initialFormData };
    }

    return {
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
        status:
            getFieldValue(
                record,
                "status",
                "Status",
                "putawayStatus",
                "PutawayStatus"
            ) || "Pending"
    };
};

/* =========================================================
   MANIFEST PACKAGES PUTAWAY FORM
========================================================= */

const ManifestPackagesPutawayForm = ({
    record = null,
    mode = "create",

    onSubmit,
    onCancel,
    onReset,

    loading = false,
    error = "",
    successMessage = "",

    statusOptions = [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled"
    ],

    title
}) => {
    /* -----------------------------------------------------
       FORM STATE
    ----------------------------------------------------- */

    const [formData, setFormData] = useState(
        () => mapRecordToForm(record)
    );

    const [formErrors, setFormErrors] = useState({});

    const isEditMode = mode === "edit";

    /* -----------------------------------------------------
       INITIALIZE FORM
    ----------------------------------------------------- */

    useEffect(() => {
        setFormData(mapRecordToForm(record));
        setFormErrors({});
    }, [record, mode]);

    /* -----------------------------------------------------
       HANDLE FIELD CHANGE
    ----------------------------------------------------- */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFormErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    /* -----------------------------------------------------
       VALIDATE FORM
    ----------------------------------------------------- */

    const validateForm = () => {
        const errors = {};

        if (
            formData.manifestId === "" ||
            formData.manifestId === null
        ) {
            errors.manifestId = "Manifest ID is required.";
        } else if (
            !Number.isFinite(Number(formData.manifestId)) ||
            Number(formData.manifestId) <= 0
        ) {
            errors.manifestId =
                "Enter a valid positive Manifest ID.";
        }

        if (
            formData.packageId === "" ||
            formData.packageId === null
        ) {
            errors.packageId = "Package ID is required.";
        } else if (
            !Number.isFinite(Number(formData.packageId)) ||
            Number(formData.packageId) <= 0
        ) {
            errors.packageId =
                "Enter a valid positive Package ID.";
        }

        if (!String(formData.putawayLocation).trim()) {
            errors.putawayLocation =
                "Putaway location is required.";
        }

        if (
            formData.quantity === "" ||
            formData.quantity === null
        ) {
            errors.quantity = "Quantity is required.";
        } else if (
            !Number.isFinite(Number(formData.quantity)) ||
            Number(formData.quantity) <= 0
        ) {
            errors.quantity =
                "Quantity must be greater than zero.";
        }

        if (!String(formData.status).trim()) {
            errors.status = "Status is required.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* -----------------------------------------------------
       RESET FORM
    ----------------------------------------------------- */

    const handleReset = () => {
        setFormData(
            isEditMode
                ? mapRecordToForm(record)
                : { ...initialFormData }
        );

        setFormErrors({});

        if (typeof onReset === "function") {
            onReset();
        }
    };

    /* -----------------------------------------------------
       HANDLE SUBMIT
    ----------------------------------------------------- */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        const payload = {
            manifestId: Number(formData.manifestId),
            packageId: Number(formData.packageId),
            putawayLocation: String(
                formData.putawayLocation
            ).trim(),
            quantity: Number(formData.quantity),
            status: String(formData.status).trim()
        };

        if (typeof onSubmit === "function") {
            await onSubmit(payload, record);
        }
    };

    /* -----------------------------------------------------
       TITLE
    ----------------------------------------------------- */

    const formTitle =
        title ||
        (
            isEditMode
                ? "Edit Manifest Package Putaway"
                : "Create Manifest Package Putaway"
        );

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            {/* FORM HEADER */}

            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    bgcolor: "background.paper"
                }}
            >
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "primary.light",
                        color: "primary.dark"
                    }}
                >
                    <Inventory2 fontSize="medium" />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {formTitle}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {isEditMode
                            ? "Update the details of the existing putaway record."
                            : "Enter the details required to register a package putaway."}
                    </Typography>
                </Box>
            </Box>

            <Divider />

            {/* FORM CONTENT */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ p: { xs: 2, sm: 3 } }}
            >
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {successMessage && (
                    <Alert
                        severity="success"
                        sx={{ mb: 3 }}
                    >
                        {successMessage}
                    </Alert>
                )}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Putaway Information
                </Typography>

                <Grid container spacing={2.5}>
                    {/* MANIFEST ID */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            name="manifestId"
                            label="Manifest ID"
                            value={formData.manifestId}
                            onChange={handleChange}
                            error={Boolean(formErrors.manifestId)}
                            helperText={formErrors.manifestId}
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
                            name="packageId"
                            label="Package ID"
                            value={formData.packageId}
                            onChange={handleChange}
                            error={Boolean(formErrors.packageId)}
                            helperText={formErrors.packageId}
                            disabled={loading}
                            inputProps={{ min: 1, step: 1 }}
                        />
                    </Grid>

                    {/* PUTAWAY LOCATION */}

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            name="putawayLocation"
                            label="Putaway Location"
                            placeholder="Example: A-01-B-02"
                            value={formData.putawayLocation}
                            onChange={handleChange}
                            error={Boolean(
                                formErrors.putawayLocation
                            )}
                            helperText={
                                formErrors.putawayLocation ||
                                "Enter the destination bin or storage location."
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
                            name="quantity"
                            label="Quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            error={Boolean(formErrors.quantity)}
                            helperText={formErrors.quantity}
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "any"
                            }}
                        />
                    </Grid>

                    {/* STATUS */}

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            select
                            name="status"
                            label="Putaway Status"
                            value={formData.status}
                            onChange={handleChange}
                            error={Boolean(formErrors.status)}
                            helperText={formErrors.status}
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

                <Divider sx={{ my: 3 }} />

                {/* FORM ACTIONS */}

                <Stack
                    direction={{
                        xs: "column-reverse",
                        sm: "row"
                    }}
                    spacing={1.5}
                    justifyContent="flex-end"
                >
                    {onCancel && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<ArrowBack />}
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEditMode
                                ? "Update Putaway"
                                : "Create Putaway"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default ManifestPackagesPutawayForm;

