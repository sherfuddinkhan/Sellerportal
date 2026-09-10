// =========================================================
// SalesOrderStatistics.jsx
// Sales Order Statistics
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
    Box,
    CircularProgress,
    Alert,
} from "@mui/material";


// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL =
    "http://localhost:5000";


// =========================================================
// CURRENCY FORMATTER
// =========================================================

const formatCurrency = (value) => {

    const amount =
        Number(value || 0);

    return `₹ ${amount.toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

};


// =========================================================
// NUMBER FORMATTER
// =========================================================

const formatNumber = (value) => {

    return Number(
        value || 0
    ).toLocaleString("en-IN");

};


// =========================================================
// STATISTICS CARD
// =========================================================

const StatisticCard = ({
    title,
    value,
    color = "text.primary",
    currency = false,
}) => {

    return (

        <Card
            className="sales-order-stat-card"
            elevation={2}
            sx={{
                height: "100%",
            }}
        >

            <CardContent>

                {/* =========================================
                    TITLE
                ========================================= */}

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                >

                    {title}

                </Typography>


                {/* =========================================
                    VALUE
                ========================================= */}

                <Typography
                    variant={
                        currency
                            ? "h5"
                            : "h4"
                    }
                    fontWeight="bold"
                    color={color}
                >

                    {currency
                        ? formatCurrency(value)
                        : formatNumber(value)
                    }

                </Typography>

            </CardContent>

        </Card>

    );

};


// =========================================================
// SALES ORDER STATISTICS
// =========================================================

const SalesOrderStatistics = () => {

    // =====================================================
    // STATISTICS STATE
    // =====================================================

    const [statistics, setStatistics] =
        useState({

            totalOrders: 0,

            pendingOrders: 0,

            confirmedOrders: 0,

            completedOrders: 0,

            cancelledOrders: 0,

            totalAmount: 0,

            averageOrderAmount: 0,

        });


    // =====================================================
    // LOADING STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // ERROR STATE
    // =====================================================

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD SALES ORDER STATISTICS
    // =====================================================

    useEffect(() => {

        const fetchStatistics =
            async () => {

                try {

                    // =====================================
                    // START LOADING
                    // =====================================

                    setLoading(true);

                    setError("");


                    // =====================================
                    // API REQUEST
                    // =====================================

                    const response =
                        await fetch(
                            `${SERVER_URL}/api/SalesOrder/stats`
                        );


                    // =====================================
                    // CHECK RESPONSE
                    // =====================================

                    if (!response.ok) {

                        throw new Error(
                            `Failed to load sales order statistics. Status: ${response.status}`
                        );

                    }


                    // =====================================
                    // PARSE JSON
                    // =====================================

                    const data =
                        await response.json();


                    console.log(
                        "Sales Order Statistics:",
                        data
                    );


                    // =====================================
                    // SET STATISTICS
                    //
                    // Supports:
                    // camelCase
                    // PascalCase
                    // =====================================

                    setStatistics({

                        // ---------------------------------
                        // TOTAL ORDERS
                        // ---------------------------------

                        totalOrders:
                            Number(
                                data?.totalOrders ??
                                data?.TotalOrders ??
                                0
                            ),


                        // ---------------------------------
                        // PENDING ORDERS
                        // ---------------------------------

                        pendingOrders:
                            Number(
                                data?.pendingOrders ??
                                data?.PendingOrders ??
                                0
                            ),


                        // ---------------------------------
                        // CONFIRMED ORDERS
                        // ---------------------------------

                        confirmedOrders:
                            Number(
                                data?.confirmedOrders ??
                                data?.ConfirmedOrders ??
                                0
                            ),


                        // ---------------------------------
                        // COMPLETED ORDERS
                        // ---------------------------------

                        completedOrders:
                            Number(
                                data?.completedOrders ??
                                data?.CompletedOrders ??
                                0
                            ),


                        // ---------------------------------
                        // CANCELLED ORDERS
                        // ---------------------------------

                        cancelledOrders:
                            Number(
                                data?.cancelledOrders ??
                                data?.CancelledOrders ??
                                0
                            ),


                        // ---------------------------------
                        // TOTAL AMOUNT
                        // ---------------------------------

                        totalAmount:
                            Number(
                                data?.totalAmount ??
                                data?.TotalAmount ??
                                0
                            ),


                        // ---------------------------------
                        // AVERAGE ORDER AMOUNT
                        // ---------------------------------

                        averageOrderAmount:
                            Number(
                                data?.averageOrderAmount ??
                                data?.AverageOrderAmount ??
                                0
                            ),

                    });

                }
                catch (err) {

                    // =====================================
                    // ERROR LOG
                    // =====================================

                    console.error(
                        "Sales Order Statistics Error:",
                        err
                    );


                    // =====================================
                    // ERROR MESSAGE
                    // =====================================

                    setError(
                        err.message ||
                        "Failed to load sales order statistics."
                    );

                }
                finally {

                    // =====================================
                    // STOP LOADING
                    // =====================================

                    setLoading(false);

                }

            };


        // =================================================
        // CALL API
        // =================================================

        fetchStatistics();

    }, []);


    // =====================================================
    // STATISTICS CARDS
    // =====================================================

    const cards = [

        // ================================================
        // TOTAL ORDERS
        // ================================================

        {
            title:
                "Total Orders",

            value:
                statistics.totalOrders,

            color:
                "text.primary",

            currency:
                false,
        },


        // ================================================
        // TOTAL SALES
        // ================================================

        {
            title:
                "Total Sales",

            value:
                statistics.totalAmount,

            color:
                "text.primary",

            currency:
                true,
        },


        // ================================================
        // PENDING ORDERS
        // ================================================

        {
            title:
                "Pending Orders",

            value:
                statistics.pendingOrders,

            color:
                "warning.main",

            currency:
                false,
        },


        // ================================================
        // CONFIRMED ORDERS
        // ================================================

        {
            title:
                "Confirmed Orders",

            value:
                statistics.confirmedOrders,

            color:
                "info.main",

            currency:
                false,
        },


        // ================================================
        // COMPLETED ORDERS
        // ================================================

        {
            title:
                "Completed Orders",

            value:
                statistics.completedOrders,

            color:
                "success.main",

            currency:
                false,
        },


        // ================================================
        // CANCELLED ORDERS
        // ================================================

        {
            title:
                "Cancelled Orders",

            value:
                statistics.cancelledOrders,

            color:
                "error.main",

            currency:
                false,
        },


        // ================================================
        // AVERAGE ORDER AMOUNT
        // ================================================

        {
            title:
                "Average Order Amount",

            value:
                statistics.averageOrderAmount,

            color:
                "text.primary",

            currency:
                true,
        },

    ];


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    py: 4,
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <Alert
                severity="error"
                sx={{
                    mb: 3,
                }}
            >

                {error}

            </Alert>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            className="sales-order-statistics"
            sx={{
                mb: 3,
            }}
        >

            <Grid
                container
                spacing={3}
            >

                {cards.map(
                    (
                        card,
                        index
                    ) => (

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={index}
                        >

                            <StatisticCard
                                title={
                                    card.title
                                }

                                value={
                                    card.value
                                }

                                color={
                                    card.color
                                }

                                currency={
                                    card.currency
                                }
                            />

                        </Grid>

                    )
                )}

            </Grid>

        </Box>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default SalesOrderStatistics;