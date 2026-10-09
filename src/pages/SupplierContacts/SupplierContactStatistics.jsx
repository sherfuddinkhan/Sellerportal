import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Avatar,
    LinearProgress,
    useTheme
} from "@mui/material";

import {
    Contacts,
    Person,
    Star,
    CheckCircle,
    Cancel,
    Business,
    TrendingUp
} from "@mui/icons-material";

/* =========================================================
   SAFE VALUE
========================================================= */

const getValue = (obj, ...keys) => {
    for (const key of keys) {
        const value = obj?.[key];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return null;
};

/* =========================================================
   BOOLEAN HELPER
========================================================= */

const isTrue = (value) =>
    value === true ||
    value === 1 ||
    String(value).toLowerCase() === "true" ||
    String(value).toLowerCase() === "active";

/* =========================================================
   STATISTICS CARD
========================================================= */

const StatisticsCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    percentage
}) => {
    const theme = useTheme();

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: theme.shadows[5]
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
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={600}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight={800}
                            sx={{ mt: 1, mb: 0.5 }}
                        >
                            {value}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {subtitle}
                        </Typography>
                    </Box>

                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: color,
                            color: "#fff",
                            flexShrink: 0
                        }}
                    >
                        {icon}
                    </Avatar>
                </Stack>

                {percentage !== undefined && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min(
                                100,
                                Math.max(0, Number(percentage) || 0)
                            )}
                            sx={{
                                height: 6,
                                borderRadius: 5,
                                bgcolor: theme.palette.action.hover,
                                "& .MuiLinearProgress-bar": {
                                    bgcolor: color,
                                    borderRadius: 5
                                }
                            }}
                        />

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mt: 0.75 }}
                        >
                            {Math.round(Number(percentage) || 0)}% of total contacts
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

/* =========================================================
   SUPPLIER CONTACT STATISTICS
========================================================= */

const SupplierContactStatistics = ({
    supplierContacts = [],
    contacts,
    totalContacts,
    activeContacts,
    inactiveContacts,
    primaryContacts,
    supplierCount,
    loading = false
}) => {
    const data = Array.isArray(contacts)
        ? contacts
        : Array.isArray(supplierContacts)
            ? supplierContacts
            : [];

    /* =====================================================
       CALCULATE STATISTICS
    ===================================================== */

    const calculatedTotal = data.length;

    const calculatedActive = data.filter((contact) => {
        const status = getValue(
            contact,
            "isActive",
            "IsActive",
            "status",
            "Status"
        );

        return status !== null && isTrue(status);
    }).length;

    const calculatedInactive = data.filter((contact) => {
        const status = getValue(
            contact,
            "isActive",
            "IsActive",
            "status",
            "Status"
        );

        return status !== null && !isTrue(status);
    }).length;

    const calculatedPrimary = data.filter((contact) =>
        isTrue(
            getValue(contact, "isPrimary", "IsPrimary")
        )
    ).length;

    const calculatedSupplierCount = new Set(
        data
            .map((contact) =>
                getValue(contact, "supplierId", "SupplierId")
            )
            .filter((id) => id !== null)
            .map(String)
    ).size;

    const total = Number(totalContacts ?? calculatedTotal) || 0;
    const active = Number(activeContacts ?? calculatedActive) || 0;
    const inactive = Number(inactiveContacts ?? calculatedInactive) || 0;
    const primary = Number(primaryContacts ?? calculatedPrimary) || 0;
    const suppliers = Number(supplierCount ?? calculatedSupplierCount) || 0;

    const activePercentage = total > 0
        ? (active / total) * 100
        : 0;

    const primaryPercentage = total > 0
        ? (primary / total) * 100
        : 0;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h6"
                    fontWeight={800}
                >
                    Supplier Contact Overview
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Summary of supplier contact records and their status.
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {/* TOTAL CONTACTS */}

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatisticsCard
                        title="Total Contacts"
                        value={loading ? "—" : total}
                        subtitle="All contact records"
                        icon={<Contacts />}
                        color="#1976d2"
                    />
                </Grid>

                {/* ACTIVE CONTACTS */}

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatisticsCard
                        title="Active Contacts"
                        value={loading ? "—" : active}
                        subtitle="Currently active"
                        icon={<CheckCircle />}
                        color="#2e7d32"
                        percentage={loading ? undefined : activePercentage}
                    />
                </Grid>

                {/* INACTIVE CONTACTS */}

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatisticsCard
                        title="Inactive Contacts"
                        value={loading ? "—" : inactive}
                        subtitle="Inactive or disabled"
                        icon={<Cancel />}
                        color="#d32f2f"
                    />
                </Grid>

                {/* PRIMARY CONTACTS */}

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatisticsCard
                        title="Primary Contacts"
                        value={loading ? "—" : primary}
                        subtitle="Marked as primary"
                        icon={<Star />}
                        color="#ed6c02"
                        percentage={loading ? undefined : primaryPercentage}
                    />
                </Grid>

                {/* SUPPLIERS */}

                <Grid item xs={12} sm={6} md={4} lg={2.4}>
                    <StatisticsCard
                        title="Suppliers"
                        value={loading ? "—" : suppliers}
                        subtitle="Suppliers represented"
                        icon={<Business />}
                        color="#7b1fa2"
                    />
                </Grid>
            </Grid>

            {/* CONTACT ACTIVITY SUMMARY */}

            {!loading && total > 0 && (
                <Card
                    elevation={1}
                    sx={{
                        mt: 2,
                        borderRadius: 3,
                        border: 1,
                        borderColor: "divider"
                    }}
                >
                    <CardContent sx={{ p: 2.5 }}>
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            spacing={2}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: "action.hover",
                                    color: "primary.main"
                                }}
                            >
                                <TrendingUp />
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Contact Activity
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {active} of {total} contacts are active
                                    {activePercentage > 0
                                        ? ` (${activePercentage.toFixed(1)}%)`
                                        : "."}
                                </Typography>
                            </Box>

                            <Typography
                                variant="body2"
                                fontWeight={700}
                                color="success.main"
                            >
                                {activePercentage.toFixed(1)}% active
                            </Typography>
                        </Stack>

                        <LinearProgress
                            variant="determinate"
                            value={Math.min(100, activePercentage)}
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

export default SupplierContactStatistics;

