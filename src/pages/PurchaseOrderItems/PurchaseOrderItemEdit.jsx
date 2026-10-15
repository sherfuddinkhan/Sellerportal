// ============================================================
// PurchaseOrderItemEdit.jsx
// Full Page Purchase Order Item Edit
// ============================================================

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import { ArrowBack, Save, Refresh } from "@mui/icons-material";

// ============================================================
// NODE PROXY API
// ============================================================

const API_URL = "http://localhost:5000/api/purchase-order-items";

// ============================================================
// INITIAL FORM
// ============================================================

const initialFormData = {
    PurchaseOrderItemId: "",
    PurchaseOrderId: "",
    SellerId: "",
    CustomerId: "",
    ProductId: "",
    Quantity: "",
    UnitPrice: "",
    Discount: "0",
    TaxAmount: "0",
    TotalAmount: "0"
};

// ============================================================
// NORMALIZE API RESPONSE
// ============================================================

const normalizeItem = (item, requestedId) => {
    if (!item || typeof item !== "object") {
        return null;
    }

    const itemId =
        item.purchaseOrderItemId ??
        item.PurchaseOrderItemId ??
        item.id ??
        item.Id;

    if (itemId == null) {
        return null;
    }

    return {
        PurchaseOrderItemId: itemId ?? requestedId,
        PurchaseOrderId:
            item.purchaseOrderId ?? item.PurchaseOrderId ?? "",
        SellerId:
            item.sellerId ?? item.SellerId ?? "",
        CustomerId:
            item.customerId ?? item.CustomerId ?? "",
        ProductId:
            item.productId ?? item.ProductId ?? "",
        Quantity:
            item.quantity ?? item.Quantity ?? "",
        UnitPrice:
            item.unitPrice ?? item.UnitPrice ?? "",
        Discount:
            item.discount ?? item.Discount ?? 0,
        TaxAmount:
            item.taxAmount ?? item.TaxAmount ?? 0,
        TotalAmount:
            item.totalAmount ?? item.TotalAmount ?? 0
    };
};

// ============================================================
// COMPONENT
// ============================================================

const PurchaseOrderItemEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // ========================================================
    // LOAD ITEM BY ID; FALL BACK TO /ALL
    // ========================================================

    const loadPurchaseOrderItem = useCallback(async () => {
        const requestedId = Number(id);

        if (!Number.isInteger(requestedId) || requestedId <= 0) {
            setError("Invalid Purchase Order Item ID.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            let item = null;

            // First try the individual endpoint.
            try {
                const response = await axios.get(
                    `${API_URL}/${encodeURIComponent(requestedId)}`
                );

                const data = response.data;

                item = normalizeItem(
                    data?.data ?? data?.item ?? data,
                    requestedId
                );

                // Prevent accidentally loading a different record.
                if (
                    item &&
                    Number(item.PurchaseOrderItemId) !== requestedId
                ) {
                    item = null;
                }
            } catch (detailError) {
                console.warn(
                    "Individual item endpoint failed; trying /all.",
                    detailError?.response?.status || detailError.message
                );
            }

            // Fallback to the working collection endpoint.
            if (!item) {
                const response = await axios.get(`${API_URL}/all`);
                const data = response.data;

                const records = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.items)
                            ? data.items
                            : [];

                const found = records.find((record) => {
                    const recordId =
                        record.purchaseOrderItemId ??
                        record.PurchaseOrderItemId ??
                        record.id ??
                        record.Id;

                    return Number(recordId) === requestedId;
                });

                item = normalizeItem(found, requestedId);
            }

            if (!item) {
                throw new Error(
                    `Purchase Order Item ID ${requestedId} was not found.`
                );
            }

            setFormData({
                ...initialFormData,
                ...item
            });
        } catch (err) {
            console.error("Failed to load Purchase Order Item:", err);

            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err.message ||
                "Failed to load Purchase Order Item."
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadPurchaseOrderItem();
    }, [loadPurchaseOrderItem]);

    // ========================================================
    // HANDLE FIELD CHANGES
    // ========================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ========================================================
    // CALCULATE TOTAL
    // Total = Quantity * Unit Price - Discount + Tax
    // ========================================================

    useEffect(() => {
        const quantity = Number(formData.Quantity) || 0;
        const unitPrice = Number(formData.UnitPrice) || 0;
        const discount = Number(formData.Discount) || 0;
        const taxAmount = Number(formData.TaxAmount) || 0;

        const total = Math.max(
            0,
            quantity * unitPrice - discount + taxAmount
        );

        setFormData((previous) => {
            const nextTotal = total.toFixed(2);

            if (previous.TotalAmount === nextTotal) {
                return previous;
            }

            return {
                ...previous,
                TotalAmount: nextTotal
            };
        });
    }, [
        formData.Quantity,
        formData.UnitPrice,
        formData.Discount,
        formData.TaxAmount
    ]);

    // ========================================================
    // SAVE CHANGES
    // ========================================================

    const handleSave = async (event) => {
        event.preventDefault();

        const itemId = Number(formData.PurchaseOrderItemId);
        const purchaseOrderId = Number(formData.PurchaseOrderId);
        const productId = Number(formData.ProductId);
        const quantity = Number(formData.Quantity);
        const unitPrice = Number(formData.UnitPrice);
        const discount = Number(formData.Discount);
        const taxAmount = Number(formData.TaxAmount);

        if (!Number.isInteger(itemId) || itemId <= 0) {
            setSnackbar({
                open: true,
                message: "Invalid Purchase Order Item ID.",
                severity: "error"
            });
            return;
        }

        if (!Number.isInteger(purchaseOrderId) || purchaseOrderId <= 0) {
            setSnackbar({
                open: true,
                message: "Enter a valid Purchase Order ID.",
                severity: "error"
            });
            return;
        }

        if (!Number.isInteger(productId) || productId <= 0) {
            setSnackbar({
                open: true,
                message: "Enter a valid Product ID.",
                severity: "error"
            });
            return;
        }

        if (
            !Number.isFinite(quantity) ||
            quantity <= 0 ||
            !Number.isFinite(unitPrice) ||
            unitPrice < 0 ||
            !Number.isFinite(discount) ||
            discount < 0 ||
            !Number.isFinite(taxAmount) ||
            taxAmount < 0
        ) {
            setSnackbar({
                open: true,
                message:
                    "Enter a valid quantity, unit price, discount, and tax amount.",
                severity: "error"
            });
            return;
        }

        const totalAmount = Math.max(
            0,
            quantity * unitPrice - discount + taxAmount
        );

        const payload = {
            PurchaseOrderItemId: itemId,
            PurchaseOrderId: purchaseOrderId,
            ProductId: productId,
            Quantity: quantity,
            UnitPrice: unitPrice,
            Discount: discount,
            TaxAmount: taxAmount,
            TotalAmount: Number(totalAmount.toFixed(2))
        };

        // Preserve tenant fields if your backend update model requires them.
        if (formData.SellerId !== "" && formData.SellerId != null) {
            payload.SellerId = Number(formData.SellerId);
        }

        if (formData.CustomerId !== "" && formData.CustomerId != null) {
            payload.CustomerId = Number(formData.CustomerId);
        }

        setSaving(true);

        try {
            console.log("PUT URL:", `${API_URL}/${itemId}`);
            console.log("UPDATE PAYLOAD:", payload);

            await axios.put(
                `${API_URL}/${encodeURIComponent(itemId)}`,
                payload
            );

            setSnackbar({
                open: true,
                message: "Purchase Order Item updated successfully.",
                severity: "success"
            });

            // Navigate after the success message has had time to display.
            window.setTimeout(() => {
                navigate("/purchase-order-items");
            }, 800);
        } catch (err) {
            console.error("Failed to update Purchase Order Item:", err);

            setSnackbar({
                open: true,
                message:
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err.message ||
                    "Failed to update Purchase Order Item.",
                severity: "error"
            });
        } finally {
            setSaving(false);
        }
    };

    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {
        navigate("/purchase-order-items");
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2
                }}
            >
                <CircularProgress />
                <Typography color="text.secondary">
                    Loading Purchase Order Item...
                </Typography>
            </Box>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ mt: 2 }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to Purchase Order Items
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={loadPurchaseOrderItem}
                    >
                        Retry
                    </Button>
                </Stack>
            </Box>
        );
    }

    // ========================================================
    // EDIT PAGE
    // ========================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Edit Purchase Order Item
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Update Purchase Order Item #
                        {formData.PurchaseOrderItemId}
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

            <Card>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                        Purchase Order Item Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Box component="form" onSubmit={handleSave}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Purchase Order Item ID"
                                    value={formData.PurchaseOrderItemId}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Purchase Order ID"
                                    name="PurchaseOrderId"
                                    type="number"
                                    value={formData.PurchaseOrderId}
                                    onChange={handleChange}
                                    inputProps={{ min: 1, step: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Product ID"
                                    name="ProductId"
                                    type="number"
                                    value={formData.ProductId}
                                    onChange={handleChange}
                                    inputProps={{ min: 1, step: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Quantity"
                                    name="Quantity"
                                    type="number"
                                    value={formData.Quantity}
                                    onChange={handleChange}
                                    inputProps={{ min: 0.01, step: "0.01" }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Unit Price"
                                    name="UnitPrice"
                                    type="number"
                                    value={formData.UnitPrice}
                                    onChange={handleChange}
                                    inputProps={{ min: 0, step: "0.01" }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Discount"
                                    name="Discount"
                                    type="number"
                                    value={formData.Discount}
                                    onChange={handleChange}
                                    inputProps={{ min: 0, step: "0.01" }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Tax Amount"
                                    name="TaxAmount"
                                    type="number"
                                    value={formData.TaxAmount}
                                    onChange={handleChange}
                                    inputProps={{ min: 0, step: "0.01" }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Total Amount"
                                    value={formData.TotalAmount}
                                    disabled
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
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
                                        ? <CircularProgress size={18} color="inherit" />
                                        : <Save />
                                }
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() =>
                        setSnackbar((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PurchaseOrderItemEdit;
