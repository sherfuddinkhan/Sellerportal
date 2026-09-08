import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";

import {
    ShoppingCart,
    CurrencyRupee,
    PendingActions,
    LocalShipping
} from "@mui/icons-material";


const OrderStatistics = ({

    orders = []

}) => {


    // =========================================================
    // TOTAL ORDERS
    // =========================================================

    const totalOrders =
        orders.length;


    // =========================================================
    // TOTAL AMOUNT
    // =========================================================

    const totalAmount = orders.reduce(

        (sum, item) => {

            const amount =
                item.TotalAmount ??
                item.totalAmount ??
                0;

            return sum + Number(amount);

        },

        0

    );


    // =========================================================
    // PENDING ORDERS
    // =========================================================

    const pendingOrders = orders.filter(

        item => {

            const status =
                item.OrderStatus ??
                item.orderStatus ??
                "";

            return (

                status
                    .toString()
                    .toLowerCase() === "pending"

            );

        }

    ).length;


    // =========================================================
    // SHIPPED ORDERS
    // =========================================================

    const shippedOrders = orders.filter(

        item => {

            const status =
                item.OrderStatus ??
                item.orderStatus ??
                "";

            return (

                status
                    .toString()
                    .toLowerCase() === "shipped"

            );

        }

    ).length;


    // =========================================================
    // STATISTICS
    // =========================================================

    const statistics = [

        {
            title: "Total Orders",

            value: totalOrders,

            icon: (
                <ShoppingCart
                    fontSize="large"
                />
            )
        },


        {
            title: "Total Amount",

            value:
                `₹ ${totalAmount.toFixed(2)}`,

            icon: (
                <CurrencyRupee
                    fontSize="large"
                />
            )
        },


        {
            title: "Pending Orders",

            value: pendingOrders,

            icon: (
                <PendingActions
                    fontSize="large"
                />
            )
        },


        {
            title: "Shipped Orders",

            value: shippedOrders,

            icon: (
                <LocalShipping
                    fontSize="large"
                />
            )
        }

    ];


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Grid

            container

            spacing={3}

            sx={{
                mb: 3
            }}

        >

            {

                statistics.map(

                    (item, index) => (

                        <Grid

                            item

                            xs={12}

                            sm={6}

                            md={3}

                            key={index}

                        >

                            <Card

                                elevation={3}

                                sx={{

                                    borderRadius: 2,

                                    height: "100%",

                                    transition:
                                        "0.3s",

                                    "&:hover": {

                                        transform:
                                            "translateY(-4px)",

                                        boxShadow: 6

                                    }

                                }}

                            >

                                <CardContent>

                                    <Stack

                                        direction="row"

                                        justifyContent="space-between"

                                        alignItems="center"

                                    >

                                        {/* =================================
                                            STATISTIC VALUE
                                        ================================= */}

                                        <div>

                                            <Typography

                                                variant="subtitle2"

                                                color="text.secondary"

                                            >

                                                {
                                                    item.title
                                                }

                                            </Typography>


                                            <Typography

                                                variant="h5"

                                                fontWeight="bold"

                                            >

                                                {
                                                    item.value
                                                }

                                            </Typography>

                                        </div>


                                        {/* =================================
                                            ICON
                                        ================================= */}

                                        <Stack

                                            color="primary.main"

                                        >

                                            {
                                                item.icon
                                            }

                                        </Stack>

                                    </Stack>

                                </CardContent>

                            </Card>

                        </Grid>

                    )

                )

            }

        </Grid>

    );

};


export default OrderStatistics;
