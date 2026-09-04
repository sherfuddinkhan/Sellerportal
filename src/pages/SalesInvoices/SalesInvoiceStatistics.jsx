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


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

};


/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
    title,
    value,
    icon,
    iconColor,
    iconBackground
}) => {

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                borderRadius: 2,
                transition: "all 0.2s ease",

                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 5
                }
            }}
        >

            <CardContent
                sx={{
                    p: 2.5,

                    "&:last-child": {
                        pb: 2.5
                    }
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                    }}
                >

                    {/* =================================================
                       ICON
                    ================================================= */}

                    <Box
                        sx={{
                            width: 54,
                            height: 54,
                            minWidth: 54,

                            borderRadius: 2,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            backgroundColor: iconBackground
                        }}
                    >

                        {React.cloneElement(icon, {
                            color: iconColor,
                            fontSize: "large"
                        })}

                    </Box>


                    {/* =================================================
                       VALUE
                    ================================================= */}

                    <Box
                        sx={{
                            minWidth: 0,
                            flex: 1
                        }}
                    >

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mb: 0.5,
                                fontWeight: 500
                            }}
                        >
                            {title}
                        </Typography>


                        <Typography
                            variant="h5"
                            fontWeight={700}
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


/* =========================================================
   SALES INVOICE STATISTICS
========================================================= */

const SalesInvoiceStatistics = ({
    statistics
}) => {

    /*
        Default values prevent the UI from breaking
        when the API response is empty/null.
    */

    const stats = statistics || {};


    const totalInvoices =
        Number(stats.totalInvoices) || 0;

    const totalAmount =
        Number(stats.totalAmount) || 0;

    const paidAmount =
        Number(stats.paidAmount) || 0;

    const balanceAmount =
        Number(stats.balanceAmount) || 0;


    return (
        <Grid
            container
            spacing={3}
            sx={{
                mb: 3
            }}
        >

            {/* =================================================
               TOTAL INVOICES
            ================================================= */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatCard
                    title="Total Invoices"
                    value={totalInvoices}
                    icon={<ReceiptLong />}
                    iconColor="primary"
                    iconBackground="rgba(25, 118, 210, 0.10)"
                />

            </Grid>


            {/* =================================================
               TOTAL AMOUNT
            ================================================= */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatCard
                    title="Total Amount"
                    value={formatCurrency(totalAmount)}
                    icon={<Payments />}
                    iconColor="success"
                    iconBackground="rgba(46, 125, 50, 0.10)"
                />

            </Grid>


            {/* =================================================
               PAID AMOUNT
            ================================================= */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatCard
                    title="Paid Amount"
                    value={formatCurrency(paidAmount)}
                    icon={<AccountBalanceWallet />}
                    iconColor="info"
                    iconBackground="rgba(2, 136, 209, 0.10)"
                />

            </Grid>


            {/* =================================================
               BALANCE AMOUNT
            ================================================= */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatCard
                    title="Balance Amount"
                    value={formatCurrency(balanceAmount)}
                    icon={<AccountBalance />}
                    iconColor="warning"
                    iconBackground="rgba(237, 108, 2, 0.10)"
                />

            </Grid>

        </Grid>
    );

};


export default SalesInvoiceStatistics;
