import React, { useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Alert,
    Button,
    TextField,
    Grid,
    MenuItem,
    Divider,
    CircularProgress
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


/* =========================================================
   DEFAULT VALUES
========================================================= */

const DEFAULT_SELLER_ID = 6;
const DEFAULT_CUSTOMER_ID = 3;


/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS = [
    "Pending",
    "Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned"
];


/* =========================================================
   CURRENT LOCAL DATETIME
========================================================= */

const getCurrentDateTimeLocal = () => {

    const now = new Date();

    const offset = now.getTimezoneOffset() * 60000;

    return new Date(now.getTime() - offset)
        .toISOString()
        .slice(0, 16);
};


/* =========================================================
   COMPONENT
========================================================= */

const CreateOrderStatusHistory = ({
    onSave,
    loading = false
}) => {

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        sellerId: DEFAULT_SELLER_ID,
        customerId: DEFAULT_CUSTOMER_ID,
        orderId: "",
        status: "",
        remarks: "",
        changedOn: getCurrentDateTimeLocal()
    });


    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

    };


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {
        navigate("/order-status-history");
    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        const sellerId = Number(formData.sellerId);
        const customerId = Number(formData.customerId);
        const orderId = Number(formData.orderId);

        if (!sellerId || !customerId || !orderId) {
            setError(
                "Seller ID, Customer ID, and Order ID are required."
            );
            return;
        }

        if (!formData.status) {
            setError("Please select an order status.");
            return;
        }

        if (
            !formData.changedOn ||
            Number.isNaN(new Date(formData.changedOn).getTime())
        ) {
            setError("Please enter a valid Changed On date.");
            return;
        }

        const payload = {
            orderStatusHistoryId: 0,
            sellerId,
            customerId,
            orderId,
            status: formData.status,
            remarks: formData.remarks.trim(),
            changedOn: new Date(
                formData.changedOn
            ).toISOString()
        };

        console.log(
            "CREATE ORDER STATUS HISTORY PAYLOAD:",
            payload
        );

        try {

            if (typeof onSave !== "function") {
                setError(
                    "Save handler is missing. Please check the parent component."
                );
                return;
            }

            await onSave(payload);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to create Order Status History."
            );

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
                gap={2}
                mb={3}
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    disabled={loading}
                >
                    Back
                </Button>

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Create Order Status History
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Record a new order status update.
                    </Typography>

                </Box>

            </Box>


            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}


            {/* FULL-PAGE FORM */}

            <Paper
                elevation={2}
                sx={{ p: 3 }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid container spacing={3}>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Seller ID"
                                name="sellerId"
                                type="number"
                                required
                                value={formData.sellerId}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Customer ID"
                                name="customerId"
                                type="number"
                                required
                                value={formData.customerId}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Order ID"
                                name="orderId"
                                type="number"
                                required
                                value={formData.orderId}
                                onChange={handleChange}
                                inputProps={{ min: 1 }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                required
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                {STATUS_OPTIONS.map(status => (
                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Enter remarks"
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                label="Changed On"
                                name="changedOn"
                                required
                                value={formData.changedOn}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap={2}
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
                                    ? <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                    : <Save />
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "Create Status History"}
                        </Button>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};

export default CreateOrderStatusHistory;
