import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    TextField,
    Button,
    Typography,
    Divider,
    Paper,
    Alert
} from "@mui/material";

import {
    Save,
    Clear,
    ArrowBack
} from "@mui/icons-material";

/* =========================================================
   INITIAL FORM STATE
========================================================= */

const initialFormData = {
    GoodsReceiptNoteItemId: null,
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
   GOODS RECEIPT NOTE ITEM FORM
========================================================= */

const GoodsReceiptNoteItemForm = ({
    initialData = null,
    onSubmit,
    onCancel,
    loading = false,
    submitLabel = "Save GRN Item"
}) => {

    const [formData, setFormData] = useState(initialFormData);

    const [errors, setErrors] = useState({});

    /* =========================================================
       LOAD INITIAL DATA
    ========================================================= */

    useEffect(() => {

        if (initialData) {

            setFormData({
                GoodsReceiptNoteItemId:
                    initialData.GoodsReceiptNoteItemId ?? null,

                GoodsReceiptNoteId:
                    initialData.GoodsReceiptNoteId ?? "",

                ProductId:
                    initialData.ProductId ?? "",

                ReceivedQuantity:
                    initialData.ReceivedQuantity ?? "",

                AcceptedQuantity:
                    initialData.AcceptedQuantity ?? "",

                RejectedQuantity:
                    initialData.RejectedQuantity ?? "",

                UnitPrice:
                    initialData.UnitPrice ?? "",

                TaxAmount:
                    initialData.TaxAmount ?? "",

                TotalAmount:
                    initialData.TotalAmount ?? ""
            });

        } else {

            setFormData(initialFormData);

        }

        setErrors({});

    }, [initialData]);

    /* =========================================================
       HANDLE INPUT CHANGE
    ========================================================= */

    const handleChange = (field) => (event) => {

        const value = event.target.value;

        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: ""
        }));
    };

    /* =========================================================
       CALCULATE TOTAL AMOUNT
    ========================================================= */

    useEffect(() => {

        const acceptedQuantity =
            Number(formData.AcceptedQuantity) || 0;

        const unitPrice =
            Number(formData.UnitPrice) || 0;

        const taxAmount =
            Number(formData.TaxAmount) || 0;

        const totalAmount =
            acceptedQuantity * unitPrice + taxAmount;

        setFormData((prev) => {

            const currentTotal =
                Number(prev.TotalAmount) || 0;

            if (currentTotal === totalAmount) {
                return prev;
            }

            return {
                ...prev,
                TotalAmount: totalAmount.toFixed(2)
            };

        });

    }, [
        formData.AcceptedQuantity,
        formData.UnitPrice,
        formData.TaxAmount
    ]);

    /* =========================================================
       VALIDATE FORM
    ========================================================= */

    const validate = () => {

        const newErrors = {};

        const receivedQuantity =
            Number(formData.ReceivedQuantity);

        const acceptedQuantity =
            Number(formData.AcceptedQuantity);

        const rejectedQuantity =
            Number(formData.RejectedQuantity);

        const unitPrice =
            Number(formData.UnitPrice);

        const taxAmount =
            Number(formData.TaxAmount);

        /* -----------------------------------------------------
           GRN ID
        ----------------------------------------------------- */

        if (
            formData.GoodsReceiptNoteId === "" ||
            formData.GoodsReceiptNoteId === null ||
            formData.GoodsReceiptNoteId === undefined
        ) {
            newErrors.GoodsReceiptNoteId =
                "GRN ID is required.";
        } else if (
            !Number.isInteger(
                Number(formData.GoodsReceiptNoteId)
            ) ||
            Number(formData.GoodsReceiptNoteId) <= 0
        ) {
            newErrors.GoodsReceiptNoteId =
                "Enter a valid GRN ID.";
        }

        /* -----------------------------------------------------
           PRODUCT ID
        ----------------------------------------------------- */

        if (
            formData.ProductId === "" ||
            formData.ProductId === null ||
            formData.ProductId === undefined
        ) {
            newErrors.ProductId =
                "Product ID is required.";
        } else if (
            !Number.isInteger(
                Number(formData.ProductId)
            ) ||
            Number(formData.ProductId) <= 0
        ) {
            newErrors.ProductId =
                "Enter a valid Product ID.";
        }

        /* -----------------------------------------------------
           RECEIVED QUANTITY
        ----------------------------------------------------- */

        if (
            formData.ReceivedQuantity === "" ||
            formData.ReceivedQuantity === null
        ) {
            newErrors.ReceivedQuantity =
                "Received quantity is required.";
        } else if (
            !Number.isFinite(receivedQuantity) ||
            receivedQuantity <= 0
        ) {
            newErrors.ReceivedQuantity =
                "Received quantity must be greater than 0.";
        }

        /* -----------------------------------------------------
           ACCEPTED QUANTITY
        ----------------------------------------------------- */

        if (
            formData.AcceptedQuantity === "" ||
            formData.AcceptedQuantity === null
        ) {
            newErrors.AcceptedQuantity =
                "Accepted quantity is required.";
        } else if (
            !Number.isFinite(acceptedQuantity) ||
            acceptedQuantity < 0
        ) {
            newErrors.AcceptedQuantity =
                "Accepted quantity cannot be negative.";
        }

        /* -----------------------------------------------------
           REJECTED QUANTITY
        ----------------------------------------------------- */

        if (
            formData.RejectedQuantity === "" ||
            formData.RejectedQuantity === null
        ) {
            newErrors.RejectedQuantity =
                "Rejected quantity is required.";
        } else if (
            !Number.isFinite(rejectedQuantity) ||
            rejectedQuantity < 0
        ) {
            newErrors.RejectedQuantity =
                "Rejected quantity cannot be negative.";
        }

        /* -----------------------------------------------------
           ACCEPTED + REJECTED
        ----------------------------------------------------- */

        if (
            Number.isFinite(acceptedQuantity) &&
            Number.isFinite(rejectedQuantity) &&
            Number.isFinite(receivedQuantity)
        ) {

            if (
                acceptedQuantity + rejectedQuantity >
                receivedQuantity
            ) {
                newErrors.AcceptedQuantity =
                    "Accepted + rejected quantity cannot exceed received quantity.";

                newErrors.RejectedQuantity =
                    "Accepted + rejected quantity cannot exceed received quantity.";
            }
        }

        /* -----------------------------------------------------
           UNIT PRICE
        ----------------------------------------------------- */

        if (
            formData.UnitPrice === "" ||
            formData.UnitPrice === null
        ) {
            newErrors.UnitPrice =
                "Unit price is required.";
        } else if (
            !Number.isFinite(unitPrice) ||
            unitPrice < 0
        ) {
            newErrors.UnitPrice =
                "Unit price cannot be negative.";
        }

        /* -----------------------------------------------------
           TAX AMOUNT
        ----------------------------------------------------- */

        if (
            formData.TaxAmount === "" ||
            formData.TaxAmount === null
        ) {
            newErrors.TaxAmount =
                "Tax amount is required.";
        } else if (
            !Number.isFinite(taxAmount) ||
            taxAmount < 0
        ) {
            newErrors.TaxAmount =
                "Tax amount cannot be negative.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =========================================================
       HANDLE SUBMIT
    ========================================================= */

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!validate()) {
            return;
        }

        const payload = {
            GoodsReceiptNoteItemId:
                formData.GoodsReceiptNoteItemId
                    ? Number(formData.GoodsReceiptNoteItemId)
                    : null,

            GoodsReceiptNoteId:
                Number(formData.GoodsReceiptNoteId),

            ProductId:
                Number(formData.ProductId),

            ReceivedQuantity:
                Number(formData.ReceivedQuantity),

            AcceptedQuantity:
                Number(formData.AcceptedQuantity),

            RejectedQuantity:
                Number(formData.RejectedQuantity),

            UnitPrice:
                Number(formData.UnitPrice),

            TaxAmount:
                Number(formData.TaxAmount),

            TotalAmount:
                Number(formData.TotalAmount)
        };

        if (typeof onSubmit === "function") {
            onSubmit(payload);
        }
    };

    /* =========================================================
       RESET FORM
    ========================================================= */

    const handleReset = () => {

        if (initialData) {

            setFormData({
                GoodsReceiptNoteItemId:
                    initialData.GoodsReceiptNoteItemId ?? null,

                GoodsReceiptNoteId:
                    initialData.GoodsReceiptNoteId ?? "",

                ProductId:
                    initialData.ProductId ?? "",

                ReceivedQuantity:
                    initialData.ReceivedQuantity ?? "",

                AcceptedQuantity:
                    initialData.AcceptedQuantity ?? "",

                RejectedQuantity:
                    initialData.RejectedQuantity ?? "",

                UnitPrice:
                    initialData.UnitPrice ?? "",

                TaxAmount:
                    initialData.TaxAmount ?? "",

                TotalAmount:
                    initialData.TotalAmount ?? ""
            });

        } else {

            setFormData(initialFormData);

        }

        setErrors({});
    };

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
                p: {
                    xs: 2,
                    sm: 3,
                    md: 4
                }
            }}
        >

            {/* =================================================
               HEADER
            ================================================= */}

            <Box sx={{ mb: 3 }}>

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    {formData.GoodsReceiptNoteItemId
                        ? "Edit GRN Item"
                        : "Create GRN Item"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Enter the goods receipt note item details.
                </Typography>

            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* =================================================
               VALIDATION MESSAGE
            ================================================= */}

            {Object.keys(errors).length > 0 && (

                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    Please correct the highlighted fields.
                </Alert>

            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >

                {/* =================================================
                   BASIC INFORMATION
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Basic Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 4 }}
                >

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="GRN ID"
                            type="number"
                            value={formData.GoodsReceiptNoteId}
                            onChange={handleChange(
                                "GoodsReceiptNoteId"
                            )}
                            error={
                                Boolean(
                                    errors.GoodsReceiptNoteId
                                )
                            }
                            helperText={
                                errors.GoodsReceiptNoteId
                            }
                            disabled={loading}
                            inputProps={{
                                min: 1
                            }}
                            required
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Product ID"
                            type="number"
                            value={formData.ProductId}
                            onChange={handleChange(
                                "ProductId"
                            )}
                            error={
                                Boolean(
                                    errors.ProductId
                                )
                            }
                            helperText={
                                errors.ProductId
                            }
                            disabled={loading}
                            inputProps={{
                                min: 1
                            }}
                            required
                        />

                    </Grid>

                </Grid>

                {/* =================================================
                   QUANTITY INFORMATION
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Quantity Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 4 }}
                >

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Received Quantity"
                            type="number"
                            value={formData.ReceivedQuantity}
                            onChange={handleChange(
                                "ReceivedQuantity"
                            )}
                            error={
                                Boolean(
                                    errors.ReceivedQuantity
                                )
                            }
                            helperText={
                                errors.ReceivedQuantity
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Accepted Quantity"
                            type="number"
                            value={formData.AcceptedQuantity}
                            onChange={handleChange(
                                "AcceptedQuantity"
                            )}
                            error={
                                Boolean(
                                    errors.AcceptedQuantity
                                )
                            }
                            helperText={
                                errors.AcceptedQuantity
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Rejected Quantity"
                            type="number"
                            value={formData.RejectedQuantity}
                            onChange={handleChange(
                                "RejectedQuantity"
                            )}
                            error={
                                Boolean(
                                    errors.RejectedQuantity
                                )
                            }
                            helperText={
                                errors.RejectedQuantity
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>

                </Grid>

                {/* =================================================
                   FINANCIAL INFORMATION
                ================================================= */}

                <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Financial Information
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 4 }}
                >

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Unit Price"
                            type="number"
                            value={formData.UnitPrice}
                            onChange={handleChange(
                                "UnitPrice"
                            )}
                            error={
                                Boolean(
                                    errors.UnitPrice
                                )
                            }
                            helperText={
                                errors.UnitPrice
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Tax Amount"
                            type="number"
                            value={formData.TaxAmount}
                            onChange={handleChange(
                                "TaxAmount"
                            )}
                            error={
                                Boolean(
                                    errors.TaxAmount
                                )
                            }
                            helperText={
                                errors.TaxAmount
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                            required
                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Total Amount"
                            type="number"
                            value={formData.TotalAmount}
                            disabled
                            InputProps={{
                                readOnly: true
                            }}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>

                </Grid>

                {/* =================================================
                   SUMMARY
                ================================================= */}

                <Box
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 1,
                        bgcolor: "grey.100"
                    }}
                >

                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                    >
                        Calculation
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ mt: 0.5 }}
                    >
                        Total Amount = Accepted Quantity × Unit
                        Price + Tax Amount
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mt: 1 }}
                    >
                        ₹{" "}
                        {Number(
                            formData.TotalAmount || 0
                        ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </Typography>

                </Box>

                {/* =================================================
                   ACTIONS
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >

                        <Button
                            variant="outlined"
                            startIcon={<Clear />}
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Reset
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Save />}
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : submitLabel}
                        </Button>

                    </Box>

                </Box>

            </Box>

        </Paper>
    );
};

export default GoodsReceiptNoteItemForm;
