import React, {
    useEffect,
    useState
} from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    CircularProgress,
    Alert,
    Box
} from "@mui/material";

import {
    Category,
    CheckCircle,
    Cancel,
    Inventory
} from "@mui/icons-material";

import axios from "axios";


// =========================================================
// SERVER
// =========================================================

const SERVER_URL =
    "http://localhost:5000";


// =========================================================
// STATISTIC CARD
// =========================================================

const StatisticCard = ({
    title,
    value,
    icon,
    color
}) => {

    return (

        <Card
            elevation={3}
            sx={{
                height: "100%"
            }}
        >

            <CardContent>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Box>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{
                                mt: 0.5
                            }}
                        >
                            {value}
                        </Typography>

                    </Box>

                    <Box
                        sx={{
                            color: color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {icon}
                    </Box>

                </Stack>

            </CardContent>

        </Card>

    );

};


// =========================================================
// CATEGORY STATISTICS
// =========================================================

const CategoryStatistics = () => {

    const [
        statistics,
        setStatistics
    ] = useState({
        totalCategories: 0,
        activeCategories: 0,
        inactiveCategories: 0,
        categoriesWithProducts: 0,
        categoriesWithoutProducts: 0
    });


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // LOAD CATEGORY STATISTICS
    // =====================================================

    const loadStatistics = async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "GET CATEGORY STATISTICS"
            );

            console.log(
                "URL:",
                `${SERVER_URL}/api/categories/stats`
            );


            const response =
                await axios.get(
                    `${SERVER_URL}/api/categories/stats`,
                    {
                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );


            console.log(
                "CATEGORY STATISTICS RESPONSE:",
                response.data
            );


            const data =
                response.data || {};


            setStatistics({

                totalCategories:
                    data.totalCategories ?? 0,

                activeCategories:
                    data.activeCategories ?? 0,

                inactiveCategories:
                    data.inactiveCategories ?? 0,

                categoriesWithProducts:
                    data.categoriesWithProducts ?? 0,

                categoriesWithoutProducts:
                    data.categoriesWithoutProducts ?? 0

            });

        }
        catch (err) {

            console.error(
                "CATEGORY STATISTICS ERROR:",
                err
            );


            const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to fetch category statistics";


            setError(
                typeof message === "string"
                    ? message
                    : "Failed to fetch category statistics"
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD ON COMPONENT MOUNT
    // =====================================================

    useEffect(() => {

        loadStatistics();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 100
                }}
            >

                <CircularProgress
                    size={30}
                />

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
                    mb: 2
                }}
            >
                {error}
            </Alert>

        );

    }


    // =====================================================
    // STATISTICS
    // =====================================================

    return (

        <Grid
            container
            spacing={2}
        >

            {/* =================================================
                TOTAL CATEGORIES
            ================================================= */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatisticCard
                    title="Total Categories"
                    value={
                        statistics.totalCategories
                    }
                    icon={
                        <Category
                            fontSize="large"
                        />
                    }
                    color="#1976d2"
                />

            </Grid>


            {/* =================================================
                ACTIVE CATEGORIES
            ================================================= */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatisticCard
                    title="Active"
                    value={
                        statistics.activeCategories
                    }
                    icon={
                        <CheckCircle
                            fontSize="large"
                        />
                    }
                    color="#2e7d32"
                />

            </Grid>


            {/* =================================================
                INACTIVE CATEGORIES
            ================================================= */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatisticCard
                    title="Inactive"
                    value={
                        statistics.inactiveCategories
                    }
                    icon={
                        <Cancel
                            fontSize="large"
                        />
                    }
                    color="#d32f2f"
                />

            </Grid>


            {/* =================================================
                CATEGORIES WITH PRODUCTS
            ================================================= */}

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
            >

                <StatisticCard
                    title="With Products"
                    value={
                        statistics.categoriesWithProducts
                    }
                    icon={
                        <Inventory
                            fontSize="large"
                        />
                    }
                    color="#ed6c02"
                />

            </Grid>

        </Grid>

    );

};


export default CategoryStatistics;