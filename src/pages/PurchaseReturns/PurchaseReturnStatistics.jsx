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
   SAFE NUMBER
========================================================= */

const safeNumber = (value) => {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
};


/* =========================================================
   PURCHASE RETURN STATISTICS
========================================================= */

const PurchaseReturnStatistics = ({
    statistics = {}
}) => {

    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
        "STATISTICS RECEIVED BY COMPONENT:",
        statistics
    );

    console.log(
        "TOTAL AMOUNT RECEIVED:",
        statistics?.totalAmount
    );


    /* =====================================================
       NORMALIZE STATISTICS
    ===================================================== */

    const totalReturns = safeNumber(
        statistics?.totalReturns ??
        statistics?.totalRecords
    );


    const totalAmount = safeNumber(
        statistics?.totalAmount ??
        statistics?.totalReturnAmount
    );


    const completedReturns = safeNumber(
        statistics?.completedReturns ??
        statistics?.completedCount
    );


    const pendingReturns = safeNumber(
        statistics?.pendingReturns ??
        statistics?.pendingPickupCount
    );


    /* =====================================================
       STATISTICS CARDS
    ===================================================== */

    const cards = [

        {
            title: "Total Returns",

            value: totalReturns,

            icon: (
                <AssignmentReturn
                    fontSize="large"
                    color="primary"
                />
            )
        },


        {
            title: "Total Amount",

            value: formatCurrency(
                totalAmount
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

            value: completedReturns,

            icon: (
                <CheckCircle
                    fontSize="large"
                    color="info"
                />
            )
        },


        {
            title: "Pending",

            value: pendingReturns,

            icon: (
                <PendingActions
                    fontSize="large"
                    color="warning"
                />
            )
        }

    ];


    /* =====================================================
       RENDER
    ===================================================== */

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
                            height: "100%",
                            borderRadius: 2
                        }}
                    >

                        <CardContent
                            sx={{
                                p: 3
                            }}
                        >

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap={2}
                            >

                                {/* =================================
                                   CARD CONTENT
                                ================================= */}

                                <Box
                                    sx={{
                                        minWidth: 0,
                                        flex: 1
                                    }}
                                >

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        fontWeight={500}
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


                                {/* =================================
                                   CARD ICON
                                ================================= */}

                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
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