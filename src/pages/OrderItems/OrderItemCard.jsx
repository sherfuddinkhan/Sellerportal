import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Inventory2,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";


const OrderItemCard = ({
    item,
    onView,
    onEdit,
    onDelete
}) => {

    if (!item) {
        return null;
    }


    // =====================================================
    // Values
    // =====================================================

    const orderItemId =
        item.OrderItemId ??
        item.orderItemId;

    const orderId =
        item.OrderId ??
        item.orderId;

    const productId =
        item.ProductId ??
        item.productId;

    const quantity =
        item.Quantity ??
        item.quantity ??
        0;

    const unitPrice =
        item.UnitPrice ??
        item.unitPrice ??
        0;

    const totalAmount =
        item.TotalAmount ??
        item.totalAmount ??
        0;


    // =====================================================
    // Format Currency
    // =====================================================

    const formatCurrency = (value) => {

        return Number(
            value || 0
        ).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    };


    // =====================================================
    // Render
    // =====================================================

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

                {/* =========================================
                    Header
                ========================================== */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Inventory2
                        color="primary"
                        fontSize="large"
                    />

                </Stack>


                {/* =========================================
                    Order Item ID
                ========================================== */}

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    Order Item #
                    {orderItemId ?? "-"}
                </Typography>


                {/* =========================================
                    Order ID
                ========================================== */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Order ID:</strong>{" "}
                    {orderId ?? "-"}
                </Typography>


                {/* =========================================
                    Product ID
                ========================================== */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Product ID:</strong>{" "}
                    {productId ?? "-"}
                </Typography>


                {/* =========================================
                    Quantity
                ========================================== */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Quantity:</strong>{" "}
                    {Number(quantity).toFixed(2)}
                </Typography>


                {/* =========================================
                    Unit Price
                ========================================== */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    <strong>Unit Price:</strong>{" "}
                    ₹ {formatCurrency(unitPrice)}
                </Typography>


                {/* =========================================
                    Total Amount
                ========================================== */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Total:</strong>{" "}
                    ₹ {formatCurrency(totalAmount)}
                </Typography>

            </CardContent>


            <Divider />


            {/* =============================================
                Actions
            ============================================== */}

            <CardActions
                sx={{
                    justifyContent: "flex-end"
                }}
            >

                {/* View */}

                <Tooltip title="View">

                    <IconButton
                        color="primary"
                        onClick={() => onView(item)}
                    >
                        <Visibility />
                    </IconButton>

                </Tooltip>


                {/* Edit */}

                <Tooltip title="Edit">

                    <IconButton
                        color="warning"
                        onClick={() => onEdit(item)}
                    >
                        <Edit />
                    </IconButton>

                </Tooltip>


                {/* Delete */}

                <Tooltip title="Delete">

                    <IconButton
                        color="error"
                        onClick={() => onDelete(item)}
                    >
                        <Delete />
                    </IconButton>

                </Tooltip>

            </CardActions>

        </Card>
    );
};


export default OrderItemCard;
