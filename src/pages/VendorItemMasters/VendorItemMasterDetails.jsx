// =========================================================
// VendorItemMasterDetails.jsx
// Standalone Review / Details Page - No Modal
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
    Typography,
    Chip
} from "@mui/material";

import {
    ArrowBack,
    Refresh,
    Edit
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/VendorItemMaster";

// =========================================================
// FORMAT VALUE
// =========================================================

const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return String(value);
};

// =========================================================
// FORMAT CURRENCY
// =========================================================

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "—";
    }

    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

// =========================================================
// DETAIL FIELD
// =========================================================

const DetailField = ({ label, value, currency = false }) => (
    <Box sx={{ mb: 1 }}>
        <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mb: 0.5 }}
        >
            {label}
        </Typography>

        <Typography
            variant="body1"
            fontWeight={500}
            sx={{
                overflowWrap: "anywhere",
                whiteSpace: "pre-wrap"
            }}
        >
            {currency ? formatCurrency(value) : formatValue(value)}
        </Typography>
    </Box>
);

// =========================================================
// VENDOR ITEM MASTER DETAILS
// =========================================================

const VendorItemMasterDetails = () => {
    const navigate = useNavigate();
    const { id, itemId } = useParams();

    const currentId = id ?? itemId;

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
    // FETCH ITEM DETAILS
    // API: GET /api/VendorItemMaster/{id}/seller/{sellerId}/customer/{customerId}
    // =====================================================

    const fetchItemDetails = useCallback(async () => {
        if (!currentId) {
            setItem(null);
            setError("Vendor item ID was not provided.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // The current model uses sellerId/customerId to scope
            // item details. Supply these from the saved app context
            // or change the URL if your API has an ID-only GET route.
            const response = await axios.get(
                `${API_URL}/all`
            );

            const responseData = response.data;

            const records = Array.isArray(responseData)
                ? responseData
                : Array.isArray(responseData?.data)
                    ? responseData.data
                    : Array.isArray(responseData?.items)
                        ? responseData.items
                        : [];

            const foundItem = records.find((record) => {
                const recordId =
                    record.vendorItemMasterId ??
                    record.VendorItemMasterId ??
                    record.id ??
                    record.Id;

                return String(recordId) === String(currentId);
            });

            if (!foundItem) {
                setItem(null);
                setError(`Vendor item with ID ${currentId} was not found.`);
                return;
            }

            setItem(foundItem);
        } catch (err) {
            console.error("GET VENDOR ITEM DETAILS ERROR:", err);

            setItem(null);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.detail ||
                err.message ||
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
    // NAVIGATION
    // =====================================================

    const handleBack = () => {
        navigate("/vendor-item-masters");
    };

    const handleEdit = () => {
        if (!currentId) {
            showNotification("Vendor item ID is unavailable.", "error");
            return;
        }

        navigate(`/vendor-item-masters/${currentId}/edit`);
    };

    // =====================================================
    // ITEM FIELDS
    // =====================================================

    const getValue = (...values) =>
        values.find((value) => value !== undefined && value !== null);

    const itemStatus = getValue(
        item?.status,
        item?.Status,
        item?.enabled === true || item?.enabled === 1 ||
        item?.Enabled === true || item?.Enabled === 1
            ? "Enabled"
            : item?.enabled === false || item?.enabled === 0 ||
              item?.Enabled === false || item?.Enabled === 0
                ? "Disabled"
                : item?.isActive ?? item?.IsActive
                    ? "Active"
                    : "Inactive"
    );

    const active =
        String(itemStatus).toLowerCase() === "active" ||
        String(itemStatus).toLowerCase() === "enabled" ||
        itemStatus === true;

    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading && !item) {
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
    // ERROR / NOT FOUND
    // =====================================================

    if (error && !item) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>

                    <Box display="flex" gap={2} flexWrap="wrap">
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={fetchItemDetails}
                            disabled={loading}
                        >
                            Retry
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back to List
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    if (!item) {
        return null;
    }

    // =====================================================
    // DETAILS PAGE
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
                {/* HEADER */}

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
                            Vendor Item Master Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Review vendor SKU, product mapping,
                            prices, inventory and status.
                        </Typography>
                    </Box>

                    <Chip
                        label={formatValue(itemStatus)}
                        color={active ? "success" : "default"}
                        variant="outlined"
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* IDENTIFICATION */}

                <Typography variant="h6" fontWeight={700} mb={2}>
                    Identification
                </Typography>

                <Grid container spacing={3}>
                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Vendor Item Master ID"
                            value={getValue(
                                item.vendorItemMasterId,
                                item.VendorItemMasterId,
                                currentId
                            )}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Vendor ID"
                            value={getValue(item.vendorId, item.VendorId)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Seller ID"
                            value={getValue(item.sellerId, item.SellerId)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Customer ID"
                            value={getValue(item.customerId, item.CustomerId)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Product ID"
                            value={getValue(item.productId, item.ProductId)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Vendor SKU Code"
                            value={getValue(item.vendorSkuCode, item.VendorSkuCode)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Item SKU Code"
                            value={getValue(item.itemSkuCode, item.ItemSkuCode)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Item Code"
                            value={getValue(item.itemCode, item.ItemCode)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Item SKU"
                            value={getValue(item.itemSku, item.ItemSku)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="SKU"
                            value={getValue(item.sku, item.SKU)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Vendor Code"
                            value={getValue(item.vendorCode, item.VendorCode)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Vendor Item Code"
                            value={getValue(item.vendorItemCode, item.VendorItemCode)}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* PRICING */}

                <Typography variant="h6" fontWeight={700} mb={2}>
                    Pricing Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Cost Price"
                            value={getValue(item.costPrice, item.CostPrice)}
                            currency
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Unit Price"
                            value={getValue(item.unitPrice, item.UnitPrice)}
                            currency
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="MRP"
                            value={getValue(item.mrp, item.MRP)}
                            currency
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Selling Price"
                            value={getValue(item.sellingPrice, item.SellingPrice)}
                            currency
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* INVENTORY AND SETTINGS */}

                <Typography variant="h6" fontWeight={700} mb={2}>
                    Inventory and Settings
                </Typography>

                <Grid container spacing={3}>
                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Inventory"
                            value={getValue(item.inventory, item.Inventory)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Lead Time (Days)"
                            value={getValue(item.leadTime, item.LeadTime)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Priority"
                            value={getValue(item.priority, item.Priority)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Enabled"
                            value={getValue(item.enabled, item.Enabled)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Active"
                            value={getValue(item.isActive, item.IsActive)}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* AUDIT INFORMATION */}

                <Typography variant="h6" fontWeight={700} mb={2}>
                    Audit Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Created Date"
                            value={getValue(item.createdDate, item.CreatedDate)}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={4}>
                        <DetailField
                            label="Updated Date"
                            value={getValue(item.updatedDate, item.UpdatedDate)}
                        />
                    </Grid>
                </Grid>

                {/* ACTIONS */}

                <Divider sx={{ my: 3 }} />

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    gap={2}
                    flexWrap="wrap"
                >
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchItemDetails}
                        disabled={loading}
                    >
                        Refresh
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to List
                    </Button>
                </Box>
            </Paper>

            {/* NOTIFICATION */}

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
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

export default VendorItemMasterDetails;
