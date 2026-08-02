import React from "react";

import {
    Grid,
    Paper,
    Typography
} from "@mui/material";


const ProductInventoryStatistics = ({
    inventories = []
}) => {


    const totalInventory =
        inventories.length;


    const activeInventory =
        inventories.filter(
            item => item.IsActive
        ).length;


    const inactiveInventory =
        totalInventory - activeInventory;


    const totalQuantity =
        inventories.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.Quantity || 0
                ),
            0
        );


    const availableQuantity =
        inventories.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.AvailableQuantity || 0
                ),
            0
        );


    const reservedQuantity =
        inventories.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.ReservedQuantity || 0
                ),
            0
        );


    const lowStockCount =
        inventories.filter(
            item =>

                Number(
                    item.AvailableQuantity || 0
                )

                <=

                Number(
                    item.ReorderLevel || 0
                )

        ).length;



    const cards = [

        {
            title: "Total Inventory",
            value: totalInventory
        },

        {
            title: "Active",
            value: activeInventory
        },

        {
            title: "Inactive",
            value: inactiveInventory
        },

        {
            title: "Total Quantity",
            value: totalQuantity
        },

        {
            title: "Available",
            value: availableQuantity
        },

        {
            title: "Reserved",
            value: reservedQuantity
        },

        {
            title: "Low Stock",
            value: lowStockCount
        }

    ];



    return (

        <Grid

            container

            spacing={2}

            sx={{ mb: 3 }}

        >

            {

                cards.map(
                    (card, index) => (

                        <Grid

                            item

                            xs={12}

                            sm={6}

                            md={2}

                            key={index}

                        >

                            <Paper

                                elevation={3}

                                sx={{

                                    p:2,

                                    textAlign:
                                        "center",

                                    borderRadius:2,

                                    height:"100%"

                                }}

                            >

                                <Typography

                                    variant="body2"

                                    color="text.secondary"

                                >

                                    {card.title}

                                </Typography>


                                <Typography

                                    variant="h5"

                                    fontWeight="bold"

                                    sx={{
                                        mt:1
                                    }}

                                >

                                    {card.value}

                                </Typography>


                            </Paper>


                        </Grid>

                    )

                )

            }


        </Grid>

    );

};


export default ProductInventoryStatistics;