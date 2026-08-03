import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

const SalesOrderItemStatistics = ({

    statistics

}) => {

    const {

        totalItems = 0,

        totalQuantity = 0,

        totalTax = 0,

        totalAmount = 0

    } = statistics || {};

    return (

        <Grid
            container
            spacing={3}
            sx={{ mb: 3 }}
        >

            <Grid item xs={12} sm={6} md={3}>

                <Card className="sales-order-item-stat-card">

                    <CardContent>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >

                            Total Items

                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >

                            {totalItems}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <Card className="sales-order-item-stat-card">

                    <CardContent>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >

                            Total Quantity

                        </Typography>

                        <Typography
                            variant="h4"
                            color="primary"
                            fontWeight="bold"
                        >

                            {Number(totalQuantity).toLocaleString()}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <Card className="sales-order-item-stat-card">

                    <CardContent>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >

                            Total Tax

                        </Typography>

                        <Typography
                            variant="h5"
                            color="warning.main"
                            fontWeight="bold"
                        >

                            {formatCurrency(totalTax)}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <Card className="sales-order-item-stat-card">

                    <CardContent>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >

                            Total Amount

                        </Typography>

                        <Typography
                            variant="h5"
                            color="success.main"
                            fontWeight="bold"
                        >

                            {formatCurrency(totalAmount)}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

        </Grid>

    );

};

export default SalesOrderItemStatistics;