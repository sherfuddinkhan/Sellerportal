import React, { useMemo } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Skeleton,
    Stack
} from "@mui/material";

import {
    Inventory2,
    CheckCircle,
    PendingActions,
    WarningAmber,
    RemoveShoppingCart,
    Warehouse
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...keys) => {
    for (const key of keys) {
        const value = record?.[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return undefined;
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value ?? 0);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   GET QUANTITY
========================================================= */

const getQuantity = (record) => {
    const value = getFieldValue(
        record,
        "quantity",
        "Quantity",
        "stockQuantity",
        "StockQuantity"
    );

    const quantity = Number(value ?? 0);

    return Number.isFinite(quantity) ? quantity : 0;
};

/* =========================================================
   GET STOCK STATUS
========================================================= */

const getStockStatus = (record) => {
    const explicitStatus = getFieldValue(
        record,
        "status",
        "Status"
    );

    if (explicitStatus !== undefined && explicitStatus !== "") {
        const normalizedStatus = String(explicitStatus).toLowerCase();

        if (
            normalizedStatus.includes("out of stock") ||
            normalizedStatus.includes("out-of-stock")
        ) {
            return "out";
        }

        if (
            normalizedStatus.includes("low stock") ||
            normalizedStatus.includes("low-stock")
        ) {
            return "low";
        }

        return "normal";
    }

    const quantity = getQuantity(record);

    const minimumStock = Number(
        getFieldValue(
            record,
            "minimumStock",
            "MinimumStock",
            "minStock",
            "MinStock"
        ) ?? 0
    );

    if (quantity <= 0) {
        return "out";
    }

    if (minimumStock > 0 && quantity <= minimumStock) {
        return "low";
    }

    return "normal";
};

/* =========================================================
   STATISTIC CARD
========================================================= */

const StatisticCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    loading = false
}) => {
    return (
        <Card
            elevation={1}
            sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "box-shadow 0.2s ease",
                "&:hover": {
                    boxShadow: 4
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                        >
                            {title}
                        </Typography>

                        {loading ? (
                            <Skeleton
                                variant="text"
                                width={100}
                                height={42}
                            />
                        ) : (
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    mt: 1,
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {value}
                            </Typography>
                        )}

                        {subtitle && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: "block",
                                    mt: 0.75
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: `${color}.light`,
                            color: `${color}.dark`,
                            flexShrink: 0
                        }}
                    >
                        {icon}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

/* =========================================================
   SHELFWISE INVENTORY STATISTICS
========================================================= */

const ShelfwiseInventoryStatistics = ({
    inventory = [],
    data,
    loading = false,
    statistics,
    stats
}) => {
    const records = Array.isArray(data)
        ? data
        : Array.isArray(inventory)
            ? inventory
            : [];

    const suppliedStatistics = statistics ?? stats ?? {};

    const summary = useMemo(() => {
        const totalRecords = records.length;

        let totalQuantity = 0;
        let totalAvailable = 0;
        let totalReserved = 0;
        let lowStockCount = 0;
        let outOfStockCount = 0;

        records.forEach((record) => {
            const quantity = getQuantity(record);

            const availableValue = getFieldValue(
                record,
                "availableQuantity",
                "AvailableQuantity"
            );

            const reservedValue = getFieldValue(
                record,
                "reservedQuantity",
                "ReservedQuantity"
            );

            const available = Number(
                availableValue ?? quantity
            );

            const reserved = Number(
                reservedValue ?? 0
            );

            totalQuantity += quantity;

            totalAvailable += Number.isFinite(available)
                ? available
                : 0;

            totalReserved += Number.isFinite(reserved)
                ? reserved
                : 0;

            const status = getStockStatus(record);

            if (status === "low") {
                lowStockCount += 1;
            }

            if (status === "out") {
                outOfStockCount += 1;
            }
        });

        return {
            totalRecords,
            totalQuantity,
            totalAvailable,
            totalReserved,
            lowStockCount,
            outOfStockCount
        };
    }, [records]);

    /* =====================================================
       SUPPORT API-PROVIDED STATISTICS
    ===================================================== */

    const getStat = (keys, fallback) => {
        const value = getFieldValue(suppliedStatistics, ...keys);

        return value !== undefined ? value : fallback;
    };

    const cards = [
        {
            title: "Total Records",
            value: formatNumber(
                getStat(
                    ["totalRecords", "TotalRecords", "totalCount", "TotalCount"],
                    summary.totalRecords
                )
            ),
            subtitle: "Shelf inventory entries",
            icon: <Inventory2 />,
            color: "primary"
        },
        {
            title: "Total Quantity",
            value: formatNumber(
                getStat(
                    ["totalQuantity", "TotalQuantity", "totalStock", "TotalStock"],
                    summary.totalQuantity
                )
            ),
            subtitle: "Units across shelves",
            icon: <Warehouse />,
            color: "info"
        },
        {
            title: "Available Quantity",
            value: formatNumber(
                getStat(
                    ["totalAvailable", "TotalAvailable", "availableQuantity", "AvailableQuantity"],
                    summary.totalAvailable
                )
            ),
            subtitle: "Available stock units",
            icon: <CheckCircle />,
            color: "success"
        },
        {
            title: "Reserved Quantity",
            value: formatNumber(
                getStat(
                    ["totalReserved", "TotalReserved", "reservedQuantity", "ReservedQuantity"],
                    summary.totalReserved
                )
            ),
            subtitle: "Units reserved",
            icon: <PendingActions />,
            color: "warning"
        },
        {
            title: "Low Stock Items",
            value: formatNumber(
                getStat(
                    ["lowStockCount", "LowStockCount", "lowStockItems", "LowStockItems"],
                    summary.lowStockCount
                )
            ),
            subtitle: "At or below minimum stock",
            icon: <WarningAmber />,
            color: "warning"
        },
        {
            title: "Out of Stock",
            value: formatNumber(
                getStat(
                    ["outOfStockCount", "OutOfStockCount", "outOfStockItems", "OutOfStockItems"],
                    summary.outOfStockCount
                )
            ),
            subtitle: "Items with zero stock",
            icon: <RemoveShoppingCart />,
            color: "error"
        }
    ];

    /* =====================================================
       RENDER STATISTICS
    ===================================================== */

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2}
                    key={card.title}
                >
                    <StatisticCard
                        title={card.title}
                        value={card.value}
                        subtitle={card.subtitle}
                        icon={card.icon}
                        color={card.color}
                        loading={loading}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ShelfwiseInventoryStatistics;

