import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
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
// SERVER
// ============================================================

const SERVER_URL = "http://localhost:5000";

// ============================================================
// INITIAL FORM STATE
// ============================================================

const initialFormData = {
    PurchaseOrderId: "",
    ProductId: "",
    Quantity: "",
    UnitPrice: "",
    Discount: "",
    TaxAmount: "",
    TotalAmount: "0.00"
};

// ============================================================
// PURCHASE ORDER ITEM CREATE
// ============================================================

const PurchaseOrderItemCreate = () => {

    const navigate = useNavigate();

    // ========================================================
    // STATE
    // ========================================================

    const [
        formData,
        setFormData
    ] = useState(initialFormData);

    const [
        error,
        setError
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        snackbar,
        setSnackbar
    ] = useState({
        open: false,
        message: "",
        severity: "success"
    });

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

        const total =
            (quantity * unitPrice) -
            discount +
            taxAmount;

        const calculatedTotal =
            Math.max(
                0,
                total
            ).toFixed(2);

        setFormData((previous) => {

            if (
                previous.TotalAmount ===
                calculatedTotal
            ) {
                return previous;
            }

            return {
                ...previous,
                TotalAmount:
                    calculatedTotal
            };
        });

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

        setError("");
    };

    // ========================================================
    // VALIDATE FORM
    // ========================================================

    const validateForm = () => {

        const purchaseOrderId =
            Number(formData.PurchaseOrderId);

        if (
            !Number.isInteger(purchaseOrderId) ||
            purchaseOrderId <= 0
        ) {
            return "Purchase Order ID is required.";
        }

        const productId =
            Number(formData.ProductId);

        if (
            !Number.isInteger(productId) ||
            productId <= 0
        ) {
            return "Product ID is required.";
        }

        const quantity =
            Number(formData.Quantity);

        if (
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {
            return "Quantity must be greater than 0.";
        }

        const unitPrice =
            Number(formData.UnitPrice);

        if (
            !Number.isFinite(unitPrice) ||
            unitPrice < 0
        ) {
            return "Unit Price cannot be negative.";
        }

        const discount =
            Number(formData.Discount) || 0;

        if (discount < 0) {
            return "Discount cannot be negative.";
        }

        const taxAmount =
            Number(formData.TaxAmount) || 0;

        if (taxAmount < 0) {
            return "Tax Amount cannot be negative.";
        }

        return "";
    };

    // ========================================================
    // CREATE PURCHASE ORDER ITEM
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");

        const validationError =
            validateForm();

        if (validationError) {

            setError(
                validationError
            );

            return;
        }

        const payload = {

            PurchaseOrderId:
                Number(
                    formData.PurchaseOrderId
                ),

            ProductId:
                Number(
                    formData.ProductId
                ),

            Quantity:
                Number(
                    formData.Quantity
                ),

            UnitPrice:
                Number(
                    formData.UnitPrice
                ) || 0,

            Discount:
                Number(
                    formData.Discount
                ) || 0,

            TaxAmount:
                Number(
                    formData.TaxAmount
                ) || 0,

            TotalAmount:
                Number(
                    formData.TotalAmount
                ) || 0
        };

        console.log(
            "================================================="
        );

        console.log(
            "CREATE PURCHASE ORDER ITEM"
        );

        console.log(
            "POST URL:",
            `${SERVER_URL}/api/purchase-order-items`
        );

        console.log(
            "PAYLOAD:",
            payload
        );

        console.log(
            "================================================="
        );

        try {

            setLoading(true);

            const response =
                await axios.post(
                    `${SERVER_URL}/api/purchase-order-items`,
                    payload
                );

            console.log(
                "CREATE PURCHASE ORDER ITEM RESPONSE:",
                response.data
            );

            setSnackbar({
                open: true,
                message:
                    "Purchase order item created successfully.",
                severity: "success"
            });

            setFormData(
                initialFormData
            );

            // ------------------------------------------------
            // RETURN TO LIST AFTER SUCCESS
            // ------------------------------------------------

            setTimeout(() => {

                navigate(
                    "/purchase-order-items"
                );

            }, 800);

        } catch (error) {

            console.error(
                "CREATE PURCHASE ORDER ITEM ERROR:",
                error
            );

            console.error(
                "CREATE PURCHASE ORDER ITEM RESPONSE:",
                error.response?.data
            );

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create purchase order item.";

            setError(message);

            setSnackbar({
                open: true,
                message,
                severity: "error"
            });

        } finally {

            setLoading(false);

        }
    };

    // ========================================================
    // CANCEL
    // ========================================================

    const handleCancel = () => {

        navigate(
            "/purchase-order-items"
        );
    };

    // ========================================================
    // CLOSE SNACKBAR
    // ========================================================

    const handleSnackbarClose = () => {

        setSnackbar((previous) => ({
            ...previous,
            open: false
        }));
    };

    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            sx={{
                p: 3
            }}
        >

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
                sx={{
                    mb: 3
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Create Purchase Order Item
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        Add a new item to a purchase order.
                    </Typography>

                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                >
                    Back to Purchase Order Items
                </Button>

            </Stack>

            {/* =================================================
                FORM CARD
            ================================================= */}

            <Card>

                <CardContent>

                    <form
                        onSubmit={handleSubmit}
                    >

                        {error && (

                            <Alert
                                severity="error"
                                sx={{
                                    mb: 3
                                }}
                            >
                                {error}
                            </Alert>

                        )}

                        <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{
                                mb: 2
                            }}
                        >
                            Purchase Order Item Details
                        </Typography>

                        <Divider
                            sx={{
                                mb: 3
                            }}
                        />

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* =====================================
                                PURCHASE ORDER ID
                            ===================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Purchase Order ID"
                                    name="PurchaseOrderId"
                                    value={
                                        formData.PurchaseOrderId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 1,
                                        step: 1
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                PRODUCT ID
                            ===================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Product ID"
                                    name="ProductId"
                                    value={
                                        formData.ProductId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 1,
                                        step: 1
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                QUANTITY
                            ===================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Quantity"
                                    name="Quantity"
                                    value={
                                        formData.Quantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                UNIT PRICE
                            ===================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Unit Price"
                                    name="UnitPrice"
                                    value={
                                        formData.UnitPrice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                DISCOUNT
                            ===================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Discount"
                                    name="Discount"
                                    value={
                                        formData.Discount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                TAX AMOUNT
                            ===================================== */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Tax Amount"
                                    name="TaxAmount"
                                    value={
                                        formData.TaxAmount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>

                            {/* =====================================
                                TOTAL AMOUNT
                            ===================================== */}

                            <Grid
                                item
                                xs={12}
                            >

                                <TextField
                                    fullWidth
                                    label="Total Amount"
                                    name="TotalAmount"
                                    value={
                                        formData.TotalAmount
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />

                            </Grid>

                        </Grid>

                        {/* =========================================
                            ACTIONS
                        ========================================= */}

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={2}
                            sx={{
                                mt: 4
                            }}
                        >

                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Item"}
                            </Button>

                        </Stack>

                    </form>

                </CardContent>

            </Card>

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
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: "100%"
                    }}
                >
                    {snackbar.message}
                </Alert>

            </Snackbar>

        </Box>
    );
};

export default PurchaseOrderItemCreate;