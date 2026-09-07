import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    ShoppingCart,
    Inventory2,
    Payments,
    ReceiptLong
} from "@mui/icons-material";


/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
};


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "₹ 0";
    }

    return `₹ ${number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


/* =========================================================
   MARKETPLACE ORDER ITEM STATISTICS
========================================================= */

const MarketplaceOrderItemStatistics = ({
    statistics = {}
}) => {


    /* =====================================================
       STATISTICS CARDS
    ===================================================== */

    const cards = [

        {
            title: "Total Items",

            value: formatNumber(
                statistics?.totalItems
            ),

            icon: (
                <ShoppingCart
                    fontSize="large"
                    color="primary"
                />
            )
        },

        {
            title: "Total Quantity",

            value: formatNumber(
                statistics?.totalQuantity
            ),

            icon: (
                <Inventory2
                    fontSize="large"
                    color="success"
                />
            )
        },

        {
            title: "Total Sales",

            value: formatCurrency(
                statistics?.totalSales
            ),

            icon: (
                <Payments
                    fontSize="large"
                    color="warning"
                />
            )
        },

        {
            title: "Total Tax",

            value: formatCurrency(
                statistics?.totalTax
            ),

            icon: (
                <ReceiptLong
                    fontSize="large"
                    color="secondary"
                />
            )
        }

    ];


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Grid
            container
            spacing={3}
            className="marketplace-order-item-statistics"
            sx={{
                mb: 3
            }}
        >

            {cards.map((card) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={card.title}
                >

                    <Card
                        elevation={3}
                        className="marketplace-order-item-stat-card"
                        sx={{
                            height: "100%"
                        }}
                    >

                        <CardContent>

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                            >

                                {/* ---------------------------------
                                    CONTENT
                                --------------------------------- */}

                                <Box
                                    sx={{
                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >

                                        {card.title}

                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                        sx={{
                                            mt: 1,
                                            wordBreak: "break-word"
                                        }}
                                    >

                                        {card.value}

                                    </Typography>

                                </Box>


                                {/* ---------------------------------
                                    ICON
                                --------------------------------- */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexShrink: 0
                                    }}
                                >

                                    {card.icon}

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

};


export default MarketplaceOrderItemStatistics;
