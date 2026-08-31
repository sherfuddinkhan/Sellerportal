// =========================================================
// ProductTypeCreate.jsx
// Create Product Type
//
// React → Node server.js → ASP.NET Core API
// =========================================================

import React, {
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Paper,
    Snackbar,
    Typography,
} from "@mui/material";

import {
    useNavigate,
} from "react-router-dom";

import ProductTypeForm from "./ProductTypeForm";


// =========================================================
// NODE SERVER URL
// =========================================================

const NODE_API_URL = "http://localhost:5000";


// =========================================================
// DEFAULT FORM VALUES
// =========================================================

const initialValues = {
    productTypeName: "",
    description: "",
    isActive: true,
};


// =========================================================
// PRODUCT TYPE CREATE
// =========================================================

const ProductTypeCreate = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // SNACKBAR
    // =====================================================

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
        message,
        severity = "success"
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

    const handleSnackbarClose = (
        event,
        reason
    ) => {

        if (reason === "clickaway") {
            return;
        }

        setSnackbar(
            (previous) => ({
                ...previous,
                open: false,
            })
        );

    };


    // =====================================================
    // CREATE PRODUCT TYPE
    // =====================================================

    const handleSubmit = async (
        values
    ) => {

        try {

            setLoading(true);


            // ---------------------------------------------
            // PREPARE PAYLOAD
            // ---------------------------------------------

            const payload = {

                productTypeName:
                    values.productTypeName
                        ?.trim() || "",

                description:
                    values.description
                        ?.trim() || "",

                isActive:
                    Boolean(
                        values.isActive
                    ),

            };


            // ---------------------------------------------
            // BASIC FRONTEND VALIDATION
            // ---------------------------------------------

            if (
                !payload.productTypeName
            ) {

                showMessage(
                    "Product Type Name is required.",
                    "error"
                );

                setLoading(false);

                return;

            }


            // ---------------------------------------------
            // REACT → NODE SERVER
            // ---------------------------------------------

            const response =
                await axios.post(

                    `${NODE_API_URL}/api/product-types`,

                    payload,

                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }

                );


            // ---------------------------------------------
            // DEBUG RESPONSE
            // ---------------------------------------------

            console.log(
                "Create Product Type Response:",
                response.data
            );


            // ---------------------------------------------
            // SUCCESS
            // ---------------------------------------------

            showMessage(
                "Product Type created successfully.",
                "success"
            );


            // ---------------------------------------------
            // REDIRECT
            // ---------------------------------------------

            setTimeout(() => {

                navigate(
                    "/product-types"
                );

            }, 1000);

        }
        catch (error) {

            console.error(
                "Create Product Type Error:",
                error
            );


            // ---------------------------------------------
            // GET BACKEND ERROR
            // ---------------------------------------------

            let message =
                "Unable to create Product Type.";


            if (
                error?.response?.data?.message
            ) {

                message =
                    error.response.data.message;

            }
            else if (
                error?.response?.data?.title
            ) {

                message =
                    error.response.data.title;

            }
            else if (
                error?.message
            ) {

                message =
                    error.message;

            }


            // ---------------------------------------------
            // SHOW ERROR
            // ---------------------------------------------

            showMessage(
                message,
                "error"
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
            }}
        >

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                }}
            >

                {/* =========================================
                    TITLE
                ========================================= */}

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                >

                    Create Product Type

                </Typography>


                {/* =========================================
                    FORM
                ========================================= */}

                <ProductTypeForm

                    initialValues={
                        initialValues
                    }

                    loading={
                        loading
                    }

                    onSubmit={
                        handleSubmit
                    }

                    onCancel={() =>
                        navigate(
                            "/product-types"
                        )
                    }

                />

            </Paper>


            {/* =============================================
                SNACKBAR
            ============================================= */}

            <Snackbar

                open={
                    snackbar.open
                }

                autoHideDuration={
                    4000
                }

                onClose={
                    handleSnackbarClose
                }

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}

            >

                <Alert

                    severity={
                        snackbar.severity
                    }

                    variant="filled"

                    onClose={
                        handleSnackbarClose
                    }

                    sx={{
                        width: "100%",
                    }}

                >

                    {
                        snackbar.message
                    }

                </Alert>

            </Snackbar>

        </Box>

    );
};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeCreate;
