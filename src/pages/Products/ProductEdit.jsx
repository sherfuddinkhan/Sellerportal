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
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

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

    // IMPORTANT:
    // This must match your React route:
    //
    // /products/edit/:id
    //
    const { id } = useParams();

    const [product, setProduct] = useState(null);

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
    // LOAD PRODUCT
    // =====================================================

    useEffect(() => {

        if (!id) {

            console.error(
                "Product ID is missing."
            );

            setSnackbar({
                open: true,
                severity: "error",
                message: "Product ID is missing.",
            });

            setPageLoading(false);

            return;
        }

        loadProduct();

    }, [id]);

    // =====================================================
    // GET PRODUCT BY ID
    // =====================================================

    const loadProduct = async () => {

        try {

            setPageLoading(true);

            console.log(
                "Loading Product ID:",
                id
            );

            // IMPORTANT:
            // Use /api/products/:id
            //
            // because your server.js contains:
            //
            // app.get("/api/products/:id")

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

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Product API error:",
                    errorText
                );

                throw new Error(
                    `Unable to load product. HTTP ${response.status}`
                );
            }

            const data =
                await response.json();

            console.log(
                "Product response:",
                data
            );

            if (!data) {
                throw new Error(
                    "Product data is empty."
                );
            }

            setProduct(data);

        }
        catch (error) {

            console.error(
                "Product loading error:",
                error
            );

            setSnackbar({
                open: true,
                severity: "error",
                message:
                    error.message ||
                    "Unable to load Product.",
            });

        }
        finally {

            setPageLoading(false);
        }
    };

    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    const handleUpdate = async (values) => {

        try {

            setLoading(true);

            console.log(
                "Updating Product:",
                id
            );

            console.log(
                "Update payload:",
                values
            );

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

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Update error:",
                    errorText
                );

                throw new Error(
                    errorText ||
                    `Unable to update Product. HTTP ${response.status}`
                );
            }

            setSnackbar({
                open: true,
                severity: "success",
                message:
                    "Product updated successfully.",
            });

            setTimeout(() => {

                navigate("/products");

            }, 1000);

        }
        catch (error) {

            console.error(
                "Product update error:",
                error
            );

            setSnackbar({
                open: true,
                severity: "error",
                message:
                    error.message ||
                    "Unable to update Product.",
            });

        }
        finally {

            setLoading(false);
        }
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
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
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
                    Product ID: {id || "Missing"}
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
                        sx={{ mb: 2 }}
                    >
                        Product ID:{" "}
                        {id || "Missing"}
                    </Alert>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/products")
                        }
                    >
                        ← Back to Products
                    </button>

                </Paper>

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
                        severity={
                            snackbar.severity
                        }
                        variant="filled"
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

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                >
                    Edit Product
                </Typography>

                <ProductForm
                    initialValues={product}
                    loading={loading}
                    onSubmit={handleUpdate}
                    onCancel={() =>
                        navigate("/products")
                    }
                />

            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
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

export default ProductEdit;
