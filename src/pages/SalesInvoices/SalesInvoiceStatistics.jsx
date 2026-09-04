import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    ReceiptLong,
    Payments,
    AccountBalanceWallet,
    AccountBalance
} from "@mui/icons-material";


const formatCurrency = (value) => {

    const amount = Number(value);

    if (Number.isNaN(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

};


const StatCard = ({
    title,
    value,
    icon
}) => {

    return (

        <Card
            elevation={2}
            sx={{
                height: "100%",
                borderRadius: 2
            }}
        >

            <CardContent>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {icon}
                    </Box>

                    <Box
                        sx={{
                            minWidth: 0
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            noWrap
                        >
                            {value}
                        </Typography>

                    </Box>

                </Box>

            </CardContent>

        </Card>

    );

};


const SalesInvoiceStatistics = ({
    statistics
}) => {

    const stats = statistics || {};

    return (

        <Grid
            container
            spacing={3}
            sx={{
                mb: 3
            }}
        >

            {/* Total Invoices */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatCard
                    title="Total Invoices"
                    value={Number(stats.totalInvoices) || 0}
                    icon={
                        <ReceiptLong
                            color="primary"
                            fontSize="large"
                        />
                    }
                />

            </Grid>


            {/* Total Amount */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatCard
                    title="Total Amount"
                    value={formatCurrency(
                        stats.totalAmount
                    )}
                    icon={
                        <Payments
                            color="success"
                            fontSize="large"
                        />
                    }
                />

            </Grid>


            {/* Paid Amount */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatCard
                    title="Paid Amount"
                    value={formatCurrency(
                        stats.paidAmount
                    )}
                    icon={
                        <AccountBalanceWallet
                            color="info"
                            fontSize="large"
                        />
                    }
                />

            </Grid>


            {/* Balance Amount */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatCard
                    title="Balance Amount"
                    value={formatCurrency(
                        stats.balanceAmount
                    )}
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