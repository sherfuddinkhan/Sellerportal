// ==========================================================
// ProductPriceModal.jsx
// ==========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
} from "@mui/material";

// ==========================================================
// Initial Form
// ==========================================================

const INITIAL_FORM = {
    ProductPriceId: 0,
    ProductId: "",
    SellerId: "",
    PriceType: "",
    Price: "",
    Currency: "INR",
    EffectiveFrom: "",
    EffectiveTo: "",
    IsActive: true,
};

// ==========================================================
// ProductPriceModal
// ==========================================================

const ProductPriceModal = ({
    open,
    productPrice,
    onClose,
    onSave,
    saving = false,
}) => {
    const [formData, setFormData] =
        useState(INITIAL_FORM);

    // ======================================================
    // LOAD DATA
    // ======================================================

    useEffect(() => {
        if (!open) {
            return;
        }

        if (productPrice) {
            setFormData({
                ProductPriceId:
                    productPrice.ProductPriceId ??
                    productPrice.productPriceId ??
                    0,

                ProductId:
                    productPrice.ProductId ??
                    productPrice.productId ??
                    "",

                SellerId:
                    productPrice.SellerId ??
                    productPrice.sellerId ??
                    "",

                PriceType:
                    productPrice.PriceType ??
                    productPrice.priceType ??
                    "",

                Price:
                    productPrice.Price ??
                    productPrice.price ??
                    "",

                Currency:
                    productPrice.Currency ??
                    productPrice.currency ??
                    "INR",

                EffectiveFrom:
                    productPrice.EffectiveFrom
                        ? String(
                              productPrice.EffectiveFrom
                          ).substring(0, 10)
                        : productPrice.effectiveFrom
                        ? String(
                              productPrice.effectiveFrom
                          ).substring(0, 10)
                        : "",

                EffectiveTo:
                    productPrice.EffectiveTo
                        ? String(
                              productPrice.EffectiveTo
                          ).substring(0, 10)
                        : productPrice.effectiveTo
                        ? String(
                              productPrice.effectiveTo
                          ).substring(0, 10)
                        : "",

                IsActive:
                    productPrice.IsActive ??
                    productPrice.isActive ??
                    true,
            });
        } else {
            setFormData({
                ...INITIAL_FORM,
            });
        }
    }, [
        productPrice,
        open,
    ]);

    // ======================================================
    // HANDLE CHANGE
    // ======================================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ======================================================
    // HANDLE ACTIVE
    // ======================================================

    const handleActiveChange = (
        event
    ) => {
        setFormData((previous) => ({
            ...previous,
            IsActive:
                event.target.checked,
        }));
    };

    // ======================================================
    // SUBMIT
    // ======================================================

    const handleSubmit = () => {
        const payload = {
            ...formData,

            ProductPriceId:
                Number(
                    formData.ProductPriceId
                ) || 0,

            ProductId:
                Number(
                    formData.ProductId
                ) || 0,

            SellerId:
                Number(
                    formData.SellerId
                ) || 0,

            Price:
                Number(
                    formData.Price
                ) || 0,

            IsActive:
                Boolean(
                    formData.IsActive
                ),
        };

        onSave(payload);
    };

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <Dialog
            open={open}
            onClose={
                saving
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {productPrice
                    ? "Edit Product Price"
                    : "Add Product Price"}
            </DialogTitle>

            <Divider />

            <DialogContent
                sx={{ mt: 2 }}
            >
                <Grid
                    container
                    spacing={3}
                >
                    {/* PRODUCT ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Product ID"
                            name="ProductId"
                            type="number"
                            value={
                                formData.ProductId
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />
                    </Grid>

                    {/* SELLER ID */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Seller ID"
                            name="SellerId"
                            type="number"
                            value={
                                formData.SellerId
                            }
                            onChange={
                                handleChange
                            }
                            required
                        />
                    </Grid>

                    {/* PRICE TYPE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Price Type"
                            name="PriceType"
                            value={
                                formData.PriceType
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Retail / Wholesale / Dealer"
                            required
                        />
                    </Grid>

                    {/* PRICE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            name="Price"
                            value={
                                formData.Price
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                                step: "0.01",
                            }}
                            required
                        />
                    </Grid>

                    {/* CURRENCY */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <FormControl
                            fullWidth
                        >
                            <InputLabel>
                                Currency
                            </InputLabel>

                            <Select
                                name="Currency"
                                value={
                                    formData.Currency
                                }
                                label="Currency"
                                onChange={
                                    handleChange
                                }
                            >
                                <MenuItem value="INR">
                                    INR
                                </MenuItem>

                                <MenuItem value="USD">
                                    USD
                                </MenuItem>

                                <MenuItem value="EUR">
                                    EUR
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* EFFECTIVE FROM */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            type="date"
                            label="Effective From"
                            name="EffectiveFrom"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={
                                formData.EffectiveFrom
                            }
                            onChange={
                                handleChange
                            }
                        />
                    </Grid>

                    {/* EFFECTIVE TO */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            type="date"
                            label="Effective To"
                            name="EffectiveTo"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={
                                formData.EffectiveTo
                            }
                            onChange={
                                handleChange
                            }
                        />
                    </Grid>

                    {/* ACTIVE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        formData.IsActive
                                    }
                                    onChange={
                                        handleActiveChange
                                    }
                                />
                            }
                            label="Active"
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={saving}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={
                        handleSubmit
                    }
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductPriceModal;
