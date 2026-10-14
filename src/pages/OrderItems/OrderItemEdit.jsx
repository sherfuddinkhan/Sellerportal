import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

const SERVER_URL = "http://localhost:5000";
const API_URL = `${SERVER_URL}/api/OrderItems`;

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

    useEffect(() => {
        let active = true;

        const loadOrderItem = async () => {
            if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
                setError("Invalid Order Item ID.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(`${API_URL}/${id}`, {
                    headers: {
                        Accept: "application/json"
                    }
                });

                const item = response.data;

                if (!item || typeof item !== "object") {
                    throw new Error("Order item was not found.");
                }

                const quantity = Number(
                    item.quantity ?? item.Quantity ?? 0
                );

                const unitPrice = Number(
                    item.unitPrice ?? item.UnitPrice ?? 0
                );

                if (active) {
                    setFormData({
                        OrderItemId:
                            item.orderItemId ?? item.OrderItemId ?? id,
                        OrderId:
                            item.orderId ?? item.OrderId ?? "",
                        ProductId:
                            item.productId ?? item.ProductId ?? "",
                        Quantity:
                            item.quantity ?? item.Quantity ?? "",
                        UnitPrice:
                            item.unitPrice ?? item.UnitPrice ?? "",
                        TotalAmount:
                            item.totalAmount ??
                            item.TotalAmount ??
                            quantity * unitPrice
                    });
                }
            } catch (err) {
                console.error(
                    "LOAD ORDER ITEM EDIT ERROR:",
                    err.response?.data || err.message
                );

                if (active) {
                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.title ||
                        err.message ||
                        "Failed to load order item."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadOrderItem();

        return () => {
            active = false;
        };
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => {
            const updated = {
                ...previous,
                [name]: value
            };

            if (name === "Quantity" || name === "UnitPrice") {
                const quantity = Number(
                    name === "Quantity" ? value : previous.Quantity
                ) || 0;

                const unitPrice = Number(
                    name === "UnitPrice" ? value : previous.UnitPrice
                ) || 0;

                updated.TotalAmount = quantity * unitPrice;
            }

            return updated;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
            setError("Invalid Order Item ID.");
            return;
        }

        const orderId = Number(formData.OrderId);
        const productId = Number(formData.ProductId);
        const quantity = Number(formData.Quantity);
        const unitPrice = Number(formData.UnitPrice);

        if (!Number.isInteger(orderId) || orderId <= 0) {
            setError("Enter a valid Order ID.");
            return;
        }

        if (!Number.isInteger(productId) || productId <= 0) {
            setError("Enter a valid Product ID.");
            return;
        }

        if (!Number.isFinite(quantity) || quantity <= 0) {
            setError("Quantity must be greater than 0.");
            return;
        }

        if (!Number.isFinite(unitPrice) || unitPrice < 0) {
            setError("Unit Price cannot be negative.");
            return;
        }

        const payload = {
            OrderItemId: Number(id),
            OrderId: orderId,
            ProductId: productId,
            Quantity: quantity,
            UnitPrice: unitPrice,
            TotalAmount: quantity * unitPrice
        };

        try {
            setSaving(true);

            await axios.put(`${API_URL}/${id}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });

            navigate("/order-items", {
                replace: true,
                state: {
                    message: "Order item updated successfully."
                }
            });
        } catch (err) {
            console.error(
                "UPDATE ORDER ITEM ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
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
        <Box
            sx={{
                p: { xs: 2, md: 3 },
                maxWidth: 900,
                mx: "auto"
            }}
        >
            <Paper
                elevation={3}
                sx={{ p: { xs: 2, md: 4 } }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Typography variant="h5" fontWeight={700}>
                        Edit Order Item
                    </Typography>

                    <Button
                        startIcon={<ArrowBack />}
                        variant="outlined"
                        onClick={() => navigate("/order-items")}
                        disabled={saving}
                    >
                        Back to List
                    </Button>
                </Stack>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
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
                            slotProps={{
                                htmlInput: { min: 1, step: 1 }
                            }}
                        />

                        <TextField
                            label="Product ID"
                            name="ProductId"
                            type="number"
                            value={formData.ProductId}
                            onChange={handleChange}
                            required
                            fullWidth
                            slotProps={{
                                htmlInput: { min: 1, step: 1 }
                            }}
                        />

                        <TextField
                            label="Quantity"
                            name="Quantity"
                            type="number"
                            value={formData.Quantity}
                            onChange={handleChange}
                            required
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    min: 0.01,
                                    step: "any"
                                }
                            }}
                        />

                        <TextField
                            label="Unit Price"
                            name="UnitPrice"
                            type="number"
                            value={formData.UnitPrice}
                            onChange={handleChange}
                            required
                            fullWidth
                            slotProps={{
                                htmlInput: {
                                    min: 0,
                                    step: "any"
                                }
                            }}
                        />

                        <TextField
                            label="Total Amount"
                            name="TotalAmount"
                            type="number"
                            value={Number(formData.TotalAmount || 0).toFixed(2)}
                            disabled
                            fullWidth
                        />

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/order-items")}
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={saving}
                            >
                                {saving ? "Updating..." : "Update Order Item"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default OrderItemEdit;
