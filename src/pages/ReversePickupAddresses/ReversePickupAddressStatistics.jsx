import React, { useMemo } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    CircularProgress
} from "@mui/material";

import {
    LocationOn,
    CheckCircle,
    Cancel,
    Home,
    TrendingUp
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getField = (object, ...keys) => {
    if (!object || typeof object !== "object") {
        return undefined;
    }

    for (const key of keys) {
        if (
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {
            return object[key];
        }
    }

    return undefined;
};

/* =========================================================
   NORMALIZE STATUS
========================================================= */

const normalizeStatus = (status) =>
    String(status ?? "")
        .trim()
        .toLowerCase()
        .replace(/[_-]/g, " ");

/* =========================================================
   GET ADDRESS ID
========================================================= */

const getAddressId = (address) =>
    getField(
        address,
        "reversePickupAddressId",
        "ReversePickupAddressId",
        "addressId",
        "AddressId",
        "id",
        "Id"
    );

/* =========================================================
   GET ACTIVE STATUS
========================================================= */

const isActiveAddress = (address) => {
    const status = normalizeStatus(
        getField(address, "status", "Status")
    );

    const explicitActive = getField(
        address,
        "isActive",
        "IsActive",
        "active",
        "Active"
    );

    if (typeof explicitActive === "boolean") {
        return explicitActive;
    }

    if (typeof explicitActive === "number") {
        return explicitActive === 1;
    }

    if (typeof explicitActive === "string") {
        const normalized = explicitActive.trim().toLowerCase();

        if (["true", "1", "yes"].includes(normalized)) {
            return true;
        }

        if (["false", "0", "no"].includes(normalized)) {
            return false;
        }
    }

    if (
        ["inactive", "disabled", "deleted", "rejected", "cancelled", "canceled"]
            .includes(status)
    ) {
        return false;
    }

    if (
        ["active", "approved", "verified"]
            .includes(status)
    ) {
        return true;
    }

    return false;
};

/* =========================================================
   GET INACTIVE STATUS
========================================================= */

const isInactiveAddress = (address) => {
    const status = normalizeStatus(
        getField(address, "status", "Status")
    );

    const explicitActive = getField(
        address,
        "isActive",
        "IsActive",
        "active",
        "Active"
    );

    if (typeof explicitActive === "boolean") {
        return !explicitActive;
    }

    if (typeof explicitActive === "number") {
        return explicitActive === 0;
    }

    if (typeof explicitActive === "string") {
        const normalized = explicitActive.trim().toLowerCase();

        if (["false", "0", "no"].includes(normalized)) {
            return true;
        }

        if (["true", "1", "yes"].includes(normalized)) {
            return false;
        }
    }

    return [
        "inactive",
        "disabled",
        "deleted",
        "rejected",
        "cancelled",
        "canceled"
    ].includes(status);
};

/* =========================================================
   GET DEFAULT ADDRESS FLAG
========================================================= */

const isDefaultAddress = (address) => {
    const value = getField(
        address,
        "isDefault",
        "IsDefault",
        "defaultAddress",
        "DefaultAddress",
        "isPrimary",
        "IsPrimary"
    );

    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value === 1;
    }

    if (typeof value === "string") {
        return ["true", "1", "yes"].includes(
            value.trim().toLowerCase()
        );
    }

    return false;
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
    description,
    icon: Icon,
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
                borderRadius: 3,
                backgroundColor: "background.paper",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.08)"
                }
            }}
        >
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 2
                    }}
                >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontWeight: 500,
                                mb: 1
                            }}
                        >
                            {title}
                        </Typography>

                        {loading ? (
                            <CircularProgress
                                size={26}
                                thickness={5}
                            />
                        ) : (
                            <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                    lineHeight: 1.3,
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {formatNumber(value)}
                            </Typography>
                        )}

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

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            flexShrink: 0,
                            borderRadius: 2.5,
                            color: iconColor,
                            backgroundColor: iconBackground
                        }}
                    >
                        <Icon sx={{ fontSize: 27 }} />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

/* =========================================================
   MAIN STATISTICS COMPONENT
========================================================= */

const ReversePickupAddressStatistics = ({
    addresses = [],
    data,
    loading = false,
    statistics,
    stats,
    totalCount,
    activeCount,
    inactiveCount,
    defaultCount,
    onCardClick
}) => {
    /* -----------------------------------------------------
       NORMALIZE DATA
    ----------------------------------------------------- */

    const addressList = Array.isArray(data)
        ? data
        : Array.isArray(addresses)
            ? addresses
            : [];

    const suppliedStatistics = statistics || stats || {};

    /* -----------------------------------------------------
       CALCULATE STATISTICS
    ----------------------------------------------------- */

    const calculatedStatistics = useMemo(() => {
        const total = addressList.length;

        const active = addressList.filter(
            isActiveAddress
        ).length;

        const inactive = addressList.filter(
            isInactiveAddress
        ).length;

        const defaults = addressList.filter(
            isDefaultAddress
        ).length;

        const uniqueIds = new Set(
            addressList
                .map(getAddressId)
                .filter(
                    (id) =>
                        id !== undefined &&
                        id !== null &&
                        id !== ""
                )
                .map(String)
        );

        return {
            total,
            active,
            inactive,
            defaults,
            uniqueIds: uniqueIds.size
        };
    }, [addressList]);

    /* -----------------------------------------------------
       USE PROVIDED VALUES WHEN AVAILABLE
    ----------------------------------------------------- */

    const resolvedTotal =
        totalCount ??
        getField(
            suppliedStatistics,
            "totalAddresses",
            "TotalAddresses",
            "totalCount",
            "TotalCount",
            "total",
            "Total"
        ) ??
        calculatedStatistics.total;

    const resolvedActive =
        activeCount ??
        getField(
            suppliedStatistics,
            "activeAddresses",
            "ActiveAddresses",
            "activeCount",
            "ActiveCount",
            "active",
            "Active"
        ) ??
        calculatedStatistics.active;

    const resolvedInactive =
        inactiveCount ??
        getField(
            suppliedStatistics,
            "inactiveAddresses",
            "InactiveAddresses",
            "inactiveCount",
            "InactiveCount",
            "inactive",
            "Inactive"
        ) ??
        calculatedStatistics.inactive;

    const resolvedDefault =
        defaultCount ??
        getField(
            suppliedStatistics,
            "defaultAddresses",
            "DefaultAddresses",
            "defaultCount",
            "DefaultCount",
            "defaults",
            "Defaults"
        ) ??
        calculatedStatistics.defaults;

    /* -----------------------------------------------------
       CARD CONFIGURATION
    ----------------------------------------------------- */

    const cards = [
        {
            key: "total",
            title: "Total Addresses",
            value: resolvedTotal,
            description: "All reverse pickup addresses",
            icon: LocationOn,
            iconColor: "#2563eb",
            iconBackground: "#dbeafe"
        },
        {
            key: "active",
            title: "Active Addresses",
            value: resolvedActive,
            description: "Currently active addresses",
            icon: CheckCircle,
            iconColor: "#15803d",
            iconBackground: "#dcfce7"
        },
        {
            key: "inactive",
            title: "Inactive Addresses",
            value: resolvedInactive,
            description: "Inactive or disabled addresses",
            icon: Cancel,
            iconColor: "#dc2626",
            iconBackground: "#fee2e2"
        },
        {
            key: "default",
            title: "Default Addresses",
            value: resolvedDefault,
            description: "Addresses marked as default",
            icon: Home,
            iconColor: "#7c3aed",
            iconBackground: "#ede9fe"
        }
    ];

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Box
            sx={{
                width: "100%",
                mb: 3
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2
                }}
            >
                <TrendingUp color="primary" />

                <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 700 }}
                >
                    Address Statistics
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        lg={3}
                        key={card.key}
                    >
                        <Box
                            onClick={
                                onCardClick
                                    ? () => onCardClick(card.key)
                                    : undefined
                            }
                            sx={{
                                height: "100%",
                                cursor: onCardClick
                                    ? "pointer"
                                    : "default"
                            }}
                        >
                            <StatisticsCard
                                title={card.title}
                                value={card.value}
                                description={card.description}
                                icon={card.icon}
                                iconColor={card.iconColor}
                                iconBackground={card.iconBackground}
                                loading={loading}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ReversePickupAddressStatistics;

