import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    Inventory,
    MoveToInbox,
    Block,
    CurrencyRupee
} from "@mui/icons-material";


/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "0";
    }

    return amount.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
};


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
   GOODS RECEIPT NOTE ITEM STATISTICS
========================================================= */

const GoodsReceiptNoteItemStatistics = ({
    statistics = {}
}) => {

    /* =========================================================
       STATISTICS VALUES
    ========================================================= */

    const totalItems = Number(
        statistics.totalItems ?? 0
    );

    const totalReceived = Number(
        statistics.totalReceived ?? 0
    );

    const totalRejected = Number(
        statistics.totalRejected ?? 0
    );

    const totalAmount = Number(
        statistics.totalAmount ?? 0
    );


    /* =========================================================
       STATISTICS CARDS
    ========================================================= */

    const cards = [

        {
            title: "Total Items",
            value: formatNumber(totalItems),
            icon: <Inventory />
        },

        {
            title: "Received Quantity",
            value: formatNumber(totalReceived),
            icon: <MoveToInbox />
        },

        {
            title: "Rejected Quantity",
            value: formatNumber(totalRejected),
            icon: <Block />
        },

        {
            title: "Total Amount",
            value: formatCurrency(totalAmount),
            icon: <CurrencyRupee />
        }

    ];


    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <Grid
            container
            spacing={2}
            mb={3}
        >

            {cards.map((card, index) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={index}
                >

                    <Card
                        className="goods-receipt-note-item-stat-card"
                        sx={{
                            height: "100%",
                            borderRadius: 3
                        }}
                    >

                        <CardContent>

                            {/* =================================================
                                CARD HEADER
                            ================================================= */}

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >

                                {React.cloneElement(
                                    card.icon,
                                    {
                                        fontSize: "small",
                                        color: "action"
                                    }
                                )}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {card.title}
                                </Typography>

                            </Box>


                            {/* =================================================
                                CARD VALUE
                            ================================================= */}

                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                mt={1}
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


export default GoodsReceiptNoteItemStatistics;
