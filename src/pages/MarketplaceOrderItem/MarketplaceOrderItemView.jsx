import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider
} from "@mui/material";

const MarketplaceOrderItemView = ({
    open,
    onClose,
    marketplaceOrderItem
}) => {

    if (!marketplaceOrderItem) return null;

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleString();

    };

    const formatCurrency = (value) => {

        return `₹ ${Number(value || 0).toLocaleString()}`;

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >

            <DialogTitle>

                Marketplace Order Item Details

            </DialogTitle>

            <DialogContent dividers>

                <Grid container spacing={3}>

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

                    <Grid item xs={12} md={6}>

                        <Typography variant="subtitle2">

                            Marketplace Order Item ID

                        </Typography>

                        <Typography>

                            {marketplaceOrderItem.MarketplaceOrderItemId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography variant="subtitle2">

                            Marketplace Order ID

                        </Typography>

                        <Typography>

                            {marketplaceOrderItem.MarketplaceOrderId}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography variant="subtitle2">

                            Marketplace Listing ID

                        </Typography>

                        <Typography>

                            {marketplaceOrderItem.MarketplaceListingId || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography variant="subtitle2">

                            Product ID

                        </Typography>

                        <Typography>

                            {marketplaceOrderItem.ProductId || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography variant="subtitle2">

                            Marketplace Order Item Number

                        </Typography>

                        <Typography>

                            {marketplaceOrderItem.MarketplaceOrderItemNumber || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography variant="subtitle2">

                            External Order Item ID

                        </Typography>

                        <Typography>

                            {marketplaceOrderItem.ExternalOrderItemId || "-"}

                        </Typography>

                    </Grid>

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

                    <Grid item xs={12} md={8}>

                        <Typography variant="subtitle2">

                            Product Title

                        </Typography>

                        <Typography>

                            {marketplaceOrderItem.ProductTitle || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography variant="subtitle2">

                            SKU

                        </Typography>

                        <Typography>

                            {marketplaceOrderItem.SKU || "-"}

                        </Typography>

                    </Grid>

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

                    <Grid item xs={12} md={4}>

                        <Typography variant="subtitle2">

                            Quantity

                        </Typography>

                        <Typography>

                            {marketplaceOrderItem.Quantity ?? 0}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography variant="subtitle2">

                            Unit Price

                        </Typography>

                        <Typography>

                            {formatCurrency(marketplaceOrderItem.UnitPrice)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography variant="subtitle2">

                            Tax Amount

                        </Typography>

                        <Typography>

                            {formatCurrency(marketplaceOrderItem.TaxAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography variant="subtitle2">

                            Shipping Amount

                        </Typography>

                        <Typography>

                            {formatCurrency(marketplaceOrderItem.ShippingAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography variant="subtitle2">

                            Discount Amount

                        </Typography>

                        <Typography>

                            {formatCurrency(marketplaceOrderItem.DiscountAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography
                            variant="subtitle2"
                            color="primary"
                        >

                            Total Amount

                        </Typography>

                        <Typography
                            fontWeight="bold"
                            color="primary"
                        >

                            {formatCurrency(marketplaceOrderItem.TotalAmount)}

                        </Typography>

                    </Grid>

                    <Grid item xs={12}>

                        <Divider sx={{ my: 2 }} />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography variant="subtitle2">

                            Created Date

                        </Typography>

                        <Typography>

                            {formatDate(marketplaceOrderItem.CreatedDate)}

                        </Typography>

                    </Grid>

                </Grid>

            </DialogContent>

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