import React, { useMemo } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    CircularProgress,
    Skeleton,
    Tooltip
} from "@mui/material";

import {
    LocalShipping,
    Inventory2,
    Payments,
    CheckCircle,
    PendingActions,
    Cancel,
    Schedule,
    TrendingUp
} from "@mui/icons-material";

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === "" ||
        !Number.isFinite(number)
    ) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
    const amount = Number(value);

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === "" ||
        !Number.isFinite(amount)
    ) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/* =========================================================
   GET FIELD
   Supports camelCase and PascalCase API fields
========================================================= */

const getField = (record, ...keys) => {
    for (const key of keys) {
        const value = record?.[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return undefined;
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (status) =>
    String(status || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

/* =========================================================
   STATUS MATCHING
========================================================= */

const isPendingStatus = (status) =>
    [
        "pending",
        "requested",
        "scheduled"
    ].includes(normalizeStatus(status));

const isCompletedStatus = (status) =>
    [
        "completed",
        "delivered",
        "picked up",
        "approved"
    ].includes(normalizeStatus(status));

const isCancelledStatus = (status) =>
    [
        "cancelled",
        "canceled",
        "failed",
        "rejected"
    ].includes(normalizeStatus(status));

const isInProgressStatus = (status) =>
    [
        "processing",
        "in transit",
        "in progress"
    ].includes(normalizeStatus(status));

/* =========================================================
   STATISTIC CARD
========================================================= */

const StatisticCard = ({
    title,
    value,
    subtitle,
    icon,
    color = "#1976d2",
    loading = false,
    compact = false
}) => (
    <Card
        elevation={0}
        sx={{
            height: "100%",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: 3
            }
        }}
    >
        <CardContent
            sx={{
                p: 2.25,
                "&:last-child": {
                    pb: 2.25
                }
            }}
        >
            <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                spacing={1.5}
            >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1,
                            fontWeight: 500
                        }}
                    >
                        {title}
                    </Typography>

                    {loading ? (
                        <Skeleton
                            variant="text"
                            width="75%"
                            height={38}
                        />
                    ) : (
                        <Tooltip title={String(value)}>
                            <Typography
                                variant={compact ? "h6" : "h5"}
                                fontWeight={700}
                                sx={{
                                    color,
                                    overflowWrap: "anywhere",
                                    lineHeight: 1.3
                                }}
                            >
                                {value}
                            </Typography>
                        </Tooltip>
                    )}

                    {subtitle && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                display: "block",
                                mt: 1
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
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${color}18`,
                        color
                    }}
                >
                    {icon}
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

/* =========================================================
   REVERSE PICKUP ITEM STATISTICS
========================================================= */

const ReversePickupItemStatistics = ({
    reversePickups,
    pickups,
    items,
    records,

    totalCount,
    totalPickups,
    totalItems,
    totalQuantity,
    totalCost,

    pendingCount,
    completedCount,
    cancelledCount,
    inProgressCount,

    loading = false,

    showTotalPickups = true,
    showTotalQuantity = true,
    showTotalCost = true,
    showPending = true,
    showCompleted = true,
    showCancelled = true,
    showInProgress = true,

    title = "Reverse Pickup Statistics"
}) => {
    /* =====================================================
       NORMALIZE INPUT RECORDS
    ===================================================== */

    const sourceRecords =
        reversePickups ??
        pickups ??
        items ??
        records ??
        [];

    const safeRecords = Array.isArray(sourceRecords)
        ? sourceRecords
        : [];

    /* =====================================================
       CALCULATE STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        let quantitySum = 0;
        let costSum = 0;

        let pending = 0;
        let completed = 0;
        let cancelled = 0;
        let inProgress = 0;

        safeRecords.forEach((record) => {
            const quantityValue = Number(
                getField(
                    record,
                    "quantity",
                    "Quantity"
                )
            );

            const costValue = Number(
                getField(
                    record,
                    "pickupCost",
                    "PickupCost"
                )
            );

            if (Number.isFinite(quantityValue)) {
                quantitySum += quantityValue;
            }

            if (Number.isFinite(costValue)) {
                costSum += costValue;
            }

            const status = getField(
                record,
                "status",
                "Status"
            );

            if (isPendingStatus(status)) {
                pending += 1;
            } else if (isCompletedStatus(status)) {
                completed += 1;
            } else if (isCancelledStatus(status)) {
                cancelled += 1;
            } else if (isInProgressStatus(status)) {
                inProgress += 1;
            }
        });

        return {
            total: safeRecords.length,
            quantity: quantitySum,
            cost: costSum,
            pending,
            completed,
            cancelled,
            inProgress
        };
    }, [safeRecords]);

    /* =====================================================
       APPLY PROVIDED OVERRIDES
    ===================================================== */

    const resolvedTotal =
        totalCount ??
        totalPickups ??
        totalItems ??
        statistics.total;

    const resolvedQuantity =
        totalQuantity ??
        statistics.quantity;

    const resolvedCost =
        totalCost ??
        statistics.cost;

    const resolvedPending =
        pendingCount ??
        statistics.pending;

    const resolvedCompleted =
        completedCount ??
        statistics.completed;

    const resolvedCancelled =
        cancelledCount ??
        statistics.cancelled;

    const resolvedInProgress =
        inProgressCount ??
        statistics.inProgress;

    /* =====================================================
       STATISTIC CARD DEFINITIONS
    ===================================================== */

    const statisticCards = [
        {
            key: "total",
            visible: showTotalPickups,
            title: "Total Reverse Pickups",
            value: formatNumber(resolvedTotal),
            subtitle: "Total pickup records",
            icon: <LocalShipping />,
            color: "#1976d2"
        },
        {
            key: "quantity",
            visible: showTotalQuantity,
            title: "Total Item Quantity",
            value: formatNumber(resolvedQuantity),
            subtitle: "Combined item quantity",
            icon: <Inventory2 />,
            color: "#7b1fa2"
        },
        {
            key: "cost",
            visible: showTotalCost,
            title: "Total Pickup Cost",
            value: formatCurrency(resolvedCost),
            subtitle: "Combined pickup cost",
            icon: <Payments />,
            color: "#0288d1"
        },
        {
            key: "pending",
            visible: showPending,
            title: "Pending Pickups",
            value: formatNumber(resolvedPending),
            subtitle: "Awaiting action",
            icon: <PendingActions />,
            color: "#ed6c02"
        },
        {
            key: "completed",
            visible: showCompleted,
            title: "Completed Pickups",
            value: formatNumber(resolvedCompleted),
            subtitle: "Successfully processed",
            icon: <CheckCircle />,
            color: "#2e7d32"
        },
        {
            key: "cancelled",
            visible: showCancelled,
            title: "Cancelled Pickups",
            value: formatNumber(resolvedCancelled),
            subtitle: "Cancelled or failed",
            icon: <Cancel />,
            color: "#d32f2f"
        },
        {
            key: "inProgress",
            visible: showInProgress,
            title: "In Progress",
            value: formatNumber(resolvedInProgress),
            subtitle: "Processing or in transit",
            icon: <Schedule />,
            color: "#0288d1"
        }
    ].filter((card) => card.visible);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", mb: 3 }}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
            >
                <TrendingUp color="primary" />

                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    {title}
                </Typography>
            </Stack>

            {loading && safeRecords.length === 0 ? (
                <Grid container spacing={2}>
                    {statisticCards.map((card) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={card.key}
                        >
                            <StatisticCard
                                title={card.title}
                                value="0"
                                subtitle={card.subtitle}
                                icon={card.icon}
                                color={card.color}
                                loading
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    {statisticCards.map((card) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            key={card.key}
                        >
                            <StatisticCard
                                title={card.title}
                                value={card.value}
                                subtitle={card.subtitle}
                                icon={card.icon}
                                color={card.color}
                                loading={loading}
                                compact={card.key === "cost"}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ReversePickupItemStatistics;

