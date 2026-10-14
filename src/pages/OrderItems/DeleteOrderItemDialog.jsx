import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const API_URL = "http://localhost:5000/api/OrderItems";

const DeleteOrderItemDialog = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "error"
    });

    useEffect(() => {
        const loadOrderItem = async () => {
            if (!id) {
                setSnackbar({
                    open: true,
                    message: "Order Item ID is missing.",
                    severity: "error"
                });
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const response = await axios.get(`${API_URL}/${id}`, {
                    headers: { Accept: "application/json" },
                    timeout: 15000
                });

                setItem(response.data?.data ?? response.data);
            } catch (error) {
                console.error(
                    "LOAD ORDER ITEM FAILED:",
                    error.response?.data || error.message
                );

                setSnackbar({
                    open: true,
                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        "Failed to load order item.",
                    severity: "error"
                });
            } finally {
                setLoading(false);
            }
        };

        loadOrderItem();
    }, [id]);

    const getValue = (pascal, camel, fallback = "—") =>
        item?.[pascal] ?? item?.[camel] ?? fallback;

    const formatCurrency = (value) =>
        Number(value ?? 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const handleDelete = async () => {
        if (!id || deleting || !item) return;

        setDeleting(true);

        try {
            await axios.delete(`${API_URL}/${id}`, {
                timeout: 15000
            });

            navigate("/order-items", {
                replace: true,
                state: {
                    message: "Order item deleted successfully.",
                    severity: "success"
                }
            });
        } catch (error) {
            console.error(
                "DELETE ORDER ITEM FAILED:",
                error.response?.data || error.message
            );

            setSnackbar({
                open: true,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.title ||
                    "Failed to delete order item.",
                severity: "error"
            });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    p: 5
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/order-items")}
                sx={{ mb: 2 }}
            >
                Back to Order Items
            </Button>

            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <WarningAmberIcon color="error" sx={{ fontSize: 38 }} />

                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Delete Order Item
                        </Typography>

                        <Typography color="text.secondary">
                            Review the record before deleting it.
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {!item ? (
                    <Alert severity="error">
                        Order item not found. Verify the ID and API endpoint.
                    </Alert>
                ) : (
                    <>
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            Are you sure you want to permanently delete this
                            order item? This action cannot be undone.
                        </Alert>

                        <Stack spacing={2}>
                            <Box>
                                <Typography color="text.secondary">
                                    Order Item ID
                                </Typography>
                                <Typography fontWeight="bold">
                                    {getValue("OrderItemId", "orderItemId", id)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography color="text.secondary">
                                    Order ID
                                </Typography>
                                <Typography fontWeight="bold">
                                    {getValue("OrderId", "orderId")}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography color="text.secondary">
                                    Product ID
                                </Typography>
                                <Typography fontWeight="bold">
                                    {getValue("ProductId", "productId")}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography color="text.secondary">
                                    Quantity
                                </Typography>
                                <Typography fontWeight="bold">
                                    {Number(
                                        getValue("Quantity", "quantity", 0)
                                    ).toFixed(2)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography color="text.secondary">
                                    Unit Price
                                </Typography>
                                <Typography fontWeight="bold">
                                    ₹ {formatCurrency(
                                        getValue("UnitPrice", "unitPrice", 0)
                                    )}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography color="text.secondary">
                                    Total Amount
                                </Typography>
                                <Typography fontWeight="bold">
                                    ₹ {formatCurrency(
                                        getValue(
                                            "TotalAmount",
                                            "totalAmount",
                                            0
                                        )
                                    )}
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => navigate("/order-items")}
                                disabled={deleting}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Confirm Delete"}
                            </Button>
                        </Stack>
                    </>
                )}
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
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

export default DeleteOrderItemDialog;
