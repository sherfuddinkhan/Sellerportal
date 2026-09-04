import React, { useEffect, useState } from "react";

import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
TextField,
Grid,
Typography,
Alert
} from "@mui/material";

/* =========================================================
INITIAL FORM STATE
========================================================= */

const initialFormData = {
PurchaseOrderId: "",
ProductId: "",
Quantity: "",
UnitPrice: "",
Discount: "",
TaxAmount: "",
TotalAmount: ""
};

/* =========================================================
PURCHASE ORDER ITEM CREATE
========================================================= */

const PurchaseOrderItemCreate = ({
open,
onClose,
onSave
}) => {
const [formData, setFormData] = useState(initialFormData);

const [error, setError] = useState("");


/* =====================================================
   RESET FORM WHEN OPENING
===================================================== */

useEffect(() => {

    if (open) {
        setFormData(initialFormData);
        setError("");
    }

}, [open]);


/* =====================================================
   CALCULATE TOTAL
===================================================== */

useEffect(() => {

    const quantity = Number(formData.Quantity) || 0;
    const unitPrice = Number(formData.UnitPrice) || 0;
    const discount = Number(formData.Discount) || 0;
    const taxAmount = Number(formData.TaxAmount) || 0;

    const total =
        (quantity * unitPrice) -
        discount +
        taxAmount;

    setFormData((previous) => ({
        ...previous,
        TotalAmount: Math.max(0, total).toFixed(2)
    }));

}, [
    formData.Quantity,
    formData.UnitPrice,
    formData.Discount,
    formData.TaxAmount
]);


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
   VALIDATE FORM
===================================================== */

const validateForm = () => {

    if (!formData.PurchaseOrderId) {
        return "Purchase Order ID is required.";
    }

    if (!formData.ProductId) {
        return "Product ID is required.";
    }

    if (
        !formData.Quantity ||
        Number(formData.Quantity) <= 0
    ) {
        return "Quantity must be greater than 0.";
    }

    if (
        formData.UnitPrice === "" ||
        Number(formData.UnitPrice) < 0
    ) {
        return "Unit Price cannot be negative.";
    }

    if (
        formData.Discount !== "" &&
        Number(formData.Discount) < 0
    ) {
        return "Discount cannot be negative.";
    }

    if (
        formData.TaxAmount !== "" &&
        Number(formData.TaxAmount) < 0
    ) {
        return "Tax Amount cannot be negative.";
    }

    return "";
};


/* =====================================================
   HANDLE SUBMIT
===================================================== */

const handleSubmit = (event) => {

    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
        setError(validationError);
        return;
    }


    const payload = {
        PurchaseOrderId: Number(formData.PurchaseOrderId),
        ProductId: Number(formData.ProductId),
        Quantity: Number(formData.Quantity),
        UnitPrice: Number(formData.UnitPrice) || 0,
        Discount: Number(formData.Discount) || 0,
        TaxAmount: Number(formData.TaxAmount) || 0,
        TotalAmount: Number(formData.TotalAmount) || 0
    };


    console.log(
        "CREATE PURCHASE ORDER ITEM:",
        payload
    );


    if (typeof onSave === "function") {
        onSave(payload);
    }

};


/* =====================================================
   RENDER
===================================================== */

return (
    <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
    >

        <DialogTitle>
            Create Purchase Order Item
        </DialogTitle>


        <DialogContent dividers>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}


            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                Enter the purchase order item details below.
            </Typography>


            <Grid
                container
                spacing={2}
            >

                {/* Purchase Order ID */}

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
                        value={formData.PurchaseOrderId}
                        onChange={handleChange}
                    />

                </Grid>


                {/* Product ID */}

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
                        value={formData.ProductId}
                        onChange={handleChange}
                    />

                </Grid>


                {/* Quantity */}

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
                        value={formData.Quantity}
                        onChange={handleChange}
                        inputProps={{
                            min: 0,
                            step: "0.01"
                        }}
                    />

                </Grid>


                {/* Unit Price */}

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
                        value={formData.UnitPrice}
                        onChange={handleChange}
                        inputProps={{
                            min: 0,
                            step: "0.01"
                        }}
                    />

                </Grid>


                {/* Discount */}

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
                        value={formData.Discount}
                        onChange={handleChange}
                        inputProps={{
                            min: 0,
                            step: "0.01"
                        }}
                    />

                </Grid>


                {/* Tax Amount */}

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
                        value={formData.TaxAmount}
                        onChange={handleChange}
                        inputProps={{
                            min: 0,
                            step: "0.01"
                        }}
                    />

                </Grid>


                {/* Total Amount */}

                <Grid
                    item
                    xs={12}
                >

                    <TextField
                        fullWidth
                        label="Total Amount"
                        name="TotalAmount"
                        value={formData.TotalAmount}
                        InputProps={{
                            readOnly: true
                        }}
                    />

                </Grid>

            </Grid>

        </DialogContent>


        <DialogActions>

            <Button
                onClick={onClose}
            >
                Cancel
            </Button>

            <Button
                variant="contained"
                onClick={handleSubmit}
            >
                Create Item
            </Button>

        </DialogActions>

    </Dialog>
);
};

export default PurchaseOrderItemCreate;
