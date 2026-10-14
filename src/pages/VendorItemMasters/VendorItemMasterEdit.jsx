// =========================================================
// VendorItemMasterEdit.jsx
// Standalone Edit Page - No Modal
// =========================================================

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Snackbar,
    TextField,
    Typography,
    FormControlLabel,
    Switch
} from "@mui/material";

import {
    Save,
    ArrowBack,
    RestartAlt
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/VendorItemMaster";

// =========================================================
// INITIAL FORM DATA
// =========================================================

const INITIAL_FORM_DATA = {
    vendorId: "",
    sellerId: "",
    customerId: "",
    productId: "",
    vendorSkuCode: "",
    itemSkuCode: "",
    itemCode: "",
    itemSku: "",
    sku: "",
    vendorCode: "",
    vendorItemCode: "",
    costPrice: "",
    unitPrice: "",
    mrp: "",
    sellingPrice: "",
    inventory: "",
    leadTime: "",
    priority: "",
    enabled: true,
    isActive: true
};

// =========================================================
// MAP API DATA TO FORM
// =========================================================

const mapItemToForm = (item) => ({
    vendorId: String(item.vendorId ?? item.VendorId ?? ""),
    sellerId: String(item.sellerId ?? item.SellerId ?? ""),
    customerId: String(item.customerId ?? item.CustomerId ?? ""),
    productId: String(item.productId ?? item.ProductId ?? ""),
    vendorSkuCode: item.vendorSkuCode ?? item.VendorSkuCode ?? "",
    itemSkuCode: item.itemSkuCode ?? item.ItemSkuCode ?? "",
    itemCode: item.itemCode ?? item.ItemCode ?? "",
    itemSku: item.itemSku ?? item.ItemSku ?? "",
    sku: item.sku ?? item.SKU ?? "",
    vendorCode: item.vendorCode ?? item.VendorCode ?? "",
    vendorItemCode: item.vendorItemCode ?? item.VendorItemCode ?? "",
    costPrice: String(item.costPrice ?? item.CostPrice ?? ""),
    unitPrice: String(item.unitPrice ?? item.UnitPrice ?? ""),
    mrp: String(item.mrp ?? item.MRP ?? ""),
    sellingPrice: String(item.sellingPrice ?? item.SellingPrice ?? ""),
    inventory: String(item.inventory ?? item.Inventory ?? ""),
    leadTime: String(item.leadTime ?? item.LeadTime ?? ""),
    priority: String(item.priority ?? item.Priority ?? ""),
    enabled: item.enabled ?? item.Enabled ?? true,
    isActive: item.isActive ?? item.IsActive ?? true
});

// =========================================================
// NUMBER VALIDATION HELPER
// =========================================================

const isNonNegativeNumber = (value) =>
    value !== "" &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0;

// =========================================================
// EDIT COMPONENT
// =========================================================

const VendorItemMasterEdit = () => {
    const navigate = useNavigate();
    const { id, itemId } = useParams();

    const currentId = id ?? itemId;

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [originalData, setOriginalData] = useState(INITIAL_FORM_DATA);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [errors, setErrors] = useState({});

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // =====================================================
    // NOTIFICATION
    // =====================================================

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const closeNotification = () => {
        setNotification((previous) => ({
            ...previous,
            open: false
        }));
    };

    // =====================================================
    // LOAD ITEM
    // =====================================================

    const fetchItemDetails = useCallback(async () => {
        if (!currentId) {
            setLoadError("Vendor item ID was not provided.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setLoadError("");

            const response = await axios.get(`${API_URL}/all`);

            const responseData = response.data;

            const records = Array.isArray(responseData)
                ? responseData
                : Array.isArray(responseData?.data)
                    ? responseData.data
                    : Array.isArray(responseData?.items)
                        ? responseData.items
                        : [];

            const record = records.find((item) => {
                const recordId =
                    item.vendorItemMasterId ??
                    item.VendorItemMasterId ??
                    item.id ??
                    item.Id;

                return String(recordId) === String(currentId);
            });

            if (!record) {
                throw new Error(
                    `Vendor item ID ${currentId} was not found.`
                );
            }

            const mapped = mapItemToForm(record);

            setFormData(mapped);
            setOriginalData(mapped);
        } catch (error) {
            console.error("LOAD VENDOR ITEM ERROR:", error);

            setLoadError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.response?.data?.detail ||
                error.message ||
                "Unable to load vendor item details."
            );
        } finally {
            setLoading(false);
        }
    }, [currentId]);

    useEffect(() => {
        fetchItemDetails();
    }, [fetchItemDetails]);

    // =====================================================
    // HANDLE TEXT INPUTS
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
    // HANDLE BOOLEAN INPUTS
    // =====================================================

    const handleBooleanChange = (event) => {
        const { name, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: checked
        }));
    };

    // =====================================================
    // VALIDATE
    // =====================================================

    const validateForm = () => {
        const newErrors = {};

        const requiredPositiveIntegers = [
            ["vendorId", "Vendor ID"],
            ["sellerId", "Seller ID"],
            ["customerId", "Customer ID"]
        ];

        requiredPositiveIntegers.forEach(([field, label]) => {
            const value = formData[field];

            if (
                value === "" ||
                !Number.isInteger(Number(value)) ||
                Number(value) <= 0
            ) {
                newErrors[field] = `${label} must be a positive integer.`;
            }
        });

        if (!formData.vendorSkuCode.trim()) {
            newErrors.vendorSkuCode = "Vendor SKU Code is required.";
        }

        if (!formData.itemSkuCode.trim()) {
            newErrors.itemSkuCode = "Item SKU Code is required.";
        }

        if (!isNonNegativeNumber(formData.costPrice)) {
            newErrors.costPrice = "Enter a valid cost price.";
        }

        if (
            formData.productId !== "" &&
            (
                !Number.isInteger(Number(formData.productId)) ||
                Number(formData.productId) <= 0
            )
        ) {
            newErrors.productId = "Product ID must be a positive integer.";
        }

        const numericFields = [
            ["unitPrice", "Unit Price"],
            ["mrp", "MRP"],
            ["sellingPrice", "Selling Price"],
            ["inventory", "Inventory"],
            ["leadTime", "Lead Time"],
            ["priority", "Priority"]
        ];

        numericFields.forEach(([field, label]) => {
            const value = formData[field];

            if (value !== "" && !isNonNegativeNumber(value)) {
                newErrors[field] = `${label} must be zero or greater.`;
            }
        });

        ["inventory", "leadTime", "priority"].forEach((field) => {
            if (
                formData[field] !== "" &&
                !Number.isInteger(Number(formData[field]))
            ) {
                newErrors[field] = "Enter a whole number.";
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================================
    // RESET
    // =====================================================

    const handleReset = () => {
        setFormData({ ...originalData });
        setErrors({});
    };

    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {
        navigate("/vendor-item-masters");
    };

    // =====================================================
    // UPDATE
    // PUT /api/VendorItemMaster/{id}/seller/{sellerId}/customer/{customerId}
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            showNotification(
                "Please correct the highlighted fields.",
                "error"
            );
            return;
        }

        if (!currentId) {
            showNotification("Vendor item ID is missing.", "error");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                vendorItemMasterId: Number(currentId),
                vendorId: Number(formData.vendorId),
                sellerId: Number(formData.sellerId),
                customerId: Number(formData.customerId),
                productId:
                    formData.productId === ""
                        ? null
                        : Number(formData.productId),

                vendorSkuCode: formData.vendorSkuCode.trim(),
                itemSkuCode: formData.itemSkuCode.trim(),
                itemCode: formData.itemCode.trim() || null,
                itemSku: formData.itemSku.trim() || null,
                SKU: formData.sku.trim() || null,
                vendorCode: formData.vendorCode.trim() || null,
                vendorItemCode: formData.vendorItemCode.trim() || null,

                costPrice: Number(formData.costPrice),
                unitPrice:
                    formData.unitPrice === ""
                        ? null
                        : Number(formData.unitPrice),
                MRP:
                    formData.mrp === ""
                        ? null
                        : Number(formData.mrp),
                sellingPrice:
                    formData.sellingPrice === ""
                        ? null
                        : Number(formData.sellingPrice),

                inventory:
                    formData.inventory === ""
                        ? null
                        : Number(formData.inventory),
                leadTime:
                    formData.leadTime === ""
                        ? 0
                        : Number(formData.leadTime),
                priority:
                    formData.priority === ""
                        ? null
                        : Number(formData.priority),

                enabled: formData.enabled,
                isActive: formData.isActive
            };

            const sellerId = Number(formData.sellerId);
            const customerId = Number(formData.customerId);

            await axios.put(
                `${API_URL}/${encodeURIComponent(currentId)}/seller/${sellerId}/customer/${customerId}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            showNotification(
                "Vendor item master updated successfully."
            );

            setOriginalData({ ...formData });

            navigate("/vendor-item-masters");
        } catch (error) {
            console.error("UPDATE VENDOR ITEM ERROR:", error);

            const message =
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.response?.data?.detail ||
                (
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : null
                ) ||
                error.message ||
                "Unable to update vendor item master.";

            showNotification(message, "error");
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={2}
                minHeight={300}
            >
                <CircularProgress />
                <Typography>Loading vendor item details...</Typography>
            </Box>
        );
    }

    // =====================================================
    // LOAD ERROR
    // =====================================================

    if (loadError) {
        return (
            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {loadError}
                    </Alert>

                    <Box display="flex" gap={2} flexWrap="wrap">
                        <Button
                            variant="contained"
                            onClick={fetchItemDetails}
                            startIcon={<RestartAlt />}
                        >
                            Retry
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={handleBack}
                            startIcon={<ArrowBack />}
                        >
                            Back to List
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    // =====================================================
    // EDIT FORM
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
                elevation={2}
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    p: { xs: 2, md: 3 },
                    borderRadius: 2
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    mb={2}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Edit Vendor Item Master
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Update vendor item, pricing and inventory details.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        disabled={saving}
                    >
                        Back to List
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2.5}>
                        {/* IDENTIFIERS */}

                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight={700}>
                                Identification
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Vendor ID"
                                name="vendorId"
                                type="number"
                                value={formData.vendorId}
                                onChange={handleChange}
                                error={Boolean(errors.vendorId)}
                                helperText={errors.vendorId}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Seller ID"
                                name="sellerId"
                                type="number"
                                value={formData.sellerId}
                                onChange={handleChange}
                                error={Boolean(errors.sellerId)}
                                helperText={errors.sellerId}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Customer ID"
                                name="customerId"
                                type="number"
                                value={formData.customerId}
                                onChange={handleChange}
                                error={Boolean(errors.customerId)}
                                helperText={errors.customerId}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Product ID"
                                name="productId"
                                type="number"
                                value={formData.productId}
                                onChange={handleChange}
                                error={Boolean(errors.productId)}
                                helperText={errors.productId}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Vendor SKU Code"
                                name="vendorSkuCode"
                                value={formData.vendorSkuCode}
                                onChange={handleChange}
                                error={Boolean(errors.vendorSkuCode)}
                                helperText={errors.vendorSkuCode}
                                required
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Item SKU Code"
                                name="itemSkuCode"
                                value={formData.itemSkuCode}
                                onChange={handleChange}
                                error={Boolean(errors.itemSkuCode)}
                                helperText={errors.itemSkuCode}
                                required
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Item Code"
                                name="itemCode"
                                value={formData.itemCode}
                                onChange={handleChange}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Item SKU"
                                name="itemSku"
                                value={formData.itemSku}
                                onChange={handleChange}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Vendor Code"
                                name="vendorCode"
                                value={formData.vendorCode}
                                onChange={handleChange}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Vendor Item Code"
                                name="vendorItemCode"
                                value={formData.vendorItemCode}
                                onChange={handleChange}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>

                        {/* PRICING */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h6" fontWeight={700}>
                                Pricing
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                required
                                label="Cost Price"
                                name="costPrice"
                                type="number"
                                value={formData.costPrice}
                                onChange={handleChange}
                                error={Boolean(errors.costPrice)}
                                helperText={errors.costPrice}
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Unit Price"
                                name="unitPrice"
                                type="number"
                                value={formData.unitPrice}
                                onChange={handleChange}
                                error={Boolean(errors.unitPrice)}
                                helperText={errors.unitPrice}
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="MRP"
                                name="mrp"
                                type="number"
                                value={formData.mrp}
                                onChange={handleChange}
                                error={Boolean(errors.mrp)}
                                helperText={errors.mrp}
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Selling Price"
                                name="sellingPrice"
                                type="number"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                error={Boolean(errors.sellingPrice)}
                                helperText={errors.sellingPrice}
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        </Grid>

                        {/* INVENTORY */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h6" fontWeight={700}>
                                Inventory and Settings
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Inventory"
                                name="inventory"
                                type="number"
                                value={formData.inventory}
                                onChange={handleChange}
                                error={Boolean(errors.inventory)}
                                helperText={errors.inventory}
                                inputProps={{ min: 0, step: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Lead Time (Days)"
                                name="leadTime"
                                type="number"
                                value={formData.leadTime}
                                onChange={handleChange}
                                error={Boolean(errors.leadTime)}
                                helperText={errors.leadTime}
                                inputProps={{ min: 0, step: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                label="Priority"
                                name="priority"
                                type="number"
                                value={formData.priority}
                                onChange={handleChange}
                                error={Boolean(errors.priority)}
                                helperText={errors.priority}
                                inputProps={{ min: 0, step: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={Boolean(formData.enabled)}
                                        onChange={handleBooleanChange}
                                        name="enabled"
                                    />
                                }
                                label="Enabled"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={Boolean(formData.isActive)}
                                        onChange={handleBooleanChange}
                                        name="isActive"
                                    />
                                }
                                label="Active"
                            />
                        </Grid>

                        {/* ACTIONS */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                                flexWrap="wrap"
                                mt={2}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<RestartAlt />}
                                    onClick={handleReset}
                                    disabled={saving}
                                >
                                    Reset
                                </Button>

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
                                    {saving ? "Updating..." : "Update Vendor Item"}
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
                    severity={notification.severity}
                    variant="filled"
                    onClose={closeNotification}
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default VendorItemMasterEdit;
