// =========================================================
// CategoryProducts.jsx
// Products belonging to a Category
// =========================================================

import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

// =========================================================
// SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const CategoryProducts = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [category, setCategory] =
        useState(null);

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =====================================================
    // LOAD CATEGORY PRODUCTS
    // =====================================================

   const loadCategoryProducts = useCallback(async () => {
    if (!id) {
        setError("Category ID is missing.");
        setLoading(false);
        return;
    }

    try {
        setLoading(true);
        setError("");

        console.log(
            "GET:",
            `${SERVER_URL}/api/categories/${id}/products`
        );

        const response = await axios.get(
            `${SERVER_URL}/api/categories/${id}/products`,
            {
                headers: {
                    Accept: "application/json",
                },
                timeout: 30000,
            }
        );

        console.log(
            "CATEGORY PRODUCTS:",
            response.data
        );

        let data = response.data;

        if (data && Array.isArray(data.items)) {
            data = data.items;
        } else if (data && Array.isArray(data.data)) {
            data = data.data;
        } else if (data && Array.isArray(data.products)) {
            data = data.products;
        }

        if (!Array.isArray(data)) {
            data = [];
        }

        setProducts(data);

        // Category name is optional
        try {
            const categoryResponse = await axios.get(
                `${SERVER_URL}/api/categories/${id}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                    timeout: 30000,
                }
            );

            setCategory(categoryResponse.data);
        }
        catch (categoryError) {
            console.warn(
                "Category details could not be loaded:",
                categoryError.response?.data ||
                categoryError.message
            );

            // Don't fail the products page
            setCategory({
                categoryId: id,
                categoryName: `Category ${id}`,
            });
        }

    }
    catch (err) {

        console.error(
            "CATEGORY PRODUCTS ERROR:",
            err.response?.data ||
            err.message
        );

        const message =
            err.response?.data?.message ||
            err.response?.data ||
            err.message ||
            "Failed to fetch category products.";

        setError(
            typeof message === "string"
                ? message
                : "Failed to fetch category products."
        );

        setProducts([]);

    }
    finally {
        setLoading(false);
    }

}, [id]);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadCategoryProducts();

    }, [loadCategoryProducts]);

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 400,

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",
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

            <Box p={3}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate(
                            "/categories"
                        )
                    }
                >
                    Back to Categories
                </Button>

            </Box>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box p={3}>

            {/* =================================================
                HEADER
            ================================================== */}

            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                }}
            >

                <Box
                    sx={{
                        display: "flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "space-between",
                    }}
                >

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Category Products
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Category:{" "}

                            {category?.categoryName ||
                                `Category ${id}`}
                        </Typography>

                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/categories"
                            )
                        }
                    >
                        Back
                    </Button>

                </Box>

            </Paper>

            {/* =================================================
                PRODUCT LIST
            ================================================== */}

            <Paper
                sx={{
                    p: 3,
                }}
            >

                <Typography
                    variant="h6"
                    sx={{ mb: 2 }}
                >
                    Products
                </Typography>

                {products.length === 0 ? (

                    <Alert severity="info">
                        No products found for this
                        category.
                    </Alert>

                ) : (

                    <Box>

                        {products.map(
                            (product, index) => (

                                <Box
                                    key={
                                        product.productId ??
                                        product.id ??
                                        index
                                    }
                                    sx={{
                                        py: 2,

                                        borderBottom:
                                            "1px solid",

                                        borderColor:
                                            "divider",
                                    }}
                                >

                                    <Typography
                                        fontWeight="bold"
                                    >
                                        {
                                            product.productName ||
                                            product.name ||
                                            "Unnamed Product"
                                        }
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        Product ID:{" "}

                                        {
                                            product.productId ??
                                            product.id ??
                                            "-"
                                        }
                                    </Typography>

                                </Box>

                            )
                        )}

                    </Box>

                )}

            </Paper>

        </Box>
    );
};

export default CategoryProducts;