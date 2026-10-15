
import React, { useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save,
    Refresh
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/reverse-pickup-items";

// =========================================================
// INITIAL FORM DATA
// =========================================================

const INITIAL_FORM_DATA = {
    reversePickupId: "4",
    reversePickupNumber: "",
    orderId: "2",
    orderNumber: "",
    saleOrderItemCode: "",
    itemName: "TechNova Wireless Bluetooth Headphones",
    itemSku: "TN-WBH-001",
    totalPrice: "2499",
    sellingPrice: "2499",
    discount: "0",
    reason: "Defective"
};

// =========================================================
// ERROR HELPER
// =========================================================

const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.title) {
        return data.title;
    }

    if (data?.errors) {
        return Object.values(data.errors)
            .flat()
            .join(", ");
    }

    return error?.message ||
        "Unable to create reverse pickup item.";
};

// =========================================================
// COMPONENT
// =========================================================
 function ReversePickupItemCreate({
    apiUrl = API_URL,
    reversePickupId,
    reversePickupNumber,
    orderId,
    orderNumber,
    initialValues,
    onBack,
    onCancel,
    onSuccess,
    onCreated
}) {
    const getInitialData = () => ({
        ...INITIAL_FORM_DATA,
        ...(initialValues || {}),
        ...(reversePickupId !== undefined
            ? { reversePickupId: String(reversePickupId) }
            : {}),
        ...(reversePickupNumber !== undefined
            ? { reversePickupNumber }
            : {}),
        ...(orderId !== undefined
            ? { orderId: String(orderId) }
            : {}),
        ...(orderNumber !== undefined
            ? { orderNumber }
            : {})
    });

    const [formData, setFormData] = useState(getInitialData);

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // =====================================================
    // NOTIFICATION
    // =====================================================

    const showNotification = (
        message,
        severity = "success"
    ) => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const closeNotification = (_, reason) => {
        if (reason === "clickaway") return;

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {
        const newErrors = {};

        if (
            !String(formData.reversePickupId || "").trim() ||
            !Number.isInteger(Number(formData.reversePickupId)) ||
            Number(formData.reversePickupId) <= 0
        ) {
            newErrors.reversePickupId =
                "Enter a valid Reverse Pickup ID.";
        }

        if (
            !String(formData.saleOrderItemCode || "").trim()
        ) {
            newErrors.saleOrderItemCode =
                "Sale Order Item Code is required.";
        }

        if (!String(formData.itemSku || "").trim()) {
            newErrors.itemSku = "SKU is required.";
        }

        if (!String(formData.reason || "").trim()) {
            newErrors.reason = "Pickup reason is required.";
        }

        [
            "totalPrice",
            "sellingPrice",
            "discount"
        ].forEach((field) => {
            const value = formData[field];

            if (
                value === "" ||
                !Number.isFinite(Number(value)) ||
                Number(value) < 0
            ) {
                newErrors[field] =
                    "Enter a valid non-negative amount.";
            }
        });

        if (
            Number(formData.discount) >
            Number(formData.totalPrice)
        ) {
            newErrors.discount =
                "Discount cannot exceed total price.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================================
    // CREATE REVERSE PICKUP ITEM
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            showNotification(
                "Please correct the validation errors.",
                "error"
            );
            return;
        }

        const payload = {
            id: 0,
            sellerId: 6,
            customerId: 3,
            reversePickupId: Number(formData.reversePickupId),
            saleOrderItemCode: String(
                formData.saleOrderItemCode
            ).trim(),
            reason: String(formData.reason).trim(),
            itemSku: String(formData.itemSku).trim(),
            totalPrice: Number(formData.totalPrice),
            sellingPrice: Number(formData.sellingPrice),
            discount: Number(formData.discount)
        };

        setSaving(true);

        try {
            console.log("POST URL:", apiUrl);
            console.log("POST payload:", payload);

            const response = await axios.post(
                apiUrl,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const createdItem =
                response?.data?.data ??
                response?.data?.item ??
                response?.data?.reversePickupItem ??
                response?.data;

            showNotification(
                "Reverse pickup item created successfully.",
                "success"
            );

            if (typeof onCreated === "function") {
                onCreated(createdItem);
            }

            if (typeof onSuccess === "function") {
                onSuccess(createdItem);
            }
        } catch (error) {
            console.error(
                "CREATE REVERSE PICKUP ITEM ERROR:",
                error.response?.data || error.message
            );

            showNotification(
                getErrorMessage(error),
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const handleReset = () => {
        setFormData(getInitialData());
        setErrors({});
    };

    // =====================================================
    // BACK / CANCEL
    // =====================================================

    const handleBack = () => {
        if (typeof onBack === "function") {
            onBack();
        } else if (typeof onCancel === "function") {
            onCancel();
        } else {
            window.history.back();
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ width: "100%" }}>
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 3
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Create Reverse Pickup Item
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Enter the item and pickup information.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        disabled={saving}
                    >
                        Back
                    </Button>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Grid container spacing={2.5}>
                        {/* REVERSE PICKUP INFORMATION */}

                        <Grid xs={12}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Reverse Pickup Information
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Reverse Pickup ID"
                                name="reversePickupId"
                                value={formData.reversePickupId}
                                onChange={handleChange}
                                inputProps={{ min: 1 }}
                                error={Boolean(errors.reversePickupId)}
                                helperText={errors.reversePickupId}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reverse Pickup Number"
                                name="reversePickupNumber"
                                value={formData.reversePickupNumber}
                                onChange={handleChange}
                                helperText="Display information only; not sent by this API."
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Order ID"
                                name="orderId"
                                value={formData.orderId}
                                onChange={handleChange}
                                inputProps={{ min: 1 }}
                                helperText="Display information only; not sent by this API."
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Order Number"
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleChange}
                                helperText="Display information only; not sent by this API."
                            />
                        </Grid>

                        {/* ITEM INFORMATION */}

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Item Information
                            </Typography>
                        </Grid>

                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Sale Order Item Code"
                                name="saleOrderItemCode"
                                value={formData.saleOrderItemCode}
                                onChange={handleChange}
                                error={Boolean(errors.saleOrderItemCode)}
                                helperText={
                                    errors.saleOrderItemCode ||
                                    "Enter the order's item code."
                                }
                            />
                        </Grid>

                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                label="Item Name"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleChange}
                                helperText="Display information only; not sent by this API."
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="SKU"
                                name="itemSku"
                                value={formData.itemSku}
                                onChange={handleChange}
                                error={Boolean(errors.itemSku)}
                                helperText={errors.itemSku}
                            />
                        </Grid>

                        {/* PICKUP INFORMATION */}

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Pickup Information
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                required
                                label="Pickup Reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                error={Boolean(errors.reason)}
                                helperText={errors.reason}
                            >
                                {[
                                    "Defective",
                                    "Damaged",
                                    "Wrong Item",
                                    "Customer Return",
                                    "Not as Described",
                                    "Other"
                                ].map((reason) => (
                                    <MenuItem
                                        key={reason}
                                        value={reason}
                                    >
                                        {reason}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* PRICE INFORMATION */}

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Price Information
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Total Price"
                                name="totalPrice"
                                value={formData.totalPrice}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                                error={Boolean(errors.totalPrice)}
                                helperText={errors.totalPrice}
                            />
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Selling Price"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                                error={Boolean(errors.sellingPrice)}
                                helperText={errors.sellingPrice}
                            />
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Discount"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                                error={Boolean(errors.discount)}
                                helperText={errors.discount}
                            />
                        </Grid>

                        {/* ACTION BUTTONS */}

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row"
                                }}
                                justifyContent="flex-end"
                                spacing={1.5}
                                sx={{ mt: 1 }}
                            >
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<Refresh />}
                                    onClick={handleReset}
                                    disabled={saving}
                                >
                                    Reset
                                </Button>

                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        saving
                                            ? (
                                                <CircularProgress
                                                    size={18}
                                                    color="inherit"
                                                />
                                            )
                                            : <Save />
                                    }
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Creating..."
                                        : "Create Item"}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                onClose={closeNotification}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={closeNotification}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ReversePickupItemCreate
