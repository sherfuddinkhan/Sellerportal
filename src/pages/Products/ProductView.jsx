// =========================================================
// ProductView.jsx
// Marketplace Seller Portal
// Product Management
// View Product Page
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Paper,
    Snackbar,
    Typography,
    Grid,
    Divider,
    Button,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import axios from "axios";

// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductView = () => {

    const navigate = useNavigate();

    // IMPORTANT:
    // App.jsx route must be:
    //
    // /products/view/:id
    //
    // Therefore we use "id" here.

    const { id } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "error",
        message: "",
    });

    // =====================================================
    // LOAD PRODUCT
    // =====================================================

    useEffect(() => {

        if (!id || id === ":id") {

            setSnackbar({
                open: true,
                severity: "error",
                message: "Invalid Product ID.",
            });

            setLoading(false);

            return;
        }

        loadProduct();

    }, [id]);

    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    const loadProduct = async () => {

        try {

            setLoading(true);

            console.log(
                "Loading Product ID:",
                id
            );

            const response = await axios.get(
                `${SERVER_URL}/api/Product/${encodeURIComponent(id)}`
            );

            console.log(
                "Product Response:",
                response.data
            );

            setProduct(response.data);

        }
        catch (error) {

            console.error(
                "Unable to load Product:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            setSnackbar({
                open: true,
                severity: "error",
                message:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Unable to load Product.",
            });

        }
        finally {

            setLoading(false);
        }
    };

    // =====================================================
    // SAFE VALUE
    // =====================================================

    const getValue = (...keys) => {

        if (!product) {
            return "";
        }

        for (const key of keys) {

            if (
                product[key] !== undefined &&
                product[key] !== null &&
                product[key] !== ""
            ) {
                return product[key];
            }
        }

        return "";
    };

    // =====================================================
    // PRODUCT VALUES
    // =====================================================

    const productId =
        getValue(
            "productId",
            "ProductId"
        );

    const sellerId =
        getValue(
            "sellerId",
            "SellerId"
        );

    const customerId =
        getValue(
            "customerId",
            "CustomerId"
        );

    const sku =
        getValue(
            "sku",
            "SKU"
        );

    const productName =
        getValue(
            "productName",
            "ProductName"
        );

    const description =
        getValue(
            "description",
            "Description"
        );

    const brandId =
        getValue(
            "brandId",
            "BrandId"
        );

    const categoryId =
        getValue(
            "categoryId",
            "CategoryId"
        );

    const productTypeId =
        getValue(
            "productTypeId",
            "ProductTypeId"
        );

    const isActiveValue =
        getValue(
            "isActive",
            "IsActive"
        );

    const isActive =
        isActiveValue === true ||
        isActiveValue === 1 ||
        isActiveValue === "true" ||
        isActiveValue === "True";

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
                    minHeight: 400,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // =====================================================
    // NO PRODUCT
    // =====================================================

    if (!product) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    Unable to load Product.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/products")
                    }
                >
                    Back to Products
                </Button>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false,
                        })
                    }
                >
                    <Alert
                        severity={snackbar.severity}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>

            </Box>
        );
    }

    // =====================================================
    // VIEW
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Product Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View product information
                    </Typography>

                </Box>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/products/edit/${productId}`
                            )
                        }
                    >
                        Edit Product
                    </Button>

                </Box>

            </Box>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 2,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Product Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={3}
                >

                    {/* PRODUCT ID */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography fontWeight="bold">
                            {productId || "N/A"}
                        </Typography>

                    </Grid>

                    {/* SELLER ID */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Seller ID
                        </Typography>

                        <Typography fontWeight="bold">
                            {sellerId || "N/A"}
                        </Typography>

                    </Grid>

                    {/* CUSTOMER ID */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Customer ID
                        </Typography>

                        <Typography fontWeight="bold">
                            {customerId || "N/A"}
                        </Typography>

                    </Grid>

                    {/* SKU */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            SKU
                        </Typography>

                        <Typography fontWeight="bold">
                            {sku || "N/A"}
                        </Typography>

                    </Grid>

                    {/* PRODUCT NAME */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product Name
                        </Typography>

                        <Typography fontWeight="bold">
                            {productName || "N/A"}
                        </Typography>

                    </Grid>

                    {/* BRAND */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Brand ID
                        </Typography>

                        <Typography fontWeight="bold">
                            {brandId || "N/A"}
                        </Typography>

                    </Grid>

                    {/* CATEGORY */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Category ID
                        </Typography>

                        <Typography fontWeight="bold">
                            {categoryId || "N/A"}
                        </Typography>

                    </Grid>

                    {/* PRODUCT TYPE */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product Type ID
                        </Typography>

                        <Typography fontWeight="bold">
                            {productTypeId || "N/A"}
                        </Typography>

                    </Grid>

                    {/* STATUS */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Typography
                            fontWeight="bold"
                            color={
                                isActive
                                    ? "success.main"
                                    : "error.main"
                            }
                        >
                            {isActive
                                ? "Active"
                                : "Inactive"}
                        </Typography>

                    </Grid>

                    {/* DESCRIPTION */}

                    <Grid item xs={12}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {description || "No description"}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>

            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false,
                    })
                }
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default ProductView;
