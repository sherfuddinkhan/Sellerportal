// ReversePickupItemDetails.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh,
    Inventory2,
    LocalShipping,
    ReceiptLong,
    AttachMoney
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const API_URL = `${API_BASE_URL}/api/ReversePickupItems`;

/* =========================================================
   FORMAT HELPERS
========================================================= */

const formatText = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    return String(value);
};

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
};

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

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const getStatusColor = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    switch (normalizedStatus) {
        case "completed":
        case "received":
        case "approved":
            return "success";

        case "pending":
        case "requested":
        case "scheduled":
            return "warning";

        case "rejected":
        case "cancelled":
            return "error";

        case "picked up":
        case "in transit":
            return "info";

        default:
            return "default";
    }
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

    return error?.message ||
        "Unable to load reverse pickup item details.";
};

/* =========================================================
   RESPONSE HELPER
========================================================= */

const extractItem = (response) => {
    const data = response?.data;

    if (!data) {
        return null;
    }

    if (Array.isArray(data)) {
        return data[0] || null;
    }

    if (data.data && !Array.isArray(data.data)) {
        return data.data;
    }

    if (Array.isArray(data.data)) {
        return data.data[0] || null;
    }

    return (
        data.item ||
        data.reversePickupItem ||
        data.result ||
        data
    );
};

/* =========================================================
   DETAIL FIELD
========================================================= */

const DetailField = ({
    label,
    value,
    valueNode,
    fullWidth = false
}) => (
    <Grid item xs={12} sm={fullWidth ? 12 : 6} md={fullWidth ? 12 : 4}>
        <Box
            sx={{
                p: 2,
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper"
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: "block",
                    mb: 0.75,
                    textTransform: "uppercase",
                    letterSpacing: 0.4
                }}
            >
                {label}
            </Typography>

            {valueNode || (
                <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {formatText(value)}
                </Typography>
            )}
        </Box>
    </Grid>
);

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({ icon, title, subtitle }) => (
    <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ mb: 2.5 }}
    >
        <Box
            sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "action.hover"
            }}
        >
            {icon}
        </Box>

        <Box>
            <Typography variant="h6" fontWeight={700}>
                {title}
            </Typography>

            {subtitle && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    </Stack>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ReversePickupItemDetails = ({
    itemId,
    id,
    item,
    reversePickupItem,
    apiUrl = API_URL,
    onBack,
    onEdit,
    onRefresh
}) => {
    const initialItem = item || reversePickupItem || null;

    const resolvedId =
        itemId ??
        id ??
        initialItem?.reversePickupItemId ??
        initialItem?.ReversePickupItemId ??
        initialItem?.id ??
        initialItem?.Id ??
        "";

    const [itemData, setItemData] = useState(initialItem);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

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
       LOAD ITEM DETAILS
    ===================================================== */

    const fetchItemDetails = async (isRefresh = false) => {
        if (resolvedId === "" || resolvedId === null) {
            if (initialItem) {
                setItemData(initialItem);
                setError("");
            } else {
                setError(
                    "Reverse pickup item ID was not provided."
                );
            }

            return;
        }

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const response = await axios.get(
                `${apiUrl}/${encodeURIComponent(resolvedId)}`
            );

            const data = extractItem(response);

            if (!data) {
                throw new Error(
                    "Reverse pickup item was not found."
                );
            }

            setItemData(data);

            if (isRefresh) {
                showNotification(
                    "Item details refreshed successfully."
                );
            }
        } catch (fetchError) {
            console.error(
                "GET REVERSE PICKUP ITEM DETAILS ERROR:",
                fetchError
            );

            const message = getErrorMessage(fetchError);

            setError(message);

            if (isRefresh) {
                showNotification(message, "error");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (initialItem) {
            setItemData(initialItem);
        }

        fetchItemDetails();

        // Re-fetch when the selected ID or endpoint changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resolvedId, apiUrl]);

    /* =====================================================
       FIELD ALIASES
    ===================================================== */

    const data = itemData || {};

    const pickupItemId =
        data.reversePickupItemId ??
        data.ReversePickupItemId ??
        data.id ??
        data.Id ??
        resolvedId;

    const reversePickupId =
        data.reversePickupId ??
        data.ReversePickupId;

    const reversePickupNumber =
        data.reversePickupNumber ??
        data.ReversePickupNumber;

    const orderId =
        data.orderId ??
        data.OrderId;

    const orderNumber =
        data.orderNumber ??
        data.OrderNumber;

    const productId =
        data.itemId ??
        data.ItemId ??
        data.productId ??
        data.ProductId;

    const productName =
        data.itemName ??
        data.ItemName ??
        data.productName ??
        data.ProductName;

    const sku =
        data.sku ??
        data.SKU;

    const quantity =
        data.quantity ??
        data.Quantity;

    const status =
        data.status ??
        data.Status;

    const reason =
        data.reason ??
        data.Reason;

    const pickupCost =
        data.pickupCost ??
        data.PickupCost;

    const trackingNumber =
        data.trackingNumber ??
        data.TrackingNumber;

    const notes =
        data.notes ??
        data.Notes;

    const createdAt =
        data.createdAt ??
        data.CreatedAt;

    const updatedAt =
        data.updatedAt ??
        data.UpdatedAt;

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleRefresh = async () => {
        await fetchItemDetails(true);

        if (typeof onRefresh === "function") {
            onRefresh();
        }
    };

    const handleBack = () => {
        if (typeof onBack === "function") {
            onBack();
        }
    };

    const handleEdit = () => {
        if (typeof onEdit === "function") {
            onEdit(data);
        }
    };

    /* =====================================================
       LOADING VIEW
    ===================================================== */

    if (loading && !itemData) {
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

                <Typography color="text.secondary">
                    Loading reverse pickup item details...
                </Typography>
            </Paper>
        );
    }

    /* =====================================================
       ERROR VIEW
    ===================================================== */

    if (error && !itemData) {
        return (
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 3
                }}
            >
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>

                <Stack
                    direction="row"
                    spacing={1.5}
                    flexWrap="wrap"
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={() => fetchItemDetails()}
                    >
                        Retry
                    </Button>
                </Stack>
            </Paper>
        );
    }

    /* =====================================================
       MAIN VIEW
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
                            Reverse Pickup Item Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            View the item, pickup, and tracking information.
                        </Typography>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={
                                refreshing
                                    ? (
                                        <CircularProgress
                                            size={16}
                                        />
                                    )
                                    : <Refresh />
                            }
                            onClick={handleRefresh}
                            disabled={refreshing}
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
                    </Stack>
                </Stack>

                {error && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Divider sx={{ mb: 3 }} />

                {/* SUMMARY */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: "action.hover"
                    }}
                >
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={2}
                    >
                        <Box>
                            <Typography
                                variant="overline"
                                color="text.secondary"
                            >
                                Item
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                {formatText(productName)}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Item ID: {formatText(pickupItemId)}
                            </Typography>
                        </Box>

                        <Chip
                            label={formatText(status)}
                            color={getStatusColor(status)}
                            variant="filled"
                        />
                    </Stack>
                </Paper>

                {/* REVERSE PICKUP DETAILS */}

                <Box sx={{ mb: 4 }}>
                    <SectionHeader
                        icon={<LocalShipping />}
                        title="Reverse Pickup Information"
                        subtitle="Associated pickup record"
                    />

                    <Grid container spacing={2}>
                        <DetailField
                            label="Reverse Pickup Item ID"
                            value={pickupItemId}
                        />

                        <DetailField
                            label="Reverse Pickup ID"
                            value={reversePickupId}
                        />

                        <DetailField
                            label="Reverse Pickup Number"
                            value={reversePickupNumber}
                        />

                        <DetailField
                            label="Status"
                            valueNode={
                                <Chip
                                    label={formatText(status)}
                                    color={getStatusColor(status)}
                                    size="small"
                                />
                            }
                        />

                        <DetailField
                            label="Reason"
                            value={reason}
                        />

                        <DetailField
                            label="Tracking Number"
                            value={trackingNumber}
                        />
                    </Grid>
                </Box>

                {/* ORDER DETAILS */}

                <Box sx={{ mb: 4 }}>
                    <SectionHeader
                        icon={<ReceiptLong />}
                        title="Order Information"
                        subtitle="Order associated with this item"
                    />

                    <Grid container spacing={2}>
                        <DetailField
                            label="Order ID"
                            value={orderId}
                        />

                        <DetailField
                            label="Order Number"
                            value={orderNumber}
                        />
                    </Grid>
                </Box>

                {/* PRODUCT DETAILS */}

                <Box sx={{ mb: 4 }}>
                    <SectionHeader
                        icon={<Inventory2 />}
                        title="Product Information"
                        subtitle="Product and quantity details"
                    />

                    <Grid container spacing={2}>
                        <DetailField
                            label="Product / Item ID"
                            value={productId}
                        />

                        <DetailField
                            label="Product / Item Name"
                            value={productName}
                        />

                        <DetailField
                            label="SKU"
                            value={sku}
                        />

                        <DetailField
                            label="Quantity"
                            value={formatNumber(quantity)}
                        />
                    </Grid>
                </Box>

                {/* COST DETAILS */}

                <Box sx={{ mb: 4 }}>
                    <SectionHeader
                        icon={<AttachMoney />}
                        title="Pickup Cost"
                        subtitle="Cost associated with the reverse pickup item"
                    />

                    <Grid container spacing={2}>
                        <DetailField
                            label="Pickup Cost"
                            valueNode={
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {formatCurrency(pickupCost)}
                                </Typography>
                            }
                        />
                    </Grid>
                </Box>

                {/* NOTES */}

                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Notes
                    </Typography>

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            minHeight: 70
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{ whiteSpace: "pre-wrap" }}
                        >
                            {formatText(notes)}
                        </Typography>
                    </Paper>
                </Box>

                {/* AUDIT INFORMATION */}

                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Record Information
                    </Typography>

                    <Grid container spacing={2}>
                        <DetailField
                            label="Created At"
                            value={formatDate(createdAt)}
                        />

                        <DetailField
                            label="Last Updated At"
                            value={formatDate(updatedAt)}
                        />
                    </Grid>
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

export default ReversePickupItemDetails;

