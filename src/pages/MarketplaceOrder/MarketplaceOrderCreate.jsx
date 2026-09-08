// =========================================================
// MarketplaceOrderCreate.jsx
// =========================================================

import React, { useState } from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";


const SERVER_URL = "http://localhost:5000";


const MarketplaceOrderCreate = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [formData, setFormData] = useState({

        marketplaceAccountId: "",

        marketplaceOrderNumber: "",

        externalOrderId: "",

        sellerOrderNumber: "",

        orderDate: "",

        orderStatus: "Pending",

        fulfillmentChannel: "",

        currency: "INR",

        totalAmount: "",

        buyerName: "",

        buyerEmail: "",

        purchaseOrderNumber: ""

    });


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));


        setError("");

        setSuccess("");
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (
            !formData.marketplaceOrderNumber.trim()
        ) {

            setError(
                "Marketplace order number is required."
            );

            return;
        }


        if (
            !formData.orderStatus.trim()
        ) {

            setError(
                "Order status is required."
            );

            return;
        }


        try {

            setLoading(true);


            // -------------------------------------------------
            // PAYLOAD
            // -------------------------------------------------

            const payload = {

                marketplaceAccountId:
                    formData.marketplaceAccountId
                        ? Number(
                            formData.marketplaceAccountId
                        )
                        : null,

                marketplaceOrderNumber:
                    formData.marketplaceOrderNumber
                        .trim(),

                externalOrderId:
                    formData.externalOrderId
                        .trim() || null,

                sellerOrderNumber:
                    formData.sellerOrderNumber
                        .trim() || null,

                orderDate:
                    formData.orderDate
                        ? new Date(
                            formData.orderDate
                        ).toISOString()
                        : null,

                orderStatus:
                    formData.orderStatus
                        .trim(),

                fulfillmentChannel:
                    formData.fulfillmentChannel
                        .trim() || null,

                currency:
                    formData.currency
                        .trim() || "INR",

                totalAmount:
                    formData.totalAmount !== ""
                        ? Number(
                            formData.totalAmount
                        )
                        : 0,

                buyerName:
                    formData.buyerName
                        .trim() || null,

                buyerEmail:
                    formData.buyerEmail
                        .trim() || null,

                purchaseOrderNumber:
                    formData.purchaseOrderNumber
                        .trim() || null

            };


            console.log(
                "MARKETPLACE ORDER CREATE PAYLOAD:",
                payload
            );


            // -------------------------------------------------
            // POST
            // -------------------------------------------------

            const response = await axios.post(
                `${SERVER_URL}/api/MarketplaceOrder`,
                payload
            );


            console.log(
                "MARKETPLACE ORDER CREATED:",
                response.data
            );


            setSuccess(
                "Marketplace order created successfully."
            );


            // -------------------------------------------------
            // GET CREATED ORDER ID
            // -------------------------------------------------

            const createdOrderId =
                response.data?.marketplaceOrderId ??
                response.data?.MarketplaceOrderId;


            // -------------------------------------------------
            // NAVIGATE TO DETAILS
            // -------------------------------------------------

            if (createdOrderId) {

                setTimeout(() => {

                    navigate(
                        `/marketplace-orders/details/${createdOrderId}`
                    );

                }, 700);

            } else {

                setTimeout(() => {

                    navigate(
                        "/marketplace-orders"
                    );

                }, 700);
            }


        } catch (err) {

            console.error(
                "CREATE MARKETPLACE ORDER ERROR:",
                err
            );


            console.error(
                "CREATE MARKETPLACE ORDER RESPONSE:",
                err.response?.data
            );


            if (
                typeof err.response?.data ===
                "string"
            ) {

                setError(
                    err.response.data
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    "Unable to create marketplace order."
                );
            }

        } finally {

            setLoading(false);

        }
    };


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
                        Create Marketplace Order
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Create a new marketplace order
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/marketplace-orders"
                        )
                    }
                    disabled={loading}
                >
                    Back
                </Button>

            </Box>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            )}


            {success && (

                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 4
                    }
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    {/* =========================================
                        ORDER INFORMATION
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Order Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr"
                            },
                            gap: 2,
                            mb: 4
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Marketplace Account ID"
                            name="marketplaceAccountId"
                            type="number"
                            value={
                                formData.marketplaceAccountId
                            }
                            onChange={handleChange}
                            disabled={loading}
                        />


                        <TextField
                            fullWidth
                            required
                            label="Marketplace Order Number"
                            name="marketplaceOrderNumber"
                            value={
                                formData.marketplaceOrderNumber
                            }
                            onChange={handleChange}
                            disabled={loading}
                        />


                        <TextField
                            fullWidth
                            label="External Order ID"
                            name="externalOrderId"
                            value={
                                formData.externalOrderId
                            }
                            onChange={handleChange}
                            disabled={loading}
                        />


                        <TextField
                            fullWidth
                            label="Seller Order Number"
                            name="sellerOrderNumber"
                            value={
                                formData.sellerOrderNumber
                            }
                            onChange={handleChange}
                            disabled={loading}
                        />


                        <TextField
                            fullWidth
                            label="Order Date"
                            name="orderDate"
                            type="datetime-local"
                            value={
                                formData.orderDate
                            }
                            onChange={handleChange}
                            disabled={loading}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />


                        <TextField
                            fullWidth
                            required
                            select
                            label="Order Status"
                            name="orderStatus"
                            value={
                                formData.orderStatus
                            }
                            onChange={handleChange}
                            disabled={loading}
                        >

                            <MenuItem value="Pending">
                                Pending
                            </MenuItem>

                            <MenuItem value="Requested">
                                Requested
                            </MenuItem>

                            <MenuItem value="Processing">
                                Processing
                            </MenuItem>

                            <MenuItem value="Shipped">
                                Shipped
                            </MenuItem>

                            <MenuItem value="Delivered">
                                Delivered
                            </MenuItem>

                            <MenuItem value="Cancelled">
                                Cancelled
                            </MenuItem>

                        </TextField>


                        <TextField
                            fullWidth
                            label="Fulfillment Channel"
                            name="fulfillmentChannel"
                            value={
                                formData.fulfillmentChannel
                            }
                            onChange={handleChange}
                            disabled={loading}
                        />


                        <TextField
                            fullWidth
                            label="Currency"
                            name="currency"
                            value={
                                formData.currency
                            }
                            onChange={handleChange}
                            disabled={loading}
                        />


                        <TextField
                            fullWidth
                            label="Total Amount"
                            name="totalAmount"
                            type="number"
                            value={
                                formData.totalAmount
                            }
                            onChange={handleChange}
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />


                        <TextField
                            fullWidth
                            label="Purchase Order Number"
                            name="purchaseOrderNumber"
                            value={
                                formData.purchaseOrderNumber
                            }
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </Box>


                    {/* =========================================
                        BUYER INFORMATION
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Buyer Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr"
                            },
                            gap: 2,
                            mb: 4
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Buyer Name"
                            name="buyerName"
                            value={
                                formData.buyerName
                            }
                            onChange={handleChange}
                            disabled={loading}
                        />


                        <TextField
                            fullWidth
                            label="Buyer Email"
                            name="buyerEmail"
                            type="email"
                            value={
                                formData.buyerEmail
                            }
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </Box>


                    {/* =========================================
                        ACTIONS
                    ========================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    "/marketplace-orders"
                                )
                            }
                            disabled={loading}
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                loading
                                    ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    )
                                    : <Save />
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create Order"}
                        </Button>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};


export default MarketplaceOrderCreate;

