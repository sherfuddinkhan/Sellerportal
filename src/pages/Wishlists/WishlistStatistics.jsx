// =========================================================
// WishlistStatistics.jsx
// =========================================================

import React, { useMemo } from "react";

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Chip,
} from "@mui/material";

import {
    Favorite,
    Inventory2,
    Warning,
    RemoveShoppingCart,
    People,
    CurrencyRupee,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const WishlistStatistics = ({
    wishlists = [],
    statistics = null,
    loading = false,
}) => {
    // =========================================================
    // CALCULATE STATISTICS
    // =========================================================

    const calculatedStatistics = useMemo(() => {
        const totalItems = wishlists.length;

        const inStock = wishlists.filter(
            (item) =>
                Number(
                    item.stock ??
                        item.quantity ??
                        item.product?.stock ??
                        0
                ) > 0
        ).length;

        const outOfStock = wishlists.filter(
            (item) =>
                Number(
                    item.stock ??
                        item.quantity ??
                        item.product?.stock ??
                        0
                ) <= 0
        ).length;

        const lowStock = wishlists.filter(
            (item) => {
                const stock = Number(
                    item.stock ??
                        item.quantity ??
                        item.product?.stock ??
                        0
                );

                return stock > 0 && stock <= 10;
            }
        ).length;

        const customers = new Set(
            wishlists
                .map(
                    (item) =>
                        item.customerId ??
                        item.customer?.customerId
                )
                .filter(
                    (id) =>
                        id !== undefined &&
                        id !== null
                )
        ).size;

        const totalValue = wishlists.reduce(
            (total, item) => {
                const price = Number(
                    item.price ??
                        item.product?.price ??
                        0
                );

                return total + price;
            },
            0
        );

        return {
            totalItems,
            inStock,
            outOfStock,
            lowStock,
            customers,
            totalValue,
        };
    }, [wishlists]);

    // =========================================================
    // USE API STATISTICS IF PROVIDED
    // =========================================================

    const stats = {
        totalItems:
            statistics?.totalItems ??
            statistics?.totalWishlists ??
            calculatedStatistics.totalItems,

        inStock:
            statistics?.inStock ??
            statistics?.inStockItems ??
            calculatedStatistics.inStock,

        outOfStock:
            statistics?.outOfStock ??
            statistics?.outOfStockItems ??
            calculatedStatistics.outOfStock,

        lowStock:
            statistics?.lowStock ??
            statistics?.lowStockItems ??
            calculatedStatistics.lowStock,

        customers:
            statistics?.customers ??
            statistics?.totalCustomers ??
            calculatedStatistics.customers,

        totalValue:
            statistics?.totalValue ??
            statistics?.wishlistValue ??
            calculatedStatistics.totalValue,
    };

    // =========================================================
    // STAT CARD
    // =========================================================

    const StatCard = ({
        title,
        value,
        subtitle,
        icon,
        color = "primary",
        prefix = "",
    }) => {
        return (
            <Card
                elevation={2}
                sx={{
                    height: "100%",
                    borderRadius: 2,
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "space-between",
                            gap: 2,
                        }}
                    >
                        {/* TEXT */}

                        <Box>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mb: 0.5,
                                }}
                            >
                                {title}
                            </Typography>

                            {loading ? (
                                <Typography
                                    variant="h4"
                                    color="text.disabled"
                                >
                                    —
                                </Typography>
                            ) : (
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                >
                                    {prefix}
                                    {typeof value ===
                                    "number"
                                        ? value.toLocaleString(
                                              "en-IN"
                                          )
                                        : value}
                                </Typography>
                            )}

                            {subtitle && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>

                        {/* ICON */}

                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: 2,
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                bgcolor: `${color}.light`,
                                color: `${color}.main`,
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
        <Box sx={{ mb: 3 }}>
            {/* =====================================================
                HEADER
               ===================================================== */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Wishlist Statistics
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Overview of wishlist products,
                        customers and stock.
                    </Typography>
                </Box>

                <Chip
                    icon={<Favorite />}
                    label={`${stats.totalItems} Items`}
                    color="error"
                    variant="outlined"
                />
            </Box>

            {/* =====================================================
                STATISTICS
               ===================================================== */}

            <Grid
                container
                spacing={2}
            >
                {/* TOTAL */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                >
                    <StatCard
                        title="Total Items"
                        value={stats.totalItems}
                        subtitle="Wishlist products"
                        icon={<Favorite />}
                        color="error"
                    />
                </Grid>

                {/* IN STOCK */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                >
                    <StatCard
                        title="In Stock"
                        value={stats.inStock}
                        subtitle="Available products"
                        icon={<Inventory2 />}
                        color="success"
                    />
                </Grid>

                {/* LOW STOCK */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                >
                    <StatCard
                        title="Low Stock"
                        value={stats.lowStock}
                        subtitle="10 or fewer units"
                        icon={<Warning />}
                        color="warning"
                    />
                </Grid>

                {/* OUT OF STOCK */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                >
                    <StatCard
                        title="Out of Stock"
                        value={stats.outOfStock}
                        subtitle="Unavailable products"
                        icon={
                            <RemoveShoppingCart />
                        }
                        color="error"
                    />
                </Grid>

                {/* CUSTOMERS */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                >
                    <StatCard
                        title="Customers"
                        value={stats.customers}
                        subtitle="Unique customers"
                        icon={<People />}
                        color="primary"
                    />
                </Grid>

                {/* VALUE */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                >
                    <StatCard
                        title="Wishlist Value"
                        value={stats.totalValue}
                        subtitle="Combined product value"
                        prefix="₹"
                        icon={<CurrencyRupee />}
                        color="success"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default WishlistStatistics;