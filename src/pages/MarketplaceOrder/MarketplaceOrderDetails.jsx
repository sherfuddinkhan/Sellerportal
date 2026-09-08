// =========================================================
// MarketplaceOrderDetails.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const SERVER_URL = "http://localhost:5000";


const MarketplaceOrderDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD ORDER
    // =====================================================

    const loadOrder = async () => {

        if (!id) {

            setError(
                "Marketplace order ID is missing."
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");


            const response = await axios.get(
                `${SERVER_URL}/api/MarketplaceOrder/${id}`
            );


            if (!response.data) {

                setError(
                    "Marketplace order not found."
                );

                setOrder(null);

                return;
            }


            setOrder(response.data);

        } catch (err) {

            console.error(
                "LOAD MARKETPLACE ORDER DETAILS ERROR:",
                err
            );


            if (err.response?.status === 404) {

                setError(
                    "Marketplace order not found."
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "Unable to load marketplace order."
                );
            }


            setOrder(null);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadOrder();

    }, [id]);


    // =====================================================
    // HELPERS
    // =====================================================

    const getValue = (
        camelCase,
        pascalCase,
        fallback = "-"
    ) => {

        const value =
            order?.[camelCase] ??
            order?.[pascalCase];


        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return fallback;
        }


        return value;
    };


    const formatDateTime = (
        camelCase,
        pascalCase
    ) => {

        const value =
            order?.[camelCase] ??
            order?.[pascalCase];


        if (!value) {
            return "-";
        }


        const date = new Date(value);


        if (Number.isNaN(date.getTime())) {
            return String(value);
        }


        return date.toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };


    const formatAmount = () => {

        const value =
            order?.totalAmount ??
            order?.TotalAmount;


        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "-";
        }


        const currency =
            order?.currency ??
            order?.Currency ??
            "INR";


        try {

            return new Intl.NumberFormat(
                "en-IN",
                {
                    style: "currency",
                    currency: currency
                }
            ).format(Number(value));

        } catch {

            return `${currency} ${value}`;
        }
    };


    // =====================================================
    // STATUS
    // =====================================================

    const getStatus = () => {

        return (
            order?.orderStatus ??
            order?.OrderStatus ??
            "-"
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <CircularProgress />

            </Box>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !order) {

        return (

            <Box sx={{ p: 3 }}>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    sx={{ mb: 3 }}
                    onClick={() =>
                        navigate(
                            "/marketplace-orders"
                        )
                    }
                >
                    Back to Orders
                </Button>


                <Alert severity="error">
                    {error ||
                        "Marketplace order not found."}
                </Alert>

            </Box>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Marketplace Order Details
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Order #
                        {" "}
                        {getValue(
                            "marketplaceOrderNumber",
                            "MarketplaceOrderNumber"
                        )}
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap"
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                "/marketplace-orders"
                            )
                        }
                    >
                        Back
                    </Button>


                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadOrder}
                    >
                        Refresh
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/marketplace-orders/edit/${id}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Box>

            </Box>


            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 3
                    },
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Order Summary
                </Typography>


                <Grid
                    container
                    spacing={2}
                >

                    <Grid item xs={12} sm={6} md={3}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order ID
                        </Typography>


                        <Typography fontWeight="600">
                            {getValue(
                                "marketplaceOrderId",
                                "MarketplaceOrderId"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Marketplace Order Number
                        </Typography>


                        <Typography fontWeight="600">
                            {getValue(
                                "marketplaceOrderNumber",
                                "MarketplaceOrderNumber"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order Status
                        </Typography>


                        <Typography
                            fontWeight="600"
                        >
                            {getStatus()}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={3}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Total Amount
                        </Typography>


                        <Typography
                            fontWeight="700"
                            variant="h6"
                        >
                            {formatAmount()}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                ORDER INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 3
                    },
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Order Information
                </Typography>


                <Divider sx={{ mb: 2 }} />


                <Grid
                    container
                    spacing={3}
                >

                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Marketplace Account ID
                        </Typography>


                        <Typography>
                            {getValue(
                                "marketplaceAccountId",
                                "MarketplaceAccountId"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            External Order ID
                        </Typography>


                        <Typography>
                            {getValue(
                                "externalOrderId",
                                "ExternalOrderId"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Seller Order Number
                        </Typography>


                        <Typography>
                            {getValue(
                                "sellerOrderNumber",
                                "SellerOrderNumber"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order Date
                        </Typography>


                        <Typography>
                            {formatDateTime(
                                "orderDate",
                                "OrderDate"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Fulfillment Channel
                        </Typography>


                        <Typography>
                            {getValue(
                                "fulfillmentChannel",
                                "FulfillmentChannel"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Currency
                        </Typography>


                        <Typography>
                            {getValue(
                                "currency",
                                "Currency"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Purchase Order Number
                        </Typography>


                        <Typography>
                            {getValue(
                                "purchaseOrderNumber",
                                "PurchaseOrderNumber"
                            )}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                BUYER INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 3
                    },
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Buyer Information
                </Typography>


                <Divider sx={{ mb: 2 }} />


                <Grid
                    container
                    spacing={3}
                >

                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Buyer Name
                        </Typography>


                        <Typography>
                            {getValue(
                                "buyerName",
                                "BuyerName"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Buyer Email
                        </Typography>


                        <Typography>
                            {getValue(
                                "buyerEmail",
                                "BuyerEmail"
                            )}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                SYNC / AUDIT INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 3
                    },
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 2 }}
                >
                    Sync & Audit Information
                </Typography>


                <Divider sx={{ mb: 2 }} />


                <Grid
                    container
                    spacing={3}
                >

                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Last Sync Date
                        </Typography>


                        <Typography>
                            {formatDateTime(
                                "lastSyncDate",
                                "LastSyncDate"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>


                        <Typography>
                            {formatDateTime(
                                "createdDate",
                                "CreatedDate"
                            )}
                        </Typography>

                    </Grid>


                    <Grid item xs={12} sm={6} md={4}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>


                        <Typography>
                            {formatDateTime(
                                "updatedDate",
                                "UpdatedDate"
                            )}
                        </Typography>

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/marketplace-orders"
                        )
                    }
                >
                    Back to Orders
                </Button>


                <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() =>
                        navigate(
                            `/marketplace-orders/edit/${id}`
                        )
                    }
                >
                    Edit Order
                </Button>

            </Box>

        </Box>
    );
};


export default MarketplaceOrderDetails;

