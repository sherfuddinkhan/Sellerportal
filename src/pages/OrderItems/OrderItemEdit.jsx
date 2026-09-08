import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Stack
} from "@mui/material";

const SERVER_URL = "http://localhost:5000";

const OrderItemEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        OrderItemId: 0,
        OrderId: "",
        ProductId: "",
        Quantity: "",
        UnitPrice: "",
        TotalAmount: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!id || id === ":id") {
            setError("Invalid Order Item ID.");
            setLoading(false);
            return;
        }

        loadOrderItem();
    }, [id]);

    const loadOrderItem = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("Loading OrderItem ID:", id);

            const response = await axios.get(
                `${SERVER_URL}/api/OrderItem/${id}`
            );

            const item = response.data;

            setFormData({
                OrderItemId:
                    item.OrderItemId ??
                    item.orderItemId ??
                    id,

                OrderId:
                    item.OrderId ??
                    item.orderId ??
                    "",

                ProductId:
                    item.ProductId ??
                    item.productId ??
                    "",

                Quantity:
                    item.Quantity ??
                    item.quantity ??
                    "",

                UnitPrice:
                    item.UnitPrice ??
                    item.unitPrice ??
                    "",

                TotalAmount:
                    item.TotalAmount ??
                    item.totalAmount ??
                    ""
            });
        } catch (err) {
            console.error(
                "LOAD ORDER ITEM EDIT ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Failed to load order item."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: value
            };

            if (name === "Quantity" || name === "UnitPrice") {
                const quantity =
                    Number(
                        name === "Quantity"
                            ? value
                            : prev.Quantity
                    ) || 0;

                const unitPrice =
                    Number(
                        name === "UnitPrice"
                            ? value
                            : prev.UnitPrice
                    ) || 0;

                updated.TotalAmount = quantity * unitPrice;
            }

            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id || id === ":id") {
            setError("Invalid Order Item ID.");
            return;
        }

        const orderId = Number(formData.OrderId);
        const productId = Number(formData.ProductId);
        const quantity = Number(formData.Quantity);
        const unitPrice = Number(formData.UnitPrice);
        const totalAmount = quantity * unitPrice;

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
            setError("Unit price cannot be negative.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                OrderItemId: Number(id),
                OrderId: orderId,
                ProductId: productId,
                Quantity: quantity,
                UnitPrice: unitPrice,
                TotalAmount: totalAmount
            };

            console.log("Updating OrderItem:", id);
            console.log("Payload:", payload);

            await axios.put(
                `${SERVER_URL}/api/OrderItem/${id}`,
                payload
            );

            setSuccess("Order item updated successfully.");

            setTimeout(() => {
                navigate("/order-items");
            }, 800);
        } catch (err) {
            console.error(
                "UPDATE ORDER ITEM ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Failed to update order item."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography
                    variant="h5"
                    fontWeight={600}
                    mb={3}
                >
                    Edit Order Item
                </Typography>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
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

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >
                    <Stack spacing={2}>
                        <TextField
                            label="Order Item ID"
                            name="OrderItemId"
                            value={formData.OrderItemId}
                            disabled
                            fullWidth
                        />

                        <TextField
                            label="Order ID"
                            name="OrderId"
                            type="number"
                            value={formData.OrderId}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Product ID"
                            name="ProductId"
                            type="number"
                            value={formData.ProductId}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Quantity"
                            name="Quantity"
                            type="number"
                            value={formData.Quantity}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 1 }}
                            fullWidth
                        />

                        <TextField
                            label="Unit Price"
                            name="UnitPrice"
                            type="number"
                            value={formData.UnitPrice}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 0, step: "0.01" }}
                            fullWidth
                        />

                        <TextField
                            label="Total Amount"
                            name="TotalAmount"
                            type="number"
                            value={formData.TotalAmount}
                            disabled
                            fullWidth
                        />

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
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
                                disabled={saving}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Order Item"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default OrderItemEdit;
