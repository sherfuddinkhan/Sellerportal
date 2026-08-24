// DashboardSummary.jsx

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
    ShoppingCart,
    People,
    CurrencyRupee,
    LocalShipping,
    PendingActions
} from "@mui/icons-material";


const SummaryCard = ({
    title,
    value,
    icon,
    color
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
                            variant="subtitle2"
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
                            backgroundColor: color,
                            borderRadius: "50%",
                            width: 55,
                            height: 55,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff"
                        }}
                    >
                        {icon}

                    </Box>


                </Box>

            </CardContent>
        </Card>
    );
};



const DashboardSummary = ({
    summary = {}
}) => {


    const cards = [

        {
            title: "Total Products",
            value:
                summary.totalProducts || 0,
            icon:
                <Inventory />,
            color:
                "#1976d2"
        },


        {
            title: "Total Orders",
            value:
                summary.totalOrders || 0,
            icon:
                <ShoppingCart />,
            color:
                "#9c27b0"
        },


        {
            title: "Total Customers",
            value:
                summary.totalCustomers || 0,
            icon:
                <People />,
            color:
                "#2e7d32"
        },


        {
            title: "Total Revenue",
            value:
                `₹ ${summary.totalRevenue || 0}`,
            icon:
                <CurrencyRupee />,
            color:
                "#ed6c02"
        },


        {
            title: "Pending Orders",
            value:
                summary.pendingOrders || 0,
            icon:
                <PendingActions />,
            color:
                "#d32f2f"
        },


        {
            title: "Shipments",
            value:
                summary.totalShipments || 0,
            icon:
                <LocalShipping />,
            color:
                "#0288d1"
        }

    ];



    return (

        <Box
            sx={{
                mb:3
            }}
        >

            <Grid
                container
                spacing={3}
            >

                {
                    cards.map(
                        (card,index)=>(

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={2}
                                key={index}
                            >

                                <SummaryCard
                                    {...card}
                                />

                            </Grid>

                        )
                    )
                }

            </Grid>

        </Box>

    );

};


export default DashboardSummary;