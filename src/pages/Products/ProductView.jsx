import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider,
    Chip
} from "@mui/material";

const ProductView = ({
    open,
    product,
    onClose
}) => {

    if (!product) return null;

    const Field = ({ label, value }) => (

        <Grid item xs={12} md={6}>

            <Typography
                variant="caption"
                color="text.secondary"
            >

                {label}

            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
            >

                {value || "-"}

            </Typography>

        </Grid>

    );

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="md"

        >

            <DialogTitle>

                Product Details

            </DialogTitle>

            <Divider />

            <DialogContent sx={{ mt: 2 }}>

                <Grid container spacing={3}>

                    <Field

                        label="Product ID"

                        value={product.ProductId}

                    />

                    <Field

                        label="Seller ID"

                        value={product.SellerId}

                    />

                    <Field

                        label="SKU"

                        value={product.SKU}

                    />

                    <Field

                        label="Product Name"

                        value={product.ProductName}

                    />

                    <Field

                        label="Barcode"

                        value={product.Barcode}

                    />

                    <Field

                        label="HSN Code"

                        value={product.HSNCode}

                    />

                    <Field

                        label="Brand"

                        value={
                            product.BrandName ||

                            product.BrandId
                        }

                    />

                    <Field

                        label="Category"

                        value={
                            product.CategoryName ||

                            product.CategoryId
                        }

                    />

                    <Field

                        label="Product Type"

                        value={
                            product.ProductTypeName ||

                            product.ProductTypeId
                        }

                    />

                    <Field

                        label="Unit"

                        value={
                            product.UnitOfMeasure
                        }

                    />

                    <Field

                        label="Weight"

                        value={product.Weight}

                    />

                    <Field

                        label="Length"

                        value={product.Length}

                    />

                    <Field

                        label="Width"

                        value={product.Width}

                    />

                    <Field

                        label="Height"

                        value={product.Height}

                    />

                    <Grid item xs={12}>

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Description

                        </Typography>

                        <Typography>

                            {product.Description || "-"}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography

                            variant="caption"

                            color="text.secondary"

                        >

                            Status

                        </Typography>

                        <br />

                        <Chip

                            label={
                                product.IsActive

                                    ? "Active"

                                    : "Inactive"

                            }

                            color={
                                product.IsActive

                                    ? "success"

                                    : "error"

                            }

                        />

                    </Grid>

                    <Field

                        label="Workflow Status"

                        value={product.Status}

                    />

                    <Field

                        label="Created"

                        value={
                            product.CreatedDate

                                ? new Date(

                                    product.CreatedDate

                                ).toLocaleString()

                                : "-"
                        }

                    />

                    <Field

                        label="Updated"

                        value={
                            product.UpdatedDate

                                ? new Date(

                                    product.UpdatedDate

                                ).toLocaleString()

                                : "-"
                        }

                    />

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

export default ProductView;