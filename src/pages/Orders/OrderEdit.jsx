import React, { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Grid,
    Divider,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

const SERVER_URL = "http://localhost:5000";

const OrderEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();


    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        OrderId: 0,
        SellerId: "",
        CustomerId: "",
        OrderNumber: "",
        OrderDate: "",
        OrderStatus: "Pending",
        TotalAmount: ""
    });


    // =========================================================
    // LOAD ORDER
    // =========================================================

    useEffect(() => {

        const loadOrder = async () => {

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${SERVER_URL}/api/Order/${id}`
                );

                const data = response.data;

                const orderDate =
                    data.OrderDate ??
                    data.orderDate ??
                    "";

                setFormData({
                    OrderId:
                        data.OrderId ??
                        data.orderId ??
                        0,

                    SellerId:
                        data.SellerId ??
                        data.sellerId ??
                        "",

                    CustomerId:
                        data.CustomerId ??
                        data.customerId ??
                        "",

                    OrderNumber:
                        data.OrderNumber ??
                        data.orderNumber ??
                        "",

                    OrderDate:
                        orderDate
                            ? formatDateTimeLocal(orderDate)
                            : "",

                    OrderStatus:
                        data.OrderStatus ??
                        data.orderStatus ??
                        "Pending",

                    TotalAmount:
                        data.TotalAmount ??
                        data.totalAmount ??
                        ""
                });

            } catch (err) {

                console.error(
                    "LOAD ORDER EDIT ERROR:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    "Unable to load order."
                );

            } finally {
                setLoading(false);
            }
        };


        if (id) {
            loadOrder();
        }

    }, [id]);


    // =========================================================
    // FORMAT DATETIME
    // =========================================================

    const formatDateTimeLocal = (dateValue) => {

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        const hours = String(
            date.getHours()
        ).padStart(2, "0");

        const minutes = String(
            date.getMinutes()
        ).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // =========================================================
    // UPDATE ORDER
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        if (!formData.OrderNumber.trim()) {
            setError("Order Number is required.");
            return;
        }

        if (!formData.OrderDate) {
            setError("Order Date is required.");
            return;
        }

        try {

            setSaving(true);

            const payload = {
                OrderId: Number(formData.OrderId),
                SellerId: Number(formData.SellerId),
                CustomerId: Number(formData.CustomerId),
                OrderNumber: formData.OrderNumber.trim(),
                OrderDate: formData.OrderDate,
                OrderStatus: formData.OrderStatus,
                TotalAmount: Number(
                    formData.TotalAmount || 0
                )
            };


            await axios.put(
                `${SERVER_URL}/api/Order/${id}`,
                payload
            );


            navigate("/orders");

        } catch (err) {

            console.error(
                "UPDATE ORDER ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Unable to update order."
            );

        } finally {
            setSaving(false);
        }
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
    // PAGE
    // =========================================================

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
                        Edit Order
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
                                label="Order ID"
                                value={formData.OrderId}
                                disabled
                            />
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
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
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        size={20}
                                        color="inherit"
                                    />
                                ) : (
                                    <Save />
                                )
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update Order"
                            }
                        </Button>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};

export default OrderEdit;