// ============================================================
// DeliveryChallanItemCreate.jsx
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
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

// ============================================================
// CONFIG
// ============================================================

const SERVER_URL = "http://localhost:5000";

// ============================================================
// COMPONENT
// ============================================================

const DeliveryChallanItemCreate = () => {

    const navigate = useNavigate();
    const { challanId } = useParams();

    // ========================================================
    // STATE
    // ========================================================

    const [formData, setFormData] = useState({
        deliveryChallanId: challanId || "",
        salesOrderItemId: "",
        productId: "",
        quantity: "",
        unitPrice: "",
        totalAmount: "",
        remarks: ""
    });

    const [loading, setLoading] = useState(false);
    const [loadingChallan, setLoadingChallan] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // ========================================================
    // LOAD DELIVERY CHALLAN
    // ========================================================

    useEffect(() => {

        if (!challanId) {
            return;
        }

        const loadDeliveryChallan = async () => {

            try {

                setLoadingChallan(true);

                const response = await axios.get(
                    `${SERVER_URL}/api/delivery-challans/${Number(challanId)}`,
                    {
                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

                const challan = response.data;

                setFormData((previous) => ({
                    ...previous,
                    deliveryChallanId:
                        challan.deliveryChallanId ??
                        challan.DeliveryChallanId ??
                        challanId
                }));

            } catch (err) {

                console.error(
                    "Failed to load delivery challan:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load delivery challan."
                );

            } finally {

                setLoadingChallan(false);
            }
        };

        loadDeliveryChallan();

    }, [challanId]);

    // ========================================================
    // HANDLE CHANGE
    // ========================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };

    // ========================================================
    // CALCULATE TOTAL
    // ========================================================

    useEffect(() => {

        const quantity = Number(formData.quantity) || 0;
        const unitPrice = Number(formData.unitPrice) || 0;

        const total = quantity * unitPrice;

        setFormData((previous) => ({
            ...previous,
            totalAmount: total > 0 ? total.toFixed(2) : ""
        }));

    }, [
        formData.quantity,
        formData.unitPrice
    ]);

    // ========================================================
    // VALIDATION
    // ========================================================

    const validateForm = () => {

        if (!formData.deliveryChallanId) {
            setError("Delivery Challan ID is required.");
            return false;
        }

        if (!formData.productId) {
            setError("Product ID is required.");
            return false;
        }

        if (!formData.quantity) {
            setError("Quantity is required.");
            return false;
        }

        if (Number(formData.quantity) <= 0) {
            setError("Quantity must be greater than zero.");
            return false;
        }

        if (
            formData.unitPrice !== "" &&
            Number(formData.unitPrice) < 0
        ) {
            setError("Unit price cannot be negative.");
            return false;
        }

        return true;
    };

    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {

            setLoading(true);
            setError("");

            // =================================================
            // PAYLOAD
            // =================================================

            const payload = {
                deliveryChallanId: Number(
                    formData.deliveryChallanId
                ),

                salesOrderItemId:
                    formData.salesOrderItemId
                        ? Number(formData.salesOrderItemId)
                        : null,

                productId: Number(
                    formData.productId
                ),

                quantity: Number(
                    formData.quantity
                ),

                unitPrice:
                    formData.unitPrice !== ""
                        ? Number(formData.unitPrice)
                        : 0,

                totalAmount:
                    formData.totalAmount !== ""
                        ? Number(formData.totalAmount)
                        : 0,

                remarks:
                    formData.remarks.trim() || null
            };

            console.log(
                "CREATE DELIVERY CHALLAN ITEM PAYLOAD:",
                payload
            );

            // =================================================
            // NODE API
            // =================================================

            await axios.post(
                `${SERVER_URL}/api/delivery-challan-items`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                }
            );

            setSuccess(true);

            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                if (challanId) {

                    navigate(
                        `/delivery-challans/details/${Number(challanId)}`
                    );

                } else {

                    navigate("/delivery-challans");
                }

            }, 700);

        } catch (err) {

            console.error(
                "CREATE DELIVERY CHALLAN ITEM ERROR:",
                err
            );

            const responseData = err.response?.data;

            let message =
                "Failed to create delivery challan item.";

            if (typeof responseData === "string") {

                message = responseData;

            } else if (responseData?.message) {

                message = responseData.message;

            } else if (responseData?.title) {

                message = responseData.title;

            } else if (responseData?.errors) {

                message = Object.values(
                    responseData.errors
                )
                    .flat()
                    .join(" ");

            }

            setError(message);

        } finally {

            setLoading(false);
        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {

        if (challanId) {

            navigate(
                `/delivery-challans/details/${Number(challanId)}`
            );

        } else {

            navigate("/delivery-challans");
        }
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

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Create Delivery Challan Item
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Add a product item to the delivery challan.
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                >
                    Back
                </Button>

            </Stack>

            {/* =================================================
                FORM
            ================================================= */}

            <Card elevation={3}>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ mb: 2 }}
                        >
                            Item Information
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* =====================================
                                DELIVERY CHALLAN ID
                            ===================================== */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    required
                                    label="Delivery Challan ID"
                                    name="deliveryChallanId"
                                    value={
                                        formData.deliveryChallanId
                                    }
                                    onChange={handleChange}
                                    type="number"
                                    disabled={Boolean(challanId)}
                                />

                            </Grid>

                            {/* =====================================
                                SALES ORDER ITEM ID
                            ===================================== */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Sales Order Item ID"
                                    name="salesOrderItemId"
                                    value={
                                        formData.salesOrderItemId
                                    }
                                    onChange={handleChange}
                                    type="number"
                                    placeholder="Optional"
                                />

                            </Grid>

                            {/* =====================================
                                PRODUCT ID
                            ===================================== */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    required
                                    label="Product ID"
                                    name="productId"
                                    value={
                                        formData.productId
                                    }
                                    onChange={handleChange}
                                    type="number"
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                QUANTITY
                            ===================================== */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    required
                                    label="Quantity"
                                    name="quantity"
                                    value={
                                        formData.quantity
                                    }
                                    onChange={handleChange}
                                    type="number"
                                    inputProps={{
                                        min: 1,
                                        step: 1
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                UNIT PRICE
                            ===================================== */}

                            <Grid item xs={12} md={6}>

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
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                TOTAL AMOUNT
                            ===================================== */}

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    label="Total Amount"
                                    name="totalAmount"
                                    value={
                                        formData.totalAmount
                                    }
                                    type="number"
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                REMARKS
                            ===================================== */}

                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Remarks"
                                    name="remarks"
                                    value={
                                        formData.remarks
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter remarks"
                                />

                            </Grid>

                        </Grid>

                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                            sx={{ mt: 4 }}
                        >

                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={
                                    loading ||
                                    loadingChallan
                                }
                            >
                                {loading
                                    ? "Saving..."
                                    : "Create Item"}
                            </Button>

                        </Stack>

                    </Box>

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
                    onClose={() => setError("")}
                    variant="filled"
                >
                    {error}
                </Alert>

            </Snackbar>

            {/* =================================================
                SUCCESS
            ================================================= */}

            <Snackbar
                open={success}
                autoHideDuration={1500}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
            >

                <Alert
                    severity="success"
                    variant="filled"
                >
                    Delivery challan item created successfully.
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default DeliveryChallanItemCreate;
