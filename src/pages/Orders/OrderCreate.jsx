import React, { useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Grid,
    Divider,
    Alert
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const OrderCreate = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        SellerId: "",
        CustomerId: "",
        OrderNumber: "",
        OrderDate: "",
        OrderStatus: "Pending",
        TotalAmount: ""
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.SellerId) {
            setError("Seller ID is required.");
            return;
        }

        if (!formData.CustomerId) {
            setError("Customer ID is required.");
            return;
        }

        if (!formData.OrderNumber.trim()) {
            setError("Order Number is required.");
            return;
        }

        if (!formData.OrderDate) {
            setError("Order Date is required.");
            return;
        }

        try {
            // This page is intended to be UI/form based.
            // API creation should remain in OrderList.jsx.

            navigate("/orders", {
                state: {
                    createOrder: {
                        SellerId: Number(formData.SellerId),
                        CustomerId: Number(formData.CustomerId),
                        OrderNumber: formData.OrderNumber.trim(),
                        OrderDate: formData.OrderDate,
                        OrderStatus: formData.OrderStatus,
                        TotalAmount: Number(formData.TotalAmount || 0)
                    }
                }
            });

        } catch (err) {
            setError("Unable to prepare order.");
        }
    };

    return (
        <Box sx={{ p: 3 }}>

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    maxWidth: 900,
                    mx: "auto"
                }}
            >

                {/* Header */}

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    mb={2}
                >
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/orders")}
                    >
                        Back
                    </Button>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Create Order
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Seller ID"
                                name="SellerId"
                                type="number"
                                value={formData.SellerId}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Customer ID"
                                name="CustomerId"
                                type="number"
                                value={formData.CustomerId}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Order Number"
                                name="OrderNumber"
                                value={formData.OrderNumber}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Order Date"
                                name="OrderDate"
                                type="datetime-local"
                                value={formData.OrderDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                select
                                label="Order Status"
                                name="OrderStatus"
                                value={formData.OrderStatus}
                                onChange={handleChange}
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

                                <MenuItem value="Packed">
                                    Packed
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

                                <MenuItem value="Returned">
                                    Returned
                                </MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Total Amount"
                                name="TotalAmount"
                                type="number"
                                value={formData.TotalAmount}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                    </Grid>

                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        gap={2}
                        mt={4}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/orders")}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Save />}
                        >
                            Save Order
                        </Button>
                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};

export default OrderCreate;




