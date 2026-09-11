// ============================================================
// PurchaseOrderItemEdit.jsx
// Full Page Purchase Order Item Edit
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
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

// ============================================================
// SERVER URL
// ============================================================

const SERVER_URL = "http://localhost:5000";

// ============================================================
// INITIAL FORM
// ============================================================

const initialFormData = {
    PurchaseOrderItemId: "",
    PurchaseOrderId: "",
    ProductId: "",
    Quantity: "",
    UnitPrice: "",
    Discount: "0",
    TaxAmount: "0",
    TotalAmount: "0"
};

// ============================================================
// COMPONENT
// ============================================================

const PurchaseOrderItemEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    // ========================================================
    // STATE
    // ========================================================

    const [formData, setFormData] = useState(initialFormData);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // ========================================================
    // GET ITEM
    // ========================================================

    useEffect(() => {

        const loadPurchaseOrderItem = async () => {

            const purchaseOrderItemId = Number(id);

            if (
                !Number.isInteger(purchaseOrderItemId) ||
                purchaseOrderItemId <= 0
            ) {
                setError("Invalid Purchase Order Item ID.");
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

                const item = response.data;

                setFormData({
                    PurchaseOrderItemId:
                        item?.purchaseOrderItemId ??
                        item?.PurchaseOrderItemId ??
                        item?.id ??
                        purchaseOrderItemId,

                    PurchaseOrderId:
                        item?.purchaseOrderId ??
                        item?.PurchaseOrderId ??
                        "",

                    ProductId:
                        item?.productId ??
                        item?.ProductId ??
                        "",

                    Quantity:
                        item?.quantity ??
                        item?.Quantity ??
                        "",

                    UnitPrice:
                        item?.unitPrice ??
                        item?.UnitPrice ??
                        "",

                    Discount:
                        item?.discount ??
                        item?.Discount ??
                        0,

                    TaxAmount:
                        item?.taxAmount ??
                        item?.TaxAmount ??
                        0,

                    TotalAmount:
                        item?.totalAmount ??
                        item?.TotalAmount ??
                        0
                });

            } catch (err) {

                console.error(
                    "FAILED TO LOAD PURCHASE ORDER ITEM:",
                    err
                );

                const message =
                    err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    "Failed to load Purchase Order Item.";

                setError(message);

            } finally {

                setLoading(false);

            }
        };

        loadPurchaseOrderItem();

    }, [id]);

    // ========================================================
    // CALCULATE TOTAL
    // ========================================================

    useEffect(() => {

        const quantity =
            Number(formData.Quantity) || 0;

        const unitPrice =
            Number(formData.UnitPrice) || 0;

        const discount =
            Number(formData.Discount) || 0;

        const taxAmount =
            Number(formData.TaxAmount) || 0;

        const subtotal =
            quantity * unitPrice;

        const total =
            Math.max(
                0,
                subtotal - discount + taxAmount
            );

        setFormData((previous) => ({
            ...previous,
            TotalAmount: total.toFixed(2)
        }));

    }, [
        formData.Quantity,
        formData.UnitPrice,
        formData.Discount,
        formData.TaxAmount
    ]);

    // ========================================================
    // HANDLE CHANGE
    // ========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };

    // ========================================================
    // SAVE
    // ========================================================

    const handleSave = async () => {

        const purchaseOrderItemId =
            Number(formData.PurchaseOrderItemId);

        if (
            !Number.isInteger(purchaseOrderItemId) ||
            purchaseOrderItemId <= 0
        ) {
            setSnackbar({
                open: true,
                message: "Purchase Order Item ID is required.",
                severity: "error"
            });

            return;
        }

        if (
            !Number(formData.PurchaseOrderId) ||
            Number(formData.PurchaseOrderId) <= 0
        ) {
            setSnackbar({
                open: true,
                message: "Purchase Order ID is required.",
                severity: "error"
            });

            return;
        }

        if (
            !Number(formData.ProductId) ||
            Number(formData.ProductId) <= 0
        ) {
            setSnackbar({
                open: true,
                message: "Product ID is required.",
                severity: "error"
            });

            return;
        }

        const payload = {
            PurchaseOrderItemId:
                purchaseOrderItemId,

            PurchaseOrderId:
                Number(formData.PurchaseOrderId),

            ProductId:
                Number(formData.ProductId),

            Quantity:
                Number(formData.Quantity) || 0,

            UnitPrice:
                Number(formData.UnitPrice) || 0,

            Discount:
                Number(formData.Discount) || 0,

            TaxAmount:
                Number(formData.TaxAmount) || 0,

            TotalAmount:
                Number(formData.TotalAmount) || 0
        };

        console.log(
            "UPDATE PURCHASE ORDER ITEM"
        );

        console.log(
            "ITEM ID:",
            purchaseOrderItemId
        );

        console.log(
            "PAYLOAD:",
            payload
        );

        console.log(
            "PUT URL:",
            `${SERVER_URL}/api/purchase-order-items/${purchaseOrderItemId}`
        );

        try {

            setSaving(true);

            await axios.put(
                `${SERVER_URL}/api/purchase-order-items/${purchaseOrderItemId}`,
                payload
            );

            setSnackbar({
                open: true,
                message:
                    "Purchase Order Item updated successfully.",
                severity: "success"
            });

            setTimeout(() => {

                navigate(
                    "/purchase-order-items"
                );

            }, 800);

        } catch (err) {

            console.error(
                "FAILED TO UPDATE PURCHASE ORDER ITEM:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to update Purchase Order Item.";

            setSnackbar({
                open: true,
                message,
                severity: "error"
            });

        } finally {

            setSaving(false);

        }
    };

    // ========================================================
    // BACK
    // ========================================================

    const handleBack = () => {

        navigate(
            "/purchase-order-items"
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
                <CircularProgress />
            </Box>
        );

    }

    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    {error}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back to Purchase Order Items
                </Button>

            </Box>
        );

    }

    // ========================================================
    // PAGE
    // ========================================================

    return (
        <Box sx={{ p: 3 }}>

            {/* ==================================================
                HEADER
            ================================================== */}

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

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Edit Purchase Order Item
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Update Purchase Order Item #
                        {formData.PurchaseOrderItemId}
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back
                </Button>

            </Stack>

            {/* ==================================================
                FORM CARD
            ================================================== */}

            <Card>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Purchase Order Item Information
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* ======================================
                            ITEM ID
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <TextField
                                fullWidth
                                label="Purchase Order Item ID"
                                name="PurchaseOrderItemId"
                                value={
                                    formData.PurchaseOrderItemId
                                }
                                disabled
                            />
                        </Grid>

                        {/* ======================================
                            PURCHASE ORDER ID
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <TextField
                                fullWidth
                                label="Purchase Order ID"
                                name="PurchaseOrderId"
                                type="number"
                                value={
                                    formData.PurchaseOrderId
                                }
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* ======================================
                            PRODUCT ID
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <TextField
                                fullWidth
                                label="Product ID"
                                name="ProductId"
                                type="number"
                                value={
                                    formData.ProductId
                                }
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* ======================================
                            QUANTITY
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <TextField
                                fullWidth
                                label="Quantity"
                                name="Quantity"
                                type="number"
                                value={
                                    formData.Quantity
                                }
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        {/* ======================================
                            UNIT PRICE
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <TextField
                                fullWidth
                                label="Unit Price"
                                name="UnitPrice"
                                type="number"
                                value={
                                    formData.UnitPrice
                                }
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        {/* ======================================
                            DISCOUNT
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <TextField
                                fullWidth
                                label="Discount"
                                name="Discount"
                                type="number"
                                value={
                                    formData.Discount
                                }
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        {/* ======================================
                            TAX
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <TextField
                                fullWidth
                                label="Tax Amount"
                                name="TaxAmount"
                                type="number"
                                value={
                                    formData.TaxAmount
                                }
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        {/* ======================================
                            TOTAL
                        ====================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >
                            <TextField
                                fullWidth
                                label="Total Amount"
                                name="TotalAmount"
                                value={
                                    formData.TotalAmount
                                }
                                disabled
                            />
                        </Grid>

                    </Grid>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <Divider sx={{ my: 3 }} />

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        spacing={2}
                        justifyContent="flex-end"
                    >

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>

                    </Stack>

                </CardContent>

            </Card>

            {/* ==================================================
                SNACKBAR
            ================================================== */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
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
                    onClose={() =>
                        setSnackbar((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default PurchaseOrderItemEdit;
