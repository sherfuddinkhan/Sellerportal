import React, { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    Button,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    ArrowBack
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

const SERVER_URL = "http://localhost:5000";

const OrderItemDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [item, setItem] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =========================================================
    // LOAD ORDER ITEM
    // =========================================================

    useEffect(() => {

        const loadItem = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${SERVER_URL}/api/OrderItem/${id}`
                );

                setItem(response.data);

            } catch (err) {

                console.error(
                    "LOAD ORDER ITEM DETAILS ERROR:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load order item details."
                );

            } finally {
                setLoading(false);
            }
        };


        if (id) {
            loadItem();
        }

    }, [id]);


    // =========================================================
    // VALUE HELPER
    // =========================================================

    const getValue = (
        pascalCase,
        camelCase
    ) => {

        return (
            item?.[pascalCase] ??
            item?.[camelCase] ??
            "-"
        );
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={8}
            >
                <CircularProgress />
            </Box>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    {error}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/order-items")
                    }
                >
                    Back to Order Items
                </Button>

            </Box>
        );
    }


    if (!item) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Order item not found.
                </Alert>

            </Box>
        );
    }


    const quantity = Number(
        getValue(
            "Quantity",
            "quantity"
        ) || 0
    );

    const unitPrice = Number(
        getValue(
            "UnitPrice",
            "unitPrice"
        ) || 0
    );

    const totalAmount = Number(
        getValue(
            "TotalAmount",
            "totalAmount"
        ) || 0
    );


    return (
        <Box sx={{ p: 3 }}>

            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    maxWidth: 1000,
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
                        Order Item Details
                    </Typography>

                </Box>

                <Divider sx={{ mb: 3 }} />


                <Grid
                    container
                    spacing={3}
                >

                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order Item ID
                        </Typography>

                        <Typography fontWeight={500}>
                            {getValue(
                                "OrderItemId",
                                "orderItemId"
                            )}
                        </Typography>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order ID
                        </Typography>

                        <Typography fontWeight={500}>
                            {getValue(
                                "OrderId",
                                "orderId"
                            )}
                        </Typography>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography fontWeight={500}>
                            {getValue(
                                "ProductId",
                                "productId"
                            )}
                        </Typography>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Quantity
                        </Typography>

                        <Typography fontWeight={500}>
                            {quantity.toFixed(2)}
                        </Typography>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Unit Price
                        </Typography>

                        <Typography fontWeight={500}>
                            ₹{" "}
                            {unitPrice.toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </Typography>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Total Amount
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            ₹{" "}
                            {totalAmount.toLocaleString(
                                "en-IN",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )}
                        </Typography>
                    </Grid>

                </Grid>

            </Paper>

        </Box>
    );
};

export default OrderItemDetails;
