import React from "react";

import {
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

const StockMovementStatistics = ({
    statistics
}) => {

    if (!statistics) {
        return null;
    }

    const totalMovements =
        statistics.totalMovements ??
        statistics.TotalMovements ??
        0;

    const totalQuantity =
        statistics.totalQuantity ??
        statistics.TotalQuantity ??
        0;

    const purchases =
        statistics.purchases ??
        statistics.Purchases ??
        0;

    const sales =
        statistics.sales ??
        statistics.Sales ??
        0;

    const transfers =
        statistics.transfers ??
        statistics.Transfers ??
        0;

    const adjustments =
        statistics.adjustments ??
        statistics.Adjustments ??
        0;

    const cards = [
        {
            title: "Total Movements",
            value: totalMovements
        },
        {
            title: "Total Quantity",
            value: totalQuantity
        },
        {
            title: "Purchases",
            value: purchases
        },
        {
            title: "Sales",
            value: sales
        },
        {
            title: "Transfers",
            value: transfers
        },
        {
            title: "Adjustments",
            value: adjustments
        }
    ];

    return (
        <Grid
            container
            spacing={2}
            sx={{ mb: 2 }}
        >

            {cards.map((card) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                    key={card.title}
                >

                    <Card>
                        <CardContent>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {card.title}
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                {card.value}
                            </Typography>

                        </CardContent>
                    </Card>

                </Grid>

            ))}

        </Grid>
    );
};

export default StockMovementStatistics;