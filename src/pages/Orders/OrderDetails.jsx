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

const OrderDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const loadOrder = async () => {

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${SERVER_URL}/api/Order/${id}`
                );

                setOrder(response.data);

            } catch (err) {

                console.error(
                    "LOAD ORDER DETAILS ERROR:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load order details."
                );

            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadOrder();
        }

    }, [id]);


    const getValue = (pascalCase, camelCase) => {
        return order?.[pascalCase] ??
               order?.[camelCase] ??
               "-";
    };


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


    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {error}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/orders")}
                >
                    Back to Orders
                </Button>
            </Box>
        );
    }


    if (!order) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    Order not found.
                </Alert>
            </Box>
        );
    }


    const totalAmount = Number(
        getValue("TotalAmount", "totalAmount") || 0
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
                        onClick={() => navigate("/orders")}
                    >
                        Back
                    </Button>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Order Details
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
                            Seller ID
                        </Typography>

                        <Typography fontWeight={500}>
                            {getValue(
                                "SellerId",
                                "sellerId"
                            )}
                        </Typography>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Customer ID
                        </Typography>

                        <Typography fontWeight={500}>
                            {getValue(
                                "CustomerId",
                                "customerId"
                            )}
                        </Typography>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order Number
                        </Typography>

                        <Typography fontWeight={500}>
                            {getValue(
                                "OrderNumber",
                                "orderNumber"
                            )}
                        </Typography>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order Date
                        </Typography>

                        <Typography fontWeight={500}>
                            {getValue(
                                "OrderDate",
                                "orderDate"
                            ) !== "-"
                                ? new Date(
                                    getValue(
                                        "OrderDate",
                                        "orderDate"
                                    )
                                ).toLocaleString("en-IN")
                                : "-"
                            }
                        </Typography>
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Order Status
                        </Typography>

                        <Typography fontWeight={500}>
                            {getValue(
                                "OrderStatus",
                                "orderStatus"
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
                            fontWeight="bold"
                            variant="h6"
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


                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography fontWeight={500}>
                            {getValue(
                                "CreatedDate",
                                "createdDate"
                            ) !== "-"
                                ? new Date(
                                    getValue(
                                        "CreatedDate",
                                        "createdDate"
                                    )
                                ).toLocaleString("en-IN")
                                : "-"
                            }
                        </Typography>
                    </Grid>

                </Grid>

            </Paper>

        </Box>
    );
};

export default OrderDetails;