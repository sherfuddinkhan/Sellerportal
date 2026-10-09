import React from "react";

import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Stack,
    Button
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    AssignmentReturn,
    Refresh,
    Inventory2
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPERS
========================================================= */

const getField = (record, ...keys) => {
    if (!record) return null;

    for (const key of keys) {
        const value = record[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return String(value);
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

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

/* =========================================================
   STATUS CONFIGURATION
========================================================= */

const getStatusConfig = (status) => {
    const normalized = String(status || "Pending")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");

    if (
        normalized.includes("complete") ||
        normalized === "delivered" ||
        normalized === "received" ||
        normalized === "closed"
    ) {
        return {
            label: "Completed",
            color: "success"
        };
    }

    if (
        normalized.includes("cancel") ||
        normalized === "rejected"
    ) {
        return {
            label: "Cancelled",
            color: "error"
        };
    }

    if (
        normalized.includes("progress") ||
        normalized.includes("picked") ||
        normalized.includes("transit")
    ) {
        return {
            label: "In Progress",
            color: "info"
        };
    }

    if (
        normalized.includes("schedule") ||
        normalized.includes("assigned")
    ) {
        return {
            label: "Scheduled",
            color: "secondary"
        };
    }

    if (
        normalized.includes("pending") ||
        normalized.includes("requested") ||
        normalized.includes("open")
    ) {
        return {
            label: "Pending",
            color: "warning"
        };
    }

    return {
        label: status || "Unknown",
        color: "default"
    };
};

/* =========================================================
   REVERSE PICKUP TABLE
========================================================= */

const ReversePickupTable = ({
    reversePickups = [],
    pickups = [],
    data,
    loading = false,
    error = null,

    onView,
    onEdit,
    onDelete,
    onRefresh,

    showActions = true,
    showView = true,
    showEdit = true,
    showDelete = true,

    emptyMessage = "No reverse pickup records found."
}) => {
    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const sourceData =
        Array.isArray(reversePickups) ? reversePickups :
        Array.isArray(pickups) ? pickups :
        Array.isArray(data) ? data :
        Array.isArray(data?.items) ? data.items :
        Array.isArray(data?.Items) ? data.Items :
        Array.isArray(data?.data) ? data.data :
        Array.isArray(data?.Data) ? data.Data :
        Array.isArray(data?.records) ? data.records :
        Array.isArray(data?.Records) ? data.Records :
        [];

    /* =====================================================
       RECORD IDENTIFIER
    ===================================================== */

    const getPickupId = (pickup) =>
        getField(
            pickup,
            "reversePickupId",
            "ReversePickupId",
            "reversePickupID",
            "ReversePickupID",
            "pickupId",
            "PickupId",
            "id",
            "Id"
        );

    /* =====================================================
       RECORD NUMBER
    ===================================================== */

    const getPickupNumber = (pickup) =>
        getField(
            pickup,
            "reversePickupNumber",
            "ReversePickupNumber",
            "pickupNumber",
            "PickupNumber",
            "reversePickupNo",
            "ReversePickupNo",
            "returnPickupNumber",
            "ReturnPickupNumber"
        ) || getPickupId(pickup) || "—";

    /* =====================================================
       STATUS CHIP
    ===================================================== */

    const renderStatus = (status) => {
        const config = getStatusConfig(status);

        return (
            <Chip
                label={config.label}
                color={config.color}
                size="small"
                variant="outlined"
                sx={{
                    fontWeight: 600,
                    minWidth: 90
                }}
            />
        );
    };

    /* =====================================================
       ACTION BUTTONS
    ===================================================== */

    const renderActions = (pickup) => (
        <Stack
            direction="row"
            spacing={0.5}
            justifyContent="center"
        >
            {showView && (
                <Tooltip title="View reverse pickup">
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onView?.(pickup)}
                        aria-label="View reverse pickup"
                    >
                        <Visibility fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}

            {showEdit && (
                <Tooltip title="Edit reverse pickup">
                    <IconButton
                        size="small"
                        color="info"
                        onClick={() => onEdit?.(pickup)}
                        aria-label="Edit reverse pickup"
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}

            {showDelete && (
                <Tooltip title="Delete reverse pickup">
                    <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete?.(pickup)}
                        aria-label="Delete reverse pickup"
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </Stack>
    );

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading && sourceData.length === 0) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 5,
                    borderRadius: 2,
                    textAlign: "center"
                }}
            >
                <CircularProgress size={36} />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Loading reverse pickups...
                </Typography>
            </Paper>
        );
    }

    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error && sourceData.length === 0) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 4,
                    borderRadius: 2,
                    textAlign: "center"
                }}
            >
                <Typography
                    color="error"
                    variant="body1"
                    fontWeight={600}
                >
                    Failed to load reverse pickups
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, mb: 2 }}
                >
                    {typeof error === "string"
                        ? error
                        : error?.message || "An unexpected error occurred."}
                </Typography>

                {onRefresh && (
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                    >
                        Retry
                    </Button>
                )}
            </Paper>
        );
    }

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (sourceData.length === 0) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 5,
                    borderRadius: 2,
                    textAlign: "center"
                }}
            >
                <AssignmentReturn
                    sx={{
                        fontSize: 48,
                        color: "text.secondary",
                        mb: 1
                    }}
                />

                <Typography variant="h6" fontWeight={600}>
                    No Reverse Pickups
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    {emptyMessage}
                </Typography>

                {onRefresh && (
                    <Button
                        sx={{ mt: 2 }}
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={onRefresh}
                    >
                        Refresh
                    </Button>
                )}
            </Paper>
        );
    }

    /* =====================================================
       TABLE
    ===================================================== */

    return (
        <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
                borderRadius: 2,
                width: "100%",
                overflowX: "auto"
            }}
        >
            <Table
                size="medium"
                stickyHeader
                aria-label="Reverse pickup records"
            >
                {/* TABLE HEADER */}

                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700, minWidth: 145 }}>
                            Pickup Number
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>
                            Order Number
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700, minWidth: 160 }}>
                            Customer
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700, minWidth: 130 }}>
                            Pickup Date
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>
                            Return Item
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>
                            Carrier
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700, minWidth: 130 }}>
                            Tracking Number
                        </TableCell>

                        <TableCell
                            align="right"
                            sx={{ fontWeight: 700, minWidth: 115 }}
                        >
                            Quantity
                        </TableCell>

                        <TableCell
                            align="right"
                            sx={{ fontWeight: 700, minWidth: 125 }}
                        >
                            Pickup Cost
                        </TableCell>

                        <TableCell sx={{ fontWeight: 700, minWidth: 130 }}>
                            Status
                        </TableCell>

                        {showActions && (
                            <TableCell
                                align="center"
                                sx={{ fontWeight: 700, minWidth: 125 }}
                            >
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>

                {/* TABLE BODY */}

                <TableBody>
                    {sourceData.map((pickup, index) => {
                        const pickupId = getPickupId(pickup);

                        const orderNumber = getField(
                            pickup,
                            "orderNumber",
                            "OrderNumber",
                            "salesOrderNumber",
                            "SalesOrderNumber",
                            "originalOrderNumber",
                            "OriginalOrderNumber",
                            "returnOrderNumber",
                            "ReturnOrderNumber",
                            "rmaNumber",
                            "RMANumber"
                        );

                        const customerName = getField(
                            pickup,
                            "customerName",
                            "CustomerName",
                            "customerFullName",
                            "CustomerFullName",
                            "customer",
                            "Customer",
                            "buyerName",
                            "BuyerName"
                        );

                        const pickupDate = getField(
                            pickup,
                            "pickupDate",
                            "PickupDate",
                            "scheduledPickupDate",
                            "ScheduledPickupDate",
                            "requestedPickupDate",
                            "RequestedPickupDate",
                            "createdAt",
                            "CreatedAt"
                        );

                        const itemName = getField(
                            pickup,
                            "itemName",
                            "ItemName",
                            "productName",
                            "ProductName",
                            "returnItemName",
                            "ReturnItemName",
                            "product",
                            "Product",
                            "sku",
                            "SKU"
                        );

                        const carrierName = getField(
                            pickup,
                            "carrierName",
                            "CarrierName",
                            "carrier",
                            "Carrier",
                            "logisticsProvider",
                            "LogisticsProvider",
                            "shippingProvider",
                            "ShippingProvider"
                        );

                        const trackingNumber = getField(
                            pickup,
                            "trackingNumber",
                            "TrackingNumber",
                            "returnTrackingNumber",
                            "ReturnTrackingNumber",
                            "reverseTrackingNumber",
                            "ReverseTrackingNumber"
                        );

                        const quantity = getField(
                            pickup,
                            "quantity",
                            "Quantity",
                            "returnQuantity",
                            "ReturnQuantity",
                            "itemQuantity",
                            "ItemQuantity",
                            "totalQuantity",
                            "TotalQuantity"
                        );

                        const pickupCost = getField(
                            pickup,
                            "pickupCost",
                            "PickupCost",
                            "returnShippingCost",
                            "ReturnShippingCost",
                            "shippingCost",
                            "ShippingCost",
                            "collectionCost",
                            "CollectionCost"
                        );

                        const status = getField(
                            pickup,
                            "status",
                            "Status",
                            "pickupStatus",
                            "PickupStatus",
                            "returnStatus",
                            "ReturnStatus"
                        );

                        return (
                            <TableRow
                                key={
                                    pickupId ??
                                    getPickupNumber(pickup) ??
                                    index
                                }
                                hover
                                sx={{
                                    "&:last-child td": {
                                        borderBottom: 0
                                    }
                                }}
                            >
                                {/* PICKUP NUMBER */}

                                <TableCell>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <Box
                                            sx={{
                                                width: 34,
                                                height: 34,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: 1.5,
                                                bgcolor: "action.hover",
                                                color: "primary.main",
                                                flexShrink: 0
                                            }}
                                        >
                                            <AssignmentReturn fontSize="small" />
                                        </Box>

                                        <Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight={700}
                                            >
                                                {getPickupNumber(pickup)}
                                            </Typography>

                                            {pickupId !== null && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    ID: {pickupId}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                </TableCell>

                                {/* ORDER NUMBER */}

                                <TableCell>
                                    <Typography variant="body2">
                                        {orderNumber || "—"}
                                    </Typography>
                                </TableCell>

                                {/* CUSTOMER */}

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                    >
                                        {customerName || "—"}
                                    </Typography>

                                    {getField(
                                        pickup,
                                        "customerEmail",
                                        "CustomerEmail",
                                        "email",
                                        "Email"
                                    ) && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                        >
                                            {getField(
                                                pickup,
                                                "customerEmail",
                                                "CustomerEmail",
                                                "email",
                                                "Email"
                                            )}
                                        </Typography>
                                    )}
                                </TableCell>

                                {/* PICKUP DATE */}

                                <TableCell>
                                    <Typography variant="body2">
                                        {formatDate(pickupDate)}
                                    </Typography>
                                </TableCell>

                                {/* RETURN ITEM */}

                                <TableCell>
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <Inventory2
                                            fontSize="small"
                                            color="action"
                                        />

                                        <Box>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                            >
                                                {itemName || "—"}
                                            </Typography>

                                            {getField(
                                                pickup,
                                                "sku",
                                                "SKU",
                                                "productSku",
                                                "ProductSku",
                                                "productCode",
                                                "ProductCode"
                                            ) && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    display="block"
                                                >
                                                    SKU:{" "}
                                                    {getField(
                                                        pickup,
                                                        "sku",
                                                        "SKU",
                                                        "productSku",
                                                        "ProductSku",
                                                        "productCode",
                                                        "ProductCode"
                                                    )}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                </TableCell>

                                {/* CARRIER */}

                                <TableCell>
                                    <Typography variant="body2">
                                        {carrierName || "—"}
                                    </Typography>
                                </TableCell>

                                {/* TRACKING NUMBER */}

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: "monospace",
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {trackingNumber || "—"}
                                    </Typography>
                                </TableCell>

                                {/* QUANTITY */}

                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {formatNumber(quantity)}
                                    </Typography>
                                </TableCell>

                                {/* PICKUP COST */}

                                <TableCell align="right">
                                    <Typography
                                        variant="body2"
                                        fontWeight={600}
                                    >
                                        {formatCurrency(pickupCost)}
                                    </Typography>
                                </TableCell>

                                {/* STATUS */}

                                <TableCell>
                                    {renderStatus(status)}
                                </TableCell>

                                {/* ACTIONS */}

                                {showActions && (
                                    <TableCell align="center">
                                        {renderActions(pickup)}
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {/* LOADING OVERLAY MESSAGE */}

            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        p: 1.5,
                        borderTop: 1,
                        borderColor: "divider"
                    }}
                >
                    <CircularProgress size={18} />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Updating reverse pickups...
                    </Typography>
                </Box>
            )}
        </TableContainer>
    );
};

export default ReversePickupTable;

