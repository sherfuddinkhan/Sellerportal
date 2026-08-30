// =========================================================
// SellerStatistics.jsx
// =========================================================

import React from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

const SellerStatistics = ({
    statistics,
}) => {

    if (!statistics) {
        return null;
    }

    const total =
        statistics.total ??
        statistics.totalSellers ??
        statistics.Total ??
        statistics.TotalSellers ??
        0;

    const active =
        statistics.active ??
        statistics.activeSellers ??
        statistics.Active ??
        statistics.ActiveSellers ??
        0;

    const inactive =
        statistics.inactive ??
        statistics.inactiveSellers ??
        statistics.Inactive ??
        statistics.InactiveSellers ??
        0;

    return (

        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, 1fr)",
                },
                gap: 2,
                mb: 3,
            }}
        >

            <Card>

                <CardContent>

                    <Typography
                        color="text.secondary"
                    >
                        Total Sellers
                    </Typography>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {total}
                    </Typography>

                </CardContent>

            </Card>


            <Card>

                <CardContent>

                    <Typography
                        color="text.secondary"
                    >
                        Active Sellers
                    </Typography>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {active}
                    </Typography>

                </CardContent>

            </Card>


            <Card>

                <CardContent>

                    <Typography
                        color="text.secondary"
                    >
                        Inactive Sellers
                    </Typography>

                    <Typography
                        variant="h4"
                        fontWeight={700}
                    >
                        {inactive}
                    </Typography>

                </CardContent>

            </Card>

        </Box>
    );
};

export default SellerStatistics;

