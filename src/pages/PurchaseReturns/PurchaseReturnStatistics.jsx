import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    AssignmentReturn,
    Payments,
    CheckCircle,
    PendingActions
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
   PURCHASE RETURN STATISTICS
========================================================= */

const PurchaseReturnStatistics = ({
    statistics = {}
}) => {

    const cards = [

        {
            title: "Total Returns",

            value:
                Number(statistics?.totalReturns) || 0,

            icon: (
                <AssignmentReturn
                    fontSize="large"
                    color="primary"
                />
            )
        },

        {
            title: "Total Amount",

            value:
                formatCurrency(
                    statistics?.totalAmount
                ),

            icon: (
                <Payments
                    fontSize="large"
                    color="success"
                />
            )
        },

        {
            title: "Completed",

            value:
                Number(
                    statistics?.completedReturns
                ) || 0,

            icon: (
                <CheckCircle
                    fontSize="large"
                    color="info"
                />
            )
        },

        {
            title: "Pending",

            value:
                Number(
                    statistics?.pendingReturns
                ) || 0,

            icon: (
                <PendingActions
                    fontSize="large"
                    color="warning"
                />
            )
        }

    ];


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <Grid
            container
            spacing={3}
            className="purchase-return-statistics"
            sx={{
                mb: 3
            }}
        >

            {cards.map((card) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={card.title}
                >

                    <Card
                        elevation={3}
                        className="purchase-return-stat-card"
                        sx={{
                            height: "100%"
                        }}
                    >

                        <CardContent>

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                            >

                                <Box
                                    sx={{
                                        minWidth: 0
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {card.title}
                                    </Typography>


                                    <Typography
                                        variant="h4"
                                        fontWeight="bold"
                                        sx={{
                                            mt: 1,
                                            wordBreak: "break-word"
                                        }}
                                    >
                                        {card.value}
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        flexShrink: 0
                                    }}
                                >
                                    {card.icon}
                                </Box>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

};


export default PurchaseReturnStatistics;