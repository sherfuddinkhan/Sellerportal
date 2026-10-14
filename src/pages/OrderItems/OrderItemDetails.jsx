import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit
} from "@mui/icons-material";

const SERVER_URL = "http://localhost:5000";
const API_URL = `${SERVER_URL}/api/OrderItems`;

const OrderItemDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadItem = async () => {
            if (!id) {
                setError("Order Item ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_URL}/${id}`,
                    {
                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

                if (active) {
                    setItem(response.data);
                }
            } catch (err) {
                console.error(
                    "LOAD ORDER ITEM DETAILS ERROR:",
                    err.response?.status,
                    err.response?.data || err.message
                );

                if (active) {
                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.title ||
                        "Unable to load order item details."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadItem();

        return () => {
            active = false;
        };
    }, [id]);

    const getValue = (pascalCase, camelCase) =>
        item?.[camelCase] ?? item?.[pascalCase] ?? "-";

    const formatCurrency = (value) =>
        Number(value || 0).toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const handleBack = () => {
        navigate("/order-items");
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 8
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error || !item) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity={error ? "error" : "warning"}>
                    {error || "Order item not found."}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Order Items
                </Button>
            </Box>
        );
    }

    const orderItemId = getValue("OrderItemId", "orderItemId");
    const orderId = getValue("OrderId", "orderId");
    const productId = getValue("ProductId", "productId");
    const quantity = Number(getValue("Quantity", "quantity") || 0);
    const unitPrice = Number(getValue("UnitPrice", "unitPrice") || 0);
    const totalAmount = Number(
        getValue("TotalAmount", "totalAmount") || 0
    );

    const detailFields = [
        { label: "Order Item ID", value: orderItemId },
        { label: "Order ID", value: orderId },
        { label: "Product ID", value: productId },
        { label: "Quantity", value: quantity.toFixed(2) },
        { label: "Unit Price", value: formatCurrency(unitPrice) },
        { label: "Total Amount", value: formatCurrency(totalAmount) }
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, md: 4 },
                    maxWidth: 1000,
                    mx: "auto"
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Order Item Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            View information for order item #{orderItemId}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() =>
                                navigate(`/order-items/${id}/edit`)
                            }
                        >
                            Edit
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                    {detailFields.map((field) => (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            key={field.label}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {field.label}
                            </Typography>

                            <Typography
                                variant={
                                    field.label === "Total Amount"
                                        ? "h6"
                                        : "body1"
                                }
                                fontWeight={
                                    field.label === "Total Amount"
                                        ? "bold"
                                        : 500
                                }
                                sx={{
                                    mt: 0.5,
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {field.value}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default OrderItemDetails;
