// =========================================================
// ProductPriceStatistics.jsx
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Box,
    Button,
} from "@mui/material";

import {
    AttachMoney,
    CheckCircle,
    Cancel,
    TrendingUp,
    TrendingDown,
    LocalOffer,
    Storefront,
    ShoppingCart,
} from "@mui/icons-material";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// Product Price Statistics
// =========================================================

const ProductPriceStatistics = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [statistics, setStatistics] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD STATISTICS
    // =====================================================

    const loadStatistics = async () => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Loading Product Price Statistics..."
            );

            const response = await fetch(
                `${SERVER_URL}/api/product-prices/stats`
            );

            const data =
                await response.json();

            console.log(
                "Product Price Statistics:",
                data
            );

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Unable to load Product Price statistics."
                );

            }

            setStatistics(data);

        } catch (err) {

            console.error(
                "Product Price Statistics Error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load Product Price statistics."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadStatistics();

    }, []);


    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (value) => {

        const number =
            Number(value);

        if (
            value === null ||
            value === undefined ||
            Number.isNaN(number)
        ) {
            return "₹ 0.00";
        }

        return `₹ ${number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                }}
            >

                <CircularProgress />

                <Typography
                    color="text.secondary"
                >
                    Loading Product Price Statistics...
                </Typography>

            </Box>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <Box
                sx={{
                    p: 3,
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error}
                </Alert>

                <Button
                    variant="contained"
                    onClick={loadStatistics}
                >
                    Retry
                </Button>

            </Box>

        );

    }


    // =====================================================
    // NO DATA
    // =====================================================

    if (!statistics) {

        return (

            <Alert
                severity="warning"
            >
                No Product Price statistics available.
            </Alert>

        );

    }


    // =====================================================
    // READ API VALUES
    // =====================================================

    const totalPriceRecords =
        statistics.totalPriceRecords ??
        statistics.TotalPriceRecords ??
        0;

    const totalPrice =
        statistics.totalPrice ??
        statistics.TotalPrice ??
        0;

    const averagePrice =
        statistics.averagePrice ??
        statistics.AveragePrice ??
        0;

    const minimumPrice =
        statistics.minimumPrice ??
        statistics.MinimumPrice ??
        0;

    const maximumPrice =
        statistics.maximumPrice ??
        statistics.MaximumPrice ??
        0;

    const activePrices =
        statistics.activePrices ??
        statistics.ActivePrices ??
        0;

    const inactivePrices =
        statistics.inactivePrices ??
        statistics.InactivePrices ??
        0;

    const offerPrices =
        statistics.offerPrices ??
        statistics.OfferPrices ??
        0;

    const wholesalePrices =
        statistics.wholesalePrices ??
        statistics.WholesalePrices ??
        0;

    const retailPrices =
        statistics.retailPrices ??
        statistics.RetailPrices ??
        0;


    // =====================================================
    // STATISTIC CARDS
    // =====================================================

    const cards = [

        {
            title: "Total Price Records",
            value: totalPriceRecords,
            icon: (
                <AttachMoney
                    fontSize="large"
                />
            ),
            color: "#1976d2",
        },

        {
            title: "Total Price",
            value: formatMoney(
                totalPrice
            ),
            icon: (
                <TrendingUp
                    fontSize="large"
                />
            ),
            color: "#7b1fa2",
        },

        {
            title: "Average Price",
            value: formatMoney(
                averagePrice
            ),
            icon: (
                <TrendingUp
                    fontSize="large"
                />
            ),
            color: "#ed6c02",
        },

        {
            title: "Minimum Price",
            value: formatMoney(
                minimumPrice
            ),
            icon: (
                <TrendingDown
                    fontSize="large"
                />
            ),
            color: "#0288d1",
        },

        {
            title: "Maximum Price",
            value: formatMoney(
                maximumPrice
            ),
            icon: (
                <TrendingUp
                    fontSize="large"
                />
            ),
            color: "#6a1b9a",
        },

        {
            title: "Active Prices",
            value: activePrices,
            icon: (
                <CheckCircle
                    fontSize="large"
                />
            ),
            color: "#2e7d32",
        },

        {
            title: "Inactive Prices",
            value: inactivePrices,
            icon: (
                <Cancel
                    fontSize="large"
                />
            ),
            color: "#d32f2f",
        },

        {
            title: "Offer Prices",
            value: offerPrices,
            icon: (
                <LocalOffer
                    fontSize="large"
                />
            ),
            color: "#00838f",
        },

        {
            title: "Wholesale Prices",
            value: wholesalePrices,
            icon: (
                <Storefront
                    fontSize="large"
                />
            ),
            color: "#455a64",
        },

        {
            title: "Retail Prices",
            value: retailPrices,
            icon: (
                <ShoppingCart
                    fontSize="large"
                />
            ),
            color: "#8e24aa",
        },

    ];


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Product Price Statistics
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        Overview of product pricing
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    onClick={loadStatistics}
                >
                    Refresh
                </Button>

            </Box>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <Grid
                container
                spacing={3}
            >

                {cards.map((card) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        key={card.title}
                    >

                        <Card
                            sx={{
                                height: "100%",

                                borderLeft:
                                    `5px solid ${card.color}`,

                                transition:
                                    "0.2s",

                                "&:hover": {
                                    transform:
                                        "translateY(-3px)",

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
                                            color:
                                                card.color,

                                            display:
                                                "flex",

                                            alignItems:
                                                "center",
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

        </Box>

    );

};

export default ProductPriceStatistics;
