import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";


// =========================================================
// CURRENCY FORMATTER
// =========================================================

const formatCurrency = (value) => {

    const amount = Number(value || 0);

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

};


// =========================================================
// STATISTICS CARD
// =========================================================

const StatisticCard = ({
    title,
    value,
    color = "text.primary",
    currency = false
}) => {

    return (

        <Card
            className="sales-order-stat-card"
            sx={{
                height: "100%"
            }}
        >

            <CardContent>

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                >
                    {title}
                </Typography>


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
                        : Number(value || 0).toLocaleString("en-IN")}
                </Typography>

            </CardContent>

        </Card>

    );

};


// =========================================================
// SALES ORDER STATISTICS
// =========================================================

const SalesOrderStatistics = ({
    statistics
}) => {

    const {
        totalOrders = 0,
        totalAmount = 0,
        completedOrders = 0,
        pendingOrders = 0
    } = statistics || {};


    return (

        <Box
            className="sales-order-statistics"
            sx={{
                mb: 3
            }}
        >

            <Grid
                container
                spacing={3}
            >

                {/* =====================================
                    TOTAL ORDERS
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Total Orders"
                        value={totalOrders}
                    />

                </Grid>


                {/* =====================================
                    TOTAL SALES
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Total Sales"
                        value={totalAmount}
                        currency
                    />

                </Grid>


                {/* =====================================
                    COMPLETED ORDERS
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Completed Orders"
                        value={completedOrders}
                        color="success.main"
                    />

                </Grid>


                {/* =====================================
                    PENDING ORDERS
                ====================================== */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <StatisticCard
                        title="Pending Orders"
                        value={pendingOrders}
                        color="warning.main"
                    />

                </Grid>

            </Grid>

        </Box>

    );

};


export default SalesOrderStatistics;
