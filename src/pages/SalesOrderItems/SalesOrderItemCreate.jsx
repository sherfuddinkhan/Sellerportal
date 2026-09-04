
import React, { useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Alert
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import axios from "axios";


// =========================================================
// API
// =========================================================

const SERVER_URL = "http://localhost:5000";

const API_URL = `${SERVER_URL}/api/sales-order-items`;


// =========================================================
// INITIAL FORM
// =========================================================

const initialFormData = {

    SalesOrderId: "",

    ProductId: "",

    LineNumber: "",

    Quantity: "",

    UnitPrice: "",

    TotalAmount: "",

    TaxAmount: "",

    DiscountAmount: "",

    Remarks: ""

};


// =========================================================
// CREATE
// =========================================================

const SalesOrderItemCreate = () => {

    const navigate = useNavigate();

    const [formData, setFormData] =
        useState(initialFormData);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        if (!formData.SalesOrderId) {
            return "Sales Order ID is required.";
        }

        if (!formData.ProductId) {
            return "Product ID is required.";
        }

        if (
            !formData.Quantity ||
            Number(formData.Quantity) <= 0
        ) {
            return "Quantity must be greater than 0.";
        }

        if (
            formData.UnitPrice === "" ||
            Number(formData.UnitPrice) < 0
        ) {
            return "Unit Price cannot be negative.";
        }

        return "";

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        const validationError = validate();

        if (validationError) {

            setError(validationError);

            return;
        }


        try {

            setLoading(true);


            const payload = {

                SalesOrderId:
                    Number(formData.SalesOrderId),

                ProductId:
                    Number(formData.ProductId),

                LineNumber:
                    Number(formData.LineNumber || 0),

                Quantity:
                    Number(formData.Quantity || 0),

                UnitPrice:
                    Number(formData.UnitPrice || 0),

                TotalAmount:
                    Number(formData.TotalAmount || 0),

                TaxAmount:
                    Number(formData.TaxAmount || 0),

                DiscountAmount:
                    Number(formData.DiscountAmount || 0),

                Remarks:
                    formData.Remarks.trim()

            };


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


            navigate("/sales-order-items");

        } catch (err) {

            console.error(
                "Create Sales Order Item error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create Sales Order Item."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Create Sales Order Item
                </Typography>


                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/sales-order-items")
                    }
                >
                    Back
                </Button>

            </Box>


            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

            )}


            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Grid
                            container
                            spacing={3}
                        >

                            {/* SALES ORDER ID */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Sales Order ID"
                                    name="SalesOrderId"
                                    value={
                                        formData.SalesOrderId
                                    }
                                    onChange={handleChange}
                                />

                            </Grid>


                            {/* PRODUCT ID */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Product ID"
                                    name="ProductId"
                                    value={
                                        formData.ProductId
                                    }
                                    onChange={handleChange}
                                />

                            </Grid>


                            {/* LINE NUMBER */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Line Number"
                                    name="LineNumber"
                                    value={
                                        formData.LineNumber
                                    }
                                    onChange={handleChange}
                                />

                            </Grid>


                            {/* QUANTITY */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Quantity"
                                    name="Quantity"
                                    value={
                                        formData.Quantity
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "any"
                                    }}
                                />

                            </Grid>


                            {/* UNIT PRICE */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Unit Price"
                                    name="UnitPrice"
                                    value={
                                        formData.UnitPrice
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "any"
                                    }}
                                />

                            </Grid>


                            {/* DISCOUNT */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Discount Amount"
                                    name="DiscountAmount"
                                    value={
                                        formData.DiscountAmount
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "any"
                                    }}
                                />

                            </Grid>


                            {/* TAX */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Tax Amount"
                                    name="TaxAmount"
                                    value={
                                        formData.TaxAmount
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "any"
                                    }}
                                />

                            </Grid>


                            {/* TOTAL */}

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Amount"
                                    name="TotalAmount"
                                    value={
                                        formData.TotalAmount
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "any"
                                    }}
                                />

                            </Grid>


                            {/* REMARKS */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Remarks"
                                    name="Remarks"
                                    value={
                                        formData.Remarks
                                    }
                                    onChange={handleChange}
                                />

                            </Grid>


                            {/* ACTIONS */}

                            <Grid
                                item
                                xs={12}
                            >

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "flex-end",
                                        gap: 2
                                    }}
                                >

                                    <Button
                                        color="inherit"
                                        onClick={() =>
                                            navigate(
                                                "/sales-order-items"
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>


                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<Save />}
                                        disabled={loading}
                                    >

                                        {loading
                                            ? "Saving..."
                                            : "Create Item"}

                                    </Button>

                                </Box>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );

};


export default SalesOrderItemCreate;

