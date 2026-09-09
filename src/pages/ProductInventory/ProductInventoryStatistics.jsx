// =========================================================
// ProductInventoryStatistics.jsx
// Product Inventory Statistics
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Box,
    Alert,
} from "@mui/material";


// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL =
    "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const ProductInventoryStatistics = () => {

    // =====================================================
    // STATISTICS STATE
    // =====================================================

    const [statistics, setStatistics] = useState({

        totalInventoryRecords: 0,

        totalQuantity: 0,

        totalReservedQuantity: 0,

        totalDamagedQuantity: 0,

        availableQuantity: 0,

        lowStockItems: 0,

        outOfStockItems: 0,

        inStockItems: 0,

        damagedItems: 0,

        reservedItems: 0,

    });


    // =====================================================
    // LOADING STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // ERROR STATE
    // =====================================================

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD INVENTORY STATISTICS
    // =====================================================

    useEffect(() => {

        const fetchStatistics =
            async () => {

                try {

                    // =====================================
                    // START LOADING
                    // =====================================

                    setLoading(true);

                    setError("");


                    // =====================================
                    // API REQUEST
                    // =====================================

                    const response =
                        await fetch(
                            `${SERVER_URL}/api/product-inventories/stats`
                        );


                    // =====================================
                    // CHECK RESPONSE
                    // =====================================

                    if (!response.ok) {

                        throw new Error(
                            `Failed to load product inventory statistics. Status: ${response.status}`
                        );

                    }


                    // =====================================
                    // PARSE RESPONSE
                    // =====================================

                    const data =
                        await response.json();


                    console.log(
                        "Product Inventory Statistics:",
                        data
                    );


                    // =====================================
                    // SET STATISTICS
                    //
                    // Supports both:
                    // camelCase
                    // PascalCase
                    // =====================================

                    setStatistics({

                        // ---------------------------------
                        // TOTAL INVENTORY RECORDS
                        // ---------------------------------

                        totalInventoryRecords:
                            Number(
                                data?.totalInventoryRecords ??
                                data?.TotalInventoryRecords ??
                                0
                            ),


                        // ---------------------------------
                        // TOTAL QUANTITY
                        // ---------------------------------

                        totalQuantity:
                            Number(
                                data?.totalQuantity ??
                                data?.TotalQuantity ??
                                0
                            ),


                        // ---------------------------------
                        // TOTAL RESERVED QUANTITY
                        // ---------------------------------

                        totalReservedQuantity:
                            Number(
                                data?.totalReservedQuantity ??
                                data?.TotalReservedQuantity ??
                                0
                            ),


                        // ---------------------------------
                        // TOTAL DAMAGED QUANTITY
                        // ---------------------------------

                        totalDamagedQuantity:
                            Number(
                                data?.totalDamagedQuantity ??
                                data?.TotalDamagedQuantity ??
                                0
                            ),


                        // ---------------------------------
                        // AVAILABLE QUANTITY
                        // ---------------------------------

                        availableQuantity:
                            Number(
                                data?.availableQuantity ??
                                data?.AvailableQuantity ??
                                0
                            ),


                        // ---------------------------------
                        // LOW STOCK ITEMS
                        // ---------------------------------

                        lowStockItems:
                            Number(
                                data?.lowStockItems ??
                                data?.LowStockItems ??
                                0
                            ),


                        // ---------------------------------
                        // OUT OF STOCK ITEMS
                        // ---------------------------------

                        outOfStockItems:
                            Number(
                                data?.outOfStockItems ??
                                data?.OutOfStockItems ??
                                0
                            ),


                        // ---------------------------------
                        // IN STOCK ITEMS
                        // ---------------------------------

                        inStockItems:
                            Number(
                                data?.inStockItems ??
                                data?.InStockItems ??
                                0
                            ),


                        // ---------------------------------
                        // DAMAGED ITEMS
                        // ---------------------------------

                        damagedItems:
                            Number(
                                data?.damagedItems ??
                                data?.DamagedItems ??
                                0
                            ),


                        // ---------------------------------
                        // RESERVED ITEMS
                        // ---------------------------------

                        reservedItems:
                            Number(
                                data?.reservedItems ??
                                data?.ReservedItems ??
                                0
                            ),

                    });

                }
                catch (err) {

                    // =====================================
                    // ERROR LOG
                    // =====================================

                    console.error(
                        "Product Inventory Statistics Error:",
                        err
                    );


                    // =====================================
                    // ERROR MESSAGE
                    // =====================================

                    setError(
                        err.message ||
                        "Failed to load product inventory statistics."
                    );

                }
                finally {

                    // =====================================
                    // STOP LOADING
                    // =====================================

                    setLoading(false);

                }

            };


        // =================================================
        // CALL API
        // =================================================

        fetchStatistics();

    }, []);


    // =====================================================
    // STATISTICS CARDS
    // =====================================================

    const cards = [

        {
            title:
                "Total Inventory Records",

            value:
                statistics.totalInventoryRecords,
        },


        {
            title:
                "Total Quantity",

            value:
                statistics.totalQuantity,
        },


        {
            title:
                "Reserved Quantity",

            value:
                statistics.totalReservedQuantity,
        },


        {
            title:
                "Damaged Quantity",

            value:
                statistics.totalDamagedQuantity,
        },


        {
            title:
                "Available Quantity",

            value:
                statistics.availableQuantity,
        },


        {
            title:
                "Low Stock Items",

            value:
                statistics.lowStockItems,
        },


        {
            title:
                "Out of Stock",

            value:
                statistics.outOfStockItems,
        },


        {
            title:
                "In Stock",

            value:
                statistics.inStockItems,
        },


        {
            title:
                "Damaged Items",

            value:
                statistics.damagedItems,
        },


        {
            title:
                "Reserved Items",

            value:
                statistics.reservedItems,
        },

    ];


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    py: 4,
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <Alert
                severity="error"
                sx={{
                    mb: 3,
                }}
            >

                {error}

            </Alert>

        );

    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Grid
            container
            spacing={2}
            sx={{
                mb: 3,
            }}
        >

            {cards.map(
                (
                    card,
                    index
                ) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={2.4}
                        key={index}
                    >

                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                                textAlign: "center",
                                borderRadius: 2,
                                height: "100%",
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
                                    mt: 1,
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