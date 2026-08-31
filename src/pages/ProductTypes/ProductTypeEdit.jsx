// =========================================================
// ProductTypeEdit.jsx
// Edit Product Type
// React → Node server.js → ASP.NET Core API
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
    CircularProgress,
    Paper,
    Snackbar,
    Typography,
} from "@mui/material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import ProductTypeForm from "./ProductTypeForm";


// =========================================================
// NODE SERVER
// =========================================================

const NODE_API_URL = "http://localhost:5000";


// =========================================================
// DEFAULT PRODUCT TYPE
// =========================================================

const DEFAULT_PRODUCT_TYPE = {
    productTypeName: "",
    description: "",
    isActive: true,
};


// =========================================================
// PRODUCT TYPE EDIT
// =========================================================

const ProductTypeEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

    const [productType, setProductType] = useState(
        DEFAULT_PRODUCT_TYPE
    );


    // =====================================================
    // SNACKBAR
    // =====================================================

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: "",
    });


    // =====================================================
    // SHOW MESSAGE
    // =====================================================

    const showMessage = useCallback(
        (message, severity = "success") => {

            setSnackbar({
                open: true,
                severity,
                message,
            });

        },
        []
    );


    // =====================================================
    // LOAD PRODUCT TYPE
    // =====================================================

    const loadProductType = useCallback(
        async () => {

            // -----------------------------------------------
            // Validate ID
            // -----------------------------------------------

            if (!id) {

                showMessage(
                    "Product Type ID is missing.",
                    "error"
                );

                setPageLoading(false);

                return;

            }


            try {

                setPageLoading(true);


                // -------------------------------------------
                // React → Node
                // -------------------------------------------

                const response = await axios.get(
                    `${NODE_API_URL}/api/product-types/${id}`
                );


                const responseData =
                    response.data;


                // -------------------------------------------
                // Backend can return:
                //
                // {
                //     success: true,
                //     data: {...}
                // }
                //
                // or:
                //
                // {
                //     productTypeId: 1,
                //     productTypeName: "Electronics"
                // }
                // -------------------------------------------

                let data = null;


                if (
                    responseData?.data &&
                    typeof responseData.data === "object"
                ) {

                    data =
                        responseData.data;

                }
                else if (
                    responseData &&
                    typeof responseData === "object"
                ) {

                    data =
                        responseData;

                }


                if (!data) {

                    throw new Error(
                        "Product Type data not found."
                    );

                }


                setProductType({
                    ...DEFAULT_PRODUCT_TYPE,
                    ...data,
                });

            }
            catch (error) {

                console.error(
                    "Load Product Type Error:",
                    error
                );


                const message =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load Product Type.";


                showMessage(
                    message,
                    "error"
                );

            }
            finally {

                setPageLoading(false);

            }

        },
        [
            id,
            showMessage,
        ]
    );


    // =====================================================
    // LOAD ON PAGE OPEN
    // =====================================================

    useEffect(() => {

        loadProductType();

    }, [
        loadProductType,
    ]);


    // =====================================================
    // UPDATE PRODUCT TYPE
    // =====================================================

    const handleUpdate = async (values) => {

        if (!id) {

            showMessage(
                "Product Type ID is missing.",
                "error"
            );

            return;

        }


        try {

            setLoading(true);


            // -----------------------------------------------
            // Prepare request
            // -----------------------------------------------

            const payload = {

                productTypeName:
                    values.productTypeName?.trim() || "",

                description:
                    values.description?.trim() || "",

                isActive:
                    Boolean(values.isActive),

            };


            // -----------------------------------------------
            // React → Node
            //
            // PUT
            // /api/product-types/:id
            // -----------------------------------------------

            const response =
                await axios.put(
                    `${NODE_API_URL}/api/product-types/${id}`,
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );


            console.log(
                "Product Type Update Response:",
                response.data
            );


            // -----------------------------------------------
            // Success
            // -----------------------------------------------

            showMessage(
                "Product Type updated successfully.",
                "success"
            );


            // -----------------------------------------------
            // Navigate after success
            // -----------------------------------------------

            setTimeout(() => {

                navigate(
                    "/product-types"
                );

            }, 1000);

        }
        catch (error) {

            console.error(
                "Update Product Type Error:",
                error
            );


            // -----------------------------------------------
            // ASP.NET / Node error
            // -----------------------------------------------

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.message ||
                "Unable to update Product Type.";


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
    // PAGE LOADING
    // =====================================================

    if (pageLoading) {

        return (

            <Box
                sx={{
                    width: "100%",
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
                    PAGE TITLE
                ========================================= */}

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                >
                    Edit Product Type
                </Typography>


                {/* =========================================
                    PRODUCT TYPE FORM
                ========================================= */}

                <ProductTypeForm

                    initialValues={
                        productType
                    }

                    loading={
                        loading
                    }

                    onSubmit={
                        handleUpdate
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
                    3000
                }

                onClose={() =>
                    setSnackbar(
                        (previous) => ({
                            ...previous,
                            open: false,
                        })
                    )
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

                    onClose={() =>
                        setSnackbar(
                            (previous) => ({
                                ...previous,
                                open: false,
                            })
                        )
                    }

                    sx={{
                        width: "100%",
                    }}

                >

                    {snackbar.message}

                </Alert>

            </Snackbar>

        </Box>

    );
};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypeEdit;
