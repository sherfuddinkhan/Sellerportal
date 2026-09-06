
import React, { useMemo } from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";

import {
    History,
    ListAlt,
    Update,
    TrendingUp
} from "@mui/icons-material";


/* =========================================================
   ORDER STATUS HISTORY STATISTICS
========================================================= */

const OrderStatusHistoryStatistics = ({
    history = []
}) => {

    /* =====================================================
       TOTAL RECORDS
    ===================================================== */

    const totalRecords = history.length;


    /* =====================================================
       CALCULATE STATISTICS
    ===================================================== */

    const {
        uniqueStatuses,
        latestDate,
        trackedOrders
    } = useMemo(() => {

        /* =================================================
           UNIQUE STATUS TYPES
        ================================================= */

        const statuses = new Set();

        history.forEach((item) => {

            const status =
                item.status ??
                item.Status ??
                "";

            if (status) {

                statuses.add(
                    String(status).trim()
                );

            }

        });


        /* =================================================
           UNIQUE ORDERS
        ================================================= */

        const orders = new Set();

        history.forEach((item) => {

            const orderId =
                item.orderId ??
                item.OrderId;

            if (
                orderId !== null &&
                orderId !== undefined &&
                orderId !== ""
            ) {

                orders.add(
                    String(orderId)
                );

            }

        });


        /* =================================================
           LATEST CHANGE
        ================================================= */

        let latestChange = null;

        history.forEach((item) => {

            const changedOn =
                item.changedOn ??
                item.ChangedOn;

            if (!changedOn) {
                return;
            }

            const date =
                new Date(changedOn);

            if (Number.isNaN(date.getTime())) {
                return;
            }

            if (
                !latestChange ||
                date >
                    latestChange.date
            ) {

                latestChange = {
                    item,
                    date
                };

            }

        });


        /* =================================================
           FORMAT LATEST DATE
        ================================================= */

        const formattedLatestDate =
            latestChange
                ? latestChange.date.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                )
                : "-";


        return {
            uniqueStatuses: statuses.size,
            latestDate: formattedLatestDate,
            trackedOrders: orders.size
        };

    }, [history]);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = [

        {
            title: "Total History Records",
            value: totalRecords,
            icon: (
                <History fontSize="large" />
            )
        },

        {
            title: "Status Types",
            value: uniqueStatuses,
            icon: (
                <ListAlt fontSize="large" />
            )
        },

        {
            title: "Latest Change",
            value: latestDate,
            icon: (
                <Update fontSize="large" />
            )
        },

        {
            title: "Orders Tracked",
            value: trackedOrders,
            icon: (
                <TrendingUp fontSize="large" />
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
            sx={{
                mb: 3
            }}
        >

            {statistics.map(
                (stat, index) => (

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
                                height: "100%",
                                borderRadius: 2,

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
                                        STAT VALUE
                                    ================================= */}

                                    <Box
                                        sx={{
                                            minWidth: 0
                                        }}
                                    >

                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 0.5
                                            }}
                                        >
                                            {stat.title}
                                        </Typography>

                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            noWrap={
                                                stat.title ===
                                                "Latest Change"
                                            }
                                        >
                                            {stat.value}
                                        </Typography>

                                    </Box>


                                    {/* =================================
                                        STAT ICON
                                    ================================= */}

                                    <Stack
                                        color="primary.main"
                                        sx={{
                                            flexShrink: 0,
                                            ml: 2
                                        }}
                                    >
                                        {stat.icon}
                                    </Stack>

                                </Stack>

                            </CardContent>

                        </Card>

                    </Grid>

                )
            )}

        </Grid>
    );
};


export default OrderStatusHistoryStatistics;
