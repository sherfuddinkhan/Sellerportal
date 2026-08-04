import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    Inventory2,
    ShoppingCart,
    Payments,
    ReceiptLong
} from "@mui/icons-material";

const DeliveryChallanItemStatistics = ({ statistics }) => {

    const cards = [

        {
            title: "Total Items",
            value: statistics?.totalItems || 0,
            icon: (
                <Inventory2
                    fontSize="large"
                    color="primary"
                />
            )
        },

        {
            title: "Total Quantity",
            value: statistics?.totalQuantity || 0,
            icon: (
                <ShoppingCart
                    fontSize="large"
                    color="success"
                />
            )
        },

        {
            title: "Total Amount",
            value: `₹ ${Number(
                statistics?.totalAmount || 0
            ).toLocaleString()}`,
            icon: (
                <Payments
                    fontSize="large"
                    color="warning"
                />
            )
        },

        {
            title: "Total Tax",
            value: `₹ ${Number(
                statistics?.totalTax || 0
            ).toLocaleString()}`,
            icon: (
                <ReceiptLong
                    fontSize="large"
                    color="info"
                />
            )
        }

    ];

    return (

        <Grid
            container
            spacing={3}
            className="delivery-challan-item-statistics"
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
                        className="delivery-challan-item-stat-card"
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

export default DeliveryChallanItemStatistics;