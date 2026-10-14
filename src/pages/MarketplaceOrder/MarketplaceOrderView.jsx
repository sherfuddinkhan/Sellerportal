import React, { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Grid,
    Divider,
    Chip
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate,
    useParams
} from "react-router-dom";


/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/marketplace-orders`;


/* =========================================================
   MARKETPLACE ORDER VIEW
========================================================= */

const MarketplaceOrderView = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    /* =====================================================
       STATE
    ===================================================== */

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =====================================================
       GET VALUE
       Supports camelCase + PascalCase
    ===================================================== */

    const getValue = (
        data,
        camelCase,
        pascalCase,
        defaultValue = "-"
    ) => {

        const value =
            data?.[camelCase] ??
            data?.[pascalCase];

        return value !== null &&
            value !== undefined &&
            value !== ""
            ? value
            : defaultValue;
    };


    /* =====================================================
       FETCH MARKETPLACE ORDER
    ===================================================== */

    const fetchOrder = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await axios.get(
                `${API_URL}/${id}`
            );


            console.log(
                "MARKETPLACE ORDER VIEW RESPONSE:",
                response.data
            );


            /*
             * Supports:
             *
             * response.data
             * response.data.data
             * response.data.result
             */

            const responseData =
                response.data?.data ??
                response.data?.result ??
                response.data;


            setOrder(responseData);

        } catch (error) {

            console.error(
                "MARKETPLACE ORDER VIEW ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Failed to load Marketplace Order."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD ORDER
    ===================================================== */

    useEffect(() => {

        if (id) {

            fetchOrder();

        }

    }, [id]);


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {

        navigate(
            "/marketplace-orders"
        );

    };


    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = () => {

        navigate(
            `/marketplace-orders/edit/${id}`
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <Box
                sx={{
                    p: 4,
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


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Marketplace Orders
                </Button>

            </Box>

        );

    }


    /* =====================================================
       ORDER NOT FOUND
    ===================================================== */

    if (!order) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert
                    severity="warning"
                    sx={{ mb: 3 }}
                >
                    Marketplace Order not found.
                </Alert>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Marketplace Orders
                </Button>

            </Box>

        );

    }


    /* =====================================================
       NORMALIZED VALUES
    ===================================================== */

    const orderId = getValue(
        order,
        "id",
        "Id"
    );


    const orderNumber = getValue(
        order,
        "orderNumber",
        "OrderNumber"
    );


    const marketplaceOrderId = getValue(
        order,
        "marketplaceOrderId",
        "MarketplaceOrderId"
    );


    const marketplace = getValue(
        order,
        "marketplace",
        "Marketplace"
    );


    const sellerId = getValue(
        order,
        "sellerId",
        "SellerId"
    );


    const customerId = getValue(
        order,
        "customerId",
        "CustomerId"
    );


    const marketplaceOrderNumber = getValue(
        order,
        "marketplaceOrderNumber",
        "MarketplaceOrderNumber"
    );


    const orderDate = getValue(
        order,
        "orderDate",
        "OrderDate"
    );


    const status = getValue(
        order,
        "status",
        "Status"
    );


    const paymentStatus = getValue(
        order,
        "paymentStatus",
        "PaymentStatus"
    );


    const fulfillmentStatus = getValue(
        order,
        "fulfillmentStatus",
        "FulfillmentStatus"
    );


    const customerName = getValue(
        order,
        "customerName",
        "CustomerName"
    );


    const customerEmail = getValue(
        order,
        "customerEmail",
        "CustomerEmail"
    );


    const customerPhone = getValue(
        order,
        "customerPhone",
        "CustomerPhone"
    );


    const shippingAddress = getValue(
        order,
        "shippingAddress",
        "ShippingAddress"
    );


    const billingAddress = getValue(
        order,
        "billingAddress",
        "BillingAddress"
    );


    const subtotal = getValue(
        order,
        "subtotal",
        "Subtotal",
        "0"
    );


    const taxAmount = getValue(
        order,
        "taxAmount",
        "TaxAmount",
        "0"
    );


    const shippingAmount = getValue(
        order,
        "shippingAmount",
        "ShippingAmount",
        "0"
    );


    const discountAmount = getValue(
        order,
        "discountAmount",
        "DiscountAmount",
        "0"
    );


    const totalAmount = getValue(
        order,
        "totalAmount",
        "TotalAmount",
        "0"
    );


    const currency = getValue(
        order,
        "currency",
        "Currency",
        "INR"
    );


    const paymentMethod = getValue(
        order,
        "paymentMethod",
        "PaymentMethod"
    );


    const marketplaceOrderItems =
        order?.marketplaceOrderItems ??
        order?.MarketplaceOrderItems ??
        order?.items ??
        order?.Items ??
        [];


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (value) => {

        if (
            !value ||
            value === "-"
        ) {

            return "-";

        }


        const date = new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return value;

        }


        return date.toLocaleString();

    };


    /* =====================================================
       FORMAT MONEY
    ===================================================== */

    const formatMoney = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "₹0.00";

        }


        const number =
            Number(value);


        if (
            Number.isNaN(number)
        ) {

            return `${currency} ${value}`;

        }


        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency:
                    currency === "-"
                        ? "INR"
                        : currency
            }
        ).format(number);

    };


    /* =====================================================
       STATUS COLOR
    ===================================================== */

    const getStatusColor = (value) => {

        const normalized =
            String(value)
                .toLowerCase();


        if (
            normalized.includes("cancel")
        ) {

            return "error";

        }


        if (
            normalized.includes("complete") ||
            normalized.includes("delivered") ||
            normalized.includes("success")
        ) {

            return "success";

        }


        if (
            normalized.includes("pending") ||
            normalized.includes("processing")
        ) {

            return "warning";

        }


        return "default";

    };


    /* =====================================================
       FIELD COMPONENT
    ===================================================== */

    const DetailField = ({
        label,
        value
    }) => (

        <Box>

            <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={0.5}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                    wordBreak: "break-word"
                }}
            >
                {value}
            </Typography>

        </Box>

    );


    /* =====================================================
       RENDER
    ===================================================== */

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
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
                mb={3}
            >

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back
                    </Button>


                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            Marketplace Order
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            View Marketplace Order details
                        </Typography>

                    </Box>

                </Box>


                <Box
                    display="flex"
                    gap={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={fetchOrder}
                    >
                        Refresh
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
                ORDER HEADER
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flexWrap="wrap"
                    gap={2}
                >

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {orderNumber}
                        </Typography>


                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Marketplace Order ID: {orderId}
                        </Typography>

                    </Box>


                    <Box
                        display="flex"
                        gap={1}
                        flexWrap="wrap"
                    >

                        <Chip
                            label={marketplace}
                            variant="outlined"
                        />


                        <Chip
                            label={status}
                            color={
                                getStatusColor(status)
                            }
                        />

                    </Box>

                </Box>

            </Paper>


            {/* =================================================
                ORDER INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Order Information
                </Typography>


                <Divider sx={{ mb: 3 }} />


                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Order ID"
                            value={orderId}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Order Number"
                            value={orderNumber}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Marketplace"
                            value={marketplace}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Marketplace Order ID"
                            value={marketplaceOrderId}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Marketplace Order Number"
                            value={marketplaceOrderNumber}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Order Date"
                            value={formatDate(orderDate)}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Seller ID"
                            value={sellerId}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Customer ID"
                            value={customerId}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Fulfillment Status"
                            value={fulfillmentStatus}
                        />

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                CUSTOMER INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Customer Information
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

                        <DetailField
                            label="Customer Name"
                            value={customerName}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <DetailField
                            label="Email"
                            value={customerEmail}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <DetailField
                            label="Phone"
                            value={customerPhone}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField
                            label="Shipping Address"
                            value={shippingAddress}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <DetailField
                            label="Billing Address"
                            value={billingAddress}
                        />

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                PAYMENT INFORMATION
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Payment Information
                </Typography>


                <Divider sx={{ mb: 3 }} />


                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Payment Method"
                            value={paymentMethod}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Payment Status"
                            value={paymentStatus}
                        />

                    </Grid>


                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <DetailField
                            label="Currency"
                            value={currency}
                        />

                    </Grid>

                </Grid>

            </Paper>


            {/* =================================================
                ORDER ITEMS
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Order Items
                </Typography>


                <Divider sx={{ mb: 3 }} />


                {marketplaceOrderItems.length === 0 ? (

                    <Alert severity="info">
                        No Marketplace Order Items found.
                    </Alert>

                ) : (

                    <Box>

                        {marketplaceOrderItems.map(
                            (item, index) => {

                                const itemId =
                                    getValue(
                                        item,
                                        "id",
                                        "Id",
                                        index + 1
                                    );


                                const sku =
                                    getValue(
                                        item,
                                        "sku",
                                        "Sku"
                                    );


                                const productName =
                                    getValue(
                                        item,
                                        "productName",
                                        "ProductName"
                                    );


                                const quantity =
                                    getValue(
                                        item,
                                        "quantity",
                                        "Quantity",
                                        0
                                    );


                                const unitPrice =
                                    getValue(
                                        item,
                                        "unitPrice",
                                        "UnitPrice",
                                        0
                                    );


                                const itemTotal =
                                    getValue(
                                        item,
                                        "totalPrice",
                                        "TotalPrice",
                                        0
                                    );


                                return (

                                    <Box
                                        key={itemId}
                                        sx={{
                                            py: 2,
                                            borderBottom:
                                                index <
                                                marketplaceOrderItems.length - 1
                                                    ? "1px solid"
                                                    : "none",
                                            borderColor:
                                                "divider"
                                        }}
                                    >

                                        <Grid
                                            container
                                            spacing={2}
                                        >

                                            <Grid
                                                item
                                                xs={12}
                                                md={3}
                                            >

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Product
                                                </Typography>

                                                <Typography
                                                    fontWeight={600}
                                                >
                                                    {productName}
                                                </Typography>

                                            </Grid>


                                            <Grid
                                                item
                                                xs={12}
                                                sm={4}
                                                md={2}
                                            >

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    SKU
                                                </Typography>

                                                <Typography>
                                                    {sku}
                                                </Typography>

                                            </Grid>


                                            <Grid
                                                item
                                                xs={12}
                                                sm={4}
                                                md={2}
                                            >

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Quantity
                                                </Typography>

                                                <Typography>
                                                    {quantity}
                                                </Typography>

                                            </Grid>


                                            <Grid
                                                item
                                                xs={12}
                                                sm={4}
                                                md={2}
                                            >

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Unit Price
                                                </Typography>

                                                <Typography>
                                                    {formatMoney(
                                                        unitPrice
                                                    )}
                                                </Typography>

                                            </Grid>


                                            <Grid
                                                item
                                                xs={12}
                                                md={3}
                                            >

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Total
                                                </Typography>

                                                <Typography
                                                    fontWeight={600}
                                                >
                                                    {formatMoney(
                                                        itemTotal
                                                    )}
                                                </Typography>

                                            </Grid>

                                        </Grid>

                                    </Box>

                                );

                            }
                        )}

                    </Box>

                )}

            </Paper>


            {/* =================================================
                ORDER TOTALS
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    mb={2}
                >
                    Order Summary
                </Typography>


                <Divider sx={{ mb: 3 }} />


                <Box
                    sx={{
                        maxWidth: 450,
                        ml: "auto"
                    }}
                >

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                    >

                        <Typography>
                            Subtotal
                        </Typography>

                        <Typography>
                            {formatMoney(subtotal)}
                        </Typography>

                    </Box>


                    <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                    >

                        <Typography>
                            Discount
                        </Typography>

                        <Typography>
                            - {formatMoney(discountAmount)}
                        </Typography>

                    </Box>


                    <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                    >

                        <Typography>
                            Tax
                        </Typography>

                        <Typography>
                            {formatMoney(taxAmount)}
                        </Typography>

                    </Box>


                    <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={2}
                    >

                        <Typography>
                            Shipping
                        </Typography>

                        <Typography>
                            {formatMoney(shippingAmount)}
                        </Typography>

                    </Box>


                    <Divider sx={{ mb: 2 }} />


                    <Box
                        display="flex"
                        justifyContent="space-between"
                    >

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Total
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {formatMoney(totalAmount)}
                        </Typography>

                    </Box>

                </Box>

            </Paper>


            {/* =================================================
                BOTTOM BUTTONS
            ================================================= */}

            <Box
                display="flex"
                justifyContent="flex-end"
                gap={2}
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
                    Edit Marketplace Order
                </Button>

            </Box>

        </Box>

    );

};


export default MarketplaceOrderView;
