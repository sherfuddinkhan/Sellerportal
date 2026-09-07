import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider,
    Box
} from "@mui/material";


/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("en-IN");
};


/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "₹ 0.00";
    }

    return `₹ ${number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};


/* =========================================================
   DISPLAY VALUE
========================================================= */

const displayValue = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    return value;
};


/* =========================================================
   MARKETPLACE ORDER ITEM VIEW
========================================================= */

const MarketplaceOrderItemView = ({
    open,
    onClose,
    marketplaceOrderItem
}) => {

    if (!marketplaceOrderItem) {
        return null;
    }


    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle>

                Marketplace Order Item Details

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={3}
                >

                    {/* =================================================
                        BASIC INFORMATION
                    ================================================= */}

                    <Grid item xs={12}>

                        <Divider sx={{ mb: 2 }}>

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                            >
                                Basic Information
                            </Typography>

                        </Divider>

                    </Grid>


                    {/* ---------------------------------------------
                        ORDER ITEM ID
                    --------------------------------------------- */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Marketplace Order Item ID
                        </Typography>

                        <Typography>
                            {displayValue(
                                marketplaceOrderItem.MarketplaceOrderItemId
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        ORDER ID
                    --------------------------------------------- */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Marketplace Order ID
                        </Typography>

                        <Typography>
                            {displayValue(
                                marketplaceOrderItem.MarketplaceOrderId
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        LISTING ID
                    --------------------------------------------- */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Marketplace Listing ID
                        </Typography>

                        <Typography>
                            {displayValue(
                                marketplaceOrderItem.MarketplaceListingId
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        PRODUCT ID
                    --------------------------------------------- */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography>
                            {displayValue(
                                marketplaceOrderItem.ProductId
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        ORDER ITEM NUMBER
                    --------------------------------------------- */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Marketplace Order Item Number
                        </Typography>

                        <Typography>
                            {displayValue(
                                marketplaceOrderItem.MarketplaceOrderItemNumber
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        EXTERNAL ORDER ITEM ID
                    --------------------------------------------- */}

                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            External Order Item ID
                        </Typography>

                        <Typography>
                            {displayValue(
                                marketplaceOrderItem.ExternalOrderItemId
                            )}
                        </Typography>

                    </Grid>


                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <Grid item xs={12}>

                        <Divider sx={{ my: 2 }}>

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                            >
                                Product Information
                            </Typography>

                        </Divider>

                    </Grid>


                    {/* ---------------------------------------------
                        PRODUCT TITLE
                    --------------------------------------------- */}

                    <Grid item xs={12} md={8}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Product Title
                        </Typography>

                        <Typography
                            sx={{
                                wordBreak: "break-word"
                            }}
                        >
                            {displayValue(
                                marketplaceOrderItem.ProductTitle
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        SKU
                    --------------------------------------------- */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            SKU
                        </Typography>

                        <Typography>
                            {displayValue(
                                marketplaceOrderItem.SKU
                            )}
                        </Typography>

                    </Grid>


                    {/* =================================================
                        PRICING DETAILS
                    ================================================= */}

                    <Grid item xs={12}>

                        <Divider sx={{ my: 2 }}>

                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                            >
                                Pricing Details
                            </Typography>

                        </Divider>

                    </Grid>


                    {/* ---------------------------------------------
                        QUANTITY
                    --------------------------------------------- */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Quantity
                        </Typography>

                        <Typography>
                            {marketplaceOrderItem.Quantity ?? 0}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        UNIT PRICE
                    --------------------------------------------- */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Unit Price
                        </Typography>

                        <Typography>
                            {formatCurrency(
                                marketplaceOrderItem.UnitPrice
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        TAX
                    --------------------------------------------- */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Tax Amount
                        </Typography>

                        <Typography>
                            {formatCurrency(
                                marketplaceOrderItem.TaxAmount
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        SHIPPING
                    --------------------------------------------- */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Shipping Amount
                        </Typography>

                        <Typography>
                            {formatCurrency(
                                marketplaceOrderItem.ShippingAmount
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        DISCOUNT
                    --------------------------------------------- */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Discount Amount
                        </Typography>

                        <Typography>
                            {formatCurrency(
                                marketplaceOrderItem.DiscountAmount
                            )}
                        </Typography>

                    </Grid>


                    {/* ---------------------------------------------
                        TOTAL
                    --------------------------------------------- */}

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="primary"
                        >
                            Total Amount
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary"
                        >
                            {formatCurrency(
                                marketplaceOrderItem.TotalAmount
                            )}
                        </Typography>

                    </Grid>


                    {/* =================================================
                        DATES
                    ================================================= */}

                    <Grid item xs={12}>

                        <Divider sx={{ my: 2 }} />

                    </Grid>


                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography>
                            {formatDate(
                                marketplaceOrderItem.CreatedDate
                            )}
                        </Typography>

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>

                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>

    );

};


export default MarketplaceOrderItemView;
