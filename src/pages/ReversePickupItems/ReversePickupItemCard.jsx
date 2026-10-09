
// ReversePickupItemCard.jsx

import React from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography,
    Tooltip,
    IconButton
} from "@mui/material";

import {
    Inventory2,
    LocalShipping,
    ReceiptLong,
    Visibility,
    Edit,
    Delete,
    AttachMoney,
    Numbers
} from "@mui/icons-material";

/* =========================================================
   FORMAT HELPERS
========================================================= */

const formatText = (value) => {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
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

/* =========================================================
   STATUS COLOR
========================================================= */

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

/* =========================================================
   FIELD COMPONENT
========================================================= */

const CardField = ({
    icon,
    label,
    value,
    valueNode
}) => (
    <Stack
        direction="row"
        spacing={1.25}
        alignItems="flex-start"
        sx={{ minWidth: 0 }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                pt: 0.25
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

            {valueNode || (
                <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ overflowWrap: "anywhere" }}
                >
                    {formatText(value)}
                </Typography>
            )}
        </Box>
    </Stack>
);

/* =========================================================
   REVERSE PICKUP ITEM CARD
========================================================= */

const ReversePickupItemCard = ({
    item,
    reversePickupItem,

    onView,
    onEdit,
    onDelete,

    onViewDetails,
    onEditItem,
    onDeleteItem,

    showActions = true,
    showViewButton = true,
    showEditButton = true,
    showDeleteButton = true,

    compact = false
}) => {
    const data = item || reversePickupItem || {};

    /* =====================================================
       FIELD ALIASES
    ===================================================== */

    const id =
        data.reversePickupItemId ??
        data.ReversePickupItemId ??
        data.id ??
        data.Id;

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

    const itemId =
        data.itemId ??
        data.ItemId ??
        data.productId ??
        data.ProductId;

    const itemName =
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

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = () => {
        const callback = onView || onViewDetails;

        if (typeof callback === "function") {
            callback(data);
        }
    };

    const handleEdit = () => {
        const callback = onEdit || onEditItem;

        if (typeof callback === "function") {
            callback(data);
        }
    };

    const handleDelete = () => {
        const callback = onDelete || onDeleteItem;

        if (typeof callback === "function") {
            callback(data);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                "&:hover": {
                    boxShadow: 5,
                    transform: "translateY(-2px)"
                }
            }}
        >
            {/* CARD HEADER */}

            <Box
                sx={{
                    p: 2,
                    bgcolor: "action.hover",
                    borderBottom: "1px solid",
                    borderColor: "divider"
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1.5}
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
                                bgcolor: "background.paper",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}
                        >
                            <Inventory2 color="primary" />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {formatText(itemName)}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Item ID: {formatText(id)}
                            </Typography>
                        </Box>
                    </Stack>

                    <Chip
                        size="small"
                        label={formatText(status)}
                        color={getStatusColor(status)}
                        sx={{ flexShrink: 0 }}
                    />
                </Stack>
            </Box>

            {/* CARD CONTENT */}

            <CardContent
                sx={{
                    p: 2.5,
                    flexGrow: 1,
                    "&:last-child": { pb: 2.5 }
                }}
            >
                {/* PRODUCT DETAILS */}

                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Product Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <CardField
                            icon={<Numbers fontSize="small" />}
                            label="Product ID"
                            value={itemId}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <CardField
                            icon={<Inventory2 fontSize="small" />}
                            label="SKU"
                            value={sku}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <CardField
                            icon={<Numbers fontSize="small" />}
                            label="Quantity"
                            value={formatNumber(quantity)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <CardField
                            icon={<AttachMoney fontSize="small" />}
                            label="Pickup Cost"
                            valueNode={
                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    color="primary.main"
                                >
                                    {formatCurrency(pickupCost)}
                                </Typography>
                            }
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2.5 }} />

                {/* PICKUP DETAILS */}

                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Pickup Information
                </Typography>

                <Stack spacing={2}>
                    <CardField
                        icon={<LocalShipping fontSize="small" />}
                        label="Reverse Pickup Number"
                        value={reversePickupNumber}
                    />

                    <CardField
                        icon={<ReceiptLong fontSize="small" />}
                        label="Order Number"
                        value={orderNumber}
                    />

                    {!compact && (
                        <>
                            <CardField
                                icon={<LocalShipping fontSize="small" />}
                                label="Tracking Number"
                                value={trackingNumber}
                            />

                            <CardField
                                icon={<ReceiptLong fontSize="small" />}
                                label="Reason"
                                value={reason}
                            />

                            <CardField
                                icon={<ReceiptLong fontSize="small" />}
                                label="Notes"
                                value={notes}
                            />
                        </>
                    )}
                </Stack>

                {(reversePickupId !== undefined ||
                    orderId !== undefined) && (
                    <>
                        <Divider sx={{ my: 2.5 }} />

                        <Stack
                            direction="row"
                            spacing={2}
                            flexWrap="wrap"
                            useFlexGap
                        >
                            {reversePickupId !== undefined && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Reverse Pickup ID:{" "}
                                    {formatText(reversePickupId)}
                                </Typography>
                            )}

                            {orderId !== undefined && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Order ID: {formatText(orderId)}
                                </Typography>
                            )}
                        </Stack>
                    </>
                )}
            </CardContent>

            {/* CARD ACTIONS */}

            {showActions && (
                <CardActions
                    sx={{
                        p: 2,
                        pt: 1.5,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        justifyContent: "space-between",
                        gap: 1,
                        flexWrap: "wrap"
                    }}
                >
                    <Box>
                        {showViewButton && (
                            <Tooltip title="View Details">
                                <IconButton
                                    color="info"
                                    onClick={handleView}
                                    aria-label="View reverse pickup item"
                                >
                                    <Visibility />
                                </IconButton>
                            </Tooltip>
                        )}

                        {showEditButton && (
                            <Tooltip title="Edit Item">
                                <IconButton
                                    color="primary"
                                    onClick={handleEdit}
                                    aria-label="Edit reverse pickup item"
                                >
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        )}

                        {showDeleteButton && (
                            <Tooltip title="Delete Item">
                                <IconButton
                                    color="error"
                                    onClick={handleDelete}
                                    aria-label="Delete reverse pickup item"
                                >
                                    <Delete />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={handleView}
                    >
                        View
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

export default ReversePickupItemCard;

