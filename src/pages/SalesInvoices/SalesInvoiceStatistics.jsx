import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

import {
    ReceiptLong,
    Payments,
    AccountBalanceWallet,
    AccountBalance
} from "@mui/icons-material";

const StatCard = ({
    title,
    value,
    icon
}) => (

    <Card
        sx={{
            height: "100%",
            borderRadius: 2
        }}
    >

        <CardContent>

            <Grid
                container
                alignItems="center"
                spacing={2}
            >

                <Grid item>

                    {icon}

                </Grid>

                <Grid item xs>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >

                        {title}

                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >

                        {value}

                    </Typography>

                </Grid>

            </Grid>

        </CardContent>

    </Card>

);

const SalesInvoiceStatistics = ({

    statistics

}) => {

    return (

        <Grid
            container
            spacing={3}
            sx={{ mb: 3 }}
        >

            <Grid item xs={12} sm={6} md={3}>

                <StatCard
                    title="Total Invoices"
                    value={statistics?.totalInvoices ?? 0}
                    icon={
                        <ReceiptLong
                            color="primary"
                            fontSize="large"
                        />
                    }
                />

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <StatCard
                    title="Total Amount"
                    value={`₹ ${(
                        statistics?.totalAmount ?? 0
                    ).toFixed(2)}`}
                    icon={
                        <Payments
                            color="success"
                            fontSize="large"
                        />
                    }
                />

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <StatCard
                    title="Paid Amount"
                    value={`₹ ${(
                        statistics?.paidAmount ?? 0
                    ).toFixed(2)}`}
                    icon={
                        <AccountBalanceWallet
                            color="info"
                            fontSize="large"
                        />
                    }
                />

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <StatCard
                    title="Balance Amount"
                    value={`₹ ${(
                        statistics?.balanceAmount ?? 0
                    ).toFixed(2)}`}
                    icon={
                        <AccountBalance
                            color="warning"
                            fontSize="large"
                        />
                    }
                />

            </Grid>

        </Grid>

    );

};

export default SalesInvoiceStatistics;