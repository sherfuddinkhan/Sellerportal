// ============================================================
// PurchaseOrderItemView.jsx
// ============================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    ReceiptLong
} from "@mui/icons-material";

// ============================================================
// SERVER
// ============================================================

const SERVER_URL = "http://localhost:5000";

// ============================================================
// COMPONENT
// ============================================================

const PurchaseOrderItemView = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [item, setItem] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // ========================================================
    // LOAD ITEM
    // ========================================================

    useEffect(() => {

        const loadPurchaseOrderItem = async () => {

            const purchaseOrderItemId = Number(id);

            if (
                !Number.isInteger(purchaseOrderItemId) ||
                purchaseOrderItemId <= 0
            ) {
                setError(
                    "Invalid Purchase Order Item ID."
                );

                setLoading(false);

                return;
            }

            try {

                setLoading(true);

                setError("");

                console.log(
                    "GET PURCHASE ORDER ITEM:",
                    purchaseOrderItemId
                );

                console.log(
                    "GET URL:",
                    `${SERVER_URL}/api/purchase-order-items/${purchaseOrderItemId}`
                );

                const response = await axios.get(
                    `${SERVER_URL}/api/purchase-order-items/${purchaseOrderItemId}`
                );

                console.log(
                    "PURCHASE ORDER ITEM RESPONSE:",
                    response.data
                );

                setItem(response.data);

            } catch (err) {

                console.error(
                    "FAILED TO LOAD PURCHASE ORDER ITEM:",
                    err
                );

                console.error(
                    "RESPONSE:",
                    err.response?.data
                );

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to load purchase order item."
                );

            } finally {

                setLoading(false);
            }
        };

        loadPurchaseOrderItem();

    }, [id]);

    // ========================================================
    // CLOSE SNACKBAR
    // ========================================================

    const handleSnackbarClose = () => {

        setSnackbar({
            open: false,
            message: "",
            severity: "success"
        });
    };

    // ========================================================
    // FORMAT NUMBER
    // ========================================================

    const formatNumber = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "0.00";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return "0.00";
        }

        return number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                >
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading purchase order item...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error || !item) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    {error ||
                        "Purchase order item not found."}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/purchase-order-items"
                        )
                    }
                >
                    Back to Purchase Order Items
                </Button>

            </Box>
        );
    }

    // ========================================================
    // NORMALIZE API RESPONSE
    // ========================================================

    const purchaseOrderItemId =
        item.purchaseOrderItemId ??
        item.PurchaseOrderItemId ??
        item.id;

    const purchaseOrderId =
        item.purchaseOrderId ??
        item.PurchaseOrderId;

    const productId =
        item.productId ??
        item.ProductId;

    const quantity =
        item.quantity ??
        item.Quantity;

    const unitPrice =
        item.unitPrice ??
        item.UnitPrice;

    const discount =
        item.discount ??
        item.Discount;

    const taxAmount =
        item.taxAmount ??
        item.TaxAmount;

    const totalAmount =
        item.totalAmount ??
        item.TotalAmount;

    const sellerId =
        item.sellerId ??
        item.SellerId;

    const customerId =
        item.customerId ??
        item.CustomerId;

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center"
                }}
                spacing={2}
                sx={{ mb: 3 }}
            >

                <Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <ReceiptLong />

                        <Typography
                            variant="h5"
                            fontWeight={600}
                        >
                            Purchase Order Item
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View purchase order item details
                    </Typography>

                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                "/purchase-order-items"
                            )
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(
                                `/purchase-order-items/edit/${purchaseOrderItemId}`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Stack>

            </Stack>

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Basic Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Purchase Order Item ID"
                                value={purchaseOrderItemId}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Purchase Order ID"
                                value={purchaseOrderId}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Product ID"
                                value={productId}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Seller ID"
                                value={sellerId}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Customer ID"
                                value={customerId}
                            />
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            {/* =================================================
                QUANTITY & PRICING
            ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        Quantity & Pricing
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Quantity"
                                value={formatNumber(quantity)}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Unit Price"
                                value={`₹ ${formatNumber(unitPrice)}`}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Discount"
                                value={`₹ ${formatNumber(discount)}`}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Tax Amount"
                                value={`₹ ${formatNumber(taxAmount)}`}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                        >
                            <InfoField
                                label="Total Amount"
                                value={`₹ ${formatNumber(totalAmount)}`}
                                strong
                            />
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <Paper
                elevation={1}
                sx={{
                    p: 3,
                    mb: 3
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Item Summary
                </Typography>

                <Stack spacing={1.5}>

                    <SummaryRow
                        label="Quantity"
                        value={formatNumber(quantity)}
                    />

                    <SummaryRow
                        label="Unit Price"
                        value={`₹ ${formatNumber(unitPrice)}`}
                    />

                    <SummaryRow
                        label="Discount"
                        value={`₹ ${formatNumber(discount)}`}
                    />

                    <SummaryRow
                        label="Tax"
                        value={`₹ ${formatNumber(taxAmount)}`}
                    />

                    <Divider />

                    <SummaryRow
                        label="Total Amount"
                        value={`₹ ${formatNumber(totalAmount)}`}
                        strong
                    />

                </Stack>

            </Paper>

            {/* =================================================
                FOOTER
            ================================================= */}

            <Stack
                direction="row"
                justifyContent="flex-end"
            >

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/purchase-order-items"
                        )
                    }
                >
                    Back to Purchase Order Items
                </Button>

            </Stack>

            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >

                <Alert
                    severity={snackbar.severity}
                    onClose={handleSnackbarClose}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>
    );
};

// ============================================================
// INFO FIELD
// ============================================================

const InfoField = ({
    label,
    value,
    strong = false
}) => {

    return (
        <Box>

            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    display: "block",
                    mb: 0.5
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={strong ? 700 : 500}
            >
                {value ??
                    "—"}
            </Typography>

        </Box>
    );
};

// ============================================================
// SUMMARY ROW
// ============================================================

const SummaryRow = ({
    label,
    value,
    strong = false
}) => {

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >

            <Typography
                color={
                    strong
                        ? "text.primary"
                        : "text.secondary"
                }
                fontWeight={
                    strong
                        ? 700
                        : 400
                }
            >
                {label}
            </Typography>

            <Typography
                fontWeight={
                    strong
                        ? 700
                        : 500
                }
            >
                {value}
            </Typography>

        </Stack>
    );
};

export default PurchaseOrderItemView;
