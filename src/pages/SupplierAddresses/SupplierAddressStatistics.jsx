import React, { useMemo } from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    LocationOn,
    CheckCircle,
    Cancel,
    LocationCity
} from "@mui/icons-material";

/* =========================================================
   SUPPLIER ADDRESS STATISTICS
========================================================= */

const SupplierAddressStatistics = ({
    supplierAddresses = []
}) => {

    /* =====================================================
       SAFE DATA
    ===================================================== */

    const addresses = Array.isArray(supplierAddresses)
        ? supplierAddresses
        : [];

    /* =====================================================
       CALCULATE STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {

        const totalAddresses = addresses.length;

        const activeAddresses = addresses.filter((address) => {
            const status = String(
                address?.status ??
                address?.Status ??
                ""
            ).trim().toLowerCase();

            return [
                "active",
                "enabled",
                "true"
            ].includes(status);
        }).length;

        const inactiveAddresses = addresses.filter((address) => {
            const status = String(
                address?.status ??
                address?.Status ??
                ""
            ).trim().toLowerCase();

            return [
                "inactive",
                "disabled",
                "false"
            ].includes(status);
        }).length;

        const uniqueCities = new Set(
            addresses
                .map((address) =>
                    String(
                        address?.city ??
                        address?.City ??
                        ""
                    ).trim().toLowerCase()
                )
                .filter(Boolean)
        ).size;

        return {
            totalAddresses,
            activeAddresses,
            inactiveAddresses,
            uniqueCities
        };

    }, [addresses]);

    /* =====================================================
       STATISTIC CARD CONFIGURATION
    ===================================================== */

    const cards = [
        {
            title: "Total Addresses",
            value: statistics.totalAddresses,
            icon: <LocationOn />,
            color: "#1976d2",
            background: "#e3f2fd"
        },
        {
            title: "Active Addresses",
            value: statistics.activeAddresses,
            icon: <CheckCircle />,
            color: "#2e7d32",
            background: "#e8f5e9"
        },
        {
            title: "Inactive Addresses",
            value: statistics.inactiveAddresses,
            icon: <Cancel />,
            color: "#d32f2f",
            background: "#ffebee"
        },
        {
            title: "Unique Cities",
            value: statistics.uniqueCities,
            icon: <LocationCity />,
            color: "#ed6c02",
            background: "#fff3e0"
        }
    ];

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Grid container spacing={2} mb={3}>
            {cards.map((card) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={card.title}
                >
                    <Card
                        elevation={2}
                        sx={{
                            height: "100%",
                            borderRadius: 2,
                            transition: "0.2s",
                            "&:hover": {
                                transform: "translateY(-3px)",
                                boxShadow: 5
                            }
                        }}
                    >
                        <CardContent>
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                gap={2}
                            >
                                <Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        fontWeight={500}
                                    >
                                        {card.title}
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight={700}
                                        mt={1}
                                        sx={{
                                            color: card.color
                                        }}
                                    >
                                        {card.value.toLocaleString("en-IN")}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        width: 52,
                                        height: 52,
                                        minWidth: 52,
                                        borderRadius: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: card.color,
                                        backgroundColor: card.background
                                    }}
                                >
                                    {React.cloneElement(card.icon, {
                                        fontSize: "large"
                                    })}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default SupplierAddressStatistics;

