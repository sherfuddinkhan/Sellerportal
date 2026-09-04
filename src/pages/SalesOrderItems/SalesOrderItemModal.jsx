import React, {useEffect,useState} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button
} from "@mui/material";

// =========================================================
// INITIAL FORM STATE
// =========================================================

const initialState = {

    SalesOrderItemId: 0,

    SalesOrderId: "",

    ProductId: "",

    LineNumber: "",

    Quantity: "",

    UnitPrice: "",

    TotalAmount: "",

    TaxAmount: "",

    DiscountAmount: "",

    Remarks: ""

};

// =========================================================
// SALES ORDER ITEM MODAL
// =========================================================

const SalesOrderItemModal = ({
    open,
    item,
    onClose,
    onSave
}) => {

    const [formData, setFormData] =
        useState(initialState);

    const [errors, setErrors] =
        useState({});

    // =====================================================
    // LOAD ITEM FOR EDIT
    // =====================================================

    useEffect(() => {

        if (item) {

            setFormData({

                ...initialState,

                ...item,

                SalesOrderItemId:
                    item.SalesOrderItemId ??
                    item.salesOrderItemId ??
                    0,

                SalesOrderId:
                    item.SalesOrderId ??
                    item.salesOrderId ??
                    "",

                ProductId:
                    item.ProductId ??
                    item.productId ??
                    "",

                LineNumber:
                    item.LineNumber ??
                    item.lineNumber ??
                    "",

                Quantity:
                    item.Quantity ??
                    item.quantity ??
                    "",

                UnitPrice:
                    item.UnitPrice ??
                    item.unitPrice ??
                    "",

                TotalAmount:
                    item.TotalAmount ??
                    item.totalAmount ??
                    "",

                TaxAmount:
                    item.TaxAmount ??
                    item.taxAmount ??
                    "",

                DiscountAmount:
                    item.DiscountAmount ??
                    item.discountAmount ??
                    "",

                Remarks:
                    item.Remarks ??
                    item.remarks ??
                    ""

            });

        }
        else {

            setFormData(initialState);

        }

        setErrors({});

    }, [item, open]);

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));

        // Clear field error
        setErrors((prev) => ({

            ...prev,

            [name]: ""

        }));

    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        const newErrors = {};

        if (!formData.SalesOrderId) {

            newErrors.SalesOrderId =
                "Sales Order ID is required";

        }

        if (!formData.ProductId) {

            newErrors.ProductId =
                "Product ID is required";

        }

        if (
            formData.Quantity === "" ||
            Number(formData.Quantity) <= 0
        ) {

            newErrors.Quantity =
                "Quantity must be greater than 0";

        }

        if (
            formData.UnitPrice === "" ||
            Number(formData.UnitPrice) < 0
        ) {

            newErrors.UnitPrice =
                "Enter a valid unit price";

        }

        if (
            formData.TotalAmount === "" ||
            Number(formData.TotalAmount) < 0
        ) {

            newErrors.TotalAmount =
                "Enter a valid total amount";

        }

        if (
            formData.TaxAmount !== "" &&
            Number(formData.TaxAmount) < 0
        ) {

            newErrors.TaxAmount =
                "Tax amount cannot be negative";

        }

        if (
            formData.DiscountAmount !== "" &&
            Number(formData.DiscountAmount) < 0
        ) {

            newErrors.DiscountAmount =
                "Discount cannot be negative";

        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = () => {

        if (!validate()) {

            return;

        }

        const payload = {

            SalesOrderItemId:
                Number(
                    formData.SalesOrderItemId || 0
                ),

            SalesOrderId:
                Number(formData.SalesOrderId),

            ProductId:
                Number(formData.ProductId),

            LineNumber:
                Number(formData.LineNumber || 0),

            Quantity:
                Number(formData.Quantity || 0),

            UnitPrice:
                Number(formData.UnitPrice || 0),

            TotalAmount:
                Number(formData.TotalAmount || 0),

            TaxAmount:
                Number(formData.TaxAmount || 0),

            DiscountAmount:
                Number(
                    formData.DiscountAmount || 0
                ),

            Remarks:
                formData.Remarks?.trim() || ""

        };

        onSave(payload);

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                {formData.SalesOrderItemId
                    ? "Edit Sales Order Item"
                    : "Add Sales Order Item"}

            </DialogTitle>

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 0.5 }}
                >

                    {/* =====================================
                        SALES ORDER ID
                    ===================================== */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Sales Order ID"
                            name="SalesOrderId"
                            type="number"
                            value={
                                formData.SalesOrderId
                            }
                            onChange={handleChange}
                            error={
                                Boolean(
                                    errors.SalesOrderId
                                )
                            }
                            helperText={
                                errors.SalesOrderId
                            }
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>

                    {/* =====================================
                        PRODUCT ID
                    ===================================== */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Product ID"
                            name="ProductId"
                            type="number"
                            value={
                                formData.ProductId
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
                                min: 1
                            }}
                        />

                    </Grid>

                    {/* =====================================
                        LINE NUMBER
                    ===================================== */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Line Number"
                            name="LineNumber"
                            type="number"
                            value={
                                formData.LineNumber
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 0
                            }}
                        />

                    </Grid>

                    {/* =====================================
                        QUANTITY
                    ===================================== */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Quantity"
                            name="Quantity"
                            type="number"
                            value={
                                formData.Quantity
                            }
                            onChange={handleChange}
                            error={
                                Boolean(
                                    errors.Quantity
                                )
                            }
                            helperText={
                                errors.Quantity
                            }
                            inputProps={{
                                min: 0,
                                step: "any"
                            }}
                        />

                    </Grid>

                    {/* =====================================
                        UNIT PRICE
                    ===================================== */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Unit Price"
                            name="UnitPrice"
                            type="number"
                            value={
                                formData.UnitPrice
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
                                step: "any"
                            }}
                        />

                    </Grid>

                    {/* =====================================
                        DISCOUNT
                    ===================================== */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Discount Amount"
                            name="DiscountAmount"
                            type="number"
                            value={
                                formData.DiscountAmount
                            }
                            onChange={handleChange}
                            error={
                                Boolean(
                                    errors.DiscountAmount
                                )
                            }
                            helperText={
                                errors.DiscountAmount
                            }
                            inputProps={{
                                min: 0,
                                step: "any"
                            }}
                        />

                    </Grid>

                    {/* =====================================
                        TAX AMOUNT
                    ===================================== */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Tax Amount"
                            name="TaxAmount"
                            type="number"
                            value={
                                formData.TaxAmount
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
                                step: "any"
                            }}
                        />

                    </Grid>

                    {/* =====================================
                        TOTAL AMOUNT
                    ===================================== */}

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Total Amount"
                            name="TotalAmount"
                            type="number"
                            value={
                                formData.TotalAmount
                            }
                            onChange={handleChange}
                            error={
                                Boolean(
                                    errors.TotalAmount
                                )
                            }
                            helperText={
                                errors.TotalAmount
                            }
                            inputProps={{
                                min: 0,
                                step: "any"
                            }}
                        />

                    </Grid>

                    {/* =====================================
                        REMARKS
                    ===================================== */}

                    <Grid item xs={12}>

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Remarks"
                            name="Remarks"
                            value={
                                formData.Remarks
                            }
                            onChange={handleChange}
                            placeholder="Enter remarks"
                        />

                    </Grid>

                </Grid>

            </DialogContent>

            {/* =============================================
                ACTIONS
            ============================================= */}

            <DialogActions>

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

                    {formData.SalesOrderItemId
                        ? "Update"
                        : "Save"}

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default SalesOrderItemModal;
