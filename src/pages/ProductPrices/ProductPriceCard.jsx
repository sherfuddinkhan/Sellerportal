// =========================================================
// ProductPriceCard.jsx
// =========================================================

import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Stack,
    Divider,
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const ProductPriceCard = ({ productPrice }) => {

    // =====================================================
    // SAFETY
    // =====================================================

    if (!productPrice) {
        return null;
    }

    // =====================================================
    // HELPERS
    // =====================================================

    const getValue = (pascalCase, camelCase) => {

        return (
            productPrice?.[pascalCase] ??
            productPrice?.[camelCase]
        );
    };

    // =====================================================
    // VALUES
    // =====================================================

    const productPriceId = getValue(
        "ProductPriceId",
        "productPriceId"
    );

    const productId = getValue(
        "ProductId",
        "productId"
    );

    const productName = getValue(
        "ProductName",
        "productName"
    );

    const sellerId = getValue(
        "SellerId",
        "sellerId"
    );

    const priceType = getValue(
        "PriceType",
        "priceType"
    );

    const price = getValue(
        "Price",
        "price"
    );

    const currency = getValue(
        "Currency",
        "currency"
    );

    const effectiveFrom = getValue(
        "EffectiveFrom",
        "effectiveFrom"
    );

    const effectiveTo = getValue(
        "EffectiveTo",
        "effectiveTo"
    );

    const isActive = getValue(
        "IsActive",
        "isActive"
    );

    const createdDate = getValue(
        "CreatedDate",
        "createdDate"
    );

    const updatedDate = getValue(
        "UpdatedDate",
        "updatedDate"
    );

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
    // RENDER
    // =====================================================

    return (

        <Card
            elevation={3}
            sx={{
                borderRadius: 2,
                height: "100%",
            }}
        >

            <CardContent>

                {/* =========================================
                    HEADER
                ========================================= */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    spacing={2}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        noWrap
                    >
                        {priceType || "Product Price"}
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
                        size="small"
                    />

                </Stack>

                <Divider sx={{ mb: 2 }} />

                {/* =========================================
                    DETAILS
                ========================================= */}

                <Grid
                    container
                    spacing={2}
                >

                    {/* PRODUCT PRICE ID */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product Price ID
                        </Typography>

                        <Typography>
                            {productPriceId ?? "-"}
                        </Typography>

                    </Grid>

                    {/* PRODUCT ID */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Product ID
                        </Typography>

                        <Typography>
                            {productId ?? "-"}
                        </Typography>

                    </Grid>

                    {/* PRODUCT */}

                    {productName && (

                        <Grid item xs={12}>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Product
                            </Typography>

                            <Typography
                                fontWeight="medium"
                            >
                                {productName}
                            </Typography>

                        </Grid>

                    )}

                    {/* SELLER ID */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Seller ID
                        </Typography>

                        <Typography>
                            {sellerId ?? "-"}
                        </Typography>

                    </Grid>

                    {/* PRICE TYPE */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Price Type
                        </Typography>

                        <Typography>
                            {priceType || "-"}
                        </Typography>

                    </Grid>

                    {/* PRICE */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Price
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            {currency || "₹"}{" "}
                            {formatPrice(price)}
                        </Typography>

                    </Grid>

                    {/* CURRENCY */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Currency
                        </Typography>

                        <Typography>
                            {currency || "-"}
                        </Typography>

                    </Grid>

                    {/* EFFECTIVE FROM */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Effective From
                        </Typography>

                        <Typography>
                            {formatDate(effectiveFrom)}
                        </Typography>

                    </Grid>

                    {/* EFFECTIVE TO */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Effective To
                        </Typography>

                        <Typography>
                            {formatDate(effectiveTo)}
                        </Typography>

                    </Grid>

                    {/* CREATED DATE */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>

                        <Typography>
                            {formatDateTime(createdDate)}
                        </Typography>

                    </Grid>

                    {/* UPDATED DATE */}

                    <Grid item xs={6}>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>

                        <Typography>
                            {formatDateTime(updatedDate)}
                        </Typography>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>
    );
};

export default ProductPriceCard;
