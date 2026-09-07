import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button
} from "@mui/material";


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {

    MarketplaceOrderItemId: 0,

    MarketplaceOrderId: "",

    MarketplaceListingId: "",

    ProductId: "",

    MarketplaceOrderItemNumber: "",

    ExternalOrderItemId: "",

    ProductTitle: "",

    SKU: "",

    Quantity: "",

    UnitPrice: "",

    TaxAmount: "",

    ShippingAmount: "",

    DiscountAmount: "",

    TotalAmount: ""

};


/* =========================================================
   COMPONENT
========================================================= */

const MarketplaceOrderItemModal = ({
    open,
    onClose,
    onSave,
    marketplaceOrderItem
}) => {

    const [formData, setFormData] =
        useState(initialState);


    /* =====================================================
       LOAD EDIT DATA
    ===================================================== */

    useEffect(() => {

        if (marketplaceOrderItem) {

            setFormData({

                MarketplaceOrderItemId:
                    marketplaceOrderItem.MarketplaceOrderItemId ??
                    0,

                MarketplaceOrderId:
                    marketplaceOrderItem.MarketplaceOrderId ??
                    "",

                MarketplaceListingId:
                    marketplaceOrderItem.MarketplaceListingId ??
                    "",

                ProductId:
                    marketplaceOrderItem.ProductId ??
                    "",

                MarketplaceOrderItemNumber:
                    marketplaceOrderItem.MarketplaceOrderItemNumber ??
                    "",

                ExternalOrderItemId:
                    marketplaceOrderItem.ExternalOrderItemId ??
                    "",

                ProductTitle:
                    marketplaceOrderItem.ProductTitle ??
                    "",

                SKU:
                    marketplaceOrderItem.SKU ??
                    "",

                Quantity:
                    marketplaceOrderItem.Quantity ??
                    "",

                UnitPrice:
                    marketplaceOrderItem.UnitPrice ??
                    "",

                TaxAmount:
                    marketplaceOrderItem.TaxAmount ??
                    "",

                ShippingAmount:
                    marketplaceOrderItem.ShippingAmount ??
                    "",

                DiscountAmount:
                    marketplaceOrderItem.DiscountAmount ??
                    "",

                TotalAmount:
                    marketplaceOrderItem.TotalAmount ??
                    ""

            });

        }
        else {

            setFormData({
                ...initialState
            });

        }

    }, [
        marketplaceOrderItem,
        open
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

    };


    /* =====================================================
       NUMBER HELPER
    ===================================================== */

    const toNumberOrNull = (value) => {

        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {

            return null;

        }

        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : null;

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = (event) => {

        event.preventDefault();


        /* =================================================
           VALIDATE REQUIRED MARKETPLACE ORDER ID
        ================================================= */

        const marketplaceOrderId =
            Number(
                formData.MarketplaceOrderId
            );

        if (
            !Number.isFinite(
                marketplaceOrderId
            ) ||
            marketplaceOrderId <= 0
        ) {

            return;

        }


        /* =================================================
           PREPARE PAYLOAD
        ================================================= */

        const payload = {

            MarketplaceOrderItemId:
                Number(
                    formData.MarketplaceOrderItemId || 0
                ),

            MarketplaceOrderId:
                marketplaceOrderId,

            MarketplaceListingId:
                toNumberOrNull(
                    formData.MarketplaceListingId
                ),

            ProductId:
                toNumberOrNull(
                    formData.ProductId
                ),

            MarketplaceOrderItemNumber:
                formData.MarketplaceOrderItemNumber
                    ?.trim() || null,

            ExternalOrderItemId:
                formData.ExternalOrderItemId
                    ?.trim() || null,

            ProductTitle:
                formData.ProductTitle
                    ?.trim() || null,

            SKU:
                formData.SKU
                    ?.trim() || null,

            Quantity:
                toNumberOrNull(
                    formData.Quantity
                ),

            UnitPrice:
                toNumberOrNull(
                    formData.UnitPrice
                ),

            TaxAmount:
                toNumberOrNull(
                    formData.TaxAmount
                ),

            ShippingAmount:
                toNumberOrNull(
                    formData.ShippingAmount
                ),

            DiscountAmount:
                toNumberOrNull(
                    formData.DiscountAmount
                ),

            TotalAmount:
                toNumberOrNull(
                    formData.TotalAmount
                )

        };


        /* =================================================
           SEND TO PARENT
        ================================================= */

        onSave(payload);

    };


    /* =====================================================
       RESET WHEN CLOSED
    ===================================================== */

    const handleClose = () => {

        setFormData({
            ...initialState
        });

        onClose();

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                {
                    formData.MarketplaceOrderItemId
                        ? "Edit Marketplace Order Item"
                        : "Add Marketplace Order Item"
                }

            </DialogTitle>


            {/* =================================================
                FORM
            ================================================= */}

            <form onSubmit={handleSubmit}>

                <DialogContent>

                    <Grid
                        container
                        spacing={2}
                        sx={{ mt: 0.5 }}
                    >

                        {/* =====================================
                            MARKETPLACE ORDER ID
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
                                label="Marketplace Order ID"
                                name="MarketplaceOrderId"

                                value={
                                    formData.MarketplaceOrderId
                                }

                                onChange={
                                    handleChange
                                }

                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            MARKETPLACE LISTING ID
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Marketplace Listing ID"
                                name="MarketplaceListingId"

                                value={
                                    formData.MarketplaceListingId
                                }

                                onChange={
                                    handleChange
                                }

                                inputProps={{
                                    min: 1
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


                        {/* =====================================
                            MARKETPLACE ORDER ITEM NUMBER
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Marketplace Order Item No."
                                name="MarketplaceOrderItemNumber"

                                value={
                                    formData.MarketplaceOrderItemNumber
                                }

                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =====================================
                            EXTERNAL ORDER ITEM ID
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="External Order Item ID"
                                name="ExternalOrderItemId"

                                value={
                                    formData.ExternalOrderItemId
                                }

                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =====================================
                            PRODUCT TITLE
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="Product Title"
                                name="ProductTitle"

                                value={
                                    formData.ProductTitle
                                }

                                onChange={
                                    handleChange
                                }
                            />

                        </Grid>


                        {/* =====================================
                            SKU
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                label="SKU"
                                name="SKU"

                                value={
                                    formData.SKU
                                }

                                onChange={
                                    handleChange
                                }
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


                        {/* =====================================
                            UNIT PRICE
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <TextField
                                fullWidth
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
                                    step: "any"
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            TAX AMOUNT
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={3}
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
                                    step: "any"
                                }}
                            />

                        </Grid>


                        {/* =====================================
                            SHIPPING AMOUNT
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Shipping Amount"
                                name="ShippingAmount"

                                value={
                                    formData.ShippingAmount
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


                        {/* =====================================
                            DISCOUNT AMOUNT
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Discount Amount"
                                name="DiscountAmount"

                                value={
                                    formData.DiscountAmount
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


                        {/* =====================================
                            TOTAL AMOUNT
                        ===================================== */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <TextField
                                fullWidth
                                type="number"
                                label="Total Amount"
                                name="TotalAmount"

                                value={
                                    formData.TotalAmount
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

                    </Grid>

                </DialogContent>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <DialogActions
                    sx={{
                        px: 3,
                        pb: 2
                    }}
                >

                    <Button
                        onClick={handleClose}
                        color="inherit"
                    >

                        Cancel

                    </Button>


                    <Button
                        type="submit"
                        variant="contained"
                    >

                        Save

                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );

};


export default MarketplaceOrderItemModal;
