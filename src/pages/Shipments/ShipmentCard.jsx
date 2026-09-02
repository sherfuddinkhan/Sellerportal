// =========================================================
// ShipmentCard.jsx
// Shipment Card
// =========================================================

import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    IconButton,
    Tooltip,
    Chip,
    Box
} from "@mui/material";

import {
    LocalShipping,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const ShipmentCard = ({
    item,
    onView,
    onEdit,
    onDelete
}) => {

    // ---------------------------------------------------------
    // NO ITEM
    // ---------------------------------------------------------

    if (!item) {
        return null;
    }

    // ---------------------------------------------------------
    // GET VALUE
    // Supports camelCase + PascalCase
    // ---------------------------------------------------------

    const getValue = (
        camelCase,
        pascalCase,
        defaultValue = null
    ) => {

        return (
            item?.[camelCase] ??
            item?.[pascalCase] ??
            defaultValue
        );
    };

    // ---------------------------------------------------------
    // VALUES
    // ---------------------------------------------------------

    const shipmentId = getValue(
        "shipmentId",
        "ShipmentId"
    );

    const sellerId = getValue(
        "sellerId",
        "SellerId"
    );

    const customerId = getValue(
        "customerId",
        "CustomerId"
    );

    const orderId = getValue(
        "orderId",
        "OrderId"
    );

    const courierName = getValue(
        "courierName",
        "CourierName"
    );

    const trackingNumber = getValue(
        "trackingNumber",
        "TrackingNumber"
    );

    const shipmentDate = getValue(
        "shipmentDate",
        "ShipmentDate"
    );

    const deliveryDate = getValue(
        "deliveryDate",
        "DeliveryDate"
    );

    const shipmentStatus = getValue(
        "shipmentStatus",
        "ShipmentStatus"
    );

    // ---------------------------------------------------------
    // STATUS COLOR
    // ---------------------------------------------------------

    const getStatusColor = (status) => {

        switch (
            String(status || "")
                .toLowerCase()
                .trim()
        ) {

            case "pending":
                return "warning";

            case "processing":
                return "info";

            case "packed":
                return "secondary";

            case "shipped":
                return "primary";

            case "in transit":
                return "info";

            case "out for delivery":
                return "warning";

            case "delivered":
                return "success";

            case "cancelled":
                return "error";

            case "returned":
                return "error";

            default:
                return "default";
        }
    };

    // ---------------------------------------------------------
    // FORMAT DATE
    // ---------------------------------------------------------

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };

    // ---------------------------------------------------------
    // RETURN
    // ---------------------------------------------------------

    return (

        <Card
            elevation={3}
            sx={{
                height: "100%",
                borderRadius: 2,
                transition: "0.3s",

                "&:hover": {
                    transform:
                        "translateY(-4px)",
                    boxShadow: 8
                }
            }}
        >

            <CardContent>

                {/* =================================================
                    HEADER
                ================================================= */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <LocalShipping
                        color="primary"
                        fontSize="large"
                    />

                    <Chip
                        label={
                            shipmentStatus ||
                            "N/A"
                        }
                        color={
                            getStatusColor(
                                shipmentStatus
                            )
                        }
                        size="small"
                    />

                </Stack>

                {/* =================================================
                    SHIPMENT ID
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    Shipment #{shipmentId ?? "-"}
                </Typography>

                {/* =================================================
                    SELLER / CUSTOMER
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Seller ID:</strong>{" "}
                    {sellerId ?? "-"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Customer ID:</strong>{" "}
                    {customerId ?? "-"}
                </Typography>

                {/* =================================================
                    ORDER
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Order ID:</strong>{" "}
                    {orderId ?? "-"}
                </Typography>

                {/* =================================================
                    COURIER
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Courier:</strong>{" "}
                    {courierName || "-"}
                </Typography>

                {/* =================================================
                    TRACKING
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        wordBreak: "break-word"
                    }}
                >
                    <strong>Tracking:</strong>{" "}
                    {trackingNumber || "-"}
                </Typography>

                {/* =================================================
                    SHIPMENT DATE
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Ship Date:</strong>{" "}
                    {formatDate(shipmentDate)}
                </Typography>

                {/* =================================================
                    DELIVERY DATE
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Delivery Date:</strong>{" "}
                    {formatDate(deliveryDate)}
                </Typography>

            </CardContent>

            <Divider />

            {/* =================================================
                ACTIONS
            ================================================= */}

            <CardActions
                sx={{
                    justifyContent: "flex-end"
                }}
            >

                <Tooltip title="View">

                    <IconButton
                        color="primary"
                        onClick={() =>
                            onView?.(item)
                        }
                    >
                        <Visibility />
                    </IconButton>

                </Tooltip>

                <Tooltip title="Edit">

                    <IconButton
                        color="warning"
                        onClick={() =>
                            onEdit?.(item)
                        }
                    >
                        <Edit />
                    </IconButton>

                </Tooltip>

                <Tooltip title="Delete">

                    <IconButton
                        color="error"
                        onClick={() =>
                            onDelete?.(item)
                        }
                    >
                        <Delete />
                    </IconButton>

                </Tooltip>

            </CardActions>

        </Card>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ShipmentCard;
