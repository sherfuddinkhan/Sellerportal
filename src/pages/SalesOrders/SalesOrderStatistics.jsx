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

const SalesOrderStatistics = ({

    statistics

}) => {

    const {

        totalOrders = 0,

        totalAmount = 0,

        completedOrders = 0,

        pendingOrders = 0

    } = statistics || {};

    return (

        <Grid
            container
            spacing={3}
            sx={{ mb: 3 }}
        >

            <Grid item xs={12} sm={6} md={3}>

                <Card className="sales-order-stat-card">

                    <CardContent>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >

                            Total Orders

                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >

                            {totalOrders}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <Card className="sales-order-stat-card">

                    <CardContent>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >

                            Total Sales

                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >

                            {formatCurrency(totalAmount)}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <Card className="sales-order-stat-card">

                    <CardContent>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >

                            Completed Orders

                        </Typography>

                        <Typography
                            variant="h4"
                            color="success.main"
                            fontWeight="bold"
                        >

                            {completedOrders}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <Card className="sales-order-stat-card">

                    <CardContent>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                        >

                            Pending Orders

                        </Typography>

                        <Typography
                            variant="h4"
                            color="warning.main"
                            fontWeight="bold"
                        >

                            {pendingOrders}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

        </Grid>

    );

};

export default SalesOrderStatistics;