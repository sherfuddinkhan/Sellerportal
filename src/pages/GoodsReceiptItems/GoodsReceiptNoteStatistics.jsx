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
    CurrencyRupee,
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
   GOODS RECEIPT NOTE STATISTICS
========================================================= */

const GoodsReceiptNoteStatistics = ({
    statistics = {}
}) => {

    const totalGRN = Number(statistics.totalGRN) || 0;
    const totalAmount = Number(statistics.totalAmount) || 0;
    const completed = Number(statistics.completed) || 0;
    const pending = Number(statistics.pending) || 0;


    const cards = [
        {
            title: "Total GRN",
            value: totalGRN,
            icon: <ReceiptLong />
        },
        {
            title: "Total Amount",
            value: formatCurrency(totalAmount),
            icon: <CurrencyRupee />
        },
        {
            title: "Completed",
            value: completed,
            icon: <CheckCircle />
        },
        {
            title: "Pending",
            value: pending,
            icon: <PendingActions />
        }
    ];


    return (
        <Grid
            container
            spacing={2}
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
                        className="goods-receipt-note-stat-card"
                        sx={{
                            height: "100%",
                            borderRadius: 3
                        }}
                    >

                        <CardContent>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    color: "text.secondary"
                                }}
                            >

                                {card.icon}

                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                >
                                    {card.title}
                                </Typography>

                            </Box>


                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{
                                    mt: 1
                                }}
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


export default GoodsReceiptNoteStatistics;
