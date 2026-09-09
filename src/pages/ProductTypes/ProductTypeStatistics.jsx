// =========================================================
// ProductTypeStatistics.jsx
// Product Type Statistics Cards
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Card,
    CardContent,
    Grid,
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
// PRODUCT TYPE STATISTICS
// =========================================================

const ProductTypeStatistics = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [statistics, setStatistics] = useState({
        totalProductTypes: 0,
        activeProductTypes: 0,
        inactiveProductTypes: 0,
    });


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD STATISTICS
    // =====================================================

    useEffect(() => {

        const fetchStatistics =
            async () => {

                try {

                    setLoading(true);

                    setError("");


                    // =====================================
                    // API REQUEST
                    // =====================================

                    const response =
                        await fetch(
                            `${SERVER_URL}/api/product-types/stats`
                        );


                    // =====================================
                    // CHECK RESPONSE
                    // =====================================

                    if (!response.ok) {

                        throw new Error(
                            `Failed to load product type statistics. Status: ${response.status}`
                        );

                    }


                    // =====================================
                    // PARSE RESPONSE
                    // =====================================

                    const data =
                        await response.json();


                    console.log(
                        "Product Type Statistics:",
                        data
                    );


                    // =====================================
                    // HANDLE API RESPONSE
                    // =====================================

                    setStatistics({

                        totalProductTypes:
                            Number(
                                data?.totalProductTypes ??
                                data?.TotalProductTypes ??
                                0
                            ),

                        activeProductTypes:
                            Number(
                                data?.activeProductTypes ??
                                data?.ActiveProductTypes ??
                                0
                            ),

                        inactiveProductTypes:
                            Number(
                                data?.inactiveProductTypes ??
                                data?.InactiveProductTypes ??
                                0
                            ),

                    });

                }
                catch (err) {

                    console.error(
                        "Product Type Statistics Error:",
                        err
                    );


                    setError(
                        err.message ||
                        "Failed to load product type statistics."
                    );

                }
                finally {

                    setLoading(false);

                }

            };


        fetchStatistics();

    }, []);


    // =====================================================
    // STATISTICS CARDS
    // =====================================================

    const cards = [

        {
            title:
                "Total Product Types",

            value:
                statistics.totalProductTypes,
        },

        {
            title:
                "Active",

            value:
                statistics.activeProductTypes,
        },

        {
            title:
                "Inactive",

            value:
                statistics.inactiveProductTypes,
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
                    mb: 2,
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
                        key={index}
                    >

                        <Card
                            elevation={2}
                            sx={{
                                height: "100%",
                            }}
                        >

                            <CardContent>

                                {/* =================================
                                    TITLE
                                ================================= */}

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: 1,
                                    }}
                                >

                                    {card.title}

                                </Typography>


                                {/* =================================
                                    VALUE
                                ================================= */}

                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                >

                                    {card.value}

                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                )
            )}

        </Grid>

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeStatistics;