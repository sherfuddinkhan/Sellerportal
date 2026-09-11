// ============================================================
// CustomerReturnStatistics.jsx
// ============================================================

import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";

import {
    AssignmentReturn,
    PendingActions,
    CheckCircle,
    Cancel
} from "@mui/icons-material";

// ============================================================
// CUSTOMER RETURN STATISTICS
// ============================================================

const CustomerReturnStatistics = ({
    returns = []
}) => {

    // ========================================================
    // SAFE STATUS HELPER
    // ========================================================

    const getStatus = (item) => {
        return String(
            item?.Status ??
            item?.status ??
            ""
        )
            .trim()
            .toLowerCase();
    };

    // ========================================================
    // STATISTICS
    // ========================================================

    const totalReturns = returns.length;

    const pendingReturns = returns.filter(
        (item) =>
            getStatus(item) === "pending"
    ).length;

    const completedReturns = returns.filter(
        (item) =>
            [
                "completed",
                "approved"
            ].includes(getStatus(item))
    ).length;

    const cancelledReturns = returns.filter(
        (item) =>
            [
                "cancelled",
                "rejected"
            ].includes(getStatus(item))
    ).length;

    // ========================================================
    // STATISTICS DATA
    // ========================================================

    const statistics = [
        {
            title: "Total Returns",
            value: totalReturns,
            icon: (
                <AssignmentReturn fontSize="large" />
            )
        },
        {
            title: "Pending",
            value: pendingReturns,
            icon: (
                <PendingActions fontSize="large" />
            )
        },
        {
            title: "Completed",
            value: completedReturns,
            icon: (
                <CheckCircle fontSize="large" />
            )
        },
        {
            title: "Cancelled",
            value: cancelledReturns,
            icon: (
                <Cancel fontSize="large" />
            )
        }
    ];

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Grid
            container
            spacing={3}
            sx={{ mb: 3 }}
        >
            {statistics.map((stat) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={stat.title}
                >
                    <Card
                        elevation={3}
                        sx={{
                            height: "100%",
                            borderRadius: 2,
                            transition: "0.3s",

                            "&:hover": {
                                transform:
                                    "translateY(-4px)",
                                boxShadow: 6
                            }
                        }}
                    >
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                {/* =================================
                                    STATISTIC INFORMATION
                                ================================= */}
                                <Stack spacing={0.5}>
                                    <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                    >
                                        {stat.title}
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                    >
                                        {stat.value}
                                    </Typography>
                                </Stack>

                                {/* =================================
                                    STATISTIC ICON
                                ================================= */}
                                <Stack
                                    color="primary.main"
                                >
                                    {stat.icon}
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default CustomerReturnStatistics;