import React, { useMemo } from "react";

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

import {
    ShoppingCart,
    PendingActions,
    LocalShipping,
    CheckCircle,
    Cancel,
    CurrencyRupee
} from "@mui/icons-material";

const MarketplaceOrderStatistics = ({
    orders = []
}) => {
    const statistics = useMemo(() => {
        const getValue = (
            order,
            camelCase,
            pascalCase,
            fallback = ""
        ) => {
            return order?.[camelCase] ??
                order?.[pascalCase] ??
                fallback;
        };

        const totalOrders = orders.length;

        let pendingOrders = 0;
        let processingOrders = 0;
        let shippedOrders = 0;
        let deliveredOrders = 0;
        let cancelledOrders = 0;
        let totalAmount = 0;

        orders.forEach((order) => {
            const status = String(
                getValue(
                    order,
                    "orderStatus",
                    "OrderStatus",
                    "Pending"
                )
            ).toLowerCase();

            const amount = Number(
                getValue(
                    order,
                    "totalAmount",
                    "TotalAmount",
                    0
                )
            );

            if (!Number.isNaN(amount)) {
                totalAmount += amount;
            }

            switch (status) {
                case "pending":
                    pendingOrders++;
                    break;

                case "requested":
                    pendingOrders++;
                    break;

                case "processing":
                    processingOrders++;
                    break;

                case "shipped":
                    shippedOrders++;
                    break;

                case "delivered":
                    deliveredOrders++;
                    break;

                case "cancelled":
                case "canceled":
                    cancelledOrders++;
                    break;

                default:
                    break;
            }
        });

        return {
            totalOrders,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders,
            cancelledOrders,
            totalAmount
        };
    }, [orders]);

    const formatAmount = (amount) => {
        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    const cards = [
        {
            title: "Total Orders",
            value: statistics.totalOrders,
            icon: <ShoppingCart />,
            color: "primary"
        },
        {
            title: "Pending",
            value: statistics.pendingOrders,
            icon: <PendingActions />,
            color: "warning"
        },
        {
            title: "Processing",
            value: statistics.processingOrders,
            icon: <PendingActions />,
            color: "info"
        },
        {
            title: "Shipped",
            value: statistics.shippedOrders,
            icon: <LocalShipping />,
            color: "info"
        },
        {
            title: "Delivered",
            value: statistics.deliveredOrders,
            icon: <CheckCircle />,
            color: "success"
        },
        {
            title: "Cancelled",
            value: statistics.cancelledOrders,
            icon: <Cancel />,
            color: "error"
        },
        {
            title: "Order Value",
            value: `₹ ${formatAmount(
                statistics.totalAmount
            )}`,
            icon: <CurrencyRupee />,
            color: "success"
        }
    ];

    return (
        <Grid
            container
            spacing={2}
            sx={{ mb: 3 }}
        >
            {cards.map((card) => (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={card.title === "Order Value" ? 3 : 1.714}
                    key={card.title}
                >
                    <Card
                        elevation={0}
                        sx={{
                            height: "100%",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 2
                            }}
                        >
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    minWidth: 44,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: `${card.color}.light`,
                                    color: `${card.color}.main`
                                }}
                            >
                                {card.icon}
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    noWrap
                                >
                                    {card.title}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    noWrap
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

export default MarketplaceOrderStatistics;

