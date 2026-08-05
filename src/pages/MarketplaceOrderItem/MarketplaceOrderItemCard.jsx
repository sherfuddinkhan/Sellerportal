import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Chip,
    Button
} from "@mui/material";

import {
    ShoppingCart,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const MarketplaceOrderItemCard = ({
    marketplaceOrderItem,
    onView,
    onEdit,
    onDelete
}) => {

    return (

        <Card
            className="marketplace-order-item-card"
            elevation={3}
        >

            <CardContent>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >

                        <ShoppingCart color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >

                            {marketplaceOrderItem.MarketplaceOrderItemNumber || "N/A"}

                        </Typography>

                    </Box>

                    <Chip
                        label={`Qty : ${marketplaceOrderItem.Quantity ?? 0}`}
                        color="primary"
                        size="small"
                    />

                </Box>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Marketplace Order Item ID:</strong>{" "}

                    {marketplaceOrderItem.MarketplaceOrderItemId}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Marketplace Order ID:</strong>{" "}

                    {marketplaceOrderItem.MarketplaceOrderId}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>External Item ID:</strong>{" "}

                    {marketplaceOrderItem.ExternalOrderItemId || "-"}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Product:</strong>{" "}

                    {marketplaceOrderItem.ProductTitle || "-"}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>SKU:</strong>{" "}

                    {marketplaceOrderItem.SKU || "-"}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Unit Price:</strong>{" "}

                    ₹ {Number(
                        marketplaceOrderItem.UnitPrice || 0
                    ).toLocaleString()}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Tax:</strong>{" "}

                    ₹ {Number(
                        marketplaceOrderItem.TaxAmount || 0
                    ).toLocaleString()}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Shipping:</strong>{" "}

                    ₹ {Number(
                        marketplaceOrderItem.ShippingAmount || 0
                    ).toLocaleString()}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Discount:</strong>{" "}

                    ₹ {Number(
                        marketplaceOrderItem.DiscountAmount || 0
                    ).toLocaleString()}

                </Typography>

                <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    mt={2}
                >

                    Total : ₹ {Number(
                        marketplaceOrderItem.TotalAmount || 0
                    ).toLocaleString()}

                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    mt={3}
                >

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() =>
                            onView(marketplaceOrderItem)
                        }
                    >

                        View

                    </Button>

                    <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        startIcon={<Edit />}
                        onClick={() =>
                            onEdit(marketplaceOrderItem)
                        }
                    >

                        Edit

                    </Button>

                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                            onDelete(marketplaceOrderItem)
                        }
                    >

                        Delete

                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

};

export default MarketplaceOrderItemCard;