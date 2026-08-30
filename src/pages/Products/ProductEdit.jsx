// =========================================================
// ProductEdit.jsx
// Marketplace Seller Portal
// Product Management
// Uses server.js proxy
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    CircularProgress,
    Paper,
    Snackbar,
    Typography
} from "@mui/material";

import axios from "axios";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import ProductForm from "./ProductForm";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [product, setProduct] = useState(null);

    const [pageLoading, setPageLoading] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    // =====================================================
    // LOAD PRODUCT
    // =====================================================

    useEffect(() => {

        if (!id) {

            setSnackbar({
                open: true,
                severity: "error",
                message: "Product ID is missing."
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
                "Loading Product:",
                id
            );

            const response = await axios.get(
                `${SERVER_URL}/api/products/${id}`
            );

            console.log(
                "Product API Response:",
                response.data
            );

            // -------------------------------------------------
            // Handle different possible response structures
            // -------------------------------------------------

            const data =
                response.data?.data ??
                response.data?.product ??
                response.data;

            if (!data) {

                throw new Error(
                    "Product data was not returned by server."
                );
            }

            setProduct(data);

        }
        catch (error) {

            console.error(
                "Load Product Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            let message =
                "Unable to load Product.";

            if (error.response?.status === 404) {

                message =
                    `Product ${id} was not found.`;

            }
            else if (
                error.response?.data?.message
            ) {

                message =
                    error.response.data.message;

            }
            else if (error.message) {

                message =
                    error.message;

            }

            setSnackbar({
                open: true,
                severity: "error",
                message
            });

        }
        finally {

            setPageLoading(false);

        }

    };

    // =====================================================
    // UPDATE PRODUCT
    // =====================================================

    const handleUpdate = async (
        values
    ) => {

        try {

            setLoading(true);

            console.log(
                "Updating Product:",
                id
            );

            console.log(
                "Update Payload:",
                values
            );

            const response = await axios.put(
                `${SERVER_URL}/api/products/${id}`,
                values
            );

            console.log(
                "Update Response:",
                response.data
            );

            setSnackbar({
                open: true,
                severity: "success",
                message:
                    "Product updated successfully."
            });

            // -------------------------------------------------
            // Return to product list
            // -------------------------------------------------

            setTimeout(() => {

                navigate("/products");

            }, 1000);

        }
        catch (error) {

            console.error(
                "Update Product Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );

            let message =
                "Unable to update Product.";

            if (
                error.response?.data?.message
            ) {

                message =
                    error.response.data.message;

            }
            else if (
                error.response?.data?.title
            ) {

                message =
                    error.response.data.title;

            }

            setSnackbar({
                open: true,
                severity: "error",
                message
            });

        }
        finally {

            setLoading(false);

        }

    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate("/products");

    };

    // =====================================================
    // PAGE LOADING
    // =====================================================

    if (pageLoading) {

        return (

            <Box
                sx={{
                    width: "100%",
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2
                    }}
                >

                    <CircularProgress />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Loading Product...
                    </Typography>

                </Box>

            </Box>

        );

    }

    // =====================================================
    // PRODUCT NOT FOUND
    // =====================================================

    if (!product) {

        return (

            <Paper
                sx={{
                    p: 4,
                    textAlign: "center"
                }}
            >

                <Typography
                    variant="h6"
                    color="error"
                    gutterBottom
                >
                    Unable to load Product
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Product ID: {id}
                </Typography>

            </Paper>

        );

    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ width: "100%" }}>

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    width: "100%"
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                >
                    Edit Product
                </Typography>

                {/* =================================================
                    PRODUCT FORM
                ================================================= */}

                <ProductForm
                    initialValues={product}
                    loading={loading}
                    onSubmit={handleUpdate}
                    onCancel={handleCancel}
                />

            </Paper>

            {/* =====================================================
                SNACKBAR
            ===================================================== */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={() =>
                        setSnackbar({
                            ...snackbar,
                            open: false
                        })
                    }
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>

    );

};

export default ProductEdit;
