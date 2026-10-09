import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress
} from "@mui/material";

import {
    Tune,
    CheckCircle,
    Cancel,
    PlaylistAddCheck,
    Inventory2
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (object, ...keys) => {
    for (const key of keys) {
        if (
            object?.[key] !== undefined &&
            object?.[key] !== null
        ) {
            return object[key];
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
            elevation={0}
            sx={{
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                transition: "all 0.2s ease",

                "&:hover": {
                    boxShadow: 2,
                    transform: "translateY(-2px)"
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={2}
                >
                    <Box sx={{ minWidth: 0 }}>
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
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            color,
                            backgroundColor: `${color}18`
                        }}
                    >
                        {React.cloneElement(icon, {
                            sx: {
                                fontSize: 27
                            }
                        })}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

/* =========================================================
   VENDOR ITEM CUSTOM FIELD STATISTICS
========================================================= */

const VendorItemCustomFieldStatistics = ({
    vendorItemCustomFields = [],
    customFields = [],
    fields = [],

    statistics = null,
    summary = null,

    totalFields: totalFieldsProp,
    activeFields: activeFieldsProp,
    inactiveFields: inactiveFieldsProp,
    requiredFields: requiredFieldsProp,

    loading = false
}) => {
    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const rows =
        vendorItemCustomFields?.length > 0
            ? vendorItemCustomFields
            : customFields?.length > 0
                ? customFields
                : fields;

    const apiStatistics = statistics || summary || {};

    /* =====================================================
       CALCULATE TOTAL FIELDS
    ===================================================== */

    const totalFields = Number(
        totalFieldsProp ??
        getFieldValue(
            apiStatistics,
            "totalFields",
            "TotalFields",
            "totalCustomFields",
            "TotalCustomFields",
            "totalCount",
            "TotalCount"
        ) ??
        rows.length
    ) || 0;

    /* =====================================================
       CALCULATE ACTIVE FIELDS
    ===================================================== */

    const activeFields = Number(
        activeFieldsProp ??
        getFieldValue(
            apiStatistics,
            "activeFields",
            "ActiveFields",
            "activeCount",
            "ActiveCount"
        ) ??
        rows.filter((field) => {
            const value = getFieldValue(
                field,
                "isActive",
                "IsActive"
            );

            return (
                value === true ||
                value === 1 ||
                String(value).toLowerCase() === "true"
            );
        }).length
    ) || 0;

    /* =====================================================
       CALCULATE INACTIVE FIELDS
    ===================================================== */

    const inactiveFields = Number(
        inactiveFieldsProp ??
        getFieldValue(
            apiStatistics,
            "inactiveFields",
            "InactiveFields",
            "inactiveCount",
            "InactiveCount"
        ) ??
        Math.max(totalFields - activeFields, 0)
    ) || 0;

    /* =====================================================
       CALCULATE REQUIRED FIELDS
    ===================================================== */

    const requiredFields = Number(
        requiredFieldsProp ??
        getFieldValue(
            apiStatistics,
            "requiredFields",
            "RequiredFields",
            "requiredCount",
            "RequiredCount"
        ) ??
        rows.filter((field) => {
            const value = getFieldValue(
                field,
                "isRequired",
                "IsRequired"
            );

            return (
                value === true ||
                value === 1 ||
                String(value).toLowerCase() === "true"
            );
        }).length
    ) || 0;

    /* =====================================================
       STATISTICS CARDS
    ===================================================== */

    const cards = [
        {
            title: "Total Custom Fields",
            value: totalFields,
            subtitle: "All configured custom fields",
            icon: <Inventory2 />,
            color: "#1976d2"
        },
        {
            title: "Active Fields",
            value: activeFields,
            subtitle: "Currently enabled fields",
            icon: <CheckCircle />,
            color: "#2e7d32"
        },
        {
            title: "Inactive Fields",
            value: inactiveFields,
            subtitle: "Currently disabled fields",
            icon: <Cancel />,
            color: "#d32f2f"
        },
        {
            title: "Required Fields",
            value: requiredFields,
            subtitle: "Fields marked as mandatory",
            icon: <PlaylistAddCheck />,
            color: "#ed6c02"
        }
    ];

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%" }}>
            <Grid container spacing={2}>
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

export default VendorItemCustomFieldStatistics;

