// =========================================================
// ProductInventoryStatistics.jsx
// Product Inventory Statistics
// Frontend Only
// =========================================================

import React, {
    useMemo
} from "react";

import {
    Grid,
    Paper,
    Typography
} from "@mui/material";


// =========================================================
// COMPONENT
// =========================================================

const ProductInventoryStatistics = ({
    inventories = []
}) => {


    // =====================================================
    // STATISTICS
    // =====================================================

    const statistics = useMemo(() => {

        // -------------------------------------------------
        // TOTAL INVENTORY RECORDS
        // -------------------------------------------------

        const totalInventory =
            inventories.length;


        // -------------------------------------------------
        // ACTIVE INVENTORY
        // -------------------------------------------------

        const activeInventory =
            inventories.filter((item) => {

                const isActive =
                    item.isActive ??
                    item.IsActive ??
                    false;

                return isActive === true;

            }).length;


        // -------------------------------------------------
        // INACTIVE INVENTORY
        // -------------------------------------------------

        const inactiveInventory =
            totalInventory -
            activeInventory;


        // -------------------------------------------------
        // TOTAL QUANTITY
        // -------------------------------------------------

        const totalQuantity =
            inventories.reduce(
                (sum, item) => {

                    const quantity =
                        item.quantity ??
                        item.Quantity ??
                        0;

                    return (
                        sum +
                        Number(quantity)
                    );

                },
                0
            );


        // -------------------------------------------------
        // AVAILABLE QUANTITY
        // -------------------------------------------------

        const availableQuantity =
            inventories.reduce(
                (sum, item) => {

                    const quantity =
                        item.availableQuantity ??
                        item.AvailableQuantity ??
                        0;

                    return (
                        sum +
                        Number(quantity)
                    );

                },
                0
            );


        // -------------------------------------------------
        // RESERVED QUANTITY
        // -------------------------------------------------

        const reservedQuantity =
            inventories.reduce(
                (sum, item) => {

                    const quantity =
                        item.reservedQuantity ??
                        item.ReservedQuantity ??
                        0;

                    return (
                        sum +
                        Number(quantity)
                    );

                },
                0
            );


        // -------------------------------------------------
        // LOW STOCK
        // -------------------------------------------------
        //
        // Available Quantity <= Reorder Level
        //
        // -------------------------------------------------

        const lowStockCount =
            inventories.filter((item) => {

                const available =
                    Number(
                        item.availableQuantity ??
                        item.AvailableQuantity ??
                        0
                    );

                const reorderLevel =
                    Number(
                        item.reorderLevel ??
                        item.ReorderLevel ??
                        0
                    );


                return (
                    available <=
                    reorderLevel
                );

            }).length;


        return {

            totalInventory,

            activeInventory,

            inactiveInventory,

            totalQuantity,

            availableQuantity,

            reservedQuantity,

            lowStockCount

        };

    }, [inventories]);


    // =====================================================
    // STATISTICS CARDS
    // =====================================================

    const cards = [

        {
            title: "Total Inventory",
            value:
                statistics.totalInventory
        },

        {
            title: "Active",
            value:
                statistics.activeInventory
        },

        {
            title: "Inactive",
            value:
                statistics.inactiveInventory
        },

        {
            title: "Total Quantity",
            value:
                statistics.totalQuantity
        },

        {
            title: "Available",
            value:
                statistics.availableQuantity
        },

        {
            title: "Reserved",
            value:
                statistics.reservedQuantity
        },

        {
            title: "Low Stock",
            value:
                statistics.lowStockCount
        }

    ];


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Grid
            container
            spacing={2}
            sx={{
                mb: 3
            }}
        >

            {cards.map(
                (card) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={2}
                        key={card.title}
                    >

                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                textAlign: "center",
                                borderRadius: 2,
                                height: "100%"
                            }}
                        >

                            {/* =================================
                                TITLE
                            ================================= */}

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {card.title}
                            </Typography>


                            {/* =================================
                                VALUE
                            ================================= */}

                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{
                                    mt: 1
                                }}
                            >
                                {card.value}
                            </Typography>

                        </Paper>

                    </Grid>

                )
            )}

        </Grid>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductInventoryStatistics;
