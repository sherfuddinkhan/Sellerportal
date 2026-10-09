import React, { useMemo } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress,
    Skeleton
} from "@mui/material";

import {
    LocalShipping,
    Inventory2,
    PendingActions,
    CheckCircle,
    Cancel,
    Scale
} from "@mui/icons-material";

/* =========================================================
   SAFE FIELD ACCESS
========================================================= */

const getField = (record, ...keys) => {
    if (!record) return null;

    for (const key of keys) {
        const value = record[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (status) =>
    String(status || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ");

/* =========================================================
   STATISTIC CARD
========================================================= */

const StatisticCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    loading
}) => {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                transition: "all 0.2s ease",
                "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)"
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1.5
                    }}
                >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={600}
                            sx={{ mb: 1 }}
                        >
                            {title}
                        </Typography>

                        {loading ? (
                            <Skeleton
                                variant="text"
                                width={100}
                                height={40}
                            />
                        ) : (
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    color,
                                    lineHeight: 1.2,
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {formatNumber(value)}
                            </Typography>
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
                            width: 48,
                            height: 48,
                            minWidth: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2.5,
                            bgcolor: `${color}14`,
                            color
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

/* =========================================================
   SHIPPING MANIFEST STATISTICS
========================================================= */

const ShippingManifestStatistics = ({
    manifests,
    data,
    statistics,
    stats,
    loading = false
}) => {
    const manifestList = Array.isArray(manifests)
        ? manifests
        : Array.isArray(data)
            ? data
            : [];

    const suppliedStatistics = statistics || stats || {};

    const calculatedStatistics = useMemo(() => {
        let pending = 0;
        let shipped = 0;
        let delivered = 0;
        let cancelled = 0;
        let totalQuantity = 0;

        manifestList.forEach((manifest) => {
            const status = normalizeStatus(
                getField(
                    manifest,
                    "status",
                    "Status",
                    "manifestStatus",
                    "ManifestStatus"
                )
            );

            if (
                ["pending", "processing", "ready", "packed"].includes(
                    status
                )
            ) {
                pending += 1;
            } else if (
                ["shipped", "in transit"].includes(status)
            ) {
                shipped += 1;
            } else if (
                ["delivered", "completed"].includes(status)
            ) {
                delivered += 1;
            } else if (
                ["cancelled", "canceled", "failed", "rejected"].includes(
                    status
                )
            ) {
                cancelled += 1;
            }

            const quantity = Number(
                getField(
                    manifest,
                    "totalQuantity",
                    "TotalQuantity",
                    "quantity",
                    "Quantity"
                )
            );

            if (Number.isFinite(quantity)) {
                totalQuantity += quantity;
            }
        });

        return {
            totalManifests: manifestList.length,
            pendingManifests: pending,
            shippedManifests: shipped,
            deliveredManifests: delivered,
            cancelledManifests: cancelled,
            totalQuantity
        };
    }, [manifestList]);

    const getStatistic = (fallback, ...keys) => {
        const value = getField(suppliedStatistics, ...keys);

        return value !== null ? value : fallback;
    };

    const cards = [
        {
            title: "Total Manifests",
            value: getStatistic(
                calculatedStatistics.totalManifests,
                "totalManifests",
                "TotalManifests",
                "totalRecords",
                "TotalRecords",
                "total",
                "Total"
            ),
            subtitle: "All shipping manifests",
            icon: <Inventory2 sx={{ fontSize: 27 }} />,
            color: "#1976d2"
        },
        {
            title: "Pending",
            value: getStatistic(
                calculatedStatistics.pendingManifests,
                "pendingManifests",
                "PendingManifests",
                "pending",
                "Pending",
                "pendingCount",
                "PendingCount"
            ),
            subtitle: "Awaiting shipment or processing",
            icon: <PendingActions sx={{ fontSize: 27 }} />,
            color: "#ed6c02"
        },
        {
            title: "Shipped / In Transit",
            value: getStatistic(
                calculatedStatistics.shippedManifests,
                "shippedManifests",
                "ShippedManifests",
                "shipped",
                "Shipped",
                "shippedCount",
                "ShippedCount"
            ),
            subtitle: "Currently in transit",
            icon: <LocalShipping sx={{ fontSize: 27 }} />,
            color: "#0288d1"
        },
        {
            title: "Delivered",
            value: getStatistic(
                calculatedStatistics.deliveredManifests,
                "deliveredManifests",
                "DeliveredManifests",
                "delivered",
                "Delivered",
                "deliveredCount",
                "DeliveredCount"
            ),
            subtitle: "Successfully delivered",
            icon: <CheckCircle sx={{ fontSize: 27 }} />,
            color: "#2e7d32"
        },
        {
            title: "Cancelled",
            value: getStatistic(
                calculatedStatistics.cancelledManifests,
                "cancelledManifests",
                "CancelledManifests",
                "cancelled",
                "Cancelled",
                "cancelledCount",
                "CancelledCount"
            ),
            subtitle: "Cancelled or failed shipments",
            icon: <Cancel sx={{ fontSize: 27 }} />,
            color: "#d32f2f"
        },
        {
            title: "Total Quantity",
            value: getStatistic(
                calculatedStatistics.totalQuantity,
                "totalQuantity",
                "TotalQuantity",
                "totalShippedQuantity",
                "TotalShippedQuantity"
            ),
            subtitle: "Combined manifest quantity",
            icon: <Scale sx={{ fontSize: 27 }} />,
            color: "#7b1fa2"
        }
    ];

    return (
        <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
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

            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1.5
                    }}
                >
                    <CircularProgress size={14} />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Updating shipping statistics...
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ShippingManifestStatistics;

