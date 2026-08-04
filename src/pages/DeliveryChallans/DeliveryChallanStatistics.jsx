import React from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    LocalShipping,
    CheckCircle,
    Pending,
    DirectionsBus
} from "@mui/icons-material";

const DeliveryChallanStatistics = ({ statistics }) => {

    const cards = [

        {
            title: "Total Challans",
            value: statistics?.totalDeliveryChallans || 0,
            icon: <LocalShipping fontSize="large" color="primary" />
        },

        {
            title: "Delivered",
            value: statistics?.delivered || 0,
            icon: <CheckCircle fontSize="large" color="success" />
        },

        {
            title: "Pending",
            value: statistics?.pending || 0,
            icon: <Pending fontSize="large" color="warning" />
        },

        {
            title: "In Transit",
            value: statistics?.inTransit || 0,
            icon: <DirectionsBus fontSize="large" color="info" />
        }

    ];

    return (

        <Grid
            container
            spacing={3}
            className="delivery-challan-statistics"
            sx={{ mb: 3 }}
        >

            {cards.map((card, index) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={index}
                >

                    <Card
                        className="delivery-challan-stat-card"
                        elevation={3}
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
                                        {card.title}
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                        sx={{ mt: 1 }}
                                    >
                                        {card.value}
                                    </Typography>

                                </Box>

                                {card.icon}

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

};

export default DeliveryChallanStatistics;