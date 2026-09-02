// =========================================================
// ProductPriceDetails.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import {
    Paper,
    Grid,
    Typography,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Box,
    Alert,
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

// =========================================================
// SERVER URL
// =========================================================

const SERVER_URL = "http://localhost:5000";

// =========================================================
// COMPONENT
// =========================================================

const ProductPriceDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [productPrice, setProductPrice] = useState(null);

    const [error, setError] = useState("");

    // =====================================================
    // LOAD PRODUCT PRICE
    // =====================================================

    const loadProductPrice = async () => {

        if (!id) {
            setError("Product Price ID is missing.");
            setLoading(false);
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${SERVER_URL}/api/product-prices/${id}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    "Unable to load product price."
                );
            }

            setProductPrice(data);

        } catch (err) {

            console.error(
                "Product price details error:",
                err
            );

            setProductPrice(null);

            setError(
                err.message ||
                "Unable to load product price."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // USE EFFECT
    // =====================================================

    useEffect(() => {

        loadProductPrice();

    }, [id]);

    // =====================================================
    // HELPERS
    // =====================================================

    const getValue = (pascalCase, camelCase) => {

        return (
            productPrice?.[pascalCase] ??
            productPrice?.[camelCase]
        );
    };

    const productPriceId = getValue(
        "ProductPriceId",
        "productPriceId"
    );

    const productId = getValue(
        "ProductId",
        "productId"
    );

    const productName =
        getValue("ProductName", "productName");

    const sku =
        getValue("SKU", "sku");

    const sellerId =
        getValue("SellerId", "sellerId");

    const priceType =
        getValue("PriceType", "priceType");

    const price =
        getValue("Price", "price");

    const currency =
        getValue("Currency", "currency");

    const effectiveFrom =
        getValue("EffectiveFrom", "effectiveFrom");

    const effectiveTo =
        getValue("EffectiveTo", "effectiveTo");

    const isActive =
        getValue("IsActive", "isActive");

    const createdDate =
        getValue("CreatedDate", "createdDate");

    const updatedDate =
        getValue("UpdatedDate", "updatedDate");

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString();
    };

    // =====================================================
    // FORMAT DATETIME
    // =====================================================

    const formatDateTime = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString();
    };

    // =====================================================
    // FORMAT PRICE
    // =====================================================

    const formatPrice = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "-";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return "-";
        }

        return number.toFixed(2);
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
            >
                <CircularProgress />
            </Box>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Box
                    display="flex"
                    gap={2}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate("/product-prices")
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={loadProductPrice}
                    >
                        Retry
                    </Button>

                </Box>

            </Box>
        );
    }

    // =====================================================
    // NOT FOUND
    // =====================================================

    if (!productPrice) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                >
                    Product Price not found.
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/product-prices")
                    }
                >
                    Back to Product Prices
                </Button>

            </Box>
        );
    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Paper sx={{ p: 4 }}>

            {/* =================================================
                HEADER
            ================================================= */}

            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >

                <Grid item>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Product Price Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        View complete product pricing information
                    </Typography>

                </Grid>

                <Grid item>

                    <Box
                        display="flex"
                        gap={2}
                    >

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate("/product-prices")
                            }
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() =>
                                navigate(
                                    `/product-prices/edit/${productPriceId ?? id}`
                                )
                            }
                        >
                            Edit
                        </Button>

                    </Box>

                </Grid>

            </Grid>

            <Divider sx={{ mb: 4 }} />

            {/* =================================================
                DETAILS
            ================================================= */}

            <Grid
                container
                spacing={3}
            >

                {/* PRODUCT PRICE ID */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Product Price ID
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{ mt: 0.5 }}
                    >
                        {productPriceId ?? "-"}
                    </Typography>

                </Grid>

                {/* PRODUCT */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Product
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>

                        {productName
                            ? `${productName} ${
                                productId
                                    ? `(ID: ${productId})`
                                    : ""
                            }`
                            : productId ?? "-"
                        }

                    </Typography>

                </Grid>

                {/* SKU */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        SKU
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                        {sku || "-"}
                    </Typography>

                </Grid>

                {/* SELLER ID */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Seller ID
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                        {sellerId ?? "-"}
                    </Typography>

                </Grid>

                {/* PRICE TYPE */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Price Type
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                        {priceType || "-"}
                    </Typography>

                </Grid>

                {/* PRICE */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Price
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{ mt: 0.5 }}
                    >
                        {currency || "₹"}{" "}
                        {formatPrice(price)}
                    </Typography>

                </Grid>

                {/* CURRENCY */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Currency
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                        {currency || "-"}
                    </Typography>

                </Grid>

                {/* EFFECTIVE FROM */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Effective From
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                        {formatDate(effectiveFrom)}
                    </Typography>

                </Grid>

                {/* EFFECTIVE TO */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Effective To
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                        {formatDate(effectiveTo)}
                    </Typography>

                </Grid>

                {/* STATUS */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ mb: 1 }}
                    >
                        Status
                    </Typography>

                    <Chip
                        label={
                            isActive
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            isActive
                                ? "success"
                                : "error"
                        }
                        variant="filled"
                    />

                </Grid>

                {/* CREATED DATE */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Created Date
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                        {formatDateTime(createdDate)}
                    </Typography>

                </Grid>

                {/* UPDATED DATE */}

                <Grid item xs={12} md={6}>

                    <Typography
                        color="text.secondary"
                        variant="body2"
                    >
                        Updated Date
                    </Typography>

                    <Typography sx={{ mt: 0.5 }}>
                        {formatDateTime(updatedDate)}
                    </Typography>

                </Grid>

            </Grid>

        </Paper>
    );
};

export default ProductPriceDetails;
