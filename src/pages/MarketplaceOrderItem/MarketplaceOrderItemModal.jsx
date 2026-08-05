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

const MarketplaceOrderItemModal = ({
    open,
    onClose,
    onSave,
    marketplaceOrderItem
}) => {

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

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {

        if (marketplaceOrderItem) {

            setFormData({

                MarketplaceOrderItemId:
                    marketplaceOrderItem.MarketplaceOrderItemId || 0,

                MarketplaceOrderId:
                    marketplaceOrderItem.MarketplaceOrderId || "",

                MarketplaceListingId:
                    marketplaceOrderItem.MarketplaceListingId || "",

                ProductId:
                    marketplaceOrderItem.ProductId || "",

                MarketplaceOrderItemNumber:
                    marketplaceOrderItem.MarketplaceOrderItemNumber || "",

                ExternalOrderItemId:
                    marketplaceOrderItem.ExternalOrderItemId || "",

                ProductTitle:
                    marketplaceOrderItem.ProductTitle || "",

                SKU:
                    marketplaceOrderItem.SKU || "",

                Quantity:
                    marketplaceOrderItem.Quantity || "",

                UnitPrice:
                    marketplaceOrderItem.UnitPrice || "",

                TaxAmount:
                    marketplaceOrderItem.TaxAmount || "",

                ShippingAmount:
                    marketplaceOrderItem.ShippingAmount || "",

                DiscountAmount:
                    marketplaceOrderItem.DiscountAmount || "",

                TotalAmount:
                    marketplaceOrderItem.TotalAmount || ""

            });

        }
        else {

            setFormData(initialState);

        }

    }, [marketplaceOrderItem, open]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave({

            ...formData,

            MarketplaceOrderId:
                Number(formData.MarketplaceOrderId),

            MarketplaceListingId:
                formData.MarketplaceListingId
                    ? Number(formData.MarketplaceListingId)
                    : null,

            ProductId:
                formData.ProductId
                    ? Number(formData.ProductId)
                    : null,

            Quantity:
                Number(formData.Quantity),

            UnitPrice:
                Number(formData.UnitPrice),

            TaxAmount:
                Number(formData.TaxAmount),

            ShippingAmount:
                Number(formData.ShippingAmount),

            DiscountAmount:
                Number(formData.DiscountAmount),

            TotalAmount:
                Number(formData.TotalAmount)

        });

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >

            <DialogTitle>

                {

                    formData.MarketplaceOrderItemId

                        ? "Edit Marketplace Order Item"

                        : "Add Marketplace Order Item"

                }

            </DialogTitle>

            <form onSubmit={handleSubmit}>

                <DialogContent>

                    <Grid container spacing={2}>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                required
                                label="Marketplace Order ID"
                                name="MarketplaceOrderId"
                                value={formData.MarketplaceOrderId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Marketplace Listing ID"
                                name="MarketplaceListingId"
                                value={formData.MarketplaceListingId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Product ID"
                                name="ProductId"
                                value={formData.ProductId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Marketplace Order Item No."
                                name="MarketplaceOrderItemNumber"
                                value={formData.MarketplaceOrderItemNumber}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="External Order Item ID"
                                name="ExternalOrderItemId"
                                value={formData.ExternalOrderItemId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Product Title"
                                name="ProductTitle"
                                value={formData.ProductTitle}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="SKU"
                                name="SKU"
                                value={formData.SKU}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Quantity"
                                name="Quantity"
                                value={formData.Quantity}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Unit Price"
                                name="UnitPrice"
                                value={formData.UnitPrice}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Tax Amount"
                                name="TaxAmount"
                                value={formData.TaxAmount}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Shipping Amount"
                                name="ShippingAmount"
                                value={formData.ShippingAmount}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Discount Amount"
                                name="DiscountAmount"
                                value={formData.DiscountAmount}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Total Amount"
                                name="TotalAmount"
                                value={formData.TotalAmount}
                                onChange={handleChange}
                            />

                        </Grid>

                    </Grid>

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={onClose}
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