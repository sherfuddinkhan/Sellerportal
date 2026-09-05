import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Divider,
    Typography,
    Alert
} from "@mui/material";


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
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
   GOODS RECEIPT NOTE ITEM MODAL
========================================================= */

const GoodsReceiptNoteItemModal = ({
    open,
    item,
    onClose,
    onSave
}) => {

    const [formData, setFormData] =
        useState(initialState);

    const [error, setError] =
        useState("");


    /* =====================================================
       LOAD ITEM INTO FORM
    ===================================================== */

    useEffect(() => {

        setError("");

        if (item) {

            setFormData({
                GoodsReceiptNoteItemId:
                    item.GoodsReceiptNoteItemId ?? null,

                GoodsReceiptNoteId:
                    item.GoodsReceiptNoteId ?? "",

                ProductId:
                    item.ProductId ?? "",

                ReceivedQuantity:
                    item.ReceivedQuantity ?? "",

                AcceptedQuantity:
                    item.AcceptedQuantity ?? "",

                RejectedQuantity:
                    item.RejectedQuantity ?? "",

                UnitPrice:
                    item.UnitPrice ?? "",

                TaxAmount:
                    item.TaxAmount ?? "",

                TotalAmount:
                    item.TotalAmount ?? ""
            });

        } else {

            setFormData({
                ...initialState
            });

        }

    }, [item, open]);


    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

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


    /* =====================================================
       CALCULATE TOTAL
       
       Accepted Quantity × Unit Price + Tax
    ===================================================== */

    const calculateTotal = () => {

        const acceptedQuantity =
            Number(formData.AcceptedQuantity || 0);

        const unitPrice =
            Number(formData.UnitPrice || 0);

        const taxAmount =
            Number(formData.TaxAmount || 0);

        return (
            acceptedQuantity *
            unitPrice
        ) + taxAmount;
    };


    /* =====================================================
       AUTO CALCULATE TOTAL
    ===================================================== */

    useEffect(() => {

        if (!open) {
            return;
        }

        const total =
            calculateTotal();

        setFormData((previous) => ({
            ...previous,
            TotalAmount:
                total.toFixed(2)
        }));

    }, [
        formData.AcceptedQuantity,
        formData.UnitPrice,
        formData.TaxAmount,
        open
    ]);


    /* =====================================================
       VALIDATION
    ===================================================== */

    const validateForm = () => {

        if (!formData.GoodsReceiptNoteId) {

            return "Goods Receipt Note ID is required.";
        }


        if (!formData.ProductId) {

            return "Product ID is required.";
        }


        if (
            formData.ReceivedQuantity === "" ||
            Number(formData.ReceivedQuantity) < 0
        ) {

            return "Valid Received Quantity is required.";
        }


        if (
            formData.AcceptedQuantity === "" ||
            Number(formData.AcceptedQuantity) < 0
        ) {

            return "Valid Accepted Quantity is required.";
        }


        if (
            formData.RejectedQuantity !== "" &&
            Number(formData.RejectedQuantity) < 0
        ) {

            return "Rejected Quantity cannot be negative.";
        }


        if (
            Number(formData.AcceptedQuantity || 0) >
            Number(formData.ReceivedQuantity || 0)
        ) {

            return "Accepted Quantity cannot be greater than Received Quantity.";
        }


        if (
            Number(formData.RejectedQuantity || 0) >
            Number(formData.ReceivedQuantity || 0)
        ) {

            return "Rejected Quantity cannot be greater than Received Quantity.";
        }


        if (
            Number(formData.AcceptedQuantity || 0) +
            Number(formData.RejectedQuantity || 0)
            >
            Number(formData.ReceivedQuantity || 0)
        ) {

            return "Accepted Quantity + Rejected Quantity cannot be greater than Received Quantity.";
        }


        if (
            formData.UnitPrice !== "" &&
            Number(formData.UnitPrice) < 0
        ) {

            return "Unit Price cannot be negative.";
        }


        if (
            formData.TaxAmount !== "" &&
            Number(formData.TaxAmount) < 0
        ) {

            return "Tax Amount cannot be negative.";
        }


        return null;
    };


    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = () => {

        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;
        }


        const calculatedTotal =
            calculateTotal();


        const data = {

            GoodsReceiptNoteItemId:
                formData.GoodsReceiptNoteItemId
                    ? Number(
                        formData.GoodsReceiptNoteItemId
                    )
                    : null,

            GoodsReceiptNoteId:
                Number(
                    formData.GoodsReceiptNoteId
                ),

            ProductId:
                Number(
                    formData.ProductId
                ),

            ReceivedQuantity:
                Number(
                    formData.ReceivedQuantity || 0
                ),

            AcceptedQuantity:
                Number(
                    formData.AcceptedQuantity || 0
                ),

            RejectedQuantity:
                Number(
                    formData.RejectedQuantity || 0
                ),

            UnitPrice:
                Number(
                    formData.UnitPrice || 0
                ),

            TaxAmount:
                Number(
                    formData.TaxAmount || 0
                ),

            TotalAmount:
                Number(
                    calculatedTotal.toFixed(2)
                )
        };


        console.log(
            "GRN ITEM SAVE DATA:",
            data
        );


        onSave(data);
    };


    /* =====================================================
       TITLE
    ===================================================== */

    const title =
        formData.GoodsReceiptNoteItemId
            ? "Edit Goods Receipt Note Item"
            : "Add Goods Receipt Note Item";


    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    fontWeight: "bold"
                }}
            >
                {title}
            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                {/* =============================================
                    VALIDATION ERROR
                ============================================= */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            mb: 2
                        }}
                    >
                        {error}
                    </Alert>

                )}


                <Grid
                    container
                    spacing={2}
                    sx={{
                        mt: 0.5
                    }}
                >

                    {/* =========================================
                        GRN ITEM ID
                    ========================================= */}

                    {formData.GoodsReceiptNoteItemId && (

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="GRN Item ID"
                                value={
                                    formData.GoodsReceiptNoteItemId
                                }
                                InputProps={{
                                    readOnly: true
                                }}
                            />

                        </Grid>

                    )}


                    {/* =========================================
                        GRN ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={
                            formData.GoodsReceiptNoteItemId
                                ? 6
                                : 6
                        }
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Goods Receipt Note ID"
                            name="GoodsReceiptNoteId"
                            value={
                                formData.GoodsReceiptNoteId
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        PRODUCT ID
                    ========================================= */}

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
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        DIVIDER
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Divider sx={{ my: 1 }} />

                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                        >
                            Quantity Information
                        </Typography>

                    </Grid>


                    {/* =========================================
                        RECEIVED QUANTITY
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Received Quantity"
                            name="ReceivedQuantity"
                            value={
                                formData.ReceivedQuantity
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        ACCEPTED QUANTITY
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Accepted Quantity"
                            name="AcceptedQuantity"
                            value={
                                formData.AcceptedQuantity
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        REJECTED QUANTITY
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Rejected Quantity"
                            name="RejectedQuantity"
                            value={
                                formData.RejectedQuantity
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        PRICE INFORMATION
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Divider sx={{ my: 1 }} />

                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                        >
                            Price Information
                        </Typography>

                    </Grid>


                    {/* =========================================
                        UNIT PRICE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Unit Price"
                            name="UnitPrice"
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


                    {/* =========================================
                        TAX
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Tax Amount"
                            name="TaxAmount"
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


                    {/* =========================================
                        TOTAL
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            fullWidth
                            type="number"
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

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2
                }}
            >

                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {formData.GoodsReceiptNoteItemId
                        ? "Update"
                        : "Save"}
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default GoodsReceiptNoteItemModal;
