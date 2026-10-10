// =========================================================
// VendorItemMasterDetails.jsx
// =========================================================

import React, { useEffect, useState } from "react";
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

const API_BASE_URL = "http://localhost:5000";

const VENDOR_ITEM_MASTER_API =
    `${API_BASE_URL}/api/VendorItemMaster`;

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
    const amount = Number(value);

    if (value === null || value === undefined || value === "") {
        return "—";
    }

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

const DetailField = ({ label, value }) => (
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
            sx={{
                fontWeight: 500,
                overflowWrap: "anywhere",
                whiteSpace: "pre-wrap"
            }}
        >
            {formatValue(value)}
        </Typography>
    </Box>
);

// =========================================================
// VENDOR ITEM MASTER DETAILS
// =========================================================

const VendorItemMasterDetails = ({
    itemId: itemIdProp,
    item: itemProp,
    onClose,
    onEdit
}) => {
    const navigate = useNavigate();
    const params = useParams();

    const itemId =
        itemIdProp ??
        params.itemId ??
        params.id;

    const [item, setItem] = useState(itemProp || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // =====================================================
    // FETCH ITEM DETAILS
    // =====================================================

    const fetchItemDetails = async () => {
        if (itemProp) {
            setItem(itemProp);
            setError("");
            return;
        }

        if (
            itemId === null ||
            itemId === undefined ||
            itemId === ""
        ) {
            setError("Vendor item ID was not provided.");
            setItem(null);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${VENDOR_ITEM_MASTER_API}/${encodeURIComponent(itemId)}`
            );

            const responseData = response.data;

            const fetchedItem =
                responseData?.data ??
                responseData?.item ??
                responseData;

            if (
                !fetchedItem ||
                typeof fetchedItem !== "object" ||
                Array.isArray(fetchedItem)
            ) {
                throw new Error(
                    "The API did not return a valid vendor item."
                );
            }

            setItem(fetchedItem);
        } catch (err) {
            console.error(
                "GET VENDOR ITEM MASTER DETAILS ERROR:",
                err
            );

            setItem(null);

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.detail ||
                "Unable to load vendor item details."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // EFFECT
    // =====================================================

    useEffect(() => {
        fetchItemDetails();

        // Fetch again when the selected item ID changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemId, itemProp]);

    // =====================================================
    // CLOSE DETAILS
    // =====================================================

    const handleClose = () => {
        if (typeof onClose === "function") {
            onClose();
        } else {
            navigate("/vendor-item-masters");
        }
    };

    // =====================================================
    // EDIT ITEM
    // =====================================================

    const handleEdit = () => {
        if (typeof onEdit === "function") {
            onEdit(item);
        } else {
            const id =
                item?.vendorItemMasterId ??
                item?.VendorItemMasterId ??
                item?.itemId ??
                item?.ItemId ??
                item?.id ??
                item?.Id ??
                itemId;

            if (id !== null && id !== undefined && id !== "") {
                navigate(`/vendor-item-masters/edit/${id}`);
            } else {
                setNotification({
                    open: true,
                    severity: "error",
                    message: "Cannot edit: item ID is unavailable."
                });
            }
        }
    };

    // =====================================================
    // STATUS DISPLAY
    // =====================================================

    const status = item?.status ?? item?.Status ?? "Unknown";

    const isActive =
        String(status).toLowerCase() === "active";

    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading && !item) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={300}
                gap={2}
            >
                <CircularProgress />

                <Typography>
                    Loading vendor item details...
                </Typography>
            </Box>
        );
    }

    // =====================================================
    // ERROR STATE
    // =====================================================

    if (error && !item) {
        return (
            <Box sx={{ p: 3 }}>
                <Paper
                    elevation={2}
                    sx={{ p: 3, borderRadius: 2 }}
                >
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
                            onClick={handleClose}
                        >
                            Back
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    // =====================================================
    // NO DATA STATE
    // =====================================================

    if (!item) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                    No vendor item details are available.
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleClose}
                >
                    Back
                </Button>
            </Box>
        );
    }

    // =====================================================
    // RENDER DETAILS
    // =====================================================

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    p: { xs: 2, md: 3 },
                    borderRadius: 2
                }}
            >
                {/* ========================================= */}
                {/* HEADER */}
                {/* ========================================= */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    mb={2}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Vendor Item Master Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            View vendor item information.
                        </Typography>
                    </Box>

                    <Chip
                        label={formatValue(status)}
                        color={isActive ? "success" : "default"}
                        variant="outlined"
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* ========================================= */}
                {/* ITEM INFORMATION */}
                {/* ========================================= */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Basic Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Item ID"
                            value={
                                item.vendorItemMasterId ??
                                item.VendorItemMasterId ??
                                item.itemId ??
                                item.ItemId ??
                                item.id ??
                                item.Id ??
                                itemId
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Item Code"
                            value={
                                item.itemCode ??
                                item.ItemCode
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Item Name"
                            value={
                                item.itemName ??
                                item.ItemName
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Vendor ID"
                            value={
                                item.vendorId ??
                                item.VendorId
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Unit of Measure"
                            value={
                                item.unitOfMeasure ??
                                item.UnitOfMeasure
                            }
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Status"
                            value={status}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* ========================================= */}
                {/* PRICING INFORMATION */}
                {/* ========================================= */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Pricing Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Unit Price"
                            value={formatCurrency(
                                item.unitPrice ??
                                item.UnitPrice
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Tax Rate (%)"
                            value={
                                item.taxRate ??
                                item.TaxRate
                            }
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* ========================================= */}
                {/* DESCRIPTION */}
                {/* ========================================= */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Description
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        minHeight: 80,
                        bgcolor: "background.default"
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap" }}
                    >
                        {formatValue(
                            item.description ??
                            item.Description
                        )}
                    </Typography>
                </Paper>

                {/* ========================================= */}
                {/* ACTION BUTTONS */}
                {/* ========================================= */}

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
                        onClick={handleClose}
                    >
                        Back
                    </Button>
                </Box>
            </Paper>

            {/* ============================================= */}
            {/* NOTIFICATION */}
            {/* ============================================= */}

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                onClose={() => {
                    setNotification((previous) => ({
                        ...previous,
                        open: false
                    }));
                }}
            >
                <Alert
                    severity={notification.severity}
                    variant="filled"
                    onClose={() => {
                        setNotification((previous) => ({
                            ...previous,
                            open: false
                        }));
                    }}
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default VendorItemMasterDetails;

