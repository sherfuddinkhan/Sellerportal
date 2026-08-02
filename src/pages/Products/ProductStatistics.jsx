import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

const ProductStatistics = ({ products }) => {

    const totalProducts = products.length;

    const activeProducts = products.filter(
        x => x.isActive
    ).length;

    const inactiveProducts = totalProducts - activeProducts;

    const totalStock = products.reduce(

        (sum, item) =>

            sum + (item.stockQuantity || 0),

        0

    );

    const totalValue = products.reduce(

        (sum, item) =>

            sum +

            ((item.stockQuantity || 0) *

            (item.sellingPrice || 0)),

        0

    );

    const cards = [

        {
            title: "Total Products",
            value: totalProducts
        },

        {
            title: "Active Products",
            value: activeProducts
        },

        {
            title: "Inactive Products",
            value: inactiveProducts
        },

        {
            title: "Total Stock",
            value: totalStock
        },

        {
            title: "Inventory Value",
            value: `₹ ${totalValue.toLocaleString()}`
        }

    ];

    return (

        <Grid container spacing={2} sx={{ mb: 3 }}>

            {

                cards.map((card, index) => (

                    <Grid

                        item

                        xs={12}

                        sm={6}

                        md={2.4}

                        key={index}

                    >

                        <Card
                            elevation={3}
                        >

                            <CardContent>

                                <Typography

                                    color="text.secondary"

                                    variant="body2"

                                >

                                    {card.title}

                                </Typography>

                                <Typography

                                    variant="h5"

                                    fontWeight="bold"

                                    mt={1}

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

export default ProductStatistics;