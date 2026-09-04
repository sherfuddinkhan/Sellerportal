import React, { useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";


// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/sales-orders`;


// =========================================================
// COMPONENT
// =========================================================

const SalesOrderCreate = () => {

    const navigate = useNavigate();


    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({

        SellerId: "",

        CustomerId: "",

        SalesOrderNumber: "",

        OrderDate: new Date()
            .toISOString()
            .split("T")[0],

        Status: "Pending",

        TotalAmount: "",

        Remarks: ""

    });


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


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

    };


    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {

        if (!formData.SellerId) {

            return "Seller ID is required.";

        }


        if (
            Number(formData.SellerId) <= 0
        ) {

            return "Enter a valid Seller ID.";

        }


        if (!formData.CustomerId) {

            return "Customer ID is required.";

        }


        if (
            Number(formData.CustomerId) <= 0
        ) {

            return "Enter a valid Customer ID.";

        }


        if (!formData.OrderDate) {

            return "Order Date is required.";

        }


        if (
            formData.TotalAmount === "" ||
            Number(formData.TotalAmount) < 0
        ) {

            return "Enter a valid Total Amount.";

        }


        if (!formData.Status) {

            return "Status is required.";

        }


        return "";

    };


    // =====================================================
    // CREATE SALES ORDER
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        // =================================================
        // VALIDATION
        // =================================================

        const validationError =
            validateForm();


        if (validationError) {

            setError(validationError);

            return;

        }


        try {

            setLoading(true);


            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {

                SellerId:
                    Number(
                        formData.SellerId
                    ),

                CustomerId:
                    Number(
                        formData.CustomerId
                    ),

                SalesOrderNumber:
                    formData.SalesOrderNumber
                        .trim(),

                OrderDate:
                    formData.OrderDate,

                Status:
                    formData.Status,

                TotalAmount:
                    Number(
                        formData.TotalAmount
                    ),

                Remarks:
                    formData.Remarks
                        .trim()

            };


            console.log(
                "CREATE SALES ORDER PAYLOAD:",
                payload
            );


            // =================================================
            // POST
            // =================================================

            const response =
                await axios.post(
                    API_URL,
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            console.log(
                "CREATE SALES ORDER RESPONSE:",
                response.data
            );


            setSuccess(
                "Sales Order created successfully."
            );


            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/sales-orders"
                );

            }, 1000);

        }
        catch (err) {

            console.error(
                "CREATE SALES ORDER ERROR:",
                err
            );


            setError(

                err.response?.data?.message ||

                err.response?.data?.title ||

                "Failed to create Sales Order."

            );

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        navigate(
            "/sales-orders"
        );

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            className="sales-order-create"
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
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Create Sales Order
                </Typography>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                    disabled={loading}
                >
                    Back to Sales Orders
                </Button>

            </Box>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 3
                    }}
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
                    sx={{
                        mb: 3
                    }}
                >
                    {success}
                </Alert>

            )}


            {/* =================================================
                FORM CARD
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =================================================
                            SELLER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Seller ID"
                                name="SellerId"
                                value={
                                    formData.SellerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            CUSTOMER ID
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Customer ID"
                                name="CustomerId"
                                value={
                                    formData.CustomerId
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            SALES ORDER NUMBER
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                label="Sales Order Number"
                                name="SalesOrderNumber"
                                value={
                                    formData.SalesOrderNumber
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="SO-0001"
                            />

                        </Grid>


                        {/* =================================================
                            ORDER DATE
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Order Date"
                                name="OrderDate"
                                value={
                                    formData.OrderDate
                                }
                                onChange={
                                    handleChange
                                }
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                select
                                required
                                label="Status"
                                name="Status"
                                value={
                                    formData.Status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <MenuItem value="Pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="Confirmed">
                                    Confirmed
                                </MenuItem>

                                <MenuItem value="Processing">
                                    Processing
                                </MenuItem>

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="Cancelled">
                                    Cancelled
                                </MenuItem>

                            </TextField>

                        </Grid>


                        {/* =================================================
                            TOTAL AMOUNT
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                        >

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Total Amount"
                                name="TotalAmount"
                                value={
                                    formData.TotalAmount
                                }
                                onChange={
                                    handleChange
                                }
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />

                        </Grid>


                        {/* =================================================
                            REMARKS
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                label="Remarks"
                                name="Remarks"
                                value={
                                    formData.Remarks
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter sales order remarks..."
                            />

                        </Grid>


                        {/* =================================================
                            FORM ACTIONS
                        ================================================= */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2,
                                    mt: 1
                                }}
                            >

                                <Button
                                    variant="outlined"
                                    onClick={
                                        handleCancel
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
                                            : (
                                                <Save />
                                            )
                                    }
                                    disabled={
                                        loading
                                    }
                                >
                                    {loading
                                        ? "Creating..."
                                        : "Create Sales Order"}
                                </Button>

                            </Box>

                        </Grid>

                    </Grid>

                </Box>

            </Paper>

        </Box>

    );

};


export default SalesOrderCreate;

