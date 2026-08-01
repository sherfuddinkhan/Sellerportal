import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Button
} from "@mui/material";

import {
    Inventory2,
    Category,
    LocalOffer,
    ShoppingCart,
    ReceiptLong,
    Warehouse,
    People,
    Assessment
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const QuickActions = () => {

    const navigate = useNavigate();

    const actions = [

        {
            title: "Products",
            icon: <Inventory2 fontSize="large" />,
            color: "primary",
            path: "/products"
        },

        {
            title: "Categories",
            icon: <Category fontSize="large" />,
            color: "success",
            path: "/categories"
        },

        {
            title: "Brands",
            icon: <LocalOffer fontSize="large" />,
            color: "warning",
            path: "/brands"
        },

        {
            title: "Orders",
            icon: <ShoppingCart fontSize="large" />,
            color: "secondary",
            path: "/orders"
        },

        {
            title: "Purchase Orders",
            icon: <ReceiptLong fontSize="large" />,
            color: "info",
            path: "/purchase-orders"
        },

        {
            title: "Inventory",
            icon: <Warehouse fontSize="large" />,
            color: "error",
            path: "/inventory"
        },

        {
            title: "Customers",
            icon: <People fontSize="large" />,
            color: "primary",
            path: "/customers"
        },

        {
            title: "Reports",
            icon: <Assessment fontSize="large" />,
            color: "success",
            path: "/reports"
        }

    ];

    return (

        <Card>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Quick Actions
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    {

                        actions.map((item, index) => (

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                key={index}
                            >

                                <Button

                                    fullWidth

                                    variant="contained"

                                    color={item.color}

                                    startIcon={item.icon}

                                    sx={{
                                        height: 80,
                                        justifyContent: "flex-start",
                                        pl: 3
                                    }}

                                    onClick={() =>
                                        navigate(item.path)
                                    }

                                >

                                    {item.title}

                                </Button>

                            </Grid>

                        ))

                    }

                </Grid>

            </CardContent>

        </Card>

    );

};

export default QuickActions;