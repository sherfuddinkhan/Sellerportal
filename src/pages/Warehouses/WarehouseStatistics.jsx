// =========================================================
// WarehouseStatistics.jsx
// Frontend Only
// =========================================================

import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

import {
    Warehouse,
    CheckCircle,
    Cancel
} from "@mui/icons-material";


// =========================================================
// WarehouseStatistics
// =========================================================

const WarehouseStatistics = ({
    warehouses = []
}) => {

    // =====================================================
    // TOTAL
    // =====================================================

    const totalWarehouses =
        warehouses.length;


    // =====================================================
    // ACTIVE
    // Supports IsActive + isActive
    // =====================================================

    const activeWarehouses =
        warehouses.filter(
            (warehouse) =>
                warehouse.IsActive ??
                warehouse.isActive
        ).length;


    // =====================================================
    // INACTIVE
    // =====================================================

    const inactiveWarehouses =
        totalWarehouses -
        activeWarehouses;


    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics = [

        {
            title: "Total Warehouses",

            value: totalWarehouses,

            color: "#1976d2",

            icon: (
                <Warehouse
                    fontSize="large"
                />
            )
        },

        {
            title: "Active",

            value: activeWarehouses,

            color: "#2e7d32",

            icon: (
                <CheckCircle
                    fontSize="large"
                />
            )
        },

        {
            title: "Inactive",

            value: inactiveWarehouses,

            color: "#d32f2f",

            icon: (
                <Cancel
                    fontSize="large"
                />
            )
        }

    ];


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Grid
            container
            spacing={3}
            sx={{
                mb: 3
            }}
        >

            {statistics.map(
                (item, index) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        key={index}
                    >

                        <Card
                            elevation={3}
                            sx={{
                                borderLeft:
                                    `6px solid ${item.color}`,

                                borderRadius: 2,

                                transition:
                                    "0.3s",

                                "&:hover": {
                                    transform:
                                        "translateY(-4px)",

                                    boxShadow: 6
                                }
                            }}
                        >

                            <CardContent>

                                <Grid
                                    container
                                    alignItems="center"
                                    justifyContent="space-between"
                                >

                                    {/* =================================
                                        VALUE
                                    ================================= */}

                                    <Grid item>

                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                        >
                                            {item.title}
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            fontWeight="bold"
                                        >
                                            {item.value}
                                        </Typography>

                                    </Grid>


                                    {/* =================================
                                        ICON
                                    ================================= */}

                                    <Grid
                                        item
                                        sx={{
                                            color:
                                                item.color
                                        }}
                                    >
                                        {item.icon}
                                    </Grid>

                                </Grid>

                            </CardContent>

                        </Card>

                    </Grid>

                )
            )}

        </Grid>

    );

};

export default WarehouseStatistics;