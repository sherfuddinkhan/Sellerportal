
import React, { useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    Alert
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

const SERVER_URL = "http://localhost:5000";

const OrderItemCreate = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        OrderId: "",
        ProductId: "",
        Quantity: 1,
        UnitPrice: 0,
        TotalAmount: 0
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => {

            const updated = {
                ...prev,
                [name]: value
            };

            if (
                name === "Quantity" ||
                name === "UnitPrice"
            ) {
                const quantity =
                    Number(updated.Quantity || 0);

                const unitPrice =
                    Number(updated.UnitPrice || 0);

                updated.TotalAmount =
                    quantity * unitPrice;
            }

            return updated;
        });
    };


    // =========================================================
    // CREATE ORDER ITEM
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        const orderId =
            Number(formData.OrderId);

        const productId =
            Number(formData.ProductId);

        const quantity =
            Number(formData.Quantity || 0);

        const unitPrice =
            Number(formData.UnitPrice || 0);

        const totalAmount =
            quantity * unitPrice;


        if (!orderId) {
            setError("Order ID is required.");
            return;
        }

        if (!productId) {
            setError("Product ID is required.");
            return;
        }

        if (quantity <= 0) {
            setError("Quantity must be greater than 0.");
            return;
        }

        if (unitPrice < 0) {
            setError("Unit Price cannot be negative.");
            return;
        }


        try {

            setSaving(true);

            const payload = {
                OrderId: orderId,
                ProductId: productId,
                Quantity: quantity,
                UnitPrice: unitPrice,
                TotalAmount: totalAmount
            };

            await axios.post(
                `${SERVER_URL}/api/OrderItem`,
                payload
            );

            navigate("/order-items");

        } catch (err) {

            console.error(
                "CREATE ORDER ITEM ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Unable to create order item."
            );

        } finally {
            setSaving(false);
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
                        onClick={() =>
                            navigate("/order-items")
                        }
                    >
                        Back
                    </Button>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Create Order Item
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
                                label="Order ID"
                                name="OrderId"
                                type="number"
                                value={formData.OrderId}
                                onChange={handleChange}
                            />
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Product ID"
                                name="ProductId"
                                type="number"
                                value={formData.ProductId}
                                onChange={handleChange}
                            />
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Quantity"
                                name="Quantity"
                                type="number"
                                value={formData.Quantity}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0.01,
                                    step: "0.01"
                                }}
                            />
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Unit Price"
                                name="UnitPrice"
                                type="number"
                                value={formData.UnitPrice}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>


                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Total Amount"
                                value={Number(
                                    formData.TotalAmount || 0
                                ).toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}
                                InputProps={{
                                    readOnly: true
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
                            onClick={() =>
                                navigate("/order-items")
                            }
                            disabled={saving}
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                saving ? (
                                    <span>...</span>
                                ) : (
                                    <Save />
                                )
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Order Item"
                            }
                        </Button>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};

export default OrderItemCreate;









