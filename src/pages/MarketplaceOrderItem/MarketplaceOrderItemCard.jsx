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


/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0.00";
    }

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};


/* =========================================================
   DISPLAY VALUE
========================================================= */

const displayValue = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    return value;
};


/* =========================================================
   MARKETPLACE ORDER ITEM CARD
========================================================= */

const MarketplaceOrderItemCard = ({
    marketplaceOrderItem,
    onView,
    onEdit,
    onDelete
}) => {

    if (!marketplaceOrderItem) {
        return null;
    }


    return (

        <Card
            className="marketplace-order-item-card"
            elevation={3}
            sx={{
                height: "100%"
            }}
        >

            <CardContent
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                    mb={2}
                >

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        minWidth={0}
                    >

                        <ShoppingCart
                            color="primary"
                            sx={{
                                flexShrink: 0
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            noWrap
                        >

                            {
                                marketplaceOrderItem
                                    .MarketplaceOrderItemNumber
                                || "N/A"
                            }

                        </Typography>

                    </Box>


                    <Chip
                        label={
                            `Qty : ${
                                marketplaceOrderItem.Quantity ?? 0
                            }`
                        }
                        color="primary"
                        size="small"
                        sx={{
                            flexShrink: 0
                        }}
                    />

                </Box>


                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Marketplace Order Item ID:</strong>{" "}

                    {
                        displayValue(
                            marketplaceOrderItem
                                .MarketplaceOrderItemId
                        )
                    }

                </Typography>


                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Marketplace Order ID:</strong>{" "}

                    {
                        displayValue(
                            marketplaceOrderItem
                                .MarketplaceOrderId
                        )
                    }

                </Typography>


                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>External Item ID:</strong>{" "}

                    {
                        displayValue(
                            marketplaceOrderItem
                                .ExternalOrderItemId
                        )
                    }

                </Typography>


                {/* =================================================
                    PRODUCT INFORMATION
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                    sx={{
                        wordBreak: "break-word"
                    }}
                >

                    <strong>Product:</strong>{" "}

                    {
                        displayValue(
                            marketplaceOrderItem.ProductTitle
                        )
                    }

                </Typography>


                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>SKU:</strong>{" "}

                    {
                        displayValue(
                            marketplaceOrderItem.SKU
                        )
                    }

                </Typography>


                {/* =================================================
                    PRICING
                ================================================= */}

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Unit Price:</strong>{" "}

                    ₹ {formatNumber(
                        marketplaceOrderItem.UnitPrice
                    )}

                </Typography>


                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Tax:</strong>{" "}

                    ₹ {formatNumber(
                        marketplaceOrderItem.TaxAmount
                    )}

                </Typography>


                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Shipping:</strong>{" "}

                    ₹ {formatNumber(
                        marketplaceOrderItem.ShippingAmount
                    )}

                </Typography>


                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Discount:</strong>{" "}

                    ₹ {formatNumber(
                        marketplaceOrderItem.DiscountAmount
                    )}

                </Typography>


                {/* =================================================
                    TOTAL
                ================================================= */}

                <Typography
                    variant="h6"
                    color="primary"
                    fontWeight="bold"
                    sx={{
                        mt: 2
                    }}
                >

                    Total : ₹ {
                        formatNumber(
                            marketplaceOrderItem.TotalAmount
                        )
                    }

                </Typography>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <Stack
                    direction="row"
                    spacing={1}
                    mt={3}
                    sx={{
                        flexWrap: "wrap"
                    }}
                >

                    {/* ---------------------------------------------
                        VIEW
                    --------------------------------------------- */}

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() =>
                            onView?.(marketplaceOrderItem)
                        }
                    >

                        View

                    </Button>


                    {/* ---------------------------------------------
                        EDIT
                    --------------------------------------------- */}

                    <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        startIcon={<Edit />}
                        onClick={() =>
                            onEdit?.(marketplaceOrderItem)
                        }
                    >

                        Edit

                    </Button>


                    {/* ---------------------------------------------
                        DELETE
                    --------------------------------------------- */}

                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                            onDelete?.(marketplaceOrderItem)
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
