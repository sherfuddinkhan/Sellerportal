import React, { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Grid
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";


const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/sales-order-items`;


const SalesOrderItemDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    const [item, setItem] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================================
    // FORMAT CURRENCY
    // =========================================================

    const formatCurrency = (value) =>
        `₹ ${Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;


    // =========================================================
    // FORMAT NUMBER
    // =========================================================

    const formatNumber = (value) =>
        Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });


    // =========================================================
    // LOAD SALES ORDER ITEM
    // =========================================================

    useEffect(() => {

        const loadItem = async () => {

            try {

                setLoading(true);

                setError("");

                setItem(null);


                const itemId = Number(id);


                // =================================================
                // VALIDATE ID
                // =================================================

                if (
                    !id ||
                    !Number.isInteger(itemId) ||
                    itemId <= 0
                ) {

                    setError(
                        "Invalid Sales Order Item ID."
                    );

                    return;
                }


                console.log(
                    "Loading Sales Order Item:",
                    itemId
                );


                // =================================================
                // GET ITEM
                // =================================================

                const response = await axios.get(
                    `${API_URL}/${itemId}`
                );


                const data = response.data;


                console.log(
                    "Sales Order Item response:",
                    data
                );


                // =================================================
                // CHECK RESPONSE
                // =================================================

                if (!data) {

                    setError(
                        "Sales Order Item not found."
                    );

                    return;
                }


                // =================================================
                // NORMALIZE RESPONSE
                // Supports camelCase and PascalCase
                // =================================================

                setItem({

                    SalesOrderItemId:
                        data.salesOrderItemId ??
                        data.SalesOrderItemId ??
                        0,

                    SalesOrderId:
                        data.salesOrderId ??
                        data.SalesOrderId ??
                        0,

                    ProductId:
                        data.productId ??
                        data.ProductId ??
                        0,

                    LineNumber:
                        data.lineNumber ??
                        data.LineNumber ??
                        0,

                    Quantity:
                        Number(
                            data.quantity ??
                            data.Quantity ??
                            0
                        ),

                    UnitPrice:
                        Number(
                            data.unitPrice ??
                            data.UnitPrice ??
                            0
                        ),

                    DiscountAmount:
                        Number(
                            data.discountAmount ??
                            data.DiscountAmount ??
                            0
                        ),

                    TaxAmount:
                        Number(
                            data.taxAmount ??
                            data.TaxAmount ??
                            0
                        ),

                    TotalAmount:
                        Number(
                            data.totalAmount ??
                            data.TotalAmount ??
                            0
                        ),

                    Remarks:
                        data.remarks ??
                        data.Remarks ??
                        ""
                });

            } catch (err) {

                console.error(
                    "Error loading Sales Order Item:",
                    err
                );


                if (err.response?.status === 404) {

                    setError(
                        "Sales Order Item not found."
                    );

                } else if (
                    err.response?.status === 400
                ) {

                    setError(
                        err.response?.data?.message ||
                        "Invalid Sales Order Item ID."
                    );

                } else {

                    setError(
                        err.response?.data?.message ||
                        "Failed to load Sales Order Item."
                    );
                }

            } finally {

                setLoading(false);

            }
        };


        loadItem();

    }, [id]);


    // =========================================================
    // GO BACK
    // =========================================================

    const handleBack = () => {

        navigate("/sales-order-items");

    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = () => {

        if (!item?.SalesOrderItemId) {
            return;
        }

        navigate(
            `/sales-order-items/edit/${item.SalesOrderItemId}`
        );

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px"
                }}
            >

                <CircularProgress />

            </Box>

        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error}
                </Alert>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Sales Order Items
                </Button>

            </Box>

        );
    }


    // =========================================================
    // NO ITEM
    // =========================================================

    if (!item) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Alert
                    severity="warning"
                    sx={{
                        mb: 2
                    }}
                >
                    Sales Order Item not found.
                </Alert>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Sales Order Items
                </Button>

            </Box>

        );
    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Sales Order Item Details
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        View complete sales order item information
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>

                </Box>

            </Box>


            {/* =================================================
                DETAILS CARD
            ================================================= */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            mb: 2
                        }}
                    >
                        Item Information
                    </Typography>


                    <Divider
                        sx={{
                            mb: 3
                        }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* SALES ORDER ITEM ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Sales Order Item ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="bold"
                            >
                                {item.SalesOrderItemId}
                            </Typography>

                        </Grid>


                        {/* SALES ORDER ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Sales Order ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="bold"
                            >
                                {item.SalesOrderId}
                            </Typography>

                        </Grid>


                        {/* PRODUCT ID */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Product ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="bold"
                            >
                                {item.ProductId}
                            </Typography>

                        </Grid>


                        {/* LINE NUMBER */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Line Number
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="bold"
                            >
                                {item.LineNumber}
                            </Typography>

                        </Grid>


                        {/* QUANTITY */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Quantity
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="bold"
                            >
                                {formatNumber(item.Quantity)}
                            </Typography>

                        </Grid>


                        {/* UNIT PRICE */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Unit Price
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="bold"
                            >
                                {formatCurrency(item.UnitPrice)}
                            </Typography>

                        </Grid>


                        {/* DISCOUNT */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Discount Amount
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="bold"
                            >
                                {formatCurrency(
                                    item.DiscountAmount
                                )}
                            </Typography>

                        </Grid>


                        {/* TAX */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Tax Amount
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight="bold"
                            >
                                {formatCurrency(
                                    item.TaxAmount
                                )}
                            </Typography>

                        </Grid>


                        {/* TOTAL */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
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


                        {/* REMARKS */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Remarks
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    mt: 0.5,
                                    whiteSpace: "pre-wrap"
                                }}
                            >
                                {item.Remarks || "No remarks"}
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

        </Box>

    );
};


export default SalesOrderItemDetails;
