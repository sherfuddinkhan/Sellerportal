// ReversePickupItemEdit.jsx

import React, { useEffect, useState } from "react";
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
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
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
   RESPONSE HELPERS
========================================================= */

const getItemFromResponse = (response) => {
    const data = response?.data;

    if (!data) {
        return null;
    }

    if (Array.isArray(data)) {
        return data[0] || null;
    }

    return (
        data.data ||
        data.item ||
        data.reversePickupItem ||
        data.result ||
        data
    );
};

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

    return error?.message || "Something went wrong. Please try again.";
};

/* =========================================================
   NORMALIZE ITEM DATA
========================================================= */

const normalizeItem = (item = {}) => ({
    reversePickupId:
        item.reversePickupId ??
        item.ReversePickupId ??
        "",

    reversePickupNumber:
        item.reversePickupNumber ??
        item.ReversePickupNumber ??
        "",

    orderId:
        item.orderId ??
        item.OrderId ??
        "",

    orderNumber:
        item.orderNumber ??
        item.OrderNumber ??
        "",

    itemId:
        item.itemId ??
        item.ItemId ??
        item.productId ??
        item.ProductId ??
        "",

    itemName:
        item.itemName ??
        item.ItemName ??
        item.productName ??
        item.ProductName ??
        "",

    sku:
        item.sku ??
        item.SKU ??
        "",

    quantity:
        item.quantity ??
        item.Quantity ??
        1,

    status:
        item.status ??
        item.Status ??
        "Pending",

    reason:
        item.reason ??
        item.Reason ??
        "",

    pickupCost:
        item.pickupCost ??
        item.PickupCost ??
        0,

    trackingNumber:
        item.trackingNumber ??
        item.TrackingNumber ??
        "",

    notes:
        item.notes ??
        item.Notes ??
        ""
});

/* =========================================================
   COMPONENT
========================================================= */

const ReversePickupItemEdit = ({
    itemId,
    id,
    item,
    reversePickupItem,
    apiUrl = API_URL,
    onBack,
    onCancel,
    onSuccess,
    onUpdated
}) => {
    const resolvedId =
        itemId ??
        id ??
        item?.reversePickupItemId ??
        item?.ReversePickupItemId ??
        item?.id ??
        item?.Id ??
        reversePickupItem?.reversePickupItemId ??
        reversePickupItem?.ReversePickupItemId ??
        reversePickupItem?.id ??
        reversePickupItem?.Id ??
        "";

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const showNotification = (message, severity = "success") => {
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
       LOAD ITEM
    ===================================================== */

    const loadItem = async () => {
        if (resolvedId === "" || resolvedId === null) {
            if (item || reversePickupItem) {
                setFormData(
                    normalizeItem(item || reversePickupItem)
                );
            }

            return;
        }

        setLoading(true);

        try {
            const response = await axios.get(
                `${apiUrl}/${encodeURIComponent(resolvedId)}`
            );

            const data = getItemFromResponse(response);

            if (!data) {
                throw new Error("Reverse pickup item was not found.");
            }

            setFormData(normalizeItem(data));
            setErrors({});
        } catch (error) {
            console.error(
                "GET REVERSE PICKUP ITEM ERROR:",
                error
            );

            // Fall back to supplied item data if available.
            if (item || reversePickupItem) {
                setFormData(
                    normalizeItem(item || reversePickupItem)
                );
            }

            showNotification(
                getErrorMessage(error),
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (item || reversePickupItem) {
            setFormData(
                normalizeItem(item || reversePickupItem)
            );
            setErrors({});
        }

        if (resolvedId !== "" && resolvedId !== null) {
            loadItem();
        }

        // Load when the selected record or API URL changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resolvedId, apiUrl]);

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
       VALIDATION
    ===================================================== */

    const validateForm = () => {
        const newErrors = {};

        if (
            String(formData.itemName || "").trim() === ""
        ) {
            newErrors.itemName = "Item name is required.";
        }

        if (
            String(formData.quantity).trim() === "" ||
            !Number.isFinite(Number(formData.quantity)) ||
            Number(formData.quantity) <= 0
        ) {
            newErrors.quantity =
                "Quantity must be greater than zero.";
        }

        if (
            formData.pickupCost === "" ||
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
       UPDATE ITEM
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

        if (resolvedId === "" || resolvedId === null) {
            showNotification(
                "An item ID is required to update this record.",
                "error"
            );
            return;
        }

        const payload = {
            ...formData,
            quantity: Number(formData.quantity),
            pickupCost: Number(formData.pickupCost)
        };

        setSaving(true);

        try {
            const response = await axios.put(
                `${apiUrl}/${encodeURIComponent(resolvedId)}`,
                payload
            );

            const updatedItem =
                getItemFromResponse(response) || payload;

            showNotification(
                "Reverse pickup item updated successfully.",
                "success"
            );

            if (typeof onUpdated === "function") {
                onUpdated(updatedItem);
            }

            if (typeof onSuccess === "function") {
                onSuccess(updatedItem);
            }
        } catch (error) {
            console.error(
                "UPDATE REVERSE PICKUP ITEM ERROR:",
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
        setErrors({});

        if (item || reversePickupItem) {
            setFormData(
                normalizeItem(item || reversePickupItem)
            );
        } else {
            loadItem();
        }
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
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Paper
                elevation={2}
                sx={{
                    p: 5,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography variant="body1">
                    Loading reverse pickup item...
                </Typography>
            </Paper>
        );
    }

    /* =====================================================
       RENDER FORM
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

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 2
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Edit Reverse Pickup Item
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Update the reverse pickup item details.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Grid container spacing={2.5}>
                        {/* REVERSE PICKUP DETAILS */}

                        <Grid item xs={12}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Reverse Pickup Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reverse Pickup ID"
                                name="reversePickupId"
                                value={formData.reversePickupId}
                                onChange={handleChange}
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reverse Pickup Number"
                                name="reversePickupNumber"
                                value={formData.reversePickupNumber}
                                onChange={handleChange}
                                disabled
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Order ID"
                                name="orderId"
                                value={formData.orderId}
                                onChange={handleChange}
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

                        {/* ITEM DETAILS */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Item Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item ID"
                                name="itemId"
                                value={formData.itemId}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Name"
                                name="itemName"
                                value={formData.itemName}
                                onChange={handleChange}
                                required
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
                                type="number"
                                label="Quantity"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 1, step: 1 }}
                                error={Boolean(errors.quantity)}
                                helperText={errors.quantity}
                            />
                        </Grid>

                        {/* PICKUP DETAILS */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Pickup Details
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
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
                                label="Pickup Cost"
                                name="pickupCost"
                                type="number"
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
                                placeholder="Enter reason for return"
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
                            />
                        </Grid>

                        {/* ACTIONS */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    flexWrap: "wrap",
                                    gap: 1.5,
                                    mt: 1
                                }}
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
                                        ? "Saving..."
                                        : "Update Item"}
                                </Button>
                            </Box>
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

export default ReversePickupItemEdit;

