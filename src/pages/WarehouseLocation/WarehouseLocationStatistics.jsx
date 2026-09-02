import React from "react";

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";


const WarehouseLocationStatistics = ({
    locations = []
}) => {

    const total =
        locations.length;

    const active =
        locations.filter(
            item =>
                Boolean(
                    item.IsActive ??
                    item.isActive
                )
        ).length;

    const inactive =
        total - active;

    const warehouses =
        new Set(
            locations.map(
                item =>
                    item.WarehouseId ??
                    item.warehouseId
            )
        ).size;


    const statistics = [
        {
            label: "Total Locations",
            value: total
        },
        {
            label: "Active",
            value: active
        },
        {
            label: "Inactive",
            value: inactive
        },
        {
            label: "Warehouses",
            value: warehouses
        }
    ];


    return (
        <Grid
            container
            spacing={2}
            sx={{ mb: 3 }}
        >

            {statistics.map(stat => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={stat.label}
                >

                    <Card>

                        <CardContent>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {stat.label}
                            </Typography>

                            <Typography
                                variant="h4"
                                sx={{
                                    mt: 1,
                                    fontWeight: 700
                                }}
                            >
                                {stat.value}
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>
    );
};


export default WarehouseLocationStatistics;