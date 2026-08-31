// =========================================================
// ProductTypeDetails.jsx
// Product Type Details
//
// React → Node server.js → ASP.NET Core API
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Snackbar,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";


// =========================================================
// NODE SERVER
// =========================================================

const NODE_API_URL = "http://localhost:5000";


// =========================================================
// PRODUCT TYPE DETAILS
// =========================================================

const ProductTypeDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    const [productType, setProductType] =
        useState(null);


    const [snackbar, setSnackbar] =
        useState({
            open: false,
            severity: "error",
            message: "",
        });


    // =====================================================
    // LOAD PRODUCT TYPE
    // =====================================================

    useEffect(() => {

        if (!id) {

            setLoading(false);

            setSnackbar({
                open: true,
                severity: "error",
                message:
                    "Product Type ID is missing.",
            });

            return;
        }

        loadProductType();

    }, [id]);


    // =====================================================
    // GET PRODUCT TYPE BY ID
    // =====================================================

    const loadProductType = async () => {

        try {

            setLoading(true);


            console.log(
                "Loading Product Type:",
                id
            );


            // ---------------------------------------------
            // REACT → NODE
            // ---------------------------------------------

            const response =
                await axios.get(

                    `${NODE_API_URL}/api/product-types/${id}`,

                    {
                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }

                );


            console.log(
                "Product Type Response:",
                response.data
            );


            // ---------------------------------------------
            // SUPPORT DIRECT RESPONSE
            // ---------------------------------------------

            const data =
                response.data?.data ??
                response.data;


            setProductType(data);

        }
        catch (error) {

            console.error(
                "Load Product Type Error:",
                error
            );


            let message =
                "Unable to load Product Type.";


            if (
                error?.response?.status === 404
            ) {

                message =
                    "Product Type not found.";

            }
            else if (
                error?.response?.data?.message
            ) {

                message =
                    error.response.data.message;

            }
            else if (
                error?.message
            ) {

                message =
                    error.message;

            }


            setProductType(null);


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
    // LOADING
    // =====================================================

    if (loading) {

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
    // NOT FOUND
    // =====================================================

    if (!productType) {

        return (

            <Box sx={{ p: 3 }}>

                <Paper
                    sx={{
                        p: 4,
                        textAlign: "center",
                    }}
                >

                    <Typography
                        variant="h6"
                        gutterBottom
                    >

                        Product Type not found.

                    </Typography>


                    <Button
                        variant="contained"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/product-types"
                            )
                        }
                    >

                        Back to Product Types

                    </Button>

                </Paper>


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

                >

                    <Alert
                        severity={
                            snackbar.severity
                        }

                        variant="filled"

                        onClose={
                            handleSnackbarClose
                        }
                    >

                        {
                            snackbar.message
                        }

                    </Alert>

                </Snackbar>

            </Box>

        );

    }


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "-";

        }


        return parsedDate.toLocaleString();

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box sx={{ width: "100%" }}>

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 4,
                    },
                }}
            >

                {/* =========================================
                    HEADER
                ========================================= */}

                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        mb: 2,
                    }}
                >

                    <Grid item>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >

                            Product Type Details

                        </Typography>

                    </Grid>


                    {/* =====================================
                        ACTIONS
                    ===================================== */}

                    <Grid item>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                            }}
                        >

                            <Button

                                variant="outlined"

                                startIcon={
                                    <ArrowBack />
                                }

                                onClick={() =>
                                    navigate(
                                        "/product-types"
                                    )
                                }

                            >

                                Back

                            </Button>


                            <Button

                                variant="contained"

                                startIcon={
                                    <Edit />
                                }

                                onClick={() =>
                                    navigate(
                                        `/product-types/edit/${productType.productTypeId}`
                                    )
                                }

                            >

                                Edit

                            </Button>

                        </Box>

                    </Grid>

                </Grid>


                <Divider
                    sx={{
                        mb: 3,
                    }}
                />


                {/* =========================================
                    DETAILS
                ========================================= */}

                <Grid
                    container
                    spacing={3}
                >

                    {/* =====================================
                        ID
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >

                            Product Type ID

                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="600"
                        >

                            {
                                productType.productTypeId ??
                                "-"
                            }

                        </Typography>

                    </Grid>


                    {/* =====================================
                        NAME
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >

                            Product Type Name

                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="600"
                        >

                            {
                                productType.productTypeName ||
                                "-"
                            }

                        </Typography>

                    </Grid>


                    {/* =====================================
                        DESCRIPTION
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{
                                mb: 0.5,
                            }}
                        >

                            Description

                        </Typography>

                        <Typography
                            sx={{
                                whiteSpace:
                                    "pre-wrap",

                                wordBreak:
                                    "break-word",
                            }}
                        >

                            {
                                productType.description ||
                                "-"
                            }

                        </Typography>

                    </Grid>


                    {/* =====================================
                        STATUS
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                            variant="body2"
                            sx={{
                                mb: 1,
                            }}
                        >

                            Status

                        </Typography>

                        <Chip

                            label={
                                productType.isActive
                                    ? "Active"
                                    : "Inactive"
                            }

                            color={
                                productType.isActive
                                    ? "success"
                                    : "error"
                            }

                            size="small"

                        />

                    </Grid>


                    {/* =====================================
                        CREATED DATE
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >

                            Created Date

                        </Typography>

                        <Typography>

                            {
                                formatDate(
                                    productType.createdDate
                                )
                            }

                        </Typography>

                    </Grid>


                    {/* =====================================
                        UPDATED DATE
                    ===================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >

                            Updated Date

                        </Typography>

                        <Typography>

                            {
                                formatDate(
                                    productType.updatedDate
                                )
                            }

                        </Typography>

                    </Grid>

                </Grid>

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

export default ProductTypeDetails;
