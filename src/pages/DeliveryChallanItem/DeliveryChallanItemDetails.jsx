// ============================================================
// DeliveryChallanitemDetails.jsx
// ============================================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Description,
    LocalShipping,
    Inventory2,
    Numbers,
    CurrencyRupee,
    Discount,
    Receipt,
    Notes,
    CalendarToday
} from "@mui/icons-material";


// ============================================================
// CONFIG
// ============================================================

const SERVER_URL = "http://localhost:5000";


// ============================================================
// COMPONENT
// ============================================================

const DeliveryChallanitemDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    // ========================================================
    // STATE
    // ========================================================

    const [item, setItem] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================================
    // LOAD ITEM
    // ========================================================

    useEffect(() => {

        const loadItem = async () => {

            if (!id || Number(id) <= 0) {

                setError(
                    "Invalid Delivery Challan Item ID."
                );

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                const itemId = Number(id);


                console.log(
                    "================================================"
                );

                console.log(
                    "GET DELIVERY CHALLAN ITEM DETAILS"
                );

                console.log(
                    "ITEM ID:",
                    itemId
                );

                console.log(
                    "URL:",
                    `${SERVER_URL}/api/delivery-challan-items/${itemId}`
                );

                console.log(
                    "================================================"
                );


                const response = await axios.get(

                    `${SERVER_URL}/api/delivery-challan-items/${itemId}`,

                    {
                        headers: {
                            Accept: "application/json"
                        }
                    }

                );


                console.log(
                    "DELIVERY CHALLAN ITEM RESPONSE:",
                    response.data
                );


                setItem(response.data);


            } catch (err) {

                console.error(
                    "GET DELIVERY CHALLAN ITEM DETAILS ERROR:",
                    err
                );


                console.error(
                    "RESPONSE:",
                    err.response?.data
                );


                const responseData =
                    err.response?.data;


                let message =
                    "Failed to load Delivery Challan Item.";


                if (
                    typeof responseData === "string"
                ) {

                    message =
                        responseData;

                }

                else if (
                    responseData?.message
                ) {

                    message =
                        responseData.message;

                }

                else if (
                    responseData?.title
                ) {

                    message =
                        responseData.title;

                }


                setError(message);

            } finally {

                setLoading(false);

            }

        };


        loadItem();

    }, [id]);


    // ========================================================
    // FORMAT CURRENCY
    // ========================================================

    const formatCurrency = (value) => {

        return Number(value ?? 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // ========================================================
    // FORMAT QUANTITY
    // ========================================================

    const formatQuantity = (value) => {

        return Number(value ?? 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }


        const date = new Date(value);


        if (Number.isNaN(date.getTime())) {
            return "-";
        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // ========================================================
    // GET VALUE
    // Supports camelCase + PascalCase
    // ========================================================

    const getValue = (
        camelCase,
        pascalCase,
        defaultValue = null
    ) => {

        if (!item) {
            return defaultValue;
        }


        return (
            item[camelCase] ??
            item[pascalCase] ??
            defaultValue
        );

    };


    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        navigate(
            "/delivery-challan-items"
        );

    };


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <Box sx={{ p: 3 }}>

                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    Loading Delivery Challan Item...
                </Typography>

            </Box>

        );

    }


    // ========================================================
    // ERROR / NO ITEM
    // ========================================================

    if (!item) {

        return (

            <Box sx={{ p: 3 }}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="h6"
                            color="error"
                            sx={{ mb: 2 }}
                        >
                            Delivery Challan Item not found.
                        </Typography>


                        <Button
                            variant="outlined"
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={handleBack}
                        >
                            Back
                        </Button>

                    </CardContent>

                </Card>


                <Snackbar
                    open={Boolean(error)}
                    autoHideDuration={6000}
                    onClose={() => setError("")}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                >

                    <Alert
                        severity="error"
                        variant="filled"
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>

                </Snackbar>

            </Box>

        );

    }


    // ========================================================
    // API VALUES
    // ========================================================

    const deliveryChallanItemId = getValue(
        "deliveryChallanItemId",
        "DeliveryChallanItemId",
        0
    );


    const deliveryChallanId = getValue(
        "deliveryChallanId",
        "DeliveryChallanId",
        0
    );


    const productId = getValue(
        "productId",
        "ProductId",
        0
    );


    const quantity = getValue(
        "quantity",
        "Quantity",
        0
    );


    const unitPrice = getValue(
        "unitPrice",
        "UnitPrice",
        0
    );


    const discount = getValue(
        "discount",
        "Discount",
        0
    );


    const taxAmount = getValue(
        "taxAmount",
        "TaxAmount",
        0
    );


    const totalAmount = getValue(
        "totalAmount",
        "TotalAmount",
        0
    );


    const remarks = getValue(
        "remarks",
        "Remarks",
        ""
    );


    const createdDate = getValue(
        "createdDate",
        "CreatedDate",
        null
    );


    // ========================================================
    // INFO FIELD
    // ========================================================

    const InfoField = ({
        icon,
        label,
        value
    }) => {

        return (

            <Box>

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 0.5 }}
                >

                    {icon}

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {label}
                    </Typography>

                </Stack>


                <Typography
                    variant="body1"
                    fontWeight={600}
                >
                    {value}
                </Typography>

            </Box>

        );

    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box sx={{ p: 3 }}>


            {/* =================================================
                HEADER
            ================================================= */}

            <Stack

                direction="row"

                justifyContent="space-between"

                alignItems="center"

                sx={{ mb: 3 }}

            >

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >

                    <Description
                        color="primary"
                    />

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Delivery Challan Item Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            View Delivery Challan Item information
                        </Typography>

                    </Box>

                </Stack>


                <Button

                    variant="outlined"

                    startIcon={
                        <ArrowBack />
                    }

                    onClick={handleBack}

                >
                    Back
                </Button>

            </Stack>


            {/* =================================================
                ITEM INFORMATION
            ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Item Information
                    </Typography>


                    <Divider
                        sx={{ mb: 3 }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <InfoField

                                icon={
                                    <Numbers
                                        fontSize="small"
                                        color="primary"
                                    />
                                }

                                label="Delivery Challan Item ID"

                                value={
                                    deliveryChallanItemId
                                }

                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <InfoField

                                icon={
                                    <LocalShipping
                                        fontSize="small"
                                        color="primary"
                                    />
                                }

                                label="Delivery Challan ID"

                                value={
                                    deliveryChallanId
                                }

                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <InfoField

                                icon={
                                    <Inventory2
                                        fontSize="small"
                                        color="primary"
                                    />
                                }

                                label="Product ID"

                                value={
                                    productId
                                }

                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <InfoField

                                icon={
                                    <Numbers
                                        fontSize="small"
                                        color="primary"
                                    />
                                }

                                label="Quantity"

                                value={
                                    formatQuantity(
                                        quantity
                                    )
                                }

                            />

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                PRICING DETAILS
            ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Pricing Details
                    </Typography>


                    <Divider
                        sx={{ mb: 3 }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <InfoField

                                icon={
                                    <CurrencyRupee
                                        fontSize="small"
                                        color="primary"
                                    />
                                }

                                label="Unit Price"

                                value={
                                    `₹ ${formatCurrency(unitPrice)}`
                                }

                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <InfoField

                                icon={
                                    <Discount
                                        fontSize="small"
                                        color="primary"
                                    />
                                }

                                label="Discount"

                                value={
                                    `₹ ${formatCurrency(discount)}`
                                }

                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <InfoField

                                icon={
                                    <Receipt
                                        fontSize="small"
                                        color="primary"
                                    />
                                }

                                label="Tax Amount"

                                value={
                                    `₹ ${formatCurrency(taxAmount)}`
                                }

                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Box>

                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ mb: 0.5 }}
                                >

                                    <CurrencyRupee
                                        fontSize="small"
                                        color="success"
                                    />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Total Amount
                                    </Typography>

                                </Stack>


                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="success.main"
                                >

                                    ₹ {formatCurrency(totalAmount)}

                                </Typography>

                            </Box>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                ADDITIONAL INFORMATION
            ================================================= */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Additional Information
                    </Typography>


                    <Divider
                        sx={{ mb: 3 }}
                    />


                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            md={8}
                        >

                            <InfoField

                                icon={
                                    <Notes
                                        fontSize="small"
                                        color="primary"
                                    />
                                }

                                label="Remarks"

                                value={
                                    remarks || "-"
                                }

                            />

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <InfoField

                                icon={
                                    <CalendarToday
                                        fontSize="small"
                                        color="primary"
                                    />
                                }

                                label="Created Date"

                                value={
                                    formatDate(
                                        createdDate
                                    )
                                }

                            />

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                ERROR
            ================================================= */}

            <Snackbar

                open={Boolean(error)}

                autoHideDuration={6000}

                onClose={() => setError("")}

                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}

            >

                <Alert

                    severity="error"

                    variant="filled"

                    onClose={() => setError("")}

                >

                    {error}

                </Alert>

            </Snackbar>


        </Box>

    );

};


export default DeliveryChallanitemDetails;

