import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
    Chip
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";


/* =========================================================
   API CONFIGURATION
========================================================= */

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/goods-receipt-note-items`;


/* =========================================================
   COMPONENT
========================================================= */

const GoodsReceiptNoteItemDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [item, setItem] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "error"
        });


    /* =====================================================
       LOAD DETAILS
    ===================================================== */

    const loadDetails = async () => {

        try {

            setLoading(true);

            console.log(
                "GET GRN ITEM DETAILS:",
                `${API_URL}/${id}`
            );


            const response =
                await axios.get(
                    `${API_URL}/${id}`
                );


            console.log(
                "GRN ITEM DETAILS RESPONSE:",
                response.data
            );


            const data =
                response.data?.data ||
                response.data;


            setItem(data);


        } catch (error) {

            console.error(
                "LOAD GRN ITEM DETAILS ERROR:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to load Goods Receipt Note Item details.",
                severity: "error"
            });

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       LOAD
    ===================================================== */

    useEffect(() => {

        if (id) {
            loadDetails();
        }

    }, [id]);


    /* =====================================================
       FORMAT NUMBER
    ===================================================== */

    const formatNumber = (value) => {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "0";
        }

        return number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };


    /* =====================================================
       FORMAT CURRENCY
    ===================================================== */

    const formatCurrency = (value) => {

        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "₹ 0.00";
        }

        return `₹ ${number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >

                <CircularProgress />

            </Box>
        );
    }


    /* =====================================================
       NOT FOUND
    ===================================================== */

    if (!item) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    Goods Receipt Note Item not found.
                </Alert>


                <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/goods-receipt-note-items"
                        )
                    }
                >
                    Back to GRN Items
                </Button>

            </Box>
        );
    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box sx={{ p: 3 }}>

            {/* HEADER */}

            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={3}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Goods Receipt Note Item Details
                    </Typography>

                    <Typography
                        color="text.secondary"
                        mt={0.5}
                    >
                        Item ID:{" "}
                        {item.GoodsReceiptNoteItemId}
                    </Typography>

                </Box>


                <Box
                    display="flex"
                    gap={2}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                "/goods-receipt-note-items"
                            )
                        }
                    >
                        Back
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/goods-receipt-note-items/edit/${item.GoodsReceiptNoteItemId}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Box>

            </Box>


            {/* BASIC INFORMATION */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        mb={2}
                    >
                        Basic Information
                    </Typography>


                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                GRN Item ID
                            </Typography>

                            <Typography
                                fontWeight="bold"
                            >
                                {item.GoodsReceiptNoteItemId ?? "-"}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Goods Receipt Note ID
                            </Typography>

                            <Typography
                                fontWeight="bold"
                            >
                                {item.GoodsReceiptNoteId ?? "-"}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Product ID
                            </Typography>

                            <Typography
                                fontWeight="bold"
                            >
                                {item.ProductId ?? "-"}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* QUANTITY INFORMATION */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        mb={2}
                    >
                        Quantity Information
                    </Typography>


                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Ordered Quantity
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                {formatNumber(
                                    item.OrderedQuantity
                                )}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Received Quantity
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                {formatNumber(
                                    item.ReceivedQuantity
                                )}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Rejected Quantity
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                {formatNumber(
                                    item.RejectedQuantity
                                )}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* PRICE INFORMATION */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        mb={2}
                    >
                        Price Information
                    </Typography>


                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Unit Price
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                {formatCurrency(
                                    item.UnitPrice
                                )}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Total Amount
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                {formatCurrency(
                                    item.TotalAmount
                                )}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Status
                            </Typography>

                            <Box mt={1}>

                                <Chip
                                    label={
                                        Number(
                                            item.RejectedQuantity || 0
                                        ) > 0
                                            ? "Partially Rejected"
                                            : "Received"
                                    }
                                    color={
                                        Number(
                                            item.RejectedQuantity || 0
                                        ) > 0
                                            ? "warning"
                                            : "success"
                                    }
                                />

                            </Box>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* BATCH INFORMATION */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        mb={2}
                    >
                        Batch Information
                    </Typography>


                    <Divider sx={{ mb: 3 }} />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Batch Number
                            </Typography>

                            <Typography
                                fontWeight="bold"
                            >
                                {item.BatchNumber || "-"}
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Expiry Date
                            </Typography>

                            <Typography
                                fontWeight="bold"
                            >
                                {formatDate(
                                    item.ExpiryDate
                                )}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* REMARKS */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        mb={2}
                    >
                        Remarks
                    </Typography>


                    <Divider sx={{ mb: 3 }} />


                    <Typography>
                        {item.Remarks || "No remarks available."}
                    </Typography>

                </CardContent>

            </Card>


            {/* SNACKBAR */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
            >

                <Alert
                    severity={snackbar.severity}
                    onClose={() =>
                        setSnackbar((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>
    );
};


export default GoodsReceiptNoteItemDetails;

