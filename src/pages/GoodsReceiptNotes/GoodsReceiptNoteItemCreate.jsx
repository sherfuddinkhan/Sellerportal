import React, {
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Snackbar
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";


/* =========================================================
   API CONFIGURATION
========================================================= */

const SERVER_URL = "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/goods-receipt-note-items`;


/* =========================================================
   INITIAL FORM
========================================================= */

const initialForm = {
    GoodsReceiptNoteId: "",
    ProductId: "",
    ReceivedQuantity: "",
    AcceptedQuantity: "",
    RejectedQuantity: "",
    UnitPrice: "",
    TaxAmount: "",
    TotalAmount: ""
};


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const amount = Number(value);

    if (!Number.isFinite(amount)) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


/* =========================================================
   COMPONENT
========================================================= */

const GoodsReceiptNoteItemCreate = () => {

    const navigate = useNavigate();


    /* =========================================================
       STATE
    ========================================================= */

    const [form, setForm] = useState(initialForm);

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });


    /* =========================================================
       CALCULATE TOTAL
    ========================================================= */

    const calculateTotal = (
        acceptedQuantity = form.AcceptedQuantity,
        unitPrice = form.UnitPrice,
        taxAmount = form.TaxAmount
    ) => {

        const quantity = Number(
            acceptedQuantity || 0
        );

        const price = Number(
            unitPrice || 0
        );

        const tax = Number(
            taxAmount || 0
        );

        if (
            !Number.isFinite(quantity) ||
            !Number.isFinite(price) ||
            !Number.isFinite(tax)
        ) {
            return 0;
        }

        return (
            quantity * price
        ) + tax;
    };


    /* =========================================================
       HANDLE CHANGE
    ========================================================= */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm((previous) => {

            const updatedForm = {
                ...previous,
                [name]: value
            };


            /* -----------------------------------------------
               AUTO CALCULATE TOTAL
            ------------------------------------------------ */

            if (
                name === "AcceptedQuantity" ||
                name === "UnitPrice" ||
                name === "TaxAmount"
            ) {

                const total = calculateTotal(
                    name === "AcceptedQuantity"
                        ? value
                        : previous.AcceptedQuantity,

                    name === "UnitPrice"
                        ? value
                        : previous.UnitPrice,

                    name === "TaxAmount"
                        ? value
                        : previous.TaxAmount
                );


                updatedForm.TotalAmount =
                    total.toFixed(2);
            }


            return updatedForm;
        });


        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };


    /* =========================================================
       VALIDATION
    ========================================================= */

    const validateForm = () => {

        const validationErrors = {};


        /* -----------------------------------------------------
           GRN ID
        ----------------------------------------------------- */

        if (
            !form.GoodsReceiptNoteId ||
            Number(form.GoodsReceiptNoteId) <= 0
        ) {

            validationErrors.GoodsReceiptNoteId =
                "Goods Receipt Note ID is required.";
        }


        /* -----------------------------------------------------
           PRODUCT ID
        ----------------------------------------------------- */

        if (
            !form.ProductId ||
            Number(form.ProductId) <= 0
        ) {

            validationErrors.ProductId =
                "Product ID is required.";
        }


        /* -----------------------------------------------------
           RECEIVED QUANTITY
        ----------------------------------------------------- */

        const receivedQuantity =
            Number(form.ReceivedQuantity || 0);

        if (
            form.ReceivedQuantity === "" ||
            !Number.isFinite(receivedQuantity) ||
            receivedQuantity <= 0
        ) {

            validationErrors.ReceivedQuantity =
                "Received Quantity must be greater than 0.";
        }


        /* -----------------------------------------------------
           ACCEPTED QUANTITY
        ----------------------------------------------------- */

        const acceptedQuantity =
            Number(form.AcceptedQuantity || 0);

        if (
            !Number.isFinite(acceptedQuantity) ||
            acceptedQuantity < 0
        ) {

            validationErrors.AcceptedQuantity =
                "Accepted Quantity cannot be negative.";
        }


        /* -----------------------------------------------------
           REJECTED QUANTITY
        ----------------------------------------------------- */

        const rejectedQuantity =
            Number(form.RejectedQuantity || 0);

        if (
            !Number.isFinite(rejectedQuantity) ||
            rejectedQuantity < 0
        ) {

            validationErrors.RejectedQuantity =
                "Rejected Quantity cannot be negative.";
        }


        /* -----------------------------------------------------
           QUANTITY CONSISTENCY
        ----------------------------------------------------- */

        if (
            acceptedQuantity +
            rejectedQuantity >
            receivedQuantity
        ) {

            validationErrors.RejectedQuantity =
                "Accepted Quantity + Rejected Quantity cannot exceed Received Quantity.";
        }


        /* -----------------------------------------------------
           UNIT PRICE
        ----------------------------------------------------- */

        const unitPrice =
            Number(form.UnitPrice || 0);

        if (
            !Number.isFinite(unitPrice) ||
            unitPrice < 0
        ) {

            validationErrors.UnitPrice =
                "Unit Price cannot be negative.";
        }


        /* -----------------------------------------------------
           TAX
        ----------------------------------------------------- */

        const taxAmount =
            Number(form.TaxAmount || 0);

        if (
            !Number.isFinite(taxAmount) ||
            taxAmount < 0
        ) {

            validationErrors.TaxAmount =
                "Tax Amount cannot be negative.";
        }


        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };


    /* =========================================================
       SUBMIT
    ========================================================= */

    const handleSubmit = async (event) => {

        event.preventDefault();


        /* -----------------------------------------------------
           VALIDATE
        ----------------------------------------------------- */

        if (!validateForm()) {

            setSnackbar({
                open: true,
                message: "Please correct the highlighted fields.",
                severity: "error"
            });

            return;
        }


        try {

            setLoading(true);


            /* -------------------------------------------------
               PAYLOAD
            ------------------------------------------------- */

            const payload = {

                GoodsReceiptNoteId:
                    Number(
                        form.GoodsReceiptNoteId
                    ),

                ProductId:
                    Number(
                        form.ProductId
                    ),

                ReceivedQuantity:
                    Number(
                        form.ReceivedQuantity || 0
                    ),

                AcceptedQuantity:
                    Number(
                        form.AcceptedQuantity || 0
                    ),

                RejectedQuantity:
                    Number(
                        form.RejectedQuantity || 0
                    ),

                UnitPrice:
                    Number(
                        form.UnitPrice || 0
                    ),

                TaxAmount:
                    Number(
                        form.TaxAmount || 0
                    ),

                TotalAmount:
                    Number(
                        form.TotalAmount ||
                        calculateTotal()
                    )
            };


            console.log(
                "CREATE GOODS RECEIPT NOTE ITEM PAYLOAD:",
                payload
            );


            /* -------------------------------------------------
               POST API
            ------------------------------------------------- */

            const response =
                await axios.post(
                    API_URL,
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            console.log(
                "CREATE GOODS RECEIPT NOTE ITEM RESPONSE:",
                response.data
            );


            /* -------------------------------------------------
               SUCCESS
            ------------------------------------------------- */

            setSnackbar({
                open: true,
                message:
                    "Goods Receipt Note Item created successfully.",
                severity: "success"
            });


            /* -------------------------------------------------
               NAVIGATE
            ------------------------------------------------- */

            setTimeout(() => {

                navigate(
                    "/goods-receipt-note-items"
                );

            }, 1000);


        } catch (error) {

            console.error(
                "CREATE GOODS RECEIPT NOTE ITEM ERROR:",
                error
            );


            let message =
                "Failed to create Goods Receipt Note Item.";


            if (error.response?.data?.message) {

                message =
                    error.response.data.message;

            } else if (
                typeof error.response?.data === "string"
            ) {

                message =
                    error.response.data;

            } else if (
                error.message
            ) {

                message =
                    error.message;
            }


            setSnackbar({
                open: true,
                message,
                severity: "error"
            });


        } finally {

            setLoading(false);
        }
    };


    /* =========================================================
       BACK
    ========================================================= */

    const handleBack = () => {

        navigate(
            "/goods-receipt-note-items"
        );
    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <Box
            sx={{
                p: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >

                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    Create Goods Receipt Note Item
                </Typography>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                >
                    Back
                </Button>

            </Box>


            {/* =================================================
                FORM CARD
            ================================================= */}

            <Card>

                <CardContent>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        {/* =====================================
                            SECTION TITLE
                        ====================================== */}

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                mb: 2
                            }}
                        >
                            Goods Receipt Note Item Information
                        </Typography>


                        <Divider
                            sx={{
                                mb: 3
                            }}
                        />


                        {/* =====================================
                            FORM FIELDS
                        ====================================== */}

                        <Grid
                            container
                            spacing={2}
                        >

                            {/* ---------------------------------
                                GOODS RECEIPT NOTE ID
                            ---------------------------------- */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Goods Receipt Note ID"
                                    name="GoodsReceiptNoteId"
                                    type="number"
                                    value={
                                        form.GoodsReceiptNoteId
                                    }
                                    onChange={handleChange}
                                    error={
                                        Boolean(
                                            errors.GoodsReceiptNoteId
                                        )
                                    }
                                    helperText={
                                        errors.GoodsReceiptNoteId
                                    }
                                    inputProps={{
                                        min: 1,
                                        step: 1
                                    }}
                                />

                            </Grid>


                            {/* ---------------------------------
                                PRODUCT ID
                            ---------------------------------- */}

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Product ID"
                                    name="ProductId"
                                    type="number"
                                    value={
                                        form.ProductId
                                    }
                                    onChange={handleChange}
                                    error={
                                        Boolean(
                                            errors.ProductId
                                        )
                                    }
                                    helperText={
                                        errors.ProductId
                                    }
                                    inputProps={{
                                        min: 1,
                                        step: 1
                                    }}
                                />

                            </Grid>


                            {/* ---------------------------------
                                RECEIVED QUANTITY
                            ---------------------------------- */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Received Quantity"
                                    name="ReceivedQuantity"
                                    type="number"
                                    value={
                                        form.ReceivedQuantity
                                    }
                                    onChange={handleChange}
                                    error={
                                        Boolean(
                                            errors.ReceivedQuantity
                                        )
                                    }
                                    helperText={
                                        errors.ReceivedQuantity
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* ---------------------------------
                                ACCEPTED QUANTITY
                            ---------------------------------- */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Accepted Quantity"
                                    name="AcceptedQuantity"
                                    type="number"
                                    value={
                                        form.AcceptedQuantity
                                    }
                                    onChange={handleChange}
                                    error={
                                        Boolean(
                                            errors.AcceptedQuantity
                                        )
                                    }
                                    helperText={
                                        errors.AcceptedQuantity
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* ---------------------------------
                                REJECTED QUANTITY
                            ---------------------------------- */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Rejected Quantity"
                                    name="RejectedQuantity"
                                    type="number"
                                    value={
                                        form.RejectedQuantity
                                    }
                                    onChange={handleChange}
                                    error={
                                        Boolean(
                                            errors.RejectedQuantity
                                        )
                                    }
                                    helperText={
                                        errors.RejectedQuantity
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* ---------------------------------
                                UNIT PRICE
                            ---------------------------------- */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Unit Price"
                                    name="UnitPrice"
                                    type="number"
                                    value={
                                        form.UnitPrice
                                    }
                                    onChange={handleChange}
                                    error={
                                        Boolean(
                                            errors.UnitPrice
                                        )
                                    }
                                    helperText={
                                        errors.UnitPrice
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* ---------------------------------
                                TAX AMOUNT
                            ---------------------------------- */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Tax Amount"
                                    name="TaxAmount"
                                    type="number"
                                    value={
                                        form.TaxAmount
                                    }
                                    onChange={handleChange}
                                    error={
                                        Boolean(
                                            errors.TaxAmount
                                        )
                                    }
                                    helperText={
                                        errors.TaxAmount
                                    }
                                    inputProps={{
                                        min: 0,
                                        step: "0.01"
                                    }}
                                />

                            </Grid>


                            {/* ---------------------------------
                                TOTAL AMOUNT
                            ---------------------------------- */}

                            <Grid
                                item
                                xs={12}
                                md={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Total Amount"
                                    name="TotalAmount"
                                    type="number"
                                    value={
                                        form.TotalAmount ||
                                        calculateTotal()
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        display: "block",
                                        mt: 0.5
                                    }}
                                >
                                    Accepted Quantity × Unit Price
                                    + Tax Amount
                                </Typography>

                            </Grid>

                        </Grid>


                        {/* =================================================
                            TOTAL PREVIEW
                        ================================================= */}

                        <Divider
                            sx={{
                                my: 3
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: 2
                            }}
                        >

                            <Typography
                                variant="body1"
                                color="text.secondary"
                            >
                                Total Amount:
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                            >
                                {formatCurrency(
                                    form.TotalAmount ||
                                    calculateTotal()
                                )}
                            </Typography>

                        </Box>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                                mt: 3
                            }}
                        >

                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={handleBack}
                                disabled={loading}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading
                                        ? (
                                            <CircularProgress
                                                size={20}
                                                color="inherit"
                                            />
                                        )
                                        : (
                                            <Save />
                                        )
                                }
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Item"}
                            </Button>

                        </Box>

                    </form>

                </CardContent>

            </Card>


            {/* =================================================
                SNACKBAR
            ================================================= */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
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


export default GoodsReceiptNoteItemCreate;

