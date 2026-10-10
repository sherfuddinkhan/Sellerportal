// =========================================================
// VendorItemMasterStatistics.jsx
// =========================================================

import React, { useMemo } from "react";

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Skeleton
} from "@mui/material";

import {
    Inventory2,
    CheckCircle,
    Cancel,
    CurrencyRupee
} from "@mui/icons-material";

// =========================================================
// FORMAT CURRENCY
// =========================================================

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

// =========================================================
// VENDOR ITEM MASTER STATISTICS
// =========================================================

const VendorItemMasterStatistics = ({
    items = [],
    loading = false
}) => {

    // =====================================================
    // CALCULATE STATISTICS
    // =====================================================

    const statistics = useMemo(() => {
        const records = Array.isArray(items) ? items : [];

        const totalItems = records.length;

        const activeItems = records.filter((item) => {
            const status = String(
                item.status ?? item.Status ?? ""
            ).trim().toLowerCase();

            return (
                status === "active" ||
                status === "true" ||
                status === "1"
            );
        }).length;

        const inactiveItems = records.filter((item) => {
            const status = String(
                item.status ?? item.Status ?? ""
            ).trim().toLowerCase();

            return (
                status === "inactive" ||
                status === "false" ||
                status === "0"
            );
        }).length;

        const totalValue = records.reduce((total, item) => {
            const price = Number(
                item.unitPrice ??
                item.UnitPrice ??
                item.unitCost ??
                item.UnitCost ??
                0
            );

            return total + (
                Number.isFinite(price) ? price : 0
            );
        }, 0);

        return {
            totalItems,
            activeItems,
            inactiveItems,
            totalValue
        };
    }, [items]);

    // =====================================================
    // STATISTICS CARD CONFIGURATION
    // =====================================================

    const cards = [
        {
            title: "Total Vendor Items",
            value: statistics.totalItems.toLocaleString("en-IN"),
            icon: <Inventory2 />,
            color: "#1976d2",
            background: "#e3f2fd"
        },
        {
            title: "Active Items",
            value: statistics.activeItems.toLocaleString("en-IN"),
            icon: <CheckCircle />,
            color: "#2e7d32",
            background: "#e8f5e9"
        },
        {
            title: "Inactive Items",
            value: statistics.inactiveItems.toLocaleString("en-IN"),
            icon: <Cancel />,
            color: "#d32f2f",
            background: "#ffebee"
        },
        {
            title: "Combined Unit Price",
            value: formatCurrency(statistics.totalValue),
            icon: <CurrencyRupee />,
            color: "#ed6c02",
            background: "#fff3e0"
        }
    ];

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={card.title}
                >
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            transition: "0.2s ease",
                            "&:hover": {
                                boxShadow: 3,
                                transform: "translateY(-2px)"
                            }
                        }}
                    >
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1
                                }}
                            >
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        {card.title}
                                    </Typography>

                                    {loading ? (
                                        <Skeleton
                                            variant="text"
                                            width={120}
                                            height={38}
                                        />
                                    ) : (
                                        <Typography
                                            variant="h5"
                                            fontWeight={700}
                                            sx={{
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {card.value}
                                        </Typography>
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        minWidth: 48,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: card.background,
                                        color: card.color
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

export default VendorItemMasterStatistics;

