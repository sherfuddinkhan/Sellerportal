import React, {
useEffect,
useState
} from "react";

import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
TextField,
Grid
} from "@mui/material";

/* =========================================================
INITIAL STATE
========================================================= */

const initialState = {
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
PURCHASE ORDER ITEM MODAL
========================================================= */

const PurchaseOrderItemModal = ({
open,
item,
onClose,
onSave
}) => {
const [formData, setFormData] = useState(
    initialState
);


/* =====================================================
   LOAD ITEM FOR EDIT
===================================================== */

useEffect(() => {

    if (!open) {
        return;
    }

    if (item) {

        setFormData({

            PurchaseOrderItemId:
                item.PurchaseOrderItemId ??
                null,

            PurchaseOrderId:
                item.PurchaseOrderId ??
                "",

            ProductId:
                item.ProductId ??
                "",

            Quantity:
                item.Quantity ??
                "",

            UnitPrice:
                item.UnitPrice ??
                "",

            Discount:
                item.Discount ??
                "",

            TaxAmount:
                item.TaxAmount ??
                "",

            TotalAmount:
                item.TotalAmount ??
                ""

        });

    }
    else {

        setFormData({
            ...initialState
        });

    }

}, [
    item,
    open
]);


/* =====================================================
   HANDLE INPUT CHANGE
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

};


/* =====================================================
   CALCULATE TOTAL
   
   Total =
   (Quantity × UnitPrice)
   - Discount
   + TaxAmount
===================================================== */

const calculateTotal = () => {

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
        subtotal -
        discount +
        taxAmount;

    return Math.max(
        0,
        total
    ).toFixed(2);

};


/* =====================================================
   AUTOMATIC TOTAL CALCULATION
===================================================== */

useEffect(() => {

    if (!open) {
        return;
    }

    const total =
        calculateTotal();

    setFormData((previous) => {

        if (
            previous.TotalAmount === total
        ) {
            return previous;
        }

        return {
            ...previous,
            TotalAmount: total
        };

    });

}, [
    formData.Quantity,
    formData.UnitPrice,
    formData.Discount,
    formData.TaxAmount,
    open
]);


/* =====================================================
   VALIDATION
===================================================== */

const validateForm = () => {

    if (
        !formData.PurchaseOrderId
    ) {
        return "Purchase Order ID is required";
    }

    if (
        !formData.ProductId
    ) {
        return "Product ID is required";
    }

    const quantity =
        Number(formData.Quantity);

    if (
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        return "Quantity must be greater than 0";
    }

    const unitPrice =
        Number(formData.UnitPrice);

    if (
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
    ) {
        return "Unit Price cannot be negative";
    }

    const discount =
        Number(formData.Discount || 0);

    if (
        !Number.isFinite(discount) ||
        discount < 0
    ) {
        return "Discount cannot be negative";
    }

    const taxAmount =
        Number(formData.TaxAmount || 0);

    if (
        !Number.isFinite(taxAmount) ||
        taxAmount < 0
    ) {
        return "Tax Amount cannot be negative";
    }

    return null;

};


/* =====================================================
   SUBMIT
===================================================== */

const handleSubmit = () => {

    const validationError =
        validateForm();

    if (validationError) {

        return;

    }


    const quantity =
        Number(formData.Quantity);

    const unitPrice =
        Number(formData.UnitPrice);

    const discount =
        Number(formData.Discount || 0);

    const taxAmount =
        Number(formData.TaxAmount || 0);

    const totalAmount =
        Number(calculateTotal());


    const payload = {

        PurchaseOrderItemId:
            formData.PurchaseOrderItemId
                ? Number(
                    formData.PurchaseOrderItemId
                )
                : null,

        PurchaseOrderId:
            Number(
                formData.PurchaseOrderId
            ),

        ProductId:
            Number(
                formData.ProductId
            ),

        Quantity:
            quantity,

        UnitPrice:
            unitPrice,

        Discount:
            discount,

        TaxAmount:
            taxAmount,

        TotalAmount:
            totalAmount

    };


    console.log(
        "PURCHASE ORDER ITEM PAYLOAD:",
        payload
    );


    onSave(payload);

};


/* =====================================================
   CLOSE MODAL
===================================================== */

const handleClose = () => {

    setFormData({
        ...initialState
    });

    onClose();

};


/* =====================================================
   MODE
===================================================== */

const isEditMode =
    Boolean(
        formData.PurchaseOrderItemId
    );


/* =====================================================
   RENDER
===================================================== */

return (

    <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
    >

        {/* =================================================
            TITLE
        ================================================= */}

        <DialogTitle>

            {
                isEditMode
                    ? "Edit Purchase Order Item"
                    : "Add Purchase Order Item"
            }

        </DialogTitle>


        {/* =================================================
            CONTENT
        ================================================= */}

        <DialogContent dividers>

            <Grid
                container
                spacing={2}
                sx={{
                    mt: 0.5
                }}
            >

                {/* =========================================
                    PURCHASE ORDER ID
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
                        label="Purchase Order ID"
                        name="PurchaseOrderId"
                        value={
                            formData.PurchaseOrderId
                        }
                        onChange={
                            handleChange
                        }
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
                        onChange={
                            handleChange
                        }
                        inputProps={{
                            min: 1
                        }}
                    />

                </Grid>


                {/* =========================================
                    QUANTITY
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
                            step: "any"
                        }}
                    />

                </Grid>


                {/* =========================================
                    UNIT PRICE
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


                {/* =========================================
                    DISCOUNT
                ========================================= */}

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


                {/* =========================================
                    TAX AMOUNT
                ========================================= */}

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


                {/* =========================================
                    TOTAL AMOUNT
                ========================================= */}

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

        </DialogContent>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <DialogActions>

            <Button
                onClick={handleClose}
            >
                Cancel
            </Button>

            <Button
                variant="contained"
                onClick={handleSubmit}
            >
                {
                    isEditMode
                        ? "Update"
                        : "Save"
                }
            </Button>

        </DialogActions>

    </Dialog>

);
};

export default PurchaseOrderItemModal;

