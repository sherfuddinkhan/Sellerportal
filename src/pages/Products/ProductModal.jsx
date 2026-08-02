import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Chip,
    Divider
} from "@mui/material";

const ProductModal = ({
    open,
    onClose,
    product
}) => {

    if (!product) return null;

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>

                Product Details

            </DialogTitle>

            <Divider />

            <DialogContent sx={{ mt: 2 }}>

                <Grid container spacing={3}>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            Product Name

                        </Typography>

                        <Typography variant="h6">

                            {product.productName}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            SKU

                        </Typography>

                        <Typography>

                            {product.sku}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            Barcode

                        </Typography>

                        <Typography>

                            {product.barcode || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            Brand

                        </Typography>

                        <Typography>

                            {product.brandName}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            Category

                        </Typography>

                        <Typography>

                            {product.categoryName}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            Product Type

                        </Typography>

                        <Typography>

                            {product.productTypeName}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography color="text.secondary">

                            Cost Price

                        </Typography>

                        <Typography>

                            ₹ {product.costPrice}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography color="text.secondary">

                            Selling Price

                        </Typography>

                        <Typography>

                            ₹ {product.sellingPrice}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography color="text.secondary">

                            Stock

                        </Typography>

                        <Typography>

                            {product.stockQuantity}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            Reorder Level

                        </Typography>

                        <Typography>

                            {product.reorderLevel}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            Unit

                        </Typography>

                        <Typography>

                            {product.unit}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            HSN Code

                        </Typography>

                        <Typography>

                            {product.hsnCode}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography color="text.secondary">

                            Status

                        </Typography>

                        <Chip

                            label={
                                product.isActive
                                    ? "Active"
                                    : "Inactive"
                            }

                            color={
                                product.isActive
                                    ? "success"
                                    : "error"
                            }

                        />

                    </Grid>

                    <Grid item xs={12}>

                        <Typography color="text.secondary">

                            Description

                        </Typography>

                        <Typography>

                            {product.description || "-"}

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

export default ProductModal;