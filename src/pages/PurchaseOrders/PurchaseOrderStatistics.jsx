import React, {
    useMemo
} from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    ReceiptLong,
    CurrencyRupee,
    PendingActions,
    CheckCircle
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
   PURCHASE ORDER STATISTICS
========================================================= */

const PurchaseOrderStatistics = ({

    statistics

}) => {


    /* =====================================================
       NORMALIZE STATISTICS
    ===================================================== */

    const normalizedStatistics = useMemo(() => {

        const data = statistics || {};

        return {

            totalOrders:
                Number(
                    data.totalOrders ??
                    data.TotalOrders ??
                    0
                ),

            totalAmount:
                Number(
                    data.totalAmount ??
                    data.TotalAmount ??
                    0
                ),

            pendingOrders:
                Number(
                    data.pendingOrders ??
                    data.PendingOrders ??
                    0
                ),

            completedOrders:
                Number(
                    data.completedOrders ??
                    data.CompletedOrders ??
                    0
                )

        };

    }, [statistics]);


    /* =====================================================
       STATISTIC CARDS
    ===================================================== */

    const cards = [

        {
            title: "Total Purchase Orders",

            value:
                normalizedStatistics.totalOrders,

            icon: <ReceiptLong />,

            color: "primary",

            valueVariant: "h4"

        },

        {
            title: "Total Purchase Amount",

            value:
                formatCurrency(
                    normalizedStatistics.totalAmount
                ),

            icon: <CurrencyRupee />,

            color: "success",

            valueVariant: "h5"

        },

        {
            title: "Pending Orders",

            value:
                normalizedStatistics.pendingOrders,

            icon: <PendingActions />,

            color: "warning",

            valueVariant: "h4"

        },

        {
            title: "Completed Orders",

            value:
                normalizedStatistics.completedOrders,

            icon: <CheckCircle />,

            color: "primary",

            valueVariant: "h4"

        }

    ];


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Grid

            container

            spacing={3}

            sx={{
                mb: 3
            }}

        >

            {

                cards.map((card) => (

                    <Grid

                        item

                        xs={12}

                        sm={6}

                        md={3}

                        key={card.title}

                    >

                        <Card

                            className="purchase-order-stat-card"

                            sx={{

                                height: "100%",

                                transition:
                                    "transform 0.2s ease, box-shadow 0.2s ease",

                                "&:hover": {

                                    transform:
                                        "translateY(-3px)",

                                    boxShadow: 4

                                }

                            }}

                        >

                            <CardContent>

                                <Box

                                    sx={{

                                        display: "flex",

                                        alignItems: "center",

                                        justifyContent:
                                            "space-between",

                                        mb: 1

                                    }}

                                >

                                    <Typography

                                        variant="subtitle2"

                                        color="text.secondary"

                                    >

                                        {card.title}

                                    </Typography>


                                    <Box

                                        sx={{

                                            display: "flex",

                                            alignItems:
                                                "center",

                                            color:
                                                `${card.color}.main`

                                        }}

                                    >

                                        {card.icon}

                                    </Box>

                                </Box>


                                <Typography

                                    variant={
                                        card.valueVariant
                                    }

                                    color={
                                        `${card.color}.main`
                                    }

                                    fontWeight="bold"

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


export default PurchaseOrderStatistics;
