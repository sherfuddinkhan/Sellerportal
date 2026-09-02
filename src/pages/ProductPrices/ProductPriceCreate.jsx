// =========================================================
// ProductPriceCreate.jsx
// =========================================================

import React, { useState } from "react";

import {
    Typography,
    Snackbar,
    Alert,
    Box,
} from "@mui/material";

import {
    useNavigate,
} from "react-router-dom";

import ProductPriceForm from "./ProductPriceForm";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductPriceCreate = () => {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);

    const [error, setError] = useState("");

    // =====================================================
    // CREATE PRODUCT PRICE
    // =====================================================

    const handleSubmit = async (formData) => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-prices`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to create Product Price."
                );
            }

            console.log(
                "Product Price created:",
                data
            );

            setSuccess(true);

            // Redirect after success
            setTimeout(() => {

                navigate("/product-prices");

            }, 1000);

        } catch (err) {

            console.error(
                "Create Product Price Error:",
                err
            );

            setError(
                err.message ||
                "Failed to create Product Price."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate("/product-prices");

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box>

            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Create Product Price
            </Typography>

            {/* =================================================
                FORM
            ================================================= */}

            <ProductPriceForm
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
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
            >

                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() =>
                        setSuccess(false)
                    }
                >
                    Product Price created successfully.
                </Alert>

            </Snackbar>

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={5000}
                onClose={() =>
                    setError("")
                }
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

export default ProductPriceCreate;
