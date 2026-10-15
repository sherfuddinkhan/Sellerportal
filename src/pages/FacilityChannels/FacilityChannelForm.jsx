import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    TextField,
    Button,
    Paper,
    Typography,
    Divider,
    Alert,
    CircularProgress,
    Stack
} from "@mui/material";

import {
    Save,
    RestartAlt,
    ArrowBack
} from "@mui/icons-material";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    sellerId: 6,
    customerId: 3,
    productId: 6,
    skuCode: "",
    facilityCode: "",
    channelCode: "",
    sellableQuantity: 0
};

/* =========================================================
   NORMALIZE API DATA
========================================================= */

const normalizeFacilityChannel = (record = {}) => ({
    sellerId: record.sellerId ?? record.SellerId ?? 6,
    customerId: record.customerId ?? record.CustomerId ?? 3,
    productId: record.productId ?? record.ProductId ?? 6,
    skuCode: record.skuCode ?? record.SkuCode ?? "",
    facilityCode: record.facilityCode ?? record.FacilityCode ?? "",
    channelCode: record.channelCode ?? record.ChannelCode ?? "",
    sellableQuantity:
        record.sellableQuantity ??
        record.SellableQuantity ??
        0
});

/* =========================================================
   FACILITY CHANNEL FORM
========================================================= */

const FacilityChannelForm = ({
    mode = "create",
    facilityChannel = null,
    loading = false,
    error = "",
    onSubmit,
    onCancel,
    onReset
}) => {
    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    const isEditMode =
        mode === "edit" || mode === "update";

    /* =====================================================
       POPULATE FORM
    ===================================================== */

    useEffect(() => {
        if (isEditMode && facilityChannel) {
            setFormData(
                normalizeFacilityChannel(facilityChannel)
            );
        } else {
            setFormData({ ...initialFormData });
        }

        setFormErrors({});
        setSubmitError("");
    }, [isEditMode, facilityChannel]);

    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

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

        setSubmitError("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const errors = {};

        const sellerId = Number(formData.sellerId);
        const customerId = Number(formData.customerId);
        const productId = Number(formData.productId);
        const quantity = Number(formData.sellableQuantity);

        if (!Number.isInteger(sellerId) || sellerId <= 0) {
            errors.sellerId = "Enter a valid Seller ID.";
        }

        if (!Number.isInteger(customerId) || customerId <= 0) {
            errors.customerId = "Enter a valid Customer ID.";
        }

        if (!Number.isInteger(productId) || productId <= 0) {
            errors.productId = "Enter a valid Product ID.";
        }

        if (!String(formData.skuCode).trim()) {
            errors.skuCode = "SKU code is required.";
        } else if (String(formData.skuCode).trim().length > 100) {
            errors.skuCode = "SKU code cannot exceed 100 characters.";
        }

        if (!String(formData.facilityCode).trim()) {
            errors.facilityCode = "Facility code is required.";
        } else if (
            String(formData.facilityCode).trim().length > 100
        ) {
            errors.facilityCode =
                "Facility code cannot exceed 100 characters.";
        }

        if (!String(formData.channelCode).trim()) {
            errors.channelCode = "Channel code is required.";
        } else if (
            String(formData.channelCode).trim().length > 100
        ) {
            errors.channelCode =
                "Channel code cannot exceed 100 characters.";
        }

        if (
            !Number.isInteger(quantity) ||
            quantity < 0
        ) {
            errors.sellableQuantity =
                "Sellable quantity must be a non-negative whole number.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        setSubmitError("");

        if (!validateForm()) return;

        if (typeof onSubmit !== "function") {
            setSubmitError(
                "Form submission handler is not configured."
            );
            return;
        }

        const payload = {
            sellerId: Number(formData.sellerId),
            customerId: Number(formData.customerId),
            productId: Number(formData.productId),
            skuCode: String(formData.skuCode).trim(),
            facilityCode: String(formData.facilityCode).trim(),
            channelCode: String(formData.channelCode).trim(),
            sellableQuantity: Number(formData.sellableQuantity)
        };

        try {
            await onSubmit(payload);
        } catch (submitException) {
            const responseData = submitException?.response?.data;

            setSubmitError(
                responseData?.message ||
                responseData?.title ||
                submitException?.message ||
                "Unable to save the facility channel."
            );
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        if (loading) return;

        if (isEditMode && facilityChannel) {
            setFormData(
                normalizeFacilityChannel(facilityChannel)
            );
        } else {
            setFormData({ ...initialFormData });
        }

        setFormErrors({});
        setSubmitError("");

        if (typeof onReset === "function") {
            onReset();
        }
    };

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        if (loading) return;

        if (typeof onCancel === "function") {
            onCancel();
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden"
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        {isEditMode
                            ? "Edit Facility Channel Inventory"
                            : "Create Facility Channel Inventory"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {isEditMode
                            ? "Update the facility channel inventory information."
                            : "Enter the seller, customer, product, facility and channel details."}
                    </Typography>
                </Box>

                {typeof onCancel === "function" && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Back
                    </Button>
                )}
            </Box>

            <Divider />

            {/* FORM */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <Box sx={{ p: 3 }}>
                    {(error || submitError) && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {submitError || error}
                        </Alert>
                    )}

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Ownership and Product
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid xs={12} md={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="sellerId"
                                label="Seller ID"
                                value={formData.sellerId}
                                onChange={handleChange}
                                error={Boolean(formErrors.sellerId)}
                                helperText={
                                    formErrors.sellerId || "Enter a valid seller ID."
                                }
                                disabled={loading}
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>

                        <Grid xs={12} md={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="customerId"
                                label="Customer ID"
                                value={formData.customerId}
                                onChange={handleChange}
                                error={Boolean(formErrors.customerId)}
                                helperText={
                                    formErrors.customerId || "Enter a valid customer ID."
                                }
                                disabled={loading}
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>

                        <Grid xs={12} md={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="productId"
                                label="Product ID"
                                value={formData.productId}
                                onChange={handleChange}
                                error={Boolean(formErrors.productId)}
                                helperText={
                                    formErrors.productId || "Enter a valid product ID."
                                }
                                disabled={loading}
                                inputProps={{ min: 1, step: 1 }}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                required
                                name="skuCode"
                                label="SKU Code"
                                placeholder="e.g. TN-WBH-001"
                                value={formData.skuCode}
                                onChange={handleChange}
                                error={Boolean(formErrors.skuCode)}
                                helperText={
                                    formErrors.skuCode || "Enter the product SKU."
                                }
                                disabled={loading}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Facility and Channel
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                name="facilityCode"
                                label="Facility Code"
                                placeholder="e.g. WH-TN-001"
                                value={formData.facilityCode}
                                onChange={handleChange}
                                error={Boolean(formErrors.facilityCode)}
                                helperText={
                                    formErrors.facilityCode ||
                                    "Enter the warehouse or facility code."
                                }
                                disabled={loading}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                name="channelCode"
                                label="Channel Code"
                                placeholder="e.g. AMAZON"
                                value={formData.channelCode}
                                onChange={handleChange}
                                error={Boolean(formErrors.channelCode)}
                                helperText={
                                    formErrors.channelCode ||
                                    "Enter the marketplace or channel code."
                                }
                                disabled={loading}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                name="sellableQuantity"
                                label="Sellable Quantity"
                                value={formData.sellableQuantity}
                                onChange={handleChange}
                                error={Boolean(formErrors.sellableQuantity)}
                                helperText={
                                    formErrors.sellableQuantity ||
                                    "Enter a non-negative whole number."
                                }
                                disabled={loading}
                                inputProps={{ min: 0, step: 1 }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Divider />

                {/* ACTIONS */}

                <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    spacing={1.5}
                    justifyContent="flex-end"
                    sx={{ p: 3 }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleReset}
                        startIcon={<RestartAlt />}
                        disabled={loading}
                    >
                        Reset
                    </Button>

                    {typeof onCancel === "function" && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleCancel}
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
                                ? <CircularProgress size={18} color="inherit" />
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEditMode
                                ? "Update Facility Channel"
                                : "Create Facility Channel"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default FacilityChannelForm;
