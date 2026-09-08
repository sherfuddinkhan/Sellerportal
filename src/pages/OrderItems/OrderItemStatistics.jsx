import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";

import {
    ShoppingCart,
    Inventory,
    CurrencyRupee,
    LocalShipping,
    PendingActions
} from "@mui/icons-material";


// =========================================================
// Statistic Card
// =========================================================

const StatisticCard = ({
    title,
    value,
    icon
}) => {
    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 3
            }}
        >
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            mt={1}
                        >
                            {value}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            fontSize: 40,
                            opacity: 0.8,
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};


// =========================================================
// Order Item Statistics
// =========================================================

const OrderItemStatistics = ({
    statistics = {}
}) => {

    const totalItems =
        statistics.totalItems ??
        statistics.TotalItems ??
        0;

    const totalQuantity =
        statistics.totalQuantity ??
        statistics.TotalQuantity ??
        0;

    const totalAmount =
        statistics.totalAmount ??
        statistics.TotalAmount ??
        0;

    const deliveredItems =
        statistics.deliveredItems ??
        statistics.DeliveredItems ??
        0;

    const pendingItems =
        statistics.pendingItems ??
        statistics.PendingItems ??
        0;


    const cards = [
        {
            title: "Total Order Items",
            value: totalItems,
            icon: (
                <ShoppingCart
                    color="primary"
                    fontSize="large"
                />
            )
        },

        {
            title: "Total Quantity",
            value: totalQuantity,
            icon: (
                <Inventory
                    color="success"
                    fontSize="large"
                />
            )
        },

        {
            title: "Total Amount",
            value: `₹ ${Number(totalAmount).toLocaleString("en-IN")}`,
            icon: (
                <CurrencyRupee
                    color="warning"
                    fontSize="large"
                />
            )
        },

        {
            title: "Delivered Items",
            value: deliveredItems,
            icon: (
                <LocalShipping
                    color="info"
                    fontSize="large"
                />
            )
        },

        {
            title: "Pending Items",
            value: pendingItems,
            icon: (
                <PendingActions
                    color="error"
                    fontSize="large"
                />
            )
        }
    ];


    return (
        <Grid
            container
            spacing={3}
            mb={3}
        >
            {cards.map((item, index) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={2.4}
                    key={index}
                >
                    <StatisticCard
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default OrderItemStatistics;
