import React, {
    useEffect,
    useState
} from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    Stack,
    Typography
} from "@mui/material";

import axios from "axios";


// =========================================================
// SERVER
// =========================================================

const SERVER_URL =
    "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const CategoryCard = ({
    category: categoryProp
}) => {

    const [
        categories,
        setCategories
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");


    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    const loadCategories = async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "GET CATEGORY CARDS"
            );

            const response =
                await axios.get(
                    `${SERVER_URL}/api/categories`,
                    {
                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CATEGORY CARD RESPONSE:",
                response.data
            );


            // =================================================
            // NORMALIZE RESPONSE
            // =================================================

            let data =
                response.data;


            if (
                data &&
                Array.isArray(
                    data.items
                )
            ) {

                data =
                    data.items;

            }
            else if (
                data &&
                Array.isArray(
                    data.data
                )
            ) {

                data =
                    data.data;

            }
            else if (
                data &&
                Array.isArray(
                    data.categories
                )
            ) {

                data =
                    data.categories;

            }


            if (
                !Array.isArray(data)
            ) {

                data = [];

            }


            setCategories(data);

        }
        catch (err) {

            console.error(
                "CATEGORY CARD ERROR:",
                err
            );

            const message =
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Failed to fetch categories";

            setError(
                typeof message === "string"
                    ? message
                    : "Failed to fetch categories"
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD ONLY WHEN USED AS A PAGE
    // =====================================================

    useEffect(() => {

        if (!categoryProp) {

            loadCategories();

        }

    }, [categoryProp]);


    // =====================================================
    // SINGLE CATEGORY MODE
    // =====================================================

    if (categoryProp) {

        return (

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        {
                            categoryProp.categoryName
                        }
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 1
                        }}
                    >
                        {
                            categoryProp.description ||
                            "-"
                        }
                    </Typography>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                            mt: 2
                        }}
                    >

                        <Chip
                            label={
                                categoryProp.isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                categoryProp.isActive
                                    ? "success"
                                    : "error"
                            }
                        />

                        <Typography
                            variant="caption"
                        >
                            {
                                categoryProp.parentCategoryName ||
                                "Root"
                            }
                        </Typography>

                    </Stack>

                </CardContent>

            </Card>

        );

    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5
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

            <Alert severity="error">

                {error}

            </Alert>

        );

    }


    // =====================================================
    // CATEGORY CARD PAGE
    // =====================================================

    return (

        <Box sx={{ p: 2 }}>

            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                    mb: 3
                }}
            >
                Categories
            </Typography>

            <Grid
                container
                spacing={3}
            >

                {
                    categories.map(
                        (category) => (

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={
                                    category.categoryId ||
                                    category.id
                                }
                            >

                                <Card>

                                    <CardContent>

                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            {
                                                category.categoryName
                                            }
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                            sx={{
                                                mt: 1
                                            }}
                                        >
                                            {
                                                category.description ||
                                                "-"
                                            }
                                        </Typography>

                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            sx={{
                                                mt: 2
                                            }}
                                        >

                                            <Chip
                                                label={
                                                    category.isActive
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                                color={
                                                    category.isActive
                                                        ? "success"
                                                        : "error"
                                                }
                                                size="small"
                                            />

                                            <Typography
                                                variant="caption"
                                            >
                                                {
                                                    category.parentCategoryName ||
                                                    "Root"
                                                }
                                            </Typography>

                                        </Stack>

                                    </CardContent>

                                </Card>

                            </Grid>

                        )
                    )

                }

            </Grid>

        </Box>

    );

};


export default CategoryCard;