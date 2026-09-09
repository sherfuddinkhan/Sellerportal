// =========================================================
// ProductPriceForm.jsx
// ID-BASED PRODUCT PRICE FORM
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    Switch,
    FormControlLabel,
    CircularProgress,
    Box,
} from "@mui/material";

// =========================================================
// Product Price Form
// =========================================================

const ProductPriceForm = ({
    initialValues,
    onSubmit,
    onCancel,
    loading = false,
}) => {

    // =====================================================
    // STATE
    // =====================================================

    const [errors, setErrors] =
        useState({});


    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        ProductPriceId: 0,
        ProductId: "",
        SellerId: "",
        PriceType: "Selling",
        Price: "",
        Currency: "INR",
        EffectiveFrom: "",
        EffectiveTo: "",
        IsActive: true,
    });


    // =====================================================
    // LOAD INITIAL VALUES
    // =====================================================

    useEffect(() => {

        if (!initialValues) {

            setFormData({
                ProductPriceId: 0,
                ProductId: "",
                SellerId: "",
                PriceType: "Selling",
                Price: "",
                Currency: "INR",
                EffectiveFrom: "",
                EffectiveTo: "",
                IsActive: true,
            });

            return;
        }


        // =================================================
        // SUPPORT CAMELCASE + PASCALCASE
        // =================================================

        setFormData({

            ProductPriceId:
                initialValues.ProductPriceId ??
                initialValues.productPriceId ??
                0,

            ProductId:
                initialValues.ProductId ??
                initialValues.productId ??
                "",

            SellerId:
                initialValues.SellerId ??
                initialValues.sellerId ??
                "",

            PriceType:
                initialValues.PriceType ??
                initialValues.priceType ??
                "Selling",

            Price:
                initialValues.Price ??
                initialValues.price ??
                "",

            Currency:
                initialValues.Currency ??
                initialValues.currency ??
                "INR",

            EffectiveFrom:
                initialValues.EffectiveFrom ??
                initialValues.effectiveFrom ??
                "",

            EffectiveTo:
                initialValues.EffectiveTo ??
                initialValues.effectiveTo ??
                "",

            IsActive:
                initialValues.IsActive ??
                initialValues.isActive ??
                true,
        });

        setErrors({});

    }, [initialValues]);


    // =====================================================
    // CHANGE HANDLER
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            checked,
            type,
        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));


        // Clear error

        if (errors[name]) {

            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));

        }

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        const temp = {};


        // =================================================
        // PRODUCT ID
        // =================================================

        if (
            formData.ProductId === "" ||
            formData.ProductId === null ||
            formData.ProductId === undefined
        ) {

            temp.ProductId =
                "Product ID is required.";

        }


        // =================================================
        // PRICE TYPE
        // =================================================

        if (!formData.PriceType) {

            temp.PriceType =
                "Price Type is required.";

        }


        // =================================================
        // PRICE
        // =================================================

        if (
            formData.Price === "" ||
            formData.Price === null ||
            formData.Price === undefined ||
            Number(formData.Price) <= 0
        ) {

            temp.Price =
                "Price must be greater than zero.";

        }


        // =================================================
        // CURRENCY
        // =================================================

        if (!formData.Currency) {

            temp.Currency =
                "Currency is required.";

        }


        // =================================================
        // EFFECTIVE DATES
        // =================================================

        if (
            formData.EffectiveFrom &&
            formData.EffectiveTo
        ) {

            const from =
                new Date(
                    formData.EffectiveFrom
                );

            const to =
                new Date(
                    formData.EffectiveTo
                );

            if (to < from) {

                temp.EffectiveTo =
                    "Effective To cannot be before Effective From.";

            }

        }


        setErrors(temp);

        return (
            Object.keys(temp).length === 0
        );

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (e) => {

        e.preventDefault();


        if (!validate()) {
            return;
        }


        // =================================================
        // PREPARE PAYLOAD
        // =================================================

        const payload = {

            ProductPriceId:
                Number(
                    formData.ProductPriceId
                ) || 0,

            ProductId:
                Number(
                    formData.ProductId
                ),

            SellerId:
                formData.SellerId === "" ||
                formData.SellerId === null
                    ? null
                    : Number(
                        formData.SellerId
                    ),

            PriceType:
                formData.PriceType,

            Price:
                Number(
                    formData.Price
                ),

            Currency:
                formData.Currency,

            EffectiveFrom:
                formData.EffectiveFrom ||
                null,

            EffectiveTo:
                formData.EffectiveTo ||
                null,

            IsActive:
                Boolean(
                    formData.IsActive
                ),

        };


        console.log(
            "Product Price PUT Payload:",
            payload
        );


        onSubmit(payload);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Paper
            elevation={2}
            sx={{
                p: 3,
            }}
        >

            <form
                onSubmit={handleSubmit}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* =========================================
                        PRODUCT PRICE ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Product Price ID"
                            value={
                                formData.ProductPriceId
                            }
                            disabled
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
                            label="Product ID"
                            name="ProductId"
                            value={
                                formData.ProductId
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.ProductId
                            }
                            helperText={
                                errors.ProductId ||
                                "Product ID loaded from Product Price"
                            }
                            disabled
                        />

                    </Grid>


                    {/* =========================================
                        SELLER ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Seller ID"
                            name="SellerId"
                            value={
                                formData.SellerId
                            }
                            onChange={
                                handleChange
                            }
                            disabled
                        />

                    </Grid>


                    {/* =========================================
                        PRICE TYPE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Price Type"
                            name="PriceType"
                            value={
                                formData.PriceType
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.PriceType
                            }
                            helperText={
                                errors.PriceType
                            }
                            disabled={loading}
                        >

                            <MenuItem value="Purchase">
                                Purchase
                            </MenuItem>

                            <MenuItem value="Selling">
                                Selling
                            </MenuItem>

                            <MenuItem value="Wholesale">
                                Wholesale
                            </MenuItem>

                            <MenuItem value="Retail">
                                Retail
                            </MenuItem>

                        </TextField>

                    </Grid>


                    {/* =========================================
                        PRICE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Price"
                            name="Price"
                            value={
                                formData.Price
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.Price
                            }
                            helperText={
                                errors.Price
                            }
                            disabled={loading}
                            inputProps={{
                                min: 0,
                                step: "0.01",
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        CURRENCY
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Currency"
                            name="Currency"
                            value={
                                formData.Currency
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.Currency
                            }
                            helperText={
                                errors.Currency
                            }
                            disabled={loading}
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

                            <MenuItem value="GBP">
                                GBP
                            </MenuItem>

                        </TextField>

                    </Grid>


                    {/* =========================================
                        EFFECTIVE FROM
                    ========================================= */}

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
                            value={
                                formData.EffectiveFrom
                                    ? String(
                                        formData.EffectiveFrom
                                    ).substring(0, 10)
                                    : ""
                            }
                            onChange={
                                handleChange
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={loading}
                            error={
                                !!errors.EffectiveFrom
                            }
                            helperText={
                                errors.EffectiveFrom
                            }
                        />

                    </Grid>


                    {/* =========================================
                        EFFECTIVE TO
                    ========================================= */}

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
                            value={
                                formData.EffectiveTo
                                    ? String(
                                        formData.EffectiveTo
                                    ).substring(0, 10)
                                    : ""
                            }
                            onChange={
                                handleChange
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={loading}
                            error={
                                !!errors.EffectiveTo
                            }
                            helperText={
                                errors.EffectiveTo
                            }
                        />

                    </Grid>


                    {/* =========================================
                        ACTIVE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <FormControlLabel
                            control={

                                <Switch
                                    checked={
                                        Boolean(
                                            formData.IsActive
                                        )
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="IsActive"
                                    disabled={loading}
                                />

                            }
                            label="Active"
                        />

                    </Grid>


                    {/* =========================================
                        BUTTONS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "flex-end",
                                gap: 2,
                            }}
                        >

                            <Button
                                variant="outlined"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                            >

                                {loading ? (

                                    <CircularProgress
                                        size={22}
                                        color="inherit"
                                    />

                                ) : (

                                    "Save"

                                )}

                            </Button>

                        </Box>

                    </Grid>

                </Grid>

            </form>

        </Paper>
    );
};

export default ProductPriceForm;
