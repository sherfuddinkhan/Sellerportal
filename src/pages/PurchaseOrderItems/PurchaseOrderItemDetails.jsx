// ============================================================
// PurchaseOrderItemDetails.jsx
// ============================================================

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
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh
} from "@mui/icons-material";

// ============================================================
// NODE PROXY URL
// ============================================================

const API_URL =
    "http://localhost:5000/api/purchase-order-items";

// ============================================================
// FORMAT CURRENCY
// ============================================================

const formatCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

// ============================================================
// FORMAT QUANTITY
// ============================================================

const formatQuantity = (value) => {
    const quantity = Number(value);

    if (!Number.isFinite(quantity)) {
        return "0";
    }

    return quantity.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

// ============================================================
// DETAIL FIELD
// ============================================================

const DetailField = ({
    label,
    value,
    currency = false,
    quantity = false
}) => {
    let displayValue = value;

    if (currency) {
        displayValue = formatCurrency(value);
    } else if (quantity) {
        displayValue = formatQuantity(value);
    } else if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        displayValue = "-";
    }

    return (
        <Box sx={{ height: "100%" }}>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.75 }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{ overflowWrap: "anywhere" }}
            >
                {displayValue}
            </Typography>
        </Box>
    );
};

// ============================================================
// SECTION HEADER
// ============================================================

const SectionTitle = ({ children }) => (
    <Box sx={{ mb: 1 }}>
        <Typography
            variant="h6"
            fontWeight="bold"
        >
            {children}
        </Typography>

        <Divider sx={{ mt: 1 }} />
    </Box>
);

// ============================================================
// NORMALIZE API RESPONSE
// ============================================================

const normalizeItem = (data) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return null;
    }

    const id =
        data.purchaseOrderItemId ??
        data.PurchaseOrderItemId ??
        data.id ??
        data.Id;

    if (id === null || id === undefined) {
        return null;
    }

    return {
        purchaseOrderItemId: id,

        purchaseOrderId:
            data.purchaseOrderId ??
            data.PurchaseOrderId ??
            null,

        sellerId:
            data.sellerId ??
            data.SellerId ??
            null,

        customerId:
            data.customerId ??
            data.CustomerId ??
            null,

        productId:
            data.productId ??
            data.ProductId ??
            null,

        quantity:
            data.quantity ??
            data.Quantity ??
            0,

        unitPrice:
            data.unitPrice ??
            data.UnitPrice ??
            0,

        discount:
            data.discount ??
            data.Discount ??
            0,

        taxAmount:
            data.taxAmount ??
            data.TaxAmount ??
            0,

        totalAmount:
            data.totalAmount ??
            data.TotalAmount ??
            0
    };
};

// ============================================================
// PURCHASE ORDER ITEM DETAILS PAGE
// ============================================================

const PurchaseOrderItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ""
    });

    // ========================================================
    // LOAD ITEM
    //
    // First: GET /api/purchase-order-items/{id}
    // Fallback: GET /api/purchase-order-items/all
    // ========================================================

    const loadItem = useCallback(
        async (isRefresh = false) => {
            if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
                setError(`Invalid Purchase Order Item ID: ${id}`);
                setLoading(false);
                return;
            }

            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                console.log(
                    "LOADING PURCHASE ORDER ITEM:",
                    id
                );

                let foundItem = null;
                let individualRequestError = null;

                // --------------------------------------------
                // TRY INDIVIDUAL ITEM ENDPOINT
                // --------------------------------------------

                try {
                    const response = await axios.get(
                        `${API_URL}/${encodeURIComponent(id)}`
                    );

                    const responseData = response.data;

                    // Support a direct object or common wrappers.
                    const candidate =
                        responseData?.data ??
                        responseData?.item ??
                        responseData;

                    const normalized = normalizeItem(candidate);

                    if (
                        normalized &&
                        String(normalized.purchaseOrderItemId) === String(id)
                    ) {
                        foundItem = normalized;
                    }
                } catch (requestError) {
                    individualRequestError = requestError;

                    console.warn(
                        "INDIVIDUAL ITEM ENDPOINT FAILED; TRYING COLLECTION:",
                        requestError.response?.status,
                        requestError.response?.data
                    );
                }

                // --------------------------------------------
                // FALLBACK TO WORKING COLLECTION ENDPOINT
                // --------------------------------------------

                if (!foundItem) {
                    const allResponse = await axios.get(
                        `${API_URL}/all`
                    );

                    const responseData = allResponse.data;

                    const records = Array.isArray(responseData)
                        ? responseData
                        : Array.isArray(responseData?.data)
                            ? responseData.data
                            : Array.isArray(responseData?.items)
                                ? responseData.items
                                : null;

                    if (!records) {
                        throw new Error(
                            "The API did not return a valid Purchase Order Items array."
                        );
                    }

                    const matchingRecord = records.find((record) => {
                        const recordId =
                            record.purchaseOrderItemId ??
                            record.PurchaseOrderItemId ??
                            record.id ??
                            record.Id;

                        return String(recordId) === String(id);
                    });

                    foundItem = normalizeItem(matchingRecord);
                }

                if (!foundItem) {
                    setItem(null);
                    setError(
                        `Purchase Order Item ${id} was not found.`
                    );
                    return;
                }

                setItem(foundItem);

                console.log(
                    "PURCHASE ORDER ITEM DETAILS:",
                    foundItem
                );
            } catch (requestError) {
                console.error(
                    "LOAD PURCHASE ORDER ITEM ERROR:",
                    requestError
                );

                console.error(
                    "API RESPONSE:",
                    requestError.response?.data
                );

                setItem(null);

                setError(
                    requestError.response?.data?.message ||
                    requestError.response?.data?.error ||
                    requestError.message ||
                    "Failed to load Purchase Order Item."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [id]
    );

    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {
        loadItem();
    }, [loadItem]);

    // ========================================================
    // SNACKBAR CLOSE
    // ========================================================

    const handleSnackbarClose = () => {
        setSnackbar((previous) => ({
            ...previous,
            open: false
        }));
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 350,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography>
                    Loading Purchase Order Item...
                </Typography>
            </Box>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error && !item) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Purchase Order Item Details
                </Typography>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap"
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/purchase-order-items")
                        }
                    >
                        Back to List
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={() => loadItem()}
                    >
                        Try Again
                    </Button>
                </Box>
            </Box>
        );
    }

    // ========================================================
    // NO ITEM
    // ========================================================

    if (!item) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Purchase Order Item not found.
                </Alert>

                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/purchase-order-items")
                    }
                >
                    Back to List
                </Button>
            </Box>
        );
    }

    // ========================================================
    // DETAILS PAGE
    // ========================================================

    return (
        <Box
            sx={{
                p: { xs: 2, md: 3 },
                maxWidth: 1400,
                mx: "auto"
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Purchase Order Item Details
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Item ID: {item.purchaseOrderItemId}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap"
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/purchase-order-items")
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        disabled={refreshing}
                        onClick={() => loadItem(true)}
                    >
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/purchase-order-items/edit/${item.purchaseOrderItemId}`
                            )
                        }
                    >
                        Edit
                    </Button>
                </Box>
            </Box>

            {/* ITEM DETAILS */}

            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <SectionTitle>
                    Purchase Order Item Information
                </SectionTitle>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Purchase Order Item ID"
                            value={item.purchaseOrderItemId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Purchase Order ID"
                            value={item.purchaseOrderId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Seller ID"
                            value={item.sellerId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Customer ID"
                            value={item.customerId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Product ID"
                            value={item.productId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Quantity"
                            value={item.quantity}
                            quantity
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Unit Price"
                            value={item.unitPrice}
                            currency
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Discount"
                            value={item.discount}
                            currency
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Tax Amount"
                            value={item.taxAmount}
                            currency
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* AMOUNT SUMMARY */}

            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <SectionTitle>
                    Amount Summary
                </SectionTitle>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Quantity"
                            value={item.quantity}
                            quantity
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Unit Price"
                            value={item.unitPrice}
                            currency
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Discount"
                            value={item.discount}
                            currency
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <DetailField
                            label="Tax Amount"
                            value={item.taxAmount}
                            currency
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.75 }}
                        >
                            Total Amount
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="primary.main"
                        >
                            {formatCurrency(item.totalAmount)}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* BOTTOM ACTIONS */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    flexWrap: "wrap",
                    pb: 3
                }}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/purchase-order-items")
                    }
                >
                    Back to List
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() =>
                        navigate(
                            `/purchase-order-items/edit/${item.purchaseOrderItemId}`
                        )
                    }
                >
                    Edit Item
                </Button>
            </Box>

            {/* SNACKBAR */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    onClose={handleSnackbarClose}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PurchaseOrderItemDetails;
