import React from "react";
import apiService from "../../services/apiService";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

const BrandStatistics = ({ brands = [] }) => {

    const totalBrands = brands.length;

    const activeBrands = brands.filter(
        x => x.isActive === true
    ).length;

    const inactiveBrands = brands.filter(
        x => x.isActive === false
    ).length;

    const recentlyAdded = [...brands]
        .sort(
            (a, b) =>
                new Date(b.createdDate) -
                new Date(a.createdDate)
        )
        .slice(0, 5).length;

    const statistics = [

        {
            title: "Total Brands",
            value: totalBrands,
            icon: <LocalOfferIcon fontSize="large" />,
            color: "#1976d2"
        },

        {
            title: "Active Brands",
            value: activeBrands,
            icon: <CheckCircleIcon fontSize="large" />,
            color: "#2e7d32"
        },

        {
            title: "Inactive Brands",
            value: inactiveBrands,
            icon: <CancelIcon fontSize="large" />,
            color: "#d32f2f"
        },

        {
            title: "Recently Added",
            value: recentlyAdded,
            icon: <NewReleasesIcon fontSize="large" />,
            color: "#ed6c02"
        }

    ];

    return (

        <Grid
            container
            spacing={3}
            mb={3}
        >

            {statistics.map((item, index) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={index}
                >

                    <Card
                        elevation={4}
                        sx={{
                            borderLeft: `5px solid ${item.color}`,
                            borderRadius: 3
                        }}
                    >

                        <CardContent>

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >

                                <Box>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {item.title}
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                        mt={1}
                                    >
                                        {item.value}
                                    </Typography>

                                </Box>

                                <Box
                                    sx={{
                                        color: item.color
                                    }}
                                >
                                    {item.icon}
                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

};

export default BrandStatistics;