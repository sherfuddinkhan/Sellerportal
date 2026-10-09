import React, { useMemo } from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    CircularProgress,
    Skeleton,
    LinearProgress
} from "@mui/material";

import {
    AssignmentReturn,
    PendingActions,
    EventAvailable,
    LocalShipping,
    CheckCircle,
    Cancel,
    TrendingUp
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (record, ...keys) => {
    if (!record) return undefined;

    for (const key of keys) {
        const value = record[key];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return undefined;
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (value) =>
    String(value || "pending")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");

/* =========================================================
   STATUS CLASSIFICATION
========================================================= */

const isCompleted = (status) =>
    [
        "completed",
        "complete",
        "delivered",
        "received",
        "closed",
        "success"
    ].includes(normalizeStatus(status));

const isCancelled = (status) =>
    [
        "cancelled",
        "canceled",
        "rejected",
        "void"
    ].includes(normalizeStatus(status));

const isScheduled = (status) =>
    [
        "scheduled",
        "pickup scheduled",
        "assigned",
        "confirmed",
        "ready for pickup"
    ].includes(normalizeStatus(status));

const isInProgress = (status) =>
    [
        "in progress",
        "in transit",
        "picked up",
        "pickup in progress",
        "processing",
        "collected"
    ].includes(normalizeStatus(status));

const isPending = (status) =>
    [
        "pending",
        "requested",
        "open",
        "new",
        "awaiting pickup"
    ].includes(normalizeStatus(status));

/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeRecords = (input) => {
    if (Array.isArray(input)) return input;

    if (Array.isArray(input?.items)) return input.items;
    if (Array.isArray(input?.Items)) return input.Items;
    if (Array.isArray(input?.data)) return input.data;
    if (Array.isArray(input?.Data)) return input.Data;
    if (Array.isArray(input?.records)) return input.records;
    if (Array.isArray(input?.Records)) return input.Records;
    if (Array.isArray(input?.reversePickups)) return input.reversePickups;
    if (Array.isArray(input?.ReversePickups)) return input.ReversePickups;

    return [];
};

/* =========================================================
   STATISTICS COMPONENT
========================================================= */

const ReversePickupStatistics = ({
    reversePickups = [],
    pickups,
    data,

    statistics,
    stats,

    loading = false,
    error = null,

    title = "Reverse Pickup Statistics",
    subtitle = "Overview of return pickup activity",

    showTitle = true,
    showSubtitle = true,
    showProgress = true,
    compact = false
}) => {
    /* =====================================================
       NORMALIZE RECORDS
    ===================================================== */

    const records = useMemo(() => {
        const source =
            Array.isArray(reversePickups) && reversePickups.length > 0
                ? reversePickups
                : pickups !== undefined
                    ? pickups
                    : data !== undefined
                        ? data
                        : reversePickups;

        return normalizeRecords(source);
    }, [reversePickups, pickups, data]);

    /* =====================================================
       CALCULATE STATISTICS
    ===================================================== */

    const calculatedStats = useMemo(() => {
        const result = {
            total: records.length,
            pending: 0,
            scheduled: 0,
            inProgress: 0,
            completed: 0,
            cancelled: 0
        };

        records.forEach((pickup) => {
            const status = getField(
                pickup,
                "status",
                "Status",
                "pickupStatus",
                "PickupStatus",
                "reversePickupStatus",
                "ReversePickupStatus",
                "returnStatus",
                "ReturnStatus"
            );

            if (isCompleted(status)) {
                result.completed += 1;
            } else if (isCancelled(status)) {
                result.cancelled += 1;
            } else if (isScheduled(status)) {
                result.scheduled += 1;
            } else if (isInProgress(status)) {
                result.inProgress += 1;
            } else if (isPending(status)) {
                result.pending += 1;
            } else {
                // Treat unrecognized statuses as pending so every
                // pickup is included in the status summary.
                result.pending += 1;
            }
        });

        return result;
    }, [records]);

    /* =====================================================
       USE PRECOMPUTED STATISTICS WHEN PROVIDED
    ===================================================== */

    const suppliedStats = statistics || stats || {};

    const getStat = (keys, fallback) => {
        const value = getField(suppliedStats, ...keys);

        if (value === undefined) return fallback;

        const number = Number(value);

        return Number.isFinite(number) ? number : fallback;
    };

    const totals = {
        total: getStat(
            ["total", "Total", "totalPickups", "TotalPickups", "totalRecords", "TotalRecords"],
            calculatedStats.total
        ),

        pending: getStat(
            ["pending", "Pending", "pendingPickups", "PendingPickups"],
            calculatedStats.pending
        ),

        scheduled: getStat(
            ["scheduled", "Scheduled", "scheduledPickups", "ScheduledPickups"],
            calculatedStats.scheduled
        ),

        inProgress: getStat(
            ["inProgress", "InProgress", "inProgressPickups", "InProgressPickups"],
            calculatedStats.inProgress
        ),

        completed: getStat(
            ["completed", "Completed", "completedPickups", "CompletedPickups"],
            calculatedStats.completed
        ),

        cancelled: getStat(
            ["cancelled", "Cancelled", "canceled", "Canceled", "cancelledPickups", "CancelledPickups"],
            calculatedStats.cancelled
        )
    };

    /* =====================================================
       FORMAT NUMBER
    ===================================================== */

    const formatNumber = (value) => {
        const number = Number(value);

        if (!Number.isFinite(number)) return "0";

        return number.toLocaleString("en-IN");
    };

    /* =====================================================
       PERCENTAGE
    ===================================================== */

    const getPercentage = (value) => {
        if (!totals.total || totals.total <= 0) return 0;

        return Math.min(
            100,
            Math.max(0, (Number(value) / totals.total) * 100)
        );
    };

    /* =====================================================
       STATISTIC CARD
    ===================================================== */

    const StatisticCard = ({
        label,
        value,
        icon,
        color,
        description,
        showPercentage = true
    }) => {
        const percentage = getPercentage(value);

        return (
            <Grid item xs={12} sm={6} md={4} lg={2}>
                <Card
                    variant="outlined"
                    sx={{
                        height: "100%",
                        borderRadius: 2,
                        transition: "all 0.2s ease",
                        "&:hover": {
                            boxShadow: 2,
                            transform: "translateY(-2px)"
                        }
                    }}
                >
                    <CardContent
                        sx={{
                            p: compact ? 1.5 : 2,
                            "&:last-child": {
                                pb: compact ? 1.5 : 2
                            }
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={1}
                        >
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    {label}
                                </Typography>

                                {loading ? (
                                    <Skeleton
                                        variant="text"
                                        width={85}
                                        height={38}
                                    />
                                ) : (
                                    <Typography
                                        variant="h5"
                                        fontWeight={700}
                                        sx={{
                                            lineHeight: 1.25,
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {formatNumber(value)}
                                    </Typography>
                                )}
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 42,
                                    height: 42,
                                    borderRadius: 2,
                                    bgcolor: `${color}.light`,
                                    color: `${color}.dark`,
                                    flexShrink: 0
                                }}
                            >
                                {icon}
                            </Box>
                        </Stack>

                        {showPercentage && (
                            <Box sx={{ mt: 2 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ mb: 0.75 }}
                                >
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        {description || "Share of total"}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        fontWeight={600}
                                    >
                                        {loading
                                            ? "—"
                                            : `${percentage.toFixed(1)}%`}
                                    </Typography>
                                </Stack>

                                <LinearProgress
                                    variant={loading ? "indeterminate" : "determinate"}
                                    value={percentage}
                                    color={color}
                                    sx={{
                                        height: 5,
                                        borderRadius: 5
                                    }}
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        );
    };

    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error && records.length === 0 && !statistics && !stats) {
        return (
            <Box
                sx={{
                    p: 3,
                    border: 1,
                    borderColor: "error.light",
                    borderRadius: 2
                }}
            >
                <Typography color="error" fontWeight={600}>
                    Unable to load reverse pickup statistics.
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    {typeof error === "string"
                        ? error
                        : error?.message || "An unexpected error occurred."}
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", mb: 3 }}>
            {/* SECTION HEADER */}

            {showTitle && (
                <Box sx={{ mb: 2 }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: showSubtitle ? 0.5 : 0 }}
                    >
                        <AssignmentReturn color="primary" />

                        <Typography
                            variant="h6"
                            component="h2"
                            fontWeight={700}
                        >
                            {title}
                        </Typography>
                    </Stack>

                    {showSubtitle && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
            )}

            {/* LOADING INDICATOR */}

            {loading && (
                <Box sx={{ mb: 2 }}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 1 }}
                    >
                        <CircularProgress size={16} />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Updating statistics...
                        </Typography>
                    </Stack>
                </Box>
            )}

            {/* STATISTIC CARDS */}

            <Grid container spacing={2}>
                <StatisticCard
                    label="Total Pickups"
                    value={totals.total}
                    icon={<AssignmentReturn />}
                    color="primary"
                    description="All pickup records"
                    showPercentage={false}
                />

                <StatisticCard
                    label="Pending"
                    value={totals.pending}
                    icon={<PendingActions />}
                    color="warning"
                    description="Awaiting action"
                    showPercentage={showProgress}
                />

                <StatisticCard
                    label="Scheduled"
                    value={totals.scheduled}
                    icon={<EventAvailable />}
                    color="info"
                    description="Pickup scheduled"
                    showPercentage={showProgress}
                />

                <StatisticCard
                    label="In Progress"
                    value={totals.inProgress}
                    icon={<LocalShipping />}
                    color="secondary"
                    description="Being processed"
                    showPercentage={showProgress}
                />

                <StatisticCard
                    label="Completed"
                    value={totals.completed}
                    icon={<CheckCircle />}
                    color="success"
                    description="Successfully completed"
                    showPercentage={showProgress}
                />

                <StatisticCard
                    label="Cancelled"
                    value={totals.cancelled}
                    icon={<Cancel />}
                    color="error"
                    description="Cancelled pickups"
                    showPercentage={showProgress}
                />
            </Grid>

            {/* COMPLETION SUMMARY */}

            {!compact && (
                <Card
                    variant="outlined"
                    sx={{
                        mt: 2,
                        borderRadius: 2
                    }}
                >
                    <CardContent>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            justifyContent="space-between"
                            spacing={2}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <TrendingUp color="success" />

                                <Box>
                                    <Typography
                                        variant="subtitle2"
                                        fontWeight={700}
                                    >
                                        Pickup Completion Rate
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Percentage of pickups completed
                                    </Typography>
                                </Box>
                            </Stack>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                color="success.main"
                            >
                                {loading || totals.total === 0
                                    ? "—"
                                    : `${(
                                        (totals.completed / totals.total) * 100
                                    ).toFixed(1)}%`}
                            </Typography>
                        </Stack>

                        <LinearProgress
                            variant={
                                loading ? "indeterminate" : "determinate"
                            }
                            value={
                                totals.total > 0
                                    ? Math.min(
                                        100,
                                        (totals.completed / totals.total) * 100
                                    )
                                    : 0
                            }
                            color="success"
                            sx={{
                                mt: 2,
                                height: 8,
                                borderRadius: 5
                            }}
                        />
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ReversePickupStatistics;

