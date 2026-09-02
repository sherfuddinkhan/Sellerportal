// =========================================================
// ProductPriceFilters.jsx
// =========================================================

import React from "react";

import {
    Paper,
    Grid,
    TextField,
    MenuItem,
} from "@mui/material";

// =========================================================
// Product Price Filters
// =========================================================

const ProductPriceFilters = ({
    products = [],
    currencies = [],

    productFilter = "",
    setProductFilter,

    currencyFilter = "",
    setCurrencyFilter,
}) => {

    // =====================================================
    // PRODUCT VALUE
    // =====================================================

    const getProductId = (product) => {
        return (
            product?.ProductId ??
            product?.productId ??
            ""
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
                p: 2,
                mb: 3,
            }}
        >

            <Grid
                container
                spacing={2}
            >

                {/* =================================================
                    PRODUCT FILTER
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Product"
                        value={productFilter}
                        onChange={(e) =>
                            setProductFilter?.(
                                e.target.value
                            )
                        }
                    >

                        <MenuItem value="">
                            All Products
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


                {/* =================================================
                    CURRENCY FILTER
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Currency"
                        value={currencyFilter}
                        onChange={(e) =>
                            setCurrencyFilter?.(
                                e.target.value
                            )
                        }
                    >

                        <MenuItem value="">
                            All Currencies
                        </MenuItem>

                        {currencies.map((currency) => (

                            <MenuItem
                                key={currency}
                                value={currency}
                            >
                                {currency}
                            </MenuItem>

                        ))}

                    </TextField>

                </Grid>

            </Grid>

        </Paper>
    );
};

export default ProductPriceFilters;
