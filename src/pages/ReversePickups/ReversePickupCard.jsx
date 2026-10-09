import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Grid,
    Chip,
    Divider,
    Button,
    Stack,
    Tooltip
} from "@mui/material";

import {
    Inventory2,
    ShoppingBag,
    Person,
    Email,
    CalendarMonth,
    LocalShipping,
    LocationOn,
    Numbers,
    Payments,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹0.00";
    }

    return `₹${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (status) => {
    if (!status) {
        return "Pending";
    }

    const normalized = String(status)
        .trim()
        .toLowerCase();

    const statusMap = {
        pending: "Pending",
        scheduled: "Scheduled",
        "in progress": "In Progress",
        inprogress: "In Progress",
        completed: "Completed",
        cancelled: "Cancelled",
        canceled: "Cancelled"
    };

    return statusMap[normalized] || String(status);
};

/* =========================================================
   STATUS CHIP COLOR
========================================================= */

const getStatusColor = (status) => {
    switch (normalizeStatus(status).toLowerCase()) {
        case "pending":
            return "warning";

        case "scheduled":
            return "info";

        case "in progress":
            return "secondary";

        case "completed":
            return "success";

        case "cancelled":
            return "error";

        default:
            return "default";
    }
};

/* =========================================================
   GET VALUE FROM CAMELCASE / PASCALCASE
========================================================= */

const getValue = (record, ...keys) => {
    if (!record) {
        return undefined;
    }

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

    return undefined;
};

/* =========================================================
   INFORMATION ROW
========================================================= */

const InfoRow = ({
    icon,
    label,
    value,
    valueColor
}) => (
    <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        sx={{ minWidth: 0 }}
    >
        <Box
            sx={{
                color: "text.secondary",
                display: "flex",
                alignItems: "center",
                mt: 0.2
            }}
        >
            {icon}
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={500}
                color={valueColor || "text.primary"}
                sx={{
                    overflowWrap: "anywhere"
                }}
            >
                {value ?? "—"}
            </Typography>
        </Box>
    </Stack>
);

/* =========================================================
   REVERSE PICKUP CARD
========================================================= */

const ReversePickupCard = ({
    reversePickup,
    pickup,
    record,
    data,

    onView,
    onEdit,
    onDelete,

    loading = false,

    showActions = true,
    showView = true,
    showEdit = true,
    showDelete = true,

    elevation = 2,
    className,
    sx = {}
}) => {
    const item =
        reversePickup ||
        pickup ||
        record ||
        data ||
        {};

    /* =====================================================
       PICKUP DETAILS
    ===================================================== */

    const pickupId = getValue(
        item,
        "reversePickupId",
        "ReversePickupId",
        "pickupId",
        "PickupId",
        "id",
        "Id"
    );

    const pickupNumber = getValue(
        item,
        "reversePickupNumber",
        "ReversePickupNumber",
        "pickupNumber",
        "PickupNumber"
    );

    const orderNumber = getValue(
        item,
        "orderNumber",
        "OrderNumber",
        "originalOrderNumber",
        "OriginalOrderNumber"
    );

    const customerName = getValue(
        item,
        "customerName",
        "CustomerName"
    );

    const customerEmail = getValue(
        item,
        "customerEmail",
        "CustomerEmail",
        "email",
        "Email"
    );

    const pickupDate = getValue(
        item,
        "pickupDate",
        "PickupDate",
        "scheduledPickupDate",
        "ScheduledPickupDate"
    );

    const pickupAddress = getValue(
        item,
        "pickupAddress",
        "PickupAddress",
        "address",
        "Address"
    );

    const itemName = getValue(
        item,
        "itemName",
        "ItemName",
        "productName",
        "ProductName"
    );

    const sku = getValue(
        item,
        "sku",
        "SKU",
        "itemSku",
        "ItemSku"
    );

    const quantity = getValue(
        item,
        "quantity",
        "Quantity"
    );

    const carrierName = getValue(
        item,
        "carrierName",
        "CarrierName"
    );

    const trackingNumber = getValue(
        item,
        "trackingNumber",
        "TrackingNumber"
    );

    const pickupCost = getValue(
        item,
        "pickupCost",
        "PickupCost"
    );

    const status = normalizeStatus(
        getValue(item, "status", "Status")
    );

    const notes = getValue(
        item,
        "notes",
        "Notes"
    );

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = () => {
        if (typeof onView === "function") {
            onView(item);
        }
    };

    const handleEdit = () => {
        if (typeof onEdit === "function") {
            onEdit(item);
        }
    };

    const handleDelete = () => {
        if (typeof onDelete === "function") {
            onDelete(item);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Card
            className={className}
            elevation={elevation}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "box-shadow 0.2s ease",
                "&:hover": {
                    boxShadow: 5
                },
                ...sx
            }}
        >
            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                {/* HEADER */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                    sx={{ mb: 2 }}
                >
                    <Stack
                        direction="row"
                        spacing={1.25}
                        alignItems="center"
                        sx={{ minWidth: 0 }}
                    >
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "action.hover",
                                color: "primary.main",
                                flexShrink: 0
                            }}
                        >
                            <Inventory2 />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {pickupNumber ||
                                    (pickupId != null
                                        ? `Pickup #${pickupId}`
                                        : "Reverse Pickup")}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Order: {orderNumber || "—"}
                            </Typography>
                        </Box>
                    </Stack>

                    <Chip
                        label={status}
                        color={getStatusColor(status)}
                        size="small"
                        variant="outlined"
                    />
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* CUSTOMER */}

                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Customer Information
                </Typography>

                <Stack spacing={1.5}>
                    <InfoRow
                        icon={<Person fontSize="small" />}
                        label="Customer"
                        value={customerName}
                    />

                    <InfoRow
                        icon={<Email fontSize="small" />}
                        label="Email"
                        value={customerEmail}
                    />

                    <InfoRow
                        icon={<CalendarMonth fontSize="small" />}
                        label="Pickup Date"
                        value={formatDate(pickupDate)}
                    />

                    {pickupAddress && (
                        <InfoRow
                            icon={<LocationOn fontSize="small" />}
                            label="Pickup Address"
                            value={pickupAddress}
                        />
                    )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* RETURN ITEM */}

                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Return Item
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <InfoRow
                            icon={<ShoppingBag fontSize="small" />}
                            label="Item Name"
                            value={itemName}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <InfoRow
                            icon={<Numbers fontSize="small" />}
                            label="SKU"
                            value={sku}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <InfoRow
                            icon={<Numbers fontSize="small" />}
                            label="Quantity"
                            value={quantity ?? "—"}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <InfoRow
                            icon={<Payments fontSize="small" />}
                            label="Pickup Cost"
                            value={formatCurrency(pickupCost)}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* CARRIER */}

                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Carrier Information
                </Typography>

                <Stack spacing={1.5}>
                    <InfoRow
                        icon={<LocalShipping fontSize="small" />}
                        label="Carrier"
                        value={carrierName}
                    />

                    <InfoRow
                        icon={<Numbers fontSize="small" />}
                        label="Tracking Number"
                        value={trackingNumber}
                    />
                </Stack>

                {notes && (
                    <>
                        <Divider sx={{ my: 2 }} />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Notes
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.5,
                                overflowWrap: "anywhere"
                            }}
                        >
                            {notes}
                        </Typography>
                    </>
                )}
            </CardContent>

            {/* ACTIONS */}

            {showActions && (
                <CardActions
                    sx={{
                        px: 2.5,
                        py: 1.5,
                        borderTop: 1,
                        borderColor: "divider",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        gap: 0.5
                    }}
                >
                    {showView && (
                        <Tooltip title="View pickup details">
                            <span>
                                <Button
                                    size="small"
                                    startIcon={<Visibility />}
                                    onClick={handleView}
                                    disabled={loading || !onView}
                                >
                                    View
                                </Button>
                            </span>
                        </Tooltip>
                    )}

                    {showEdit && (
                        <Tooltip title="Edit reverse pickup">
                            <span>
                                <Button
                                    size="small"
                                    color="primary"
                                    startIcon={<Edit />}
                                    onClick={handleEdit}
                                    disabled={loading || !onEdit}
                                >
                                    Edit
                                </Button>
                            </span>
                        </Tooltip>
                    )}

                    {showDelete && (
                        <Tooltip title="Delete reverse pickup">
                            <span>
                                <Button
                                    size="small"
                                    color="error"
                                    startIcon={<Delete />}
                                    onClick={handleDelete}
                                    disabled={
                                        loading ||
                                        !onDelete
                                    }
                                >
                                    Delete
                                </Button>
                            </span>
                        </Tooltip>
                    )}
                </CardActions>
            )}
        </Card>
    );
};

export default ReversePickupCard;

