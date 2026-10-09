import React, { useMemo } from "react";

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Stack,
    Avatar,
    CircularProgress
} from "@mui/material";

import {
    Inventory2,
    CheckCircle,
    PendingActions,
    Inventory
} from "@mui/icons-material";

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...fields) => {
    for (const field of fields) {
        const value = record?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return null;
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (status) => {
    return String(status || "")
        .trim()
        .toLowerCase();
};

/* =========================================================
   CHECK COMPLETED STATUS
========================================================= */

const isCompletedStatus = (status) => {
    const normalizedStatus = normalizeStatus(status);

    return (
        normalizedStatus.includes("complete") ||
        normalizedStatus.includes("done")
    );
};

/* =========================================================
   CHECK PENDING STATUS
========================================================= */

const isPendingStatus = (status) => {
    const normalizedStatus = normalizeStatus(status);

    return (
        normalizedStatus.includes("pending") ||
        normalizedStatus.includes("waiting")
    );
};

/* =========================================================
   STATISTICS CARD
========================================================= */

const StatisticsCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    loading = false
}) => {
    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 5
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
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
                            <CircularProgress size={25} />
                        ) : (
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    lineHeight: 1.3,
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

                    <Avatar
                        sx={{
                            width: 54,
                            height: 54,
                            bgcolor: `${color}.light`,
                            color: `${color}.dark`,
                            flexShrink: 0
                        }}
                    >
                        {icon}
                    </Avatar>
                </Stack>
            </CardContent>
        </Card>
    );
};

/* =========================================================
   MANIFEST PACKAGES PUTAWAY STATISTICS
========================================================= */

const ManifestPackagesPutawayStatistics = ({
    records = [],
    loading = false,

    totalRecords,
    completedRecords,
    pendingRecords,
    totalQuantity
}) => {
    /* -----------------------------------------------------
       CALCULATE STATISTICS
    ----------------------------------------------------- */

    const statistics = useMemo(() => {
        const safeRecords = Array.isArray(records)
            ? records
            : [];

        let completedCount = 0;
        let pendingCount = 0;
        let quantitySum = 0;

        safeRecords.forEach((record) => {
            const status = getFieldValue(
                record,
                "status",
                "Status",
                "putawayStatus",
                "PutawayStatus"
            );

            const quantity = getFieldValue(
                record,
                "quantity",
                "Quantity",
                "packageQuantity",
                "PackageQuantity"
            );

            if (isCompletedStatus(status)) {
                completedCount += 1;
            }

            if (isPendingStatus(status)) {
                pendingCount += 1;
            }

            const numericQuantity = Number(quantity);

            if (
                quantity !== null &&
                quantity !== "" &&
                Number.isFinite(numericQuantity)
            ) {
                quantitySum += numericQuantity;
            }
        });

        return {
            total: safeRecords.length,
            completed: completedCount,
            pending: pendingCount,
            quantity: quantitySum
        };
    }, [records]);

    /* -----------------------------------------------------
       USE PROVIDED VALUES WHEN AVAILABLE
    ----------------------------------------------------- */

    const resolvedTotal =
        totalRecords !== undefined &&
        totalRecords !== null
            ? totalRecords
            : statistics.total;

    const resolvedCompleted =
        completedRecords !== undefined &&
        completedRecords !== null
            ? completedRecords
            : statistics.completed;

    const resolvedPending =
        pendingRecords !== undefined &&
        pendingRecords !== null
            ? pendingRecords
            : statistics.pending;

    const resolvedQuantity =
        totalQuantity !== undefined &&
        totalQuantity !== null
            ? totalQuantity
            : statistics.quantity;

    /* -----------------------------------------------------
       STATISTICS CARDS
    ----------------------------------------------------- */

    const cards = [
        {
            title: "Total Putaway Records",
            value: resolvedTotal,
            subtitle: "All putaway records",
            icon: <Inventory2 />,
            color: "primary"
        },
        {
            title: "Completed Putaway",
            value: resolvedCompleted,
            subtitle: "Successfully completed",
            icon: <CheckCircle />,
            color: "success"
        },
        {
            title: "Pending Putaway",
            value: resolvedPending,
            subtitle: "Awaiting completion",
            icon: <PendingActions />,
            color: "warning"
        },
        {
            title: "Total Quantity",
            value: resolvedQuantity,
            subtitle: "Combined package quantity",
            icon: <Inventory />,
            color: "info"
        }
    ];

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Box sx={{ width: "100%", mb: 3 }}>
            <Grid container spacing={2.5}>
                {cards.map((card) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={card.title}
                    >
                        <StatisticsCard
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
        </Box>
    );
};

export default ManifestPackagesPutawayStatistics;

