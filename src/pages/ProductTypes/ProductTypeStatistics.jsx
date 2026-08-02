import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

const ProductTypeStatistics = ({ productTypes }) => {

    const total = productTypes.length;

    const active = productTypes.filter(
        x => x.isActive
    ).length;

    const inactive = total - active;

    const thisMonth = productTypes.filter(x => {

        if (!x.createdDate) return false;

        const date = new Date(x.createdDate);

        const today = new Date();

        return (

            date.getMonth() === today.getMonth() &&

            date.getFullYear() === today.getFullYear()

        );

    }).length;

    const cards = [

        {
            title: "Total Product Types",
            value: total
        },

        {
            title: "Active",
            value: active
        },

        {
            title: "Inactive",
            value: inactive
        },

        {
            title: "Added This Month",
            value: thisMonth
        }

    ];

    return (

        <Grid container spacing={2}>

            {

                cards.map((card, index) => (

                    <Grid
                        item
                        xs={12}
                        md={3}
                        key={index}
                    >

                        <Card>

                            <CardContent>

                                <Typography
                                    color="text.secondary"
                                >

                                    {card.title}

                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                >

                                    {card.value}

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                ))

            }

        </Grid>

    );

};

export default ProductTypeStatistics;