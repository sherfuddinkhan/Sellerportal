import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = "http://localhost:5000/api/OrderItems";

const OrderItemCreate = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        orderId: "2",
        productId: "6",
        quantity: "2",
        unitPrice: "1499"
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const payload = {
            orderId: Number(formData.orderId),
            productId: Number(formData.productId),
            quantity: Number(formData.quantity),
            unitPrice: Number(formData.unitPrice)
        };

        if (
            !Number.isInteger(payload.orderId) ||
            payload.orderId <= 0 ||
            !Number.isInteger(payload.productId) ||
            payload.productId <= 0 ||
            !Number.isFinite(payload.quantity) ||
            payload.quantity <= 0 ||
            !Number.isFinite(payload.unitPrice) ||
            payload.unitPrice < 0
        ) {
            setError(
                "Enter valid Order ID, Product ID, Quantity, and Unit Price."
            );
            return;
        }

        try {
            setLoading(true);

            // Log the exact values sent to the API.
            console.log(
                "CREATE ORDER ITEM PAYLOAD:",
                JSON.stringify(payload, null, 2)
            );

            console.log("CREATE ORDER ITEM URL:", API_URL);

            const response = await axios.post(API_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });

            console.log(
                "CREATE ORDER ITEM SUCCESS:",
                response.status,
                response.data
            );

            navigate("/order-items", {
                replace: true,
                state: {
                    message: "Order item created successfully."
                }
            });
        } catch (err) {
            const responseData = err.response?.data;

            // Log full diagnostic details in the browser console.
            console.error("CREATE ORDER ITEM FAILED");
            console.error("HTTP STATUS:", err.response?.status);
            console.error("REQUEST PAYLOAD:", payload);
            console.error("API RESPONSE:", responseData);
            console.error("ERROR MESSAGE:", err.message);

            let errorMessage = "Failed to create order item.";

            if (typeof responseData === "string") {
                errorMessage = responseData;
            } else if (responseData) {
                errorMessage =
                    responseData.message ||
                    responseData.title ||
                    responseData.detail ||
                    JSON.stringify(responseData);
            } else {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 850, mx: "auto" }}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/order-items")}
                >
                    Back
                </Button>

                <Typography variant="h5" fontWeight={700}>
                    Create Order Item
                </Typography>
            </Stack>

            <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3, overflowWrap: "anywhere" }}
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Order ID"
                            name="orderId"
                            type="number"
                            value={formData.orderId}
                            onChange={handleChange}
                            required
                            fullWidth
                            slotProps={{
                                htmlInput: { min: 1, step: 1 }
                            }}
                        />

                        <TextField
                            label="Product ID"
                            name="productId"
                            type="number"
                            value={formData.productId}
                            onChange={handleChange}
                            required
                            fullWidth
                            slotProps={{
                                htmlInput: { min: 1, step: 1 }
                            }}
                        />

                        <TextField
                            label="Quantity"
                            name="quantity"
                            type="number"
                            value={formData.quantity}
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
                            name="unitPrice"
                            type="number"
                            value={formData.unitPrice}
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

                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/order-items")}
                                disabled={loading}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SaveIcon />}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Create Order Item"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default OrderItemCreate;
