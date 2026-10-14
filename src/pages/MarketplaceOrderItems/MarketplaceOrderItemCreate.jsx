import React, { useState } from "react";

import {
    Box,
    Typography,
    Alert,
    Button,
    CircularProgress,
    TextField,
    Paper,
    Grid
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import axios from "axios";

import { useNavigate } from "react-router-dom";


/* =========================================================
   SERVER URL
========================================================= */

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/marketplace-order-items`;


/* =========================================================
   MARKETPLACE ORDER ITEM CREATE
========================================================= */

const MarketplaceOrderItemCreate = () => {

    const navigate = useNavigate();


    /* =====================================================
       FORM DATA
    ===================================================== */

    const [formData, setFormData] = useState({

        marketplaceOrderId: "",
        marketplaceOrderItemId: "",
        orderItemId: "",
        marketplace: "",
        sku: "",
        productName: "",
        quantity: "",
        unitPrice: "",
        totalPrice: "",
        status: ""

    });


    /* =====================================================
       STATE
    ===================================================== */

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    /* =====================================================
       CREATE ITEM
    ===================================================== */

    const handleCreate = async (event) => {

        event.preventDefault();

        try {

            setLoading(true);

            setError("");

            setSuccess("");


            /* =============================================
               PREPARE DATA
            ============================================= */

            const data = {

                marketplaceOrderId:
                    formData.marketplaceOrderId
                        ? Number(formData.marketplaceOrderId)
                        : null,

                marketplaceOrderItemId:
                    formData.marketplaceOrderItemId
                        ? formData.marketplaceOrderItemId
                        : null,

                orderItemId:
                    formData.orderItemId
                        ? Number(formData.orderItemId)
                        : null,

                marketplace:
                    formData.marketplace || null,

                sku:
                    formData.sku || null,

                productName:
                    formData.productName || null,

                quantity:
                    formData.quantity
                        ? Number(formData.quantity)
                        : 0,

                unitPrice:
                    formData.unitPrice
                        ? Number(formData.unitPrice)
                        : 0,

                totalPrice:
                    formData.totalPrice
                        ? Number(formData.totalPrice)
                        : 0,

                status:
                    formData.status || null

            };


            console.log(
                "CREATE MARKETPLACE ORDER ITEM REQUEST:",
                data
            );


            /* =============================================
               API CALL
            ============================================= */

            const response = await axios.post(
                API_URL,
                data
            );


            console.log(
                "CREATE MARKETPLACE ORDER ITEM RESPONSE:",
                response.data
            );


            setSuccess(
                "Marketplace Order Item created successfully."
            );


            /* =============================================
               REDIRECT TO LIST
            ============================================= */

            setTimeout(() => {

                navigate(
                    "/marketplace-order-items"
                );

            }, 800);


        } catch (error) {

            console.error(
                "CREATE MARKETPLACE ORDER ITEM ERROR:",
                error
            );


            setError(

                error.response?.data?.message ||

                error.response?.data?.title ||

                error.response?.data?.errors
                    ? JSON.stringify(
                        error.response.data.errors
                    )
                    : "Failed to create Marketplace Order Item."

            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {

        navigate(
            "/marketplace-order-items"
        );

    };


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
                alignItems="center"
                gap={2}
                mb={3}
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
                        Create Marketplace Order Item
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Add a new Marketplace Order Item
                    </Typography>

                </Box>

            </Box>


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                >
                    {success}
                </Alert>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleCreate}
                >

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =====================================
                            MARKETPLACE ORDER ID
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Marketplace Order ID"
                                name="marketplaceOrderId"
                                value={
                                    formData.marketplaceOrderId
                                }
                                onChange={handleChange}
                                type="number"
                            />

                        </Grid>


                        {/* =====================================
                            MARKETPLACE ORDER ITEM ID
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Marketplace Order Item ID"
                                name="marketplaceOrderItemId"
                                value={
                                    formData.marketplaceOrderItemId
                                }
                                onChange={handleChange}
                            />

                        </Grid>


                        {/* =====================================
                            ORDER ITEM ID
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Order Item ID"
                                name="orderItemId"
                                value={
                                    formData.orderItemId
                                }
                                onChange={handleChange}
                                type="number"
                            />

                        </Grid>


                        {/* =====================================
                            MARKETPLACE
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Marketplace"
                                name="marketplace"
                                value={
                                    formData.marketplace
                                }
                                onChange={handleChange}
                                placeholder="Amazon / Flipkart / Meesho"
                            />

                        </Grid>


                        {/* =====================================
                            SKU
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="SKU"
                                name="sku"
                                value={
                                    formData.sku
                                }
                                onChange={handleChange}
                            />

                        </Grid>


                        {/* =====================================
                            PRODUCT NAME
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Product Name"
                                name="productName"
                                value={
                                    formData.productName
                                }
                                onChange={handleChange}
                            />

                        </Grid>


                        {/* =====================================
                            QUANTITY
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Quantity"
                                name="quantity"
                                value={
                                    formData.quantity
                                }
                                onChange={handleChange}
                                type="number"
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            UNIT PRICE
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Unit Price"
                                name="unitPrice"
                                value={
                                    formData.unitPrice
                                }
                                onChange={handleChange}
                                type="number"
                                inputProps={{
                                    step: "0.01",
                                    min: 0
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            TOTAL PRICE
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <TextField
                                fullWidth
                                label="Total Price"
                                name="totalPrice"
                                value={
                                    formData.totalPrice
                                }
                                onChange={handleChange}
                                type="number"
                                inputProps={{
                                    step: "0.01",
                                    min: 0
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            STATUS
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Status"
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={handleChange}
                                placeholder="Pending"
                            />

                        </Grid>


                        {/* =====================================
                            BUTTONS
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                                mt={2}
                            >

                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
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
                                            : (
                                                <Save />
                                            )
                                    }
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Creating..."
                                        : "Create Item"
                                    }

                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>

    );

};


export default MarketplaceOrderItemCreate;
