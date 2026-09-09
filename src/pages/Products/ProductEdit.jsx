// =========================================================
// ProductEdit.jsx
// Marketplace Seller Portal
// Edit Product Page
// Uses server.js directly
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Box,
    CircularProgress,
    Paper,
    Typography,
    Alert,
    Snackbar,
    Button,
} from "@mui/material";

import {
    ArrowBack,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import ProductForm from "./ProductForm";

// =========================================================
// NODE SERVER
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductEdit = () => {

    const navigate = useNavigate();

    // =====================================================
    // ROUTE PARAMETER
    // =====================================================
    //
    // React route:
    //
    // /products/edit/:id
    //
    // Example:
    //
    // /products/edit/6
    //
    // Backend:
    //
    // PUT /api/products/6
    //
    // GET  /api/products/6
    //
    // =====================================================

    const { id } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [product, setProduct] =
        useState(null);

    const [pageLoading, setPageLoading] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            severity: "success",
            message: "",
        });

    // =====================================================
    // SHOW MESSAGE
    // =====================================================

    const showMessage = (
        severity,
        message
    ) => {

        setSnackbar({
            open: true,
            severity,
            message,
        });
    };

    // =====================================================
    // CLOSE SNACKBAR
    // =====================================================

    const handleCloseSnackbar = () => {

        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));
    };

    // =====================================================
    // EXTRACT API ERROR
    // =====================================================

    const getErrorMessage = async (response) => {

        try {

            const text =
                await response.text();

            if (!text) {

                return `HTTP ${response.status}`;
            }

            try {

                const data =
                    JSON.parse(text);

                // ASP.NET:
                //
                // { message: "..." }
                //

                if (data?.message) {

                    return data.message;
                }

                // ASP.NET ModelState:
                //
                // {
                //   errors: {
                //      ProductName: [...]
                //   }
                // }
                //

                if (data?.errors) {

                    const errors = [];

                    Object.entries(
                        data.errors
                    ).forEach(
                        ([field, messages]) => {

                            if (
                                Array.isArray(
                                    messages
                                )
                            ) {

                                messages.forEach(
                                    (message) => {

                                        errors.push(
                                            `${field}: ${message}`
                                        );
                                    }
                                );

                            }

                        }
                    );

                    if (errors.length > 0) {

                        return errors.join(" | ");
                    }
                }

                // ASP.NET ProblemDetails
                //

                if (data?.title) {

                    return data.title;
                }

                return text;

            }
            catch {

                return text;
            }

        }
        catch {

            return `HTTP ${response.status}`;
        }
    };

    // =====================================================
    // LOAD PRODUCT
    // =====================================================

    useEffect(() => {

        if (!id) {

            console.error(
                "Product ID is missing."
            );

            showMessage(
                "error",
                "Product ID is missing."
            );

            setPageLoading(false);

            return;
        }

        loadProduct();

    }, [id]);

    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================
    //
    // React
    //     ↓
    // Node server.js
    //     ↓
    // ASP.NET Core
    //
    // GET:
    //
    // http://localhost:5000/api/products/:id
    //
    // forwarded to:
    //
    // https://localhost:7203/api/products/:id
    //
    // =====================================================

    const loadProduct = async () => {

        try {

            setPageLoading(true);

            console.log(
                "===================================="
            );

            console.log(
                "Loading Product"
            );

            console.log(
                "Product ID:",
                id
            );

            console.log(
                "GET:",
                `${SERVER_URL}/api/products/${id}`
            );

            console.log(
                "===================================="
            );

            const response = await fetch(
                `${SERVER_URL}/api/products/${encodeURIComponent(id)}`,
                {
                    method: "GET",

                    headers: {
                        Accept:
                            "application/json",
                    },
                }
            );

            console.log(
                "Product response status:",
                response.status
            );

            // =================================================
            // API ERROR
            // =================================================

            if (!response.ok) {

                const errorMessage =
                    await getErrorMessage(
                        response
                    );

                console.error(
                    "Product API error:",
                    errorMessage
                );

                throw new Error(
                    errorMessage ||
                    `Unable to load Product. HTTP ${response.status}`
                );
            }

            // =================================================
            // RESPONSE
            // =================================================

            const data =
                await response.json();

            console.log(
                "Product response:",
                data
            );

            // =================================================
            // EMPTY RESPONSE
            // =================================================

            if (!data) {

                throw new Error(
                    "Product data is empty."
                );
            }

            // =================================================
            // SET PRODUCT
            // =================================================

            setProduct(data);

        }
        catch (error) {

            console.error(
                "Product loading error:",
                error
            );

            showMessage(
                "error",
                error.message ||
                "Unable to load Product."
            );

        }
        finally {

            setPageLoading(false);
        }
    };

    // =====================================================
    // UPDATE PRODUCT
    // =====================================================
    //
    // PUT:
    //
    // http://localhost:5000/api/products/:id
    //
    // forwarded to:
    //
    // https://localhost:7203/api/products/:id
    //
    // =====================================================

    const handleUpdate = async (values) => {

        try {

            setLoading(true);

            console.log(
                "===================================="
            );

            console.log(
                "Updating Product"
            );

            console.log(
                "Product ID:",
                id
            );

            console.log(
                "Update payload:",
                values
            );

            console.log(
                "PUT:",
                `${SERVER_URL}/api/products/${id}`
            );

            console.log(
                "===================================="
            );

            // =================================================
            // PUT REQUEST
            // =================================================

            const response = await fetch(
                `${SERVER_URL}/api/products/${encodeURIComponent(id)}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json",
                    },

                    body:
                        JSON.stringify(values),
                }
            );

            console.log(
                "Update status:",
                response.status
            );

            // =================================================
            // UPDATE ERROR
            // =================================================

            if (!response.ok) {

                const errorMessage =
                    await getErrorMessage(
                        response
                    );

                console.error(
                    "Update API error:",
                    errorMessage
                );

                throw new Error(
                    errorMessage ||
                    `Unable to update Product. HTTP ${response.status}`
                );
            }

            // =================================================
            // READ UPDATED PRODUCT
            // =================================================

            let updatedProduct = null;

            try {

                updatedProduct =
                    await response.json();

            }
            catch {

                // Some APIs return an empty
                // response after PUT.
                //
                // This is acceptable.
            }

            console.log(
                "Updated Product:",
                updatedProduct
            );

            // =================================================
            // SUCCESS
            // =================================================

            showMessage(
                "success",
                "Product updated successfully."
            );

            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate("/products");

            }, 1000);

        }
        catch (error) {

            console.error(
                "Product update error:",
                error
            );

            showMessage(
                "error",
                error.message ||
                "Unable to update Product."
            );

        }
        finally {

            setLoading(false);
        }
    };

    // =====================================================
    // BACK TO PRODUCTS
    // =====================================================

    const handleBack = () => {

        navigate("/products");
    };

    // =====================================================
    // PAGE LOADING
    // =====================================================

    if (pageLoading) {

        return (
            <Box
                sx={{
                    minHeight: 400,

                    display: "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    flexDirection:
                        "column",

                    gap: 2,
                }}
            >

                <CircularProgress />

                <Typography>
                    Loading Product...
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Product ID:{" "}
                    {id || "Missing"}
                </Typography>

            </Box>
        );
    }

    // =====================================================
    // PRODUCT NOT FOUND
    // =====================================================

    if (!product) {

        return (
            <Box sx={{ p: 3 }}>

                <Paper sx={{ p: 3 }}>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={2}
                    >
                        Unable to load Product
                    </Typography>

                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        Product ID:{" "}
                        {id || "Missing"}
                    </Alert>

                    <Button
                        variant="contained"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to Products
                    </Button>

                </Paper>

                {/* =================================================
                    ERROR SNACKBAR
                ================================================== */}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={4000}
                    onClose={
                        handleCloseSnackbar
                    }
                >

                    <Alert
                        severity={
                            snackbar.severity
                        }
                        variant="filled"
                        onClose={
                            handleCloseSnackbar
                        }
                    >
                        {snackbar.message}
                    </Alert>

                </Snackbar>

            </Box>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <Box sx={{ p: 3 }}>

            <Paper sx={{ p: 3 }}>

                {/* =================================================
                    HEADER
                ================================================== */}

                <Box
                    sx={{
                        display: "flex",

                        justifyContent:
                            "space-between",

                        alignItems:
                            "center",

                        mb: 3,
                    }}
                >

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Edit Product
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Product ID: {id}
                        </Typography>

                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        disabled={loading}
                    >
                        Back
                    </Button>

                </Box>

                {/* =================================================
                    PRODUCT FORM
                ================================================== */}

                <ProductForm
                    initialValues={product}
                    loading={loading}
                    onSubmit={handleUpdate}
                    onCancel={handleBack}
                />

            </Paper>

            {/* =====================================================
                SUCCESS / ERROR SNACKBAR
            ===================================================== */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={
                    handleCloseSnackbar
                }
            >

                <Alert
                    severity={
                        snackbar.severity
                    }
                    variant="filled"
                    onClose={
                        handleCloseSnackbar
                    }
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default ProductEdit;