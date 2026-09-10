import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

const formatCurrency = (value) => {
    return `₹ ${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

const SalesOrderItemStatistics = ({ statistics = {} }) => {

    const totalItems = Number(statistics.totalItems || 0);
    const totalQuantity = Number(statistics.totalQuantity || 0);
    const totalTax = Number(statistics.totalTax || 0);
    const totalAmount = Number(statistics.totalAmount || 0);

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>

            {/* TOTAL ITEMS */}
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: "100%" }}>
                    <CardContent>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Total Items
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {totalItems.toLocaleString("en-IN")}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* TOTAL QUANTITY */}
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: "100%" }}>
                    <CardContent>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Total Quantity
                        </Typography>

                        <Typography
                            variant="h4"
                            color="primary"
                            fontWeight="bold"
                        >
                            {totalQuantity.toLocaleString("en-IN")}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* TOTAL TAX */}
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: "100%" }}>
                    <CardContent>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
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

            {/* TOTAL AMOUNT */}
            <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: "100%" }}>
                    <CardContent>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
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