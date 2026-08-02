import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

import {
    AttachMoney,
    CheckCircle,
    Cancel,
    TrendingUp
} from "@mui/icons-material";

const ProductPriceStatistics = ({ productPrices = [] }) => {

    const totalPrices = productPrices.length;

    const activePrices = productPrices.filter(

        x => x.IsActive

    ).length;

    const inactivePrices = totalPrices - activePrices;

    const averagePrice = totalPrices

        ? (

            productPrices.reduce(

                (sum, item) =>

                    sum + Number(item.Price || 0),

                0

            ) / totalPrices

        ).toFixed(2)

        : 0;

    const cards = [

        {

            title: "Total Prices",

            value: totalPrices,

            icon: <AttachMoney fontSize="large" />,

            color: "#1976d2"

        },

        {

            title: "Active",

            value: activePrices,

            icon: <CheckCircle fontSize="large" />,

            color: "#2e7d32"

        },

        {

            title: "Inactive",

            value: inactivePrices,

            icon: <Cancel fontSize="large" />,

            color: "#d32f2f"

        },

        {

            title: "Average Price",

            value: `₹ ${averagePrice}`,

            icon: <TrendingUp fontSize="large" />,

            color: "#ed6c02"

        }

    ];

    return (

        <Grid

            container

            spacing={3}

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

                            sx={{

                                borderLeft:

                                    `5px solid ${card.color}`,

                                height: "100%"

                            }}

                        >

                            <CardContent>

                                <Grid

                                    container

                                    justifyContent="space-between"

                                    alignItems="center"

                                >

                                    <Grid item>

                                        <Typography

                                            color="text.secondary"

                                            variant="body2"

                                        >

                                            {card.title}

                                        </Typography>

                                        <Typography

                                            variant="h5"

                                            fontWeight="bold"

                                        >

                                            {card.value}

                                        </Typography>

                                    </Grid>

                                    <Grid

                                        item

                                        sx={{

                                            color: card.color

                                        }}

                                    >

                                        {card.icon}

                                    </Grid>

                                </Grid>

                            </CardContent>

                        </Card>

                    </Grid>

                ))

            }

        </Grid>

    );

};

export default ProductPriceStatistics;