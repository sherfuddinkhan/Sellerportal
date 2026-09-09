// =========================================================
// ProductAttributeStatistics.jsx
// Product Attribute Statistics Cards
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
// PRODUCT ATTRIBUTE STATISTICS
// =========================================================

const ProductAttributeStatistics = () => {

    // =====================================================
    // STATE
    // =====================================================

    const [statistics, setStatistics] = useState({

        totalAttributes: 0,

        activeAttributes: 0,

        inactiveAttributes: 0,

        distinctProducts: 0,

        distinctAttributeNames: 0,

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
                            `${SERVER_URL}/api/product-attributes/stats`
                        );


                    // =====================================
                    // CHECK RESPONSE
                    // =====================================

                    if (!response.ok) {

                        throw new Error(
                            `Failed to load product attribute statistics. Status: ${response.status}`
                        );

                    }


                    // =====================================
                    // PARSE JSON
                    // =====================================

                    const data =
                        await response.json();


                    console.log(
                        "Product Attribute Statistics:",
                        data
                    );


                    // =====================================
                    // SET STATISTICS
                    // Supports camelCase and PascalCase
                    // =====================================

                    setStatistics({

                        totalAttributes:
                            Number(
                                data?.totalAttributes ??
                                data?.TotalAttributes ??
                                0
                            ),


                        activeAttributes:
                            Number(
                                data?.activeAttributes ??
                                data?.ActiveAttributes ??
                                0
                            ),


                        inactiveAttributes:
                            Number(
                                data?.inactiveAttributes ??
                                data?.InactiveAttributes ??
                                0
                            ),


                        distinctProducts:
                            Number(
                                data?.distinctProducts ??
                                data?.DistinctProducts ??
                                0
                            ),


                        distinctAttributeNames:
                            Number(
                                data?.distinctAttributeNames ??
                                data?.DistinctAttributeNames ??
                                0
                            ),

                    });

                }
                catch (err) {

                    // =====================================
                    // ERROR LOG
                    // =====================================

                    console.error(
                        "Product Attribute Statistics Error:",
                        err
                    );


                    // =====================================
                    // ERROR MESSAGE
                    // =====================================

                    setError(
                        err.message ||
                        "Failed to load product attribute statistics."
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
                "Total Attributes",

            value:
                statistics.totalAttributes,
        },


        {
            title:
                "Active",

            value:
                statistics.activeAttributes,
        },


        {
            title:
                "Inactive",

            value:
                statistics.inactiveAttributes,
        },


        {
            title:
                "Distinct Products",

            value:
                statistics.distinctProducts,
        },


        {
            title:
                "Distinct Attribute Names",

            value:
                statistics.distinctAttributeNames,
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
                        lg={2.4}
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
                                    CARD TITLE
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
                                    CARD VALUE
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

export default ProductAttributeStatistics;