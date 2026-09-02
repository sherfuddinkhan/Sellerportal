// =========================================================
// ProductPriceForm.jsx
// =========================================================

import React, { useEffect, useState } from "react";

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
    Alert,
} from "@mui/material";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

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

    const [products, setProducts] = useState([]);

    const [errors, setErrors] = useState({});

    const [productsLoading, setProductsLoading] =
        useState(false);

    const [productError, setProductError] =
        useState("");


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

        ...initialValues,
    });


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    useEffect(() => {
        loadProducts();
    }, []);


    // =====================================================
    // UPDATE FORM WHEN EDITING
    // =====================================================

    useEffect(() => {

        if (initialValues) {

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

        } else {

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
        }

        setErrors({});

    }, [initialValues]);


    // =====================================================
    // FETCH PRODUCTS THROUGH SERVER.JS
    // =====================================================

    const loadProducts = async () => {

        try {

            setProductsLoading(true);
            setProductError("");

            const response = await fetch(
                `${SERVER_URL}/api/product/all`
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Unable to load products."
                );
            }

            const productList =
                Array.isArray(data)
                    ? data
                    : Array.isArray(data?.items)
                        ? data.items
                        : [];

            setProducts(productList);

        } catch (error) {

            console.error(
                "Product loading error:",
                error
            );

            setProductError(
                error.message ||
                "Unable to load products."
            );

            setProducts([]);

        } finally {

            setProductsLoading(false);
        }
    };


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


        // Clear field error after editing

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


        // Product

        if (
            formData.ProductId === "" ||
            formData.ProductId === null ||
            formData.ProductId === undefined
        ) {
            temp.ProductId =
                "Product is required.";
        }


        // Price Type

        if (!formData.PriceType) {

            temp.PriceType =
                "Price Type is required.";
        }


        // Price

        if (
            formData.Price === "" ||
            formData.Price === null ||
            Number(formData.Price) <= 0
        ) {

            temp.Price =
                "Price must be greater than zero.";
        }


        // Currency

        if (!formData.Currency) {

            temp.Currency =
                "Currency is required.";
        }


        // Effective dates

        if (
            formData.EffectiveFrom &&
            formData.EffectiveTo
        ) {

            const from =
                new Date(formData.EffectiveFrom);

            const to =
                new Date(formData.EffectiveTo);

            if (to < from) {

                temp.EffectiveTo =
                    "Effective To cannot be before Effective From.";
            }
        }


        setErrors(temp);

        return Object.keys(temp).length === 0;
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }


        // Prepare API payload

        const payload = {
            ...formData,

            ProductPriceId:
                Number(formData.ProductPriceId) || 0,

            ProductId:
                Number(formData.ProductId),

            SellerId:
                formData.SellerId === ""
                    ? null
                    : Number(formData.SellerId),

            Price:
                Number(formData.Price),

            EffectiveFrom:
                formData.EffectiveFrom || null,

            EffectiveTo:
                formData.EffectiveTo || null,

            IsActive:
                Boolean(formData.IsActive),
        };


        onSubmit(payload);
    };


    // =====================================================
    // PRODUCT ID
    // =====================================================

    const getProductId = (product) => {

        return (
            product?.ProductId ??
            product?.productId
        );
    };


    // =====================================================
    // PRODUCT DISPLAY NAME
    // =====================================================

    const getProductName = (product) => {

        return (
            product?.ProductName ??
            product?.productName ??
            product?.SKU ??
            product?.sku ??
            `Product ${getProductId(product)}`
        );
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

            <form onSubmit={handleSubmit}>

                <Grid
                    container
                    spacing={3}
                >

                    {/* =========================================
                        PRODUCT
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Product"
                            name="ProductId"
                            value={formData.ProductId}
                            onChange={handleChange}
                            error={!!errors.ProductId}
                            helperText={
                                errors.ProductId ||
                                (
                                    productsLoading
                                        ? "Loading products..."
                                        : ""
                                )
                            }
                            disabled={
                                productsLoading ||
                                loading
                            }
                        >

                            <MenuItem value="">
                                Select Product
                            </MenuItem>

                            {products.map((product) => {

                                const productId =
                                    getProductId(product);

                                return (
                                    <MenuItem
                                        key={productId}
                                        value={productId}
                                    >
                                        {getProductName(product)}
                                    </MenuItem>
                                );
                            })}

                        </TextField>

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
                            value={formData.PriceType}
                            onChange={handleChange}
                            error={!!errors.PriceType}
                            helperText={errors.PriceType}
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
                            value={formData.Price}
                            onChange={handleChange}
                            error={!!errors.Price}
                            helperText={errors.Price}
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
                            value={formData.Currency}
                            onChange={handleChange}
                            error={!!errors.Currency}
                            helperText={errors.Currency}
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
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={loading}
                            error={!!errors.EffectiveFrom}
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
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={loading}
                            error={!!errors.EffectiveTo}
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
                                    onChange={handleChange}
                                    name="IsActive"
                                    disabled={loading}
                                />
                            }
                            label="Active"
                        />

                    </Grid>


                    {/* =========================================
                        PRODUCT LOAD ERROR
                    ========================================= */}

                    {productError && (

                        <Grid
                            item
                            xs={12}
                        >

                            <Alert
                                severity="error"
                                action={
                                    <Button
                                        color="inherit"
                                        size="small"
                                        onClick={loadProducts}
                                    >
                                        Retry
                                    </Button>
                                }
                            >
                                {productError}
                            </Alert>

                        </Grid>
                    )}


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
                                justifyContent: "flex-end",
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
                                disabled={
                                    loading ||
                                    productsLoading
                                }
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
