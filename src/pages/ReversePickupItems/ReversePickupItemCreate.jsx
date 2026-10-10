
// ReversePickupItemCreate.jsx

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
    Add,
    Save,
    Refresh
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/ReversePickupItems`;

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const INITIAL_FORM_DATA = {
    reversePickupId: "",
    reversePickupNumber: "",
    orderId: "",
    orderNumber: "",
    itemId: "",
    itemName: "",
    sku: "",
    quantity: 1,
    status: "Pending",
    reason: "",
    pickupCost: 0,
    trackingNumber: "",
    notes: ""
};

/* =========================================================
   ERROR HELPER
========================================================= */

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

/* =========================================================
   COMPONENT
========================================================= */

const ReversePickupItemCreate = ({
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
}) => {
    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState(() => ({
        ...INITIAL_FORM_DATA,
        ...(initialValues || {}),
        ...(reversePickupId !== undefined
            ? { reversePickupId }
            : {}),
        ...(reversePickupNumber !== undefined
            ? { reversePickupNumber }
            : {}),
        ...(orderId !== undefined
            ? { orderId }
            : {}),
        ...(orderNumber !== undefined
            ? { orderNumber }
            : {})
    }));

    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
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
            message,
            severity
        });
    };

    const closeNotification = (_, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

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

    /* =====================================================
       FORM VALIDATION
    ===================================================== */

    const validateForm = () => {
        const newErrors = {};

        if (
            String(formData.itemName || "").trim() === ""
        ) {
            newErrors.itemName =
                "Item name is required.";
        }

        if (
            String(formData.quantity).trim() === "" ||
            !Number.isFinite(Number(formData.quantity)) ||
            Number(formData.quantity) <= 0
        ) {
            newErrors.quantity =
                "Quantity must be greater than zero.";
        } else if (
            !Number.isInteger(Number(formData.quantity))
        ) {
            newErrors.quantity =
                "Quantity must be a whole number.";
        }

        if (
            String(formData.pickupCost).trim() === "" ||
            !Number.isFinite(Number(formData.pickupCost)) ||
            Number(formData.pickupCost) < 0
        ) {
            newErrors.pickupCost =
                "Pickup cost must be zero or greater.";
        }

        if (!String(formData.status || "").trim()) {
            newErrors.status = "Status is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =====================================================
       CREATE REVERSE PICKUP ITEM
    ===================================================== */

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
            ...formData,
            reversePickupId:
                formData.reversePickupId === ""
                    ? null
                    : Number(formData.reversePickupId),
            orderId:
                formData.orderId === ""
                    ? null
                    : Number(formData.orderId),
            itemId:
                formData.itemId === ""
                    ? null
                    : Number(formData.itemId),
            quantity: Number(formData.quantity),
            pickupCost: Number(formData.pickupCost),
            reversePickupNumber:
                String(formData.reversePickupNumber || "").trim(),
            orderNumber:
                String(formData.orderNumber || "").trim(),
            itemName:
                String(formData.itemName || "").trim(),
            sku:
                String(formData.sku || "").trim(),
            status:
                String(formData.status || "").trim(),
            reason:
                String(formData.reason || "").trim(),
            trackingNumber:
                String(formData.trackingNumber || "").trim(),
            notes:
                String(formData.notes || "").trim()
        };

        setSaving(true);

        try {
            const response = await axios.post(
                apiUrl,
                payload
            );

            const createdItem = response?.data?.data
                ?? response?.data?.item
                ?? response?.data?.reversePickupItem
                ?? response?.data
                ?? payload;

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
                error
            );

            showNotification(
                getErrorMessage(error),
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setFormData({
            ...INITIAL_FORM_DATA,
            ...(initialValues || {}),
            ...(reversePickupId !== undefined
                ? { reversePickupId }
                : {}),
            ...(reversePickupNumber !== undefined
                ? { reversePickupNumber }
                : {}),
            ...(orderId !== undefined
                ? { orderId }
                : {}),
            ...(orderNumber !== undefined
                ? { orderNumber }
                : {})
        });

        setErrors({});
    };

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const handleBack = () => {
        if (typeof onBack === "function") {
            onBack();
        } else if (typeof onCancel === "function") {
            onCancel();
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%" }}>
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 3
                }}
            >
                {/* HEADER */}

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

                        <Grid item xs={12}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Reverse Pickup Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reverse Pickup ID"
                                name="reversePickupId"
                                value={formData.reversePickupId}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reverse Pickup Number"
                                name="reversePickupNumber"
                                value={formData.reversePickupNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Order ID"
                                name="orderId"
                                value={formData.orderId}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Order Number"
                                name="orderNumber"
                                value={formData.orderNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* ITEM INFORMATION */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Item Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item ID / Product ID"
                                name="itemId"
                                value={formData.itemId}
                                onChange={handleChange}
                                type="number"
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Item Name"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleChange}
                                error={Boolean(errors.itemName)}
                                helperText={errors.itemName}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                inputProps={{
                                    min: 1,
                                    step: 1
                                }}
                                error={Boolean(errors.quantity)}
                                helperText={errors.quantity}
                            />
                        </Grid>

                        {/* PICKUP INFORMATION */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Pickup Information
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                required
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                error={Boolean(errors.status)}
                                helperText={errors.status}
                            >
                                {[
                                    "Pending",
                                    "Requested",
                                    "Approved",
                                    "Scheduled",
                                    "Picked Up",
                                    "In Transit",
                                    "Received",
                                    "Completed",
                                    "Rejected",
                                    "Cancelled"
                                ].map((status) => (
                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Pickup Cost"
                                name="pickupCost"
                                value={formData.pickupCost}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                                error={Boolean(errors.pickupCost)}
                                helperText={errors.pickupCost}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Pickup Reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                placeholder="Enter the return reason"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tracking Number"
                                name="trackingNumber"
                                value={formData.trackingNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Enter additional information"
                            />
                        </Grid>

                        {/* ACTION BUTTONS */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
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

            {/* NOTIFICATION */}

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
};

export default ReversePickupItemCreate;

