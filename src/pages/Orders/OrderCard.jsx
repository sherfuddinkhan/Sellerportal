import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Stack,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    ShoppingCart,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const OrderCard = ({
    order,
    onView,
    onEdit,
    onDelete
}) => {
    if (!order) {
        return null;
    }

    const orderId =
        order.OrderId ??
        order.orderId;

    const customerId =
        order.CustomerId ??
        order.customerId;

    const orderNumber =
        order.OrderNumber ??
        order.orderNumber;

    const orderDate =
        order.OrderDate ??
        order.orderDate;

    const orderStatus =
        order.OrderStatus ??
        order.orderStatus;

    const totalAmount =
        order.TotalAmount ??
        order.totalAmount;

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "warning";

            case "confirmed":
                return "info";

            case "processing":
                return "primary";

            case "packed":
                return "secondary";

            case "shipped":
                return "success";

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

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString();
    };

    const formatAmount = (amount) => {
        return Number(amount || 0).toLocaleString("en-IN");
    };

    return (
        <Card
            elevation={3}
            sx={{
                height: "100%",
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 8
                }
            }}
        >
            <CardContent>
                {/* Header */}
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <ShoppingCart
                        color="primary"
                        fontSize="large"
                    />

                    <Chip
                        label={orderStatus || "N/A"}
                        color={getStatusColor(orderStatus)}
                        size="small"
                    />
                </Stack>

                {/* Order Number */}
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    {orderNumber || "-"}
                </Typography>

                {/* Order ID */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Order ID:</strong>{" "}
                    {orderId ?? "-"}
                </Typography>

                {/* Customer ID */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Customer ID:</strong>{" "}
                    {customerId ?? "-"}
                </Typography>

                {/* Order Date */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Order Date:</strong>{" "}
                    {formatDate(orderDate)}
                </Typography>

                {/* Total Amount */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Total Amount:</strong>{" "}
                    ₹ {formatAmount(totalAmount)}
                </Typography>
            </CardContent>

            <Divider />

            <CardActions
                sx={{
                    justifyContent: "flex-end"
                }}
            >
                {/* View */}
                <Tooltip title="View">
                    <IconButton
                        color="primary"
                        onClick={() => onView(order)}
                    >
                        <Visibility />
                    </IconButton>
                </Tooltip>

                {/* Edit */}
                <Tooltip title="Edit">
                    <IconButton
                        color="warning"
                        onClick={() => onEdit(order)}
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>

                {/* Delete */}
                <Tooltip title="Delete">
                    <IconButton
                        color="error"
                        onClick={() => onDelete(order)}
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default OrderCard;
