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
    TrendingUp,
    AccountBalanceWallet
} from "@mui/icons-material";

const StockLedgerStatistics = ({
    statistics = {}
}) => {

    const cards = [
        {
            title: "Total Transactions",

            value:
                statistics.totalTransactions ?? 0,

            icon:
                <Inventory fontSize="large" />
        },

        {
            title: "Total Quantity",

            value:
                Number(
                    statistics.totalQuantity ?? 0
                ).toFixed(2),

            icon:
                <TrendingUp fontSize="large" />
        },

        {
            title: "Current Balance Quantity",

            value:
                Number(
                    statistics.totalBalance ?? 0
                ).toFixed(2),

            icon:
                <AccountBalanceWallet fontSize="large" />
        }
    ];


    return (
        <Grid
            container
            spacing={3}
            className="stock-ledger-statistics"
            sx={{
                mb: 3
            }}
        >

            {cards.map((card, index) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={index}
                >

                    <Card
                        className="stock-ledger-stat-card"
                        elevation={3}
                    >

                        <CardContent>

                            <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                gutterBottom
                            >
                                {card.title}
                            </Typography>


                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >

                                {card.icon}

                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                >
                                    {card.value}
                                </Typography>

                            </Box>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>
    );
};

export default StockLedgerStatistics;
