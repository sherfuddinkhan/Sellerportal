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
EMPTY FORM
========================================================= */

const emptyForm = {
PurchaseOrderItemId: null,
PurchaseOrderId: "",
ProductId: "",
Quantity: "",
UnitPrice: "",
Discount: "",
TaxAmount: "",
TotalAmount: ""
};

/* =========================================================
PURCHASE ORDER ITEM EDIT
========================================================= */

const PurchaseOrderItemEdit = ({
open,
item,
onClose,
onSave
}) => {
const [formData, setFormData] = useState(emptyForm);
const [error, setError] = useState("");


/* =====================================================
   LOAD ITEM
===================================================== */

useEffect(() => {

    if (!open) {
        return;
    }

    if (!item) {
        setFormData(emptyForm);
        setError("");
        return;
    }


    setFormData({
        PurchaseOrderItemId:
            item.PurchaseOrderItemId ?? null,

        PurchaseOrderId:
            item.PurchaseOrderId ?? "",

        ProductId:
            item.ProductId ?? "",

        Quantity:
            item.Quantity ?? "",

        UnitPrice:
            item.UnitPrice ?? "",

        Discount:
            item.Discount ?? "",

        TaxAmount:
            item.TaxAmount ?? "",

        TotalAmount:
            item.TotalAmount ?? ""
    });

    setError("");

}, [open, item]);


/* =====================================================
   CALCULATE TOTAL
===================================================== */

useEffect(() => {

    if (!open) {
        return;
    }

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
        Math.max(0, total).toFixed(2);


    setFormData((previous) => {

        if (
            previous.TotalAmount === calculatedTotal
        ) {
            return previous;
        }

        return {
            ...previous,
            TotalAmount: calculatedTotal
        };
    });

}, [
    open,
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
   VALIDATION
===================================================== */

const validateForm = () => {

    if (!formData.PurchaseOrderItemId) {
        return "Purchase Order Item ID is required.";
    }

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
   SUBMIT
===================================================== */

const handleSubmit = (event) => {

    event.preventDefault();


    const validationError =
        validateForm();


    if (validationError) {
        setError(validationError);
        return;
    }


    const payload = {
        PurchaseOrderItemId:
            Number(formData.PurchaseOrderItemId),

        PurchaseOrderId:
            Number(formData.PurchaseOrderId),

        ProductId:
            Number(formData.ProductId),

        Quantity:
            Number(formData.Quantity),

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
        "UPDATE PURCHASE ORDER ITEM:",
        payload
    );


    if (typeof onSave === "function") {
        onSave(payload);
    }

};


/* =====================================================
   NO ITEM
===================================================== */

if (!item && open) {
    return null;
}


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
            Edit Purchase Order Item
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
                Update the purchase order item details below.
            </Typography>


            <Grid
                container
                spacing={2}
            >

                {/* Item ID */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        fullWidth
                        label="Purchase Order Item ID"
                        value={
                            formData.PurchaseOrderItemId ?? ""
                        }
                        InputProps={{
                            readOnly: true
                        }}
                    />

                </Grid>


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
                color="primary"
                onClick={handleSubmit}
            >
                Update Item
            </Button>

        </DialogActions>

    </Dialog>
);
};

export default PurchaseOrderItemEdit;
