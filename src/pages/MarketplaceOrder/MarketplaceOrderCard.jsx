import React from "react";

import {
    Box,
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Button,
    Divider,
    Grid
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    ShoppingCart,
    Person,
    LocalShipping
} from "@mui/icons-material";

const MarketplaceOrderCard = ({
    order,
    onView,
    onEdit,
    onDelete
}) => {
    if (!order) {
        return null;
    }

    const getValue = (camelCase, pascalCase, fallback = "") => {
        return order[camelCase] ??
            order[pascalCase] ??
            fallback;
    };

    const orderId = getValue(
        "marketplaceOrderId",
        "MarketplaceOrderId"
    );

    const orderNumber = getValue(
        "marketplaceOrderNumber",
        "MarketplaceOrderNumber",
        "N/A"
    );

    const externalOrderId = getValue(
        "externalOrderId",
        "ExternalOrderId",
        "N/A"
    );

    const sellerOrderNumber = getValue(
        "sellerOrderNumber",
        "SellerOrderNumber",
        "N/A"
    );

    const orderStatus = getValue(
        "orderStatus",
        "OrderStatus",
        "Pending"
    );

    const fulfillmentChannel = getValue(
        "fulfillmentChannel",
        "FulfillmentChannel",
        "N/A"
    );

    const currency = getValue(
        "currency",
        "Currency",
        "INR"
    );

    const totalAmount = Number(
        getValue(
            "totalAmount",
            "TotalAmount",
            0
        )
    );

    const buyerName = getValue(
        "buyerName",
        "BuyerName",
        "N/A"
    );

    const buyerEmail = getValue(
        "buyerEmail",
        "BuyerEmail",
        "N/A"
    );

    const orderDate = getValue(
        "orderDate",
        "OrderDate"
    );

    const getStatusColor = (status) => {
        switch (String(status).toLowerCase()) {
            case "delivered":
                return "success";

            case "shipped":
                return "info";

            case "processing":
            case "requested":
                return "warning";

            case "cancelled":
            case "canceled":
                return "error";

            case "pending":
            default:
                return "default";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatAmount = () => {
        if (Number.isNaN(totalAmount)) {
            return "0.00";
        }

        return totalAmount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 5
                }
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                        mb: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 0
                        }}
                    >
                        <ShoppingCart color="primary" />

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                noWrap
                            >
                                {orderNumber}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Order ID: {orderId || "N/A"}
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        label={orderStatus}
                        color={getStatusColor(orderStatus)}
                        size="small"
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Order Information */}
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                    >
                        Order Information
                    </Typography>

                    <Grid container spacing={1.5}>
                        <Grid item xs={12}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                External Order ID
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{
                                    wordBreak: "break-word"
                                }}
                            >
                                {externalOrderId}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Seller Order
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={500}
                                sx={{
                                    wordBreak: "break-word"
                                }}
                            >
                                {sellerOrderNumber}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Order Date
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={500}
                            >
                                {formatDate(orderDate)}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Fulfillment
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={500}
                            >
                                {fulfillmentChannel}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Total Amount
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={700}
                                color="primary"
                            >
                                {currency} {formatAmount()}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Buyer Information */}
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1
                        }}
                    >
                        <Person
                            fontSize="small"
                            color="action"
                        />

                        <Typography
                            variant="subtitle2"
                            fontWeight={600}
                        >
                            Buyer Information
                        </Typography>
                    </Box>

                    <Typography
                        variant="body2"
                        fontWeight={500}
                    >
                        {buyerName}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            wordBreak: "break-word"
                        }}
                    >
                        {buyerEmail}
                    </Typography>
                </Box>

                {/* Fulfillment indicator */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2
                    }}
                >
                    <LocalShipping
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Fulfillment: {fulfillmentChannel}
                    </Typography>
                </Box>
            </CardContent>

            {/* Actions */}
            <Divider />

            <CardActions
                sx={{
                    justifyContent: "flex-end",
                    px: 2,
                    py: 1.5,
                    gap: 0.5
                }}
            >
                {onView && (
                    <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => onView(order)}
                    >
                        View
                    </Button>
                )}

                {onEdit && (
                    <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => onEdit(order)}
                    >
                        Edit
                    </Button>
                )}

                {onDelete && (
                    <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => onDelete(order)}
                    >
                        Delete
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default MarketplaceOrderCard;

