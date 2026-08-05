import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    AssignmentReturn,
    Payments,
    CheckCircle,
    PendingActions
} from "@mui/icons-material";

const MarketplaceReturnStatistics = ({ statistics }) => {

    const cards = [

        {
            title: "Total Returns",
            value: statistics?.totalReturns || 0,
            icon: (
                <AssignmentReturn
                    fontSize="large"
                    color="primary"
                />
            )
        },

        {
            title: "Total Refund",
            value: `₹ ${Number(
                statistics?.totalRefundAmount || 0
            ).toLocaleString()}`,
            icon: (
                <Payments
                    fontSize="large"
                    color="success"
                />
            )
        },

        {
            title: "Completed",
            value: statistics?.completedReturns || 0,
            icon: (
                <CheckCircle
                    fontSize="large"
                    color="success"
                />
            )
        },

        {
            title: "Pending",
            value: statistics?.pendingReturns || 0,
            icon: (
                <PendingActions
                    fontSize="large"
                    color="warning"
                />
            )
        }

    ];

    return (

        <Grid
            container
            spacing={3}
            className="marketplace-return-statistics"
            sx={{ mb: 3 }}
        >

            {

                cards.map((card, index) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={index}
                    >

                        <Card
                            elevation={3}
                            className="marketplace-return-stat-card"
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

                ))

            }

        </Grid>

    );

};

export default MarketplaceReturnStatistics;