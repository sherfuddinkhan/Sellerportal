// =========================================================
// ProductCreate.jsx
// =========================================================

import React, { useState } from "react";

import {
    Paper,
    Typography,
    Snackbar,
    Alert,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import ProductForm from "./ProductForm";

// =========================================================
// SERVER CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// PRODUCT CREATE COMPONENT
// =========================================================

const ProductCreate = () => {

    const navigate = useNavigate();

    // =========================================================
    // STATE
    // =========================================================

    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: "",
    });

    // =========================================================
    // INITIAL PRODUCT VALUES
    // =========================================================

    const initialValues = {

        productName: "",

        sku: "",

        barcode: "",

        brandId: "",

        categoryId: "",

        productTypeId: "",

        costPrice: 0,

        sellingPrice: 0,

        stockQuantity: 0,

        reorderLevel: 0,

        unit: "",

        hsnCode: "",

        description: "",

        isActive: true,
    };

    // =========================================================
    // CREATE PRODUCT
    // =========================================================

    const handleSubmit = async (values) => {

        try {

            setLoading(true);

            console.log(
                "Creating Product:",
                values
            );

            // =====================================================
            // POST PRODUCT TO NODE SERVER
            // =====================================================

            const response = await axios.post(
                `${SERVER_URL}/api/products`,
                values,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    timeout: 30000,
                }
            );

            console.log(
                "Product Created:",
                response.data
            );

            // =====================================================
            // SUCCESS MESSAGE
            // =====================================================

            setSnackbar({
                open: true,
                severity: "success",
                message: "Product created successfully.",
            });

            // =====================================================
            // REDIRECT TO PRODUCT LIST
            // =====================================================

            setTimeout(() => {

                navigate("/products");

            }, 1000);

        }
        catch (err) {

            console.error(
                "Create Product Error:",
                err
            );

            // =====================================================
            // ERROR MESSAGE
            // =====================================================

            let message =
                "Unable to create Product.";

            if (err.response) {

                console.error(
                    "API Status:",
                    err.response.status
                );

                console.error(
                    "API Response:",
                    err.response.data
                );

                if (
                    err.response.data?.message
                ) {

                    message =
                        err.response.data.message;

                }
                else if (
                    typeof err.response.data === "string"
                ) {

                    message =
                        err.response.data;

                }
            }
            else if (err.request) {

                message =
                    "Node server is not responding. Please check http://localhost:5000.";

            }
            else {

                message =
                    err.message ||
                    "Unable to create Product.";
            }

            setSnackbar({
                open: true,
                severity: "error",
                message,
            });

        }
        finally {

            setLoading(false);

        }
    };

    // =========================================================
    // CLOSE SNACKBAR
    // =========================================================

    const handleCloseSnackbar = () => {

        setSnackbar((previous) => ({
            ...previous,
            open: false,
        }));

    };

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Paper sx={{ p: 3 }}>

            {/* =================================================
                PAGE TITLE
            ================================================== */}

            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
            >
                Create Product
            </Typography>

            {/* =================================================
                PRODUCT FORM
            ================================================== */}

            <ProductForm
                initialValues={initialValues}
                loading={loading}
                onSubmit={handleSubmit}
                onCancel={() =>
                    navigate("/products")
                }
            />

            {/* =================================================
                SUCCESS / ERROR SNACKBAR
            ================================================== */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >

                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Paper>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default ProductCreate;

