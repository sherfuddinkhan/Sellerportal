// =========================================================
// ProductPriceEdit.jsx
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Typography,
    CircularProgress,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import ProductPriceForm from "./ProductPriceForm";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// Product Price Edit
// =========================================================

const ProductPriceEdit = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [productPrice, setProductPrice] =
        useState(null);

    const [success, setSuccess] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD PRODUCT PRICE
    // =====================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Product Price ID is missing."
            );

            setLoading(false);

            return;
        }

        loadProductPrice();

    }, [id]);


    // =====================================================
    // GET PRODUCT PRICE BY ID
    // =====================================================

    const loadProductPrice = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-prices/${id}`
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Unable to load Product Price."
                );
            }

            setProductPrice(data);

        } catch (err) {

            console.error(
                "Load Product Price Error:",
                err
            );

            setError(
                err?.message ||
                "Unable to load Product Price."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // UPDATE PRODUCT PRICE
    // =====================================================

    const handleUpdate = async (data) => {

        try {

            setSaving(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-prices/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(data),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    result?.message ||
                    "Failed to update Product Price."
                );
            }


            // =============================================
            // SUCCESS
            // =============================================

            setSuccess(true);


            // =============================================
            // REDIRECT
            // =============================================

            setTimeout(() => {

                navigate(
                    "/product-prices"
                );

            }, 1000);

        } catch (err) {

            console.error(
                "Update Product Price Error:",
                err
            );

            setError(
                err?.message ||
                "Failed to update Product Price."
            );

        } finally {

            setSaving(false);
        }
    };


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
                    minHeight: 300,
                }}
            >

                <CircularProgress />

            </Box>
        );
    }


    // =====================================================
    // NO PRODUCT PRICE
    // =====================================================

    if (!productPrice) {

        return (

            <Box
                sx={{
                    p: 3,
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                    }}
                >
                    {error ||
                        "Product Price not found."}
                </Alert>

            </Box>
        );
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
            }}
        >

            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Edit Product Price
            </Typography>


            {/* =================================================
                FORM
            ================================================= */}

            <ProductPriceForm
                initialValues={productPrice}
                loading={saving}
                onSubmit={handleUpdate}
                onCancel={() =>
                    navigate(
                        "/product-prices"
                    )
                }
            />


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() =>
                    setSuccess(false)
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() =>
                        setSuccess(false)
                    }
                >
                    Product Price updated successfully.
                </Alert>

            </Snackbar>


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={4000}
                onClose={() =>
                    setError("")
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >

                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default ProductPriceEdit;
