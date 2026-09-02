// =========================================================
// ProductPriceStatistics.jsx
// =========================================================

import React, { useMemo } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import {
    AttachMoney,
    CheckCircle,
    Cancel,
    TrendingUp,
} from "@mui/icons-material";

// =========================================================
// Product Price Statistics
// =========================================================

const ProductPriceStatistics = ({
    productPrices = [],
}) => {

    // =====================================================
    // TOTAL PRICES
    // =====================================================

    const totalPrices = productPrices.length;


    // =====================================================
    // CALCULATE STATISTICS
    // =====================================================

    const {
        activePrices,
        inactivePrices,
        averagePrice,
    } = useMemo(() => {

        let active = 0;
        let totalAmount = 0;

        productPrices.forEach((item) => {

            const isActive =
                item?.IsActive ??
                item?.isActive ??
                false;

            const price =
                item?.Price ??
                item?.price ??
                0;

            if (isActive) {
                active++;
            }

            totalAmount += Number(price) || 0;
        });

        const inactive =
            productPrices.length - active;

        const average =
            productPrices.length > 0
                ? (totalAmount / productPrices.length).toFixed(2)
                : "0.00";

        return {
            activePrices: active,
            inactivePrices: inactive,
            averagePrice: average,
        };

    }, [productPrices]);


    // =====================================================
    // STATISTIC CARDS
    // =====================================================

    const cards = [
        {
            title: "Total Prices",
            value: totalPrices,
            icon: <AttachMoney fontSize="large" />,
            color: "#1976d2",
        },

        {
            title: "Active",
            value: activePrices,
            icon: <CheckCircle fontSize="large" />,
            color: "#2e7d32",
        },

        {
            title: "Inactive",
            value: inactivePrices,
            icon: <Cancel fontSize="large" />,
            color: "#d32f2f",
        },

        {
            title: "Average Price",
            value: `₹ ${averagePrice}`,
            icon: <TrendingUp fontSize="large" />,
            color: "#ed6c02",
        },
    ];


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Grid
            container
            spacing={3}
            sx={{
                mb: 3,
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
                        sx={{
                            height: "100%",
                            borderLeft: `5px solid ${card.color}`,
                            transition: "0.2s",

                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: 4,
                            },
                        }}
                    >

                        <CardContent>

                            <Grid
                                container
                                justifyContent="space-between"
                                alignItems="center"
                            >

                                {/* =================================
                                    TEXT
                                ================================= */}

                                <Grid item>

                                    <Typography
                                        color="text.secondary"
                                        variant="body2"
                                    >
                                        {card.title}
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                        sx={{
                                            mt: 0.5,
                                        }}
                                    >
                                        {card.value}
                                    </Typography>

                                </Grid>


                                {/* =================================
                                    ICON
                                ================================= */}

                                <Grid
                                    item
                                    sx={{
                                        color: card.color,
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {card.icon}
                                </Grid>

                            </Grid>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>
    );
};

export default ProductPriceStatistics;
