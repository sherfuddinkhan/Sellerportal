// =========================================================
// MarketplaceOrderEdit.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const SERVER_URL = "http://localhost:5000";


const MarketplaceOrderEdit = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const [formData, setFormData] = useState({

        marketplaceAccountId: "",

        marketplaceOrderNumber: "",

        externalOrderId: "",

        sellerOrderNumber: "",

        orderDate: "",

        orderStatus: "Pending",

        fulfillmentChannel: "",

        currency: "INR",

        totalAmount: "",

        buyerName: "",

        buyerEmail: "",

        purchaseOrderNumber: ""

    });


    // =====================================================
    // LOAD ORDER
    // =====================================================

    useEffect(() => {

        const loadOrder = async () => {

            if (!id) {

                setError(
                    "Marketplace order ID is missing."
                );

                setLoading(false);

                return;
            }


            try {

                setLoading(true);

                setError("");


                const response = await axios.get(
                    `${SERVER_URL}/api/MarketplaceOrder/${id}`
                );


                const order = response.data;


                if (!order) {

                    setError(
                        "Marketplace order not found."
                    );

                    return;
                }


                // -------------------------------------------------
                // SUPPORT camelCase + PascalCase
                // -------------------------------------------------

                const marketplaceAccountId =
                    order.marketplaceAccountId ??
                    order.MarketplaceAccountId ??
                    "";


                const marketplaceOrderNumber =
                    order.marketplaceOrderNumber ??
                    order.MarketplaceOrderNumber ??
                    "";


                const externalOrderId =
                    order.externalOrderId ??
                    order.ExternalOrderId ??
                    "";


                const sellerOrderNumber =
                    order.sellerOrderNumber ??
                    order.SellerOrderNumber ??
                    "";


                const orderDate =
                    order.orderDate ??
                    order.OrderDate ??
                    "";


                const orderStatus =
                    order.orderStatus ??
                    order.OrderStatus ??
                    "Pending";


                const fulfillmentChannel =
                    order.fulfillmentChannel ??
                    order.FulfillmentChannel ??
                    "";


                const currency =
                    order.currency ??
                    order.Currency ??
                    "INR";


                const totalAmount =
                    order.totalAmount ??
                    order.TotalAmount ??
                    "";


                const buyerName =
                    order.buyerName ??
                    order.BuyerName ??
                    "";


                const buyerEmail =
                    order.buyerEmail ??
                    order.BuyerEmail ??
                    "";


                const purchaseOrderNumber =
                    order.purchaseOrderNumber ??
                    order.PurchaseOrderNumber ??
                    "";


                // -------------------------------------------------
                // FORMAT DATE FOR DATETIME-LOCAL
                // -------------------------------------------------

                let formattedOrderDate = "";

                if (orderDate) {

                    const date = new Date(orderDate);

                    if (!Number.isNaN(date.getTime())) {

                        const pad = (value) =>
                            String(value).padStart(2, "0");


                        formattedOrderDate =
                            `${date.getFullYear()}-${pad(
                                date.getMonth() + 1
                            )}-${pad(
                                date.getDate()
                            )}T${pad(
                                date.getHours()
                            )}:${pad(
                                date.getMinutes()
                            )}`;
                    }
                }


                setFormData({

                    marketplaceAccountId:
                        marketplaceAccountId,

                    marketplaceOrderNumber:
                        marketplaceOrderNumber,

                    externalOrderId:
                        externalOrderId,

                    sellerOrderNumber:
                        sellerOrderNumber,

                    orderDate:
                        formattedOrderDate,

                    orderStatus:
                        orderStatus,

                    fulfillmentChannel:
                        fulfillmentChannel,

                    currency:
                        currency,

                    totalAmount:
                        totalAmount,

                    buyerName:
                        buyerName,

                    buyerEmail:
                        buyerEmail,

                    purchaseOrderNumber:
                        purchaseOrderNumber

                });


            } catch (err) {

                console.error(
                    "LOAD MARKETPLACE ORDER EDIT ERROR:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    "Unable to load marketplace order."
                );

            } finally {

                setLoading(false);

            }

        };


        loadOrder();

    }, [id]);


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));


        setError("");

        setSuccess("");
    };


    // =====================================================
    // UPDATE ORDER
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!id) {

            setError(
                "Marketplace order ID is missing."
            );

            return;
        }


        if (
            !formData.marketplaceOrderNumber.trim()
        ) {

            setError(
                "Marketplace order number is required."
            );

            return;
        }


        if (
            !formData.orderStatus.trim()
        ) {

            setError(
                "Order status is required."
            );

            return;
        }


        try {

            setSaving(true);

            setError("");

            setSuccess("");


            const payload = {

                marketplaceAccountId:
                    formData.marketplaceAccountId
                        ? Number(
                            formData.marketplaceAccountId
                        )
                        : null,

                marketplaceOrderNumber:
                    formData.marketplaceOrderNumber
                        .trim(),

                externalOrderId:
                    formData.externalOrderId
                        .trim() || null,

                sellerOrderNumber:
                    formData.sellerOrderNumber
                        .trim() || null,

                orderDate:
                    formData.orderDate
                        ? new Date(
                            formData.orderDate
                        ).toISOString()
                        : null,

                orderStatus:
                    formData.orderStatus
                        .trim(),

                fulfillmentChannel:
                    formData.fulfillmentChannel
                        .trim() || null,

                currency:
                    formData.currency
                        .trim() || "INR",

                totalAmount:
                    formData.totalAmount !== ""
                        ? Number(
                            formData.totalAmount
                        )
                        : 0,

                buyerName:
                    formData.buyerName
                        .trim() || null,

                buyerEmail:
                    formData.buyerEmail
                        .trim() || null,

                purchaseOrderNumber:
                    formData.purchaseOrderNumber
                        .trim() || null

            };


            const response = await axios.put(
                `${SERVER_URL}/api/MarketplaceOrder/${id}`,
                payload
            );


            console.log(
                "MARKETPLACE ORDER UPDATED:",
                response.data
            );


            setSuccess(
                "Marketplace order updated successfully."
            );


            // -------------------------------------------------
            // Go to details page
            // -------------------------------------------------

            setTimeout(() => {

                navigate(
                    `/marketplace-orders/details/${id}`
                );

            }, 700);


        } catch (err) {

            console.error(
                "UPDATE MARKETPLACE ORDER ERROR:",
                err
            );


            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to update marketplace order."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <CircularProgress />

            </Box>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    justifyContent: "space-between",
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Edit Marketplace Order
                    </Typography>


                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Update marketplace order information
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            `/marketplace-orders/details/${id}`
                        )
                    }
                >
                    Back
                </Button>

            </Box>


            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {typeof error === "string"
                        ? error
                        : "Unable to update marketplace order."}
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


            {/* =================================================
                FORM
            ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: {
                        xs: 2,
                        md: 4
                    }
                }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    {/* =========================================
                        ORDER INFORMATION
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Order Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr"
                            },
                            gap: 2,
                            mb: 4
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Marketplace Account ID"
                            name="marketplaceAccountId"
                            type="number"
                            value={
                                formData.marketplaceAccountId
                            }
                            onChange={handleChange}
                        />


                        <TextField
                            fullWidth
                            required
                            label="Marketplace Order Number"
                            name="marketplaceOrderNumber"
                            value={
                                formData.marketplaceOrderNumber
                            }
                            onChange={handleChange}
                        />


                        <TextField
                            fullWidth
                            label="External Order ID"
                            name="externalOrderId"
                            value={
                                formData.externalOrderId
                            }
                            onChange={handleChange}
                        />


                        <TextField
                            fullWidth
                            label="Seller Order Number"
                            name="sellerOrderNumber"
                            value={
                                formData.sellerOrderNumber
                            }
                            onChange={handleChange}
                        />


                        <TextField
                            fullWidth
                            label="Order Date"
                            name="orderDate"
                            type="datetime-local"
                            value={
                                formData.orderDate
                            }
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />


                        <TextField
                            fullWidth
                            required
                            select
                            label="Order Status"
                            name="orderStatus"
                            value={
                                formData.orderStatus
                            }
                            onChange={handleChange}
                        >

                            <MenuItem value="Pending">
                                Pending
                            </MenuItem>

                            <MenuItem value="Requested">
                                Requested
                            </MenuItem>

                            <MenuItem value="Processing">
                                Processing
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

                        </TextField>


                        <TextField
                            fullWidth
                            label="Fulfillment Channel"
                            name="fulfillmentChannel"
                            value={
                                formData.fulfillmentChannel
                            }
                            onChange={handleChange}
                        />


                        <TextField
                            fullWidth
                            label="Currency"
                            name="currency"
                            value={
                                formData.currency
                            }
                            onChange={handleChange}
                        />


                        <TextField
                            fullWidth
                            label="Total Amount"
                            name="totalAmount"
                            type="number"
                            inputProps={{
                                step: "0.01",
                                min: "0"
                            }}
                            value={
                                formData.totalAmount
                            }
                            onChange={handleChange}
                        />


                        <TextField
                            fullWidth
                            label="Purchase Order Number"
                            name="purchaseOrderNumber"
                            value={
                                formData.purchaseOrderNumber
                            }
                            onChange={handleChange}
                        />

                    </Box>


                    {/* =========================================
                        BUYER INFORMATION
                    ========================================= */}

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Buyer Information
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr"
                            },
                            gap: 2,
                            mb: 4
                        }}
                    >

                        <TextField
                            fullWidth
                            label="Buyer Name"
                            name="buyerName"
                            value={
                                formData.buyerName
                            }
                            onChange={handleChange}
                        />


                        <TextField
                            fullWidth
                            label="Buyer Email"
                            name="buyerEmail"
                            type="email"
                            value={
                                formData.buyerEmail
                            }
                            onChange={handleChange}
                        />

                    </Box>


                    {/* =========================================
                        ACTIONS
                    ========================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={() =>
                                navigate(
                                    `/marketplace-orders/details/${id}`
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </Button>


                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                saving
                                    ? <CircularProgress
                                        size={20}
                                        color="inherit"
                                      />
                                    : <Save />
                            }
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update Order"}
                        </Button>

                    </Box>

                </Box>

            </Paper>

        </Box>
    );
};


export default MarketplaceOrderEdit;

