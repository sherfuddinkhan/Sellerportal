// =========================================================
// GatepassStatistics.jsx
// =========================================================

import React, { useMemo } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Avatar
} from "@mui/material";

import {
    LocalShipping,
    PendingActions,
    CheckCircle,
    TaskAlt,
    Cancel
} from "@mui/icons-material";

// =========================================================
// NORMALIZE STATUS
// =========================================================

const normalizeStatus = (value) => {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");
};

// =========================================================
// GET FIELD VALUE
// Supports camelCase and PascalCase.
// =========================================================

const getField = (record, ...keys) => {
    for (const key of keys) {
        if (record?.[key] !== undefined && record?.[key] !== null) {
            return record[key];
        }
    }

    return "";
};

// =========================================================
// STATISTICS CARD
// =========================================================

const StatisticsCard = ({
    title,
    value,
    icon,
    color,
    description
}) => {
    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                borderRadius: 3,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 5
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                            gutterBottom
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            component="div"
                            fontWeight={700}
                            sx={{ mt: 1, overflowWrap: "anywhere" }}
                        >
                            {value}
                        </Typography>

                        {description && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: "block",
                                    mt: 1
                                }}
                            >
                                {description}
                            </Typography>
                        )}
                    </Box>

                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: `${color}18`,
                            color: color
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </CardContent>
        </Card>
    );
};

// =========================================================
// GATEPASS STATISTICS
// =========================================================

const GatepassStatistics = ({
    gatepasses = [],
    data,
    loading = false
}) => {

    // =====================================================
    // SOURCE DATA
    // =====================================================

    const records = Array.isArray(gatepasses)
        ? gatepasses
        : Array.isArray(data)
            ? data
            : [];

    // =====================================================
    // CALCULATE STATISTICS
    // =====================================================

    const statistics = useMemo(() => {
        const result = {
            total: records.length,
            pending: 0,
            approved: 0,
            completed: 0,
            rejected: 0
        };

        records.forEach((record) => {
            const status = normalizeStatus(
                getField(record, "status", "Status", "gatepassStatus", "GatepassStatus")
            );

            if (status === "pending") {
                result.pending++;
            } else if (
                status === "approved" ||
                status === "authorized" ||
                status === "authorised"
            ) {
                result.approved++;
            } else if (
                status === "completed" ||
                status === "closed"
            ) {
                result.completed++;
            } else if (
                status === "rejected" ||
                status === "cancelled" ||
                status === "canceled"
            ) {
                result.rejected++;
            }
        });

        return result;
    }, [records]);

    // =====================================================
    // STATISTICS CARDS
    // =====================================================

    const cards = [
        {
            title: "Total Gatepasses",
            value: statistics.total,
            icon: <LocalShipping />,
            color: "#1976d2",
            description: "All loaded records"
        },
        {
            title: "Pending",
            value: statistics.pending,
            icon: <PendingActions />,
            color: "#ed6c02",
            description: "Awaiting approval"
        },
        {
            title: "Approved",
            value: statistics.approved,
            icon: <CheckCircle />,
            color: "#0288d1",
            description: "Authorized gatepasses"
        },
        {
            title: "Completed",
            value: statistics.completed,
            icon: <TaskAlt />,
            color: "#2e7d32",
            description: "Completed gatepasses"
        },
        {
            title: "Rejected / Cancelled",
            value: statistics.rejected,
            icon: <Cancel />,
            color: "#d32f2f",
            description: "Rejected or cancelled"
        }
    ];

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box sx={{ width: "100%", mb: 3 }}>
            <Typography
                variant="h6"
                component="h2"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Gatepass Statistics
            </Typography>

            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={2.4}
                        key={card.title}
                    >
                        <StatisticsCard
                            title={card.title}
                            value={loading ? "—" : card.value}
                            icon={card.icon}
                            color={card.color}
                            description={card.description}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default GatepassStatistics;

