// PicklistStatistics.jsx

import React from "react";

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

import {
    PlaylistAddCheck,
    PendingActions,
    Autorenew,
    CheckCircle,
    Cancel
} from "@mui/icons-material";

/* =========================================================
   STATISTICS CARD
========================================================= */

const StatisticsCard = ({
    title,
    value,
    description,
    icon,
    color,
    backgroundColor
}) => {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                transition: "box-shadow 0.2s ease",
                "&:hover": {
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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1.5
                    }}
                >
                    {/* TEXT */}

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                            sx={{
                                mb: 1,
                                overflowWrap: "anywhere"
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            component="div"
                            fontWeight={700}
                            sx={{
                                lineHeight: 1.2,
                                color: "text.primary",
                                fontVariantNumeric: "tabular-nums"
                            }}
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

                    {/* ICON */}

                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            minWidth: 46,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            color,
                            backgroundColor
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
   NUMBER FORMATTER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN");
};

/* =========================================================
   STATISTICS COMPONENT
========================================================= */

const PicklistStatistics = ({
    statistics,
    totalPicklists,
    pendingPicklists,
    inProgressPicklists,
    completedPicklists,
    cancelledPicklists
}) => {
    /*
     * Supports either:
     * 1. statistics={{ total, pending, inProgress, completed, cancelled }}
     * 2. Individual count props.
     */

    const total = formatNumber(
        totalPicklists ?? statistics?.total
    );

    const pending = formatNumber(
        pendingPicklists ?? statistics?.pending
    );

    const inProgress = formatNumber(
        inProgressPicklists ?? statistics?.inProgress
    );

    const completed = formatNumber(
        completedPicklists ?? statistics?.completed
    );

    const cancelled = formatNumber(
        cancelledPicklists ?? statistics?.cancelled
    );

    const cards = [
        {
            title: "Total Picklists",
            value: total,
            description: "All picklist records",
            icon: <PlaylistAddCheck fontSize="medium" />,
            color: "primary.main",
            backgroundColor: "action.hover"
        },
        {
            title: "Pending",
            value: pending,
            description: "Awaiting picking",
            icon: <PendingActions fontSize="medium" />,
            color: "warning.main",
            backgroundColor: "warning.light"
        },
        {
            title: "In Progress",
            value: inProgress,
            description: "Currently being processed",
            icon: <Autorenew fontSize="medium" />,
            color: "info.main",
            backgroundColor: "info.light"
        },
        {
            title: "Completed",
            value: completed,
            description: "Picking completed",
            icon: <CheckCircle fontSize="medium" />,
            color: "success.main",
            backgroundColor: "success.light"
        },
        {
            title: "Cancelled",
            value: cancelled,
            description: "Cancelled picklists",
            icon: <Cancel fontSize="medium" />,
            color: "error.main",
            backgroundColor: "error.light"
        }
    ];

    return (
        <Box sx={{ width: "100%" }}>
            <Grid
                container
                spacing={2}
            >
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
                            value={card.value}
                            description={card.description}
                            icon={card.icon}
                            color={card.color}
                            backgroundColor={card.backgroundColor}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PicklistStatistics;

