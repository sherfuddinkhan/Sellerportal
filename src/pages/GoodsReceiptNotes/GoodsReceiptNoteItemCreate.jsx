import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


/* =========================================================
   API CONFIGURATION
========================================================= */

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/goods-receipt-note-items`;


/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
    GoodsReceiptNoteId: "",
    ProductId: "",
    OrderedQuantity: "",
    ReceivedQuantity: "",
    RejectedQuantity: "",
    UnitPrice: "",
    TotalAmount: "",
    BatchNumber: "",
    ExpiryDate: "",
    Remarks: ""
};


/* =========================================================
   COMPONENT
========================================================= */

const GoodsReceiptNoteItemCreate = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);

    const [loading, setLoading] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    /* =====================================================
       CALCULATE TOTAL
    ===================================================== */

    useEffect(() => {

        const quantity =
            Number(form.ReceivedQuantity || 0);

        const unitPrice =
            Number(form.UnitPrice || 0);

        const total =
            quantity * unitPrice;

        setForm((previous) => ({
            ...previous,
            TotalAmount: total.toFixed(2)
        }));

    }, [
        form.ReceivedQuantity,
        form.UnitPrice
    ]);


    /* =====================================================
       VALIDATION
    ===================================================== */

    const validateForm = () => {

        if (!form.GoodsReceiptNoteId) {
            return "Goods Receipt Note Id is required.";
        }

        if (!form.ProductId) {
            return "Product Id is required.";
        }

        if (!form.ReceivedQuantity) {
            return "Received Quantity is required.";
        }

        return null;
    };


    /* =====================================================
       CREATE
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {

            setSnackbar({
                open: true,
                message: validationError,
                severity: "error"
            });

            return;
        }

        try {

            setLoading(true);

            const payload = {
                GoodsReceiptNoteId:
                    Number(form.GoodsReceiptNoteId),

                ProductId:
                    Number(form.ProductId),

                OrderedQuantity:
                    Number(form.OrderedQuantity || 0),

                ReceivedQuantity:
                    Number(form.ReceivedQuantity || 0),

                RejectedQuantity:
                    Number(form.RejectedQuantity || 0),

                UnitPrice:
                    Number(form.UnitPrice || 0),

                TotalAmount:
                    Number(form.TotalAmount || 0),

                BatchNumber:
                    form.BatchNumber || null,

                ExpiryDate:
                    form.ExpiryDate || null,

                Remarks:
                    form.Remarks || null
            };


            console.log(
                "CREATE GRN ITEM PAYLOAD:",
                payload
            );


            const response =
                await axios.post(
                    API_URL,
                    payload
                );


            console.log(
                "CREATE GRN ITEM RESPONSE:",
                response.data
            );


            setSnackbar({
                open: true,
                message: "Goods Receipt Note Item created successfully.",
                severity: "success"
            });


            setTimeout(() => {

                navigate(
                    "/goods-receipt-note-items"
                );

            }, 1000);


        } catch (error) {

            console.error(
                "CREATE GRN ITEM ERROR:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Failed to create Goods Receipt Note Item.",
                severity: "error"
            });

        } finally {

            setLoading(false);

        }
    };


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

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Create Goods Receipt Note Item
                </Typography>


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

            </Box>


            {/* FORM */}

            <Card>

                <CardContent>

                    <form onSubmit={handleSubmit}>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            mb={2}
                        >
                            GRN Item Information
                        </Typography>


                        <Divider sx={{ mb: 3 }} />


                        <Grid
                            container
                            spacing={2}
                        >

                            {/* GRN ID */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Goods Receipt Note ID"
                                    name="GoodsReceiptNoteId"
                                    type="number"
                                    value={
                                        form.GoodsReceiptNoteId
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </Grid>


                            {/* PRODUCT ID */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Product ID"
                                    name="ProductId"
                                    type="number"
                                    value={
                                        form.ProductId
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </Grid>


                            {/* ORDERED QUANTITY */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Ordered Quantity"
                                    name="OrderedQuantity"
                                    type="number"
                                    value={
                                        form.OrderedQuantity
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* RECEIVED QUANTITY */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Received Quantity"
                                    name="ReceivedQuantity"
                                    type="number"
                                    value={
                                        form.ReceivedQuantity
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                    required
                                />

                            </Grid>


                            {/* REJECTED QUANTITY */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Rejected Quantity"
                                    name="RejectedQuantity"
                                    type="number"
                                    value={
                                        form.RejectedQuantity
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* UNIT PRICE */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Unit Price"
                                    name="UnitPrice"
                                    type="number"
                                    value={
                                        form.UnitPrice
                                    }
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* TOTAL */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Total Amount"
                                    name="TotalAmount"
                                    type="number"
                                    value={
                                        form.TotalAmount
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />

                            </Grid>


                            {/* BATCH */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Batch Number"
                                    name="BatchNumber"
                                    value={
                                        form.BatchNumber
                                    }
                                    onChange={handleChange}
                                />

                            </Grid>


                            {/* EXPIRY */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Expiry Date"
                                    name="ExpiryDate"
                                    type="date"
                                    value={
                                        form.ExpiryDate
                                    }
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true
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
                                    rows={4}
                                    label="Remarks"
                                    name="Remarks"
                                    value={
                                        form.Remarks
                                    }
                                    onChange={handleChange}
                                />

                            </Grid>

                        </Grid>


                        <Divider sx={{ my: 3 }} />


                        {/* ACTIONS */}

                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            gap={2}
                        >

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate(
                                        "/goods-receipt-note-items"
                                    )
                                }
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading
                                        ? <CircularProgress size={20} />
                                        : <Save />
                                }
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Create Item"}
                            </Button>

                        </Box>

                    </form>

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


export default GoodsReceiptNoteItemCreate;

