
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

// =====================================================
// API CONFIGURATION
// =====================================================

const API_URL = "http://localhost:5000/api/reverse-pickup-items";

// =====================================================
// INITIAL FORM DATA
// Only fields supported by the known API response
// =====================================================

const INITIAL_FORM_DATA = {
    reversePickupId: "",
    saleOrderItemCode: "",
    reason: "",
    itemSku: "",
    totalPrice: "",
    sellingPrice: "",
    discount: ""
};

// =====================================================
// RESPONSE HELPERS
// =====================================================

const getItemFromResponse = (response) => {
    const data = response?.data;

    if (!data) {
        return null;
    }

    if (Array.isArray(data)) {
        return data[0] || null;
    }

    if (Array.isArray(data.data)) {
        return data.data[0] || null;
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
        return Object.values(data.errors).flat().join(", ");
    }

    if (error?.response?.status === 404) {
        return "Reverse pickup item not found. Verify the item ID and API endpoint.";
    }

    return error?.message || "Something went wrong. Please try again.";
};

// =====================================================
// NORMALIZE API DATA
// =====================================================

const normalizeItem = (item = {}) => ({
    reversePickupId:
        item.reversePickupId ??
        item.ReversePickupId ??
        "",

    saleOrderItemCode:
        item.saleOrderItemCode ??
        item.SaleOrderItemCode ??
        "",

    reason:
        item.reason ??
        item.Reason ??
        "",

    itemSku:
        item.itemSku ??
        item.ItemSku ??
        item.sku ??
        item.SKU ??
        "",

    totalPrice:
        item.totalPrice ??
        item.TotalPrice ??
        "",

    sellingPrice:
        item.sellingPrice ??
        item.SellingPrice ??
        "",

    discount:
        item.discount ??
        item.Discount ??
        ""
});

// =====================================================
// COMPONENT
// =====================================================

 function ReversePickupItemEdit({
    itemId,
    id,
    item,
    reversePickupItem,
    apiUrl = API_URL,
    onBack,
    onCancel,
    onSuccess,
    onUpdated
}) {
    const params = useParams();
    const navigate = useNavigate();

    const initialItem = item || reversePickupItem || null;

    const resolvedId =
        itemId ??
        id ??
        params.id ??
        params.itemId ??
        initialItem?.reversePickupItemId ??
        initialItem?.ReversePickupItemId ??
        initialItem?.id ??
        initialItem?.Id ??
        "";

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [loadError, setLoadError] = useState("");

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // -------------------------------------------------
    // NOTIFICATIONS
    // -------------------------------------------------

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

    // -------------------------------------------------
    // LOAD ITEM
    // -------------------------------------------------

    const loadItem = useCallback(async () => {
        const currentId = String(resolvedId ?? "").trim();

        if (!currentId) {
            if (initialItem) {
                setFormData(normalizeItem(initialItem));
                setLoadError("");
            } else {
                setLoadError(
                    "Reverse pickup item ID was not provided. Open the edit page using /reverse-pickup-items/1/edit."
                );
            }

            setLoading(false);
            return;
        }

        setLoading(true);
        setLoadError("");

        try {
            const baseUrl = apiUrl.replace(/\/+$/, "");

            const response = await axios.get(
                `${baseUrl}/${encodeURIComponent(currentId)}`
            );

            const result = getItemFromResponse(response);

            if (!result || typeof result !== "object") {
                throw new Error("Reverse pickup item was not found.");
            }

            setFormData(normalizeItem(result));
            setErrors({});
        } catch (error) {
            console.error(
                "GET REVERSE PICKUP ITEM ERROR:",
                error
            );

            const message = getErrorMessage(error);

            setLoadError(message);

            if (initialItem) {
                setFormData(normalizeItem(initialItem));
            }

            showNotification(message, "error");
        } finally {
            setLoading(false);
        }
    }, [resolvedId, apiUrl, initialItem]);

    useEffect(() => {
        loadItem();
    }, [loadItem]);

    // -------------------------------------------------
    // INPUT HANDLER
    // -------------------------------------------------

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

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    const validateForm = () => {
        const newErrors = {};

        if (!String(formData.saleOrderItemCode || "").trim()) {
            newErrors.saleOrderItemCode =
                "Sale order item code is required.";
        }

        if (!String(formData.itemSku || "").trim()) {
            newErrors.itemSku = "Item SKU is required.";
        }

        ["totalPrice", "sellingPrice", "discount"].forEach((field) => {
            const value = formData[field];

            if (
                value !== "" &&
                value !== null &&
                (
                    !Number.isFinite(Number(value)) ||
                    Number(value) < 0
                )
            ) {
                newErrors[field] =
                    "Enter a valid non-negative amount.";
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // -------------------------------------------------
    // UPDATE ITEM
    // -------------------------------------------------

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            showNotification(
                "Please correct the validation errors.",
                "error"
            );
            return;
        }

        const currentId = String(resolvedId ?? "").trim();

        if (!currentId) {
            showNotification(
                "An item ID is required to update this record.",
                "error"
            );
            return;
        }

        const payload = {
            reversePickupId:
                formData.reversePickupId === ""
                    ? null
                    : Number(formData.reversePickupId),

            saleOrderItemCode: formData.saleOrderItemCode.trim(),
            reason: formData.reason.trim(),
            itemSku: formData.itemSku.trim(),

            totalPrice:
                formData.totalPrice === ""
                    ? null
                    : Number(formData.totalPrice),

            sellingPrice:
                formData.sellingPrice === ""
                    ? null
                    : Number(formData.sellingPrice),

            discount:
                formData.discount === ""
                    ? null
                    : Number(formData.discount)
        };

        setSaving(true);

        try {
            const baseUrl = apiUrl.replace(/\/+$/, "");

            const response = await axios.put(
                `${baseUrl}/${encodeURIComponent(currentId)}`,
                payload
            );

            const updatedItem =
                getItemFromResponse(response) || {
                    ...payload,
                    id: currentId
                };

            showNotification(
                "Reverse pickup item updated successfully.",
                "success"
            );

            if (typeof onUpdated === "function") {
                onUpdated(updatedItem);
            }

            if (typeof onSuccess === "function") {
                onSuccess(updatedItem);
            } else {
                navigate("/reverse-pickup-items");
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

    // -------------------------------------------------
    // RESET FORM
    // -------------------------------------------------

    const handleReset = () => {
        setErrors({});
        loadItem();
    };

    // -------------------------------------------------
    // NAVIGATION
    // -------------------------------------------------

    const handleBack = () => {
        if (typeof onBack === "function") {
            onBack();
        } else if (typeof onCancel === "function") {
            onCancel();
        } else {
            navigate("/reverse-pickup-items");
        }
    };

    // -------------------------------------------------
    // LOADING VIEW
    // -------------------------------------------------

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

    // -------------------------------------------------
    // FORM
    // -------------------------------------------------

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
                        alignItems: {
                            xs: "flex-start",
                            sm: "center"
                        },
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 2
                    }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Edit Reverse Pickup Item
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Update the reverse pickup item details.
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Item ID: {String(resolvedId || "Not provided")}
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

                {loadError && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={loadItem}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {loadError}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Grid container spacing={2.5}>
                        {/* REVERSE PICKUP DETAILS */}

                        <Grid xs={12}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Reverse Pickup Details
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reverse Pickup ID"
                                name="reversePickupId"
                                value={formData.reversePickupId}
                                disabled
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Sale Order Item Code"
                                name="saleOrderItemCode"
                                value={formData.saleOrderItemCode}
                                onChange={handleChange}
                                required
                                error={Boolean(errors.saleOrderItemCode)}
                                helperText={errors.saleOrderItemCode}
                            />
                        </Grid>

                        {/* ITEM DETAILS */}

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Item Details
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item SKU"
                                name="itemSku"
                                value={formData.itemSku}
                                onChange={handleChange}
                                required
                                error={Boolean(errors.itemSku)}
                                helperText={errors.itemSku}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* PRICING */}

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Pricing Details
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Total Price"
                                name="totalPrice"
                                value={formData.totalPrice}
                                onChange={handleChange}
                                inputProps={{ min: 0, step: "0.01" }}
                                error={Boolean(errors.totalPrice)}
                                helperText={errors.totalPrice}
                            />
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Selling Price"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                inputProps={{ min: 0, step: "0.01" }}
                                error={Boolean(errors.sellingPrice)}
                                helperText={errors.sellingPrice}
                            />
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Discount"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                inputProps={{ min: 0, step: "0.01" }}
                                error={Boolean(errors.discount)}
                                helperText={errors.discount}
                            />
                        </Grid>

                        {/* ACTIONS */}

                        <Grid xs={12}>
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
                                            ? <CircularProgress
                                                size={18}
                                                color="inherit"
                                            />
                                            : <Save />
                                    }
                                    disabled={saving || Boolean(loadError)}
                                >
                                    {saving ? "Saving..." : "Update Item"}
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
}

export default ReversePickupItemEdit;
