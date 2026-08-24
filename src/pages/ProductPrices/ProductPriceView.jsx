import React from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Grid,Typography,Divider,Chip} from "@mui/material";
const ProductPriceView = ({
    open,
    productPrice,
    onClose
}) => {

    if (!productPrice) return null;

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

                Product Price Details

            </DialogTitle>

            <Divider />

            <DialogContent sx={{ mt: 2 }}>

                <Grid container spacing={3}>

                    <Field

                        label="Product Price ID"

                        value={productPrice.ProductPriceId}

                    />

                    <Field

                        label="Product ID"

                        value={productPrice.ProductId}

                    />

                    <Field

                        label="Seller ID"

                        value={productPrice.SellerId}

                    />

                    <Field

                        label="Price Type"

                        value={productPrice.PriceType}

                    />

                    <Field

                        label="Price"

                        value={productPrice.Price}

                    />

                    <Field

                        label="Currency"

                        value={productPrice.Currency}

                    />

                    <Field

                        label="Effective From"

                        value={
                            productPrice.EffectiveFrom
                                ? new Date(
                                    productPrice.EffectiveFrom
                                ).toLocaleString()
                                : "-"
                        }

                    />

                    <Field

                        label="Effective To"

                        value={
                            productPrice.EffectiveTo
                                ? new Date(
                                    productPrice.EffectiveTo
                                ).toLocaleString()
                                : "-"
                        }

                    />

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
                                productPrice.IsActive
                                    ? "Active"
                                    : "Inactive"
                            }

                            color={
                                productPrice.IsActive
                                    ? "success"
                                    : "error"
                            }

                        />

                    </Grid>

                    <Field

                        label="Created"

                        value={
                            productPrice.CreatedDate
                                ? new Date(
                                    productPrice.CreatedDate
                                ).toLocaleString()
                                : "-"
                        }

                    />

                    <Field

                        label="Updated"

                        value={
                            productPrice.UpdatedDate
                                ? new Date(
                                    productPrice.UpdatedDate
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

export default ProductPriceView;