import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    Favorite,
    Inventory2,
    CheckCircle,
    CurrencyRupee
} from "@mui/icons-material";


/* =========================================================
   FORMAT CURRENCY
========================================================= */

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
   WISHLIST ITEM STATISTICS
========================================================= */

const WishlistItemStatistics = ({
    items = [],

    totalItems,
    activeItems,
    totalQuantity,
    totalValue
}) => {

    const data = Array.isArray(items)
        ? items
        : [];


    /* =====================================================
       CALCULATE
    ===================================================== */

    const calculatedTotalItems =
        totalItems !== undefined
            ? totalItems
            : data.length;


    const calculatedActiveItems =
        activeItems !== undefined
            ? activeItems
            : data.filter((item) => {

                const status =
                    item?.status ??
                    item?.Status ??
                    "Active";

                return String(status).toLowerCase() === "active";

            }).length;


    const calculatedQuantity =
        totalQuantity !== undefined
            ? totalQuantity
            : data.reduce((sum, item) => {

                const quantity =
                    Number(
                        item?.quantity ??
                        item?.Quantity ??
                        0
                    );

                return sum + (
                    Number.isFinite(quantity)
                        ? quantity
                        : 0
                );

            }, 0);


    const calculatedValue =
        totalValue !== undefined
            ? totalValue
            : data.reduce((sum, item) => {

                const quantity =
                    Number(
                        item?.quantity ??
                        item?.Quantity ??
                        1
                    );

                const price =
                    Number(
                        item?.price ??
                        item?.Price ??
                        0
                    );

                return sum + (
                    Number.isFinite(quantity)
                        ? quantity
                        : 0
                ) * (
                    Number.isFinite(price)
                        ? price
                        : 0
                );

            }, 0);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = [

        {
            title: "Total Wishlist Items",
            value: calculatedTotalItems,
            icon: <Favorite />,
            color: "primary"
        },

        {
            title: "Active Items",
            value: calculatedActiveItems,
            icon: <CheckCircle />,
            color: "success"
        },

        {
            title: "Total Quantity",
            value: calculatedQuantity,
            icon: <Inventory2 />,
            color: "warning"
        },

        {
            title: "Total Value",
            value: formatCurrency(calculatedValue),
            icon: <CurrencyRupee />,
            color: "info"
        }

    ];


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Grid
            container
            spacing={2}
            sx={{ mb: 3 }}
        >

            {statistics.map((stat) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={stat.title}
                >

                    <Card
                        elevation={2}
                        sx={{
                            height: "100%",
                            borderRadius: 2
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {stat.title}
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                        sx={{ mt: 1 }}
                                    >
                                        {stat.value}
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: `${stat.color}.lighter`,
                                        color: `${stat.color}.main`
                                    }}
                                >
                                    {stat.icon}
                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>
    );
};


export default WishlistItemStatistics;