// =========================================================
// StockAdjustmentStatistics.jsx
// Stock Adjustment Statistics
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import {
    Assessment,
    Inventory,
    TrendingUp,
    TrendingDown,
    Category,
    Warehouse
} from "@mui/icons-material";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentStatistics = () => {

    const [statistics, setStatistics] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =========================================================
    // LOAD STATISTICS
    // =========================================================

    const loadStatistics = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/stock-adjustments/statistics`
            );

            if (!response.ok) {

                let message =
                    "Failed to load stock adjustment statistics.";

                try {

                    const errorData =
                        await response.json();

                    if (errorData.message) {
                        message = errorData.message;
                    } else if (errorData.title) {
                        message = errorData.title;
                    } else if (errorData.errors) {
                        message =
                            JSON.stringify(errorData.errors);
                    }

                } catch {
                    // Ignore JSON parsing error
                }

                throw new Error(message);
            }

            const data = await response.json();

            console.log(
                "Stock Adjustment Statistics:",
                data
            );

            setStatistics(data);

        } catch (err) {

            console.error(
                "Stock Adjustment Statistics Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load stock adjustment statistics."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // LOAD ON COMPONENT MOUNT
    // =========================================================

    useEffect(() => {

        loadStatistics();

    }, []);

    // =========================================================
    // HELPERS
    // =========================================================

    const getValue = (...keys) => {

        if (!statistics) {
            return 0;
        }

        for (const key of keys) {

            if (
                statistics[key] !== undefined &&
                statistics[key] !== null
            ) {
                return statistics[key];
            }
        }

        return 0;
    };

    // =========================================================
    // POSSIBLE STATISTICS VALUES
    // =========================================================

    const totalAdjustments = getValue(
        "totalAdjustments",
        "TotalAdjustments",
        "totalStockAdjustments",
        "TotalStockAdjustments"
    );

    const totalQuantity = getValue(
        "totalQuantity",
        "TotalQuantity",
        "totalAdjustedQuantity",
        "TotalAdjustedQuantity"
    );

    const positiveAdjustments = getValue(
        "positiveAdjustments",
        "PositiveAdjustments",
        "increaseAdjustments",
        "IncreaseAdjustments",
        "foundAdjustments",
        "FoundAdjustments"
    );

    const negativeAdjustments = getValue(
        "negativeAdjustments",
        "NegativeAdjustments",
        "decreaseAdjustments",
        "DecreaseAdjustments",
        "damageAdjustments",
        "DamageAdjustments"
    );

    const totalWarehouses = getValue(
        "totalWarehouses",
        "TotalWarehouses",
        "warehouseCount",
        "WarehouseCount"
    );

    const totalProducts = getValue(
        "totalProducts",
        "TotalProducts",
        "productCount",
        "ProductCount"
    );

    // =========================================================
    // ADJUSTMENT TYPE STATISTICS
    // =========================================================

    const adjustmentTypes =
        statistics?.adjustmentTypes ??
        statistics?.AdjustmentTypes ??
        statistics?.byAdjustmentType ??
        statistics?.ByAdjustmentType ??
        [];

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (
            <Box sx={{ p: 2 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Make sure the ASP.NET Core API and
                    server.js are running.
                </Typography>

            </Box>
        );
    }

    // =========================================================
    // STATISTIC CARD
    // =========================================================

    const StatisticCard = ({
        title,
        value,
        icon
    }) => {

        return (
            <Card
                elevation={2}
                sx={{
                    height: "100%"
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
                                sx={{
                                    mb: 1
                                }}
                            >
                                {title}
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight={700}
                            >
                                {value ?? 0}
                            </Typography>

                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 50,
                                height: 50,
                                borderRadius: 2,
                                bgcolor: "action.hover"
                            }}
                        >
                            {icon}
                        </Box>

                    </Box>

                </CardContent>

            </Card>
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box sx={{ p: 2 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3
                }}
            >

                <Assessment />

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Stock Adjustment Statistics
                </Typography>

            </Box>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <Grid
                container
                spacing={2}
                sx={{ mb: 3 }}
            >

                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4
                    }}
                >
                    <StatisticCard
                        title="Total Adjustments"
                        value={totalAdjustments}
                        icon={<Assessment />}
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4
                    }}
                >
                    <StatisticCard
                        title="Total Quantity"
                        value={totalQuantity}
                        icon={<Inventory />}
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4
                    }}
                >
                    <StatisticCard
                        title="Positive Adjustments"
                        value={positiveAdjustments}
                        icon={<TrendingUp />}
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4
                    }}
                >
                    <StatisticCard
                        title="Negative Adjustments"
                        value={negativeAdjustments}
                        icon={<TrendingDown />}
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4
                    }}
                >
                    <StatisticCard
                        title="Total Products"
                        value={totalProducts}
                        icon={<Category />}
                    />
                </Grid>


                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4
                    }}
                >
                    <StatisticCard
                        title="Total Warehouses"
                        value={totalWarehouses}
                        icon={<Warehouse />}
                    />
                </Grid>

            </Grid>


            {/* =================================================
                ADJUSTMENT TYPES
            ================================================= */}

            {Array.isArray(adjustmentTypes) &&
                adjustmentTypes.length > 0 && (

                    <Paper
                        elevation={2}
                        sx={{
                            p: 2
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                                mb: 2
                            }}
                        >
                            Adjustments by Type
                        </Typography>


                        <Grid
                            container
                            spacing={2}
                        >

                            {adjustmentTypes.map(
                                (item, index) => {

                                    const type =
                                        item.adjustmentType ??
                                        item.AdjustmentType ??
                                        item.type ??
                                        item.Type ??
                                        "Unknown";

                                    const count =
                                        item.count ??
                                        item.Count ??
                                        item.total ??
                                        item.Total ??
                                        item.quantity ??
                                        item.Quantity ??
                                        0;

                                    return (
                                        <Grid
                                            key={index}
                                            size={{
                                                xs: 12,
                                                sm: 6,
                                                md: 3
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    p: 2,
                                                    border:
                                                        "1px solid",
                                                    borderColor:
                                                        "divider",
                                                    borderRadius: 1
                                                }}
                                            >

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {type}
                                                </Typography>

                                                <Typography
                                                    variant="h6"
                                                    fontWeight={700}
                                                >
                                                    {count}
                                                </Typography>

                                            </Box>

                                        </Grid>
                                    );
                                }
                            )}

                        </Grid>

                    </Paper>
                )}


            {/* =================================================
                RAW STATISTICS FALLBACK
            ================================================= */}

            {!statistics && (

                <Alert severity="info">
                    No stock adjustment statistics available.
                </Alert>
            )}

        </Box>
    );
};

export default StockAdjustmentStatistics;