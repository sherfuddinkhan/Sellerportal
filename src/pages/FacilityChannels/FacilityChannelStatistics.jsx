import React, { useMemo } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    CircularProgress
} from "@mui/material";

import {
    Apartment,
    CheckCircle,
    Cancel,
    PendingActions
} from "@mui/icons-material";

/* =========================================================
   STATISTICS CARD
========================================================= */

const StatisticsCard = ({
    title,
    value,
    icon,
    iconColor,
    iconBackground,
    loading = false
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
            <CardContent sx={{ p: 2.5 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                mt: 1,
                                overflowWrap: "anywhere"
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={25} />
                            ) : (
                                Number(value || 0).toLocaleString("en-IN")
                            )}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: iconColor,
                            bgcolor: iconBackground,
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
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (item) => {
    const status =
        item?.status ??
        item?.channelStatus;

    if (status !== null && status !== undefined) {
        return String(status).trim().toLowerCase();
    }

    const isActive =
        item?.isActive ??
        item?.active ??
        item?.enabled;

    if (isActive === true) {
        return "active";
    }

    if (isActive === false) {
        return "inactive";
    }

    return "unknown";
};

/* =========================================================
   FACILITY CHANNEL STATISTICS
========================================================= */

const FacilityChannelStatistics = ({
    facilityChannels = [],
    statistics = null,
    loading = false
}) => {

    /* =====================================================
       CALCULATE STATISTICS
    ===================================================== */

    const calculatedStatistics = useMemo(() => {
        const rows = Array.isArray(facilityChannels)
            ? facilityChannels
            : [];

        const result = {
            total: rows.length,
            active: 0,
            inactive: 0,
            pending: 0
        };

        rows.forEach((item) => {
            const status = normalizeStatus(item);

            switch (status) {
                case "active":
                case "enabled":
                case "available":
                case "true":
                    result.active += 1;
                    break;

                case "inactive":
                case "disabled":
                case "unavailable":
                case "false":
                    result.inactive += 1;
                    break;

                case "pending":
                    result.pending += 1;
                    break;

                default:
                    break;
            }
        });

        return result;
    }, [facilityChannels]);

    /* =====================================================
       SUPPORT API-PROVIDED STATISTICS
    ===================================================== */

    const summary = {
        total:
            statistics?.total ??
            statistics?.totalFacilityChannels ??
            calculatedStatistics.total,

        active:
            statistics?.active ??
            statistics?.activeFacilityChannels ??
            calculatedStatistics.active,

        inactive:
            statistics?.inactive ??
            statistics?.inactiveFacilityChannels ??
            calculatedStatistics.inactive,

        pending:
            statistics?.pending ??
            statistics?.pendingFacilityChannels ??
            calculatedStatistics.pending
    };

    /* =====================================================
       CARD CONFIGURATION
    ===================================================== */

    const cards = [
        {
            title: "Total Facility Channels",
            value: summary.total,
            icon: <Apartment />,
            iconColor: "primary.main",
            iconBackground: "primary.light"
        },
        {
            title: "Active Channels",
            value: summary.active,
            icon: <CheckCircle />,
            iconColor: "success.main",
            iconBackground: "success.light"
        },
        {
            title: "Inactive Channels",
            value: summary.inactive,
            icon: <Cancel />,
            iconColor: "error.main",
            iconBackground: "error.light"
        },
        {
            title: "Pending Channels",
            value: summary.pending,
            icon: <PendingActions />,
            iconColor: "warning.main",
            iconBackground: "warning.light"
        }
    ];

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            className="facility-channel-statistics"
            sx={{ width: "100%" }}
        >
            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={3}
                        key={card.title}
                    >
                        <StatisticsCard
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            iconColor={card.iconColor}
                            iconBackground={card.iconBackground}
                            loading={loading}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FacilityChannelStatistics;

