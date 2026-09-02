// =========================================================
// ProductAttributeFilters.jsx
// Product Attribute Filters
// No apiService
// No direct API call
// =========================================================

import React, { useEffect, useMemo, useState } from "react";

import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import {
    Clear,
    FilterAlt,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const ProductAttributeFilters = ({
    attributes = [],
    onFilter,
    onClear,
}) => {

    // =====================================================
    // FILTER STATE
    // =====================================================

    const [filters, setFilters] = useState({
        productId: "",
        sellerId: "",
        customerId: "",
        attributeName: "",
        attributeValue: "",
        status: "all",
    });

    // =====================================================
    // GET UNIQUE VALUES
    // =====================================================

    const productIds = useMemo(() => {

        return [
            ...new Set(
                attributes
                    .map(
                        (item) =>
                            item.productId ??
                            item.ProductId
                    )
                    .filter(
                        (value) =>
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                    )
                    .map(String)
            ),
        ].sort(
            (a, b) =>
                Number(a) - Number(b)
        );

    }, [attributes]);

    const sellerIds = useMemo(() => {

        return [
            ...new Set(
                attributes
                    .map(
                        (item) =>
                            item.sellerId ??
                            item.SellerId
                    )
                    .filter(
                        (value) =>
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                    )
                    .map(String)
            ),
        ].sort(
            (a, b) =>
                Number(a) - Number(b)
        );

    }, [attributes]);

    const customerIds = useMemo(() => {

        return [
            ...new Set(
                attributes
                    .map(
                        (item) =>
                            item.customerId ??
                            item.CustomerId
                    )
                    .filter(
                        (value) =>
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                    )
                    .map(String)
            ),
        ].sort(
            (a, b) =>
                Number(a) - Number(b)
        );

    }, [attributes]);

    const attributeNames = useMemo(() => {

        return [
            ...new Set(
                attributes
                    .map(
                        (item) =>
                            item.attributeName ??
                            item.AttributeName
                    )
                    .filter(
                        (value) =>
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                    )
            ),
        ].sort();

    }, [attributes]);

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFilters(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };

    // =====================================================
    // APPLY FILTERS
    // =====================================================

    const handleApply = () => {

        const filtered = attributes.filter(
            (item) => {

                const productId = String(
                    item.productId ??
                    item.ProductId ??
                    ""
                );

                const sellerId = String(
                    item.sellerId ??
                    item.SellerId ??
                    ""
                );

                const customerId = String(
                    item.customerId ??
                    item.CustomerId ??
                    ""
                );

                const attributeName = String(
                    item.attributeName ??
                    item.AttributeName ??
                    ""
                );

                const attributeValue = String(
                    item.attributeValue ??
                    item.AttributeValue ??
                    ""
                );

                const isActive =
                    item.isActive ??
                    item.IsActive ??
                    false;

                // -----------------------------------------
                // PRODUCT ID
                // -----------------------------------------

                if (
                    filters.productId &&
                    productId !==
                        filters.productId
                ) {
                    return false;
                }

                // -----------------------------------------
                // SELLER ID
                // -----------------------------------------

                if (
                    filters.sellerId &&
                    sellerId !==
                        filters.sellerId
                ) {
                    return false;
                }

                // -----------------------------------------
                // CUSTOMER ID
                // -----------------------------------------

                if (
                    filters.customerId &&
                    customerId !==
                        filters.customerId
                ) {
                    return false;
                }

                // -----------------------------------------
                // ATTRIBUTE NAME
                // -----------------------------------------

                if (
                    filters.attributeName &&
                    attributeName !==
                        filters.attributeName
                ) {
                    return false;
                }

                // -----------------------------------------
                // ATTRIBUTE VALUE
                // -----------------------------------------

                if (
                    filters.attributeValue &&
                    !attributeValue
                        .toLowerCase()
                        .includes(
                            filters.attributeValue
                                .toLowerCase()
                        )
                ) {
                    return false;
                }

                // -----------------------------------------
                // STATUS
                // -----------------------------------------

                if (
                    filters.status ===
                    "active" &&
                    !isActive
                ) {
                    return false;
                }

                if (
                    filters.status ===
                    "inactive" &&
                    isActive
                ) {
                    return false;
                }

                return true;
            }
        );

        // Send filtered records to parent
        onFilter?.(
            filtered,
            filters
        );
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const handleClear = () => {

        const emptyFilters = {
            productId: "",
            sellerId: "",
            customerId: "",
            attributeName: "",
            attributeValue: "",
            status: "all",
        };

        setFilters(emptyFilters);

        onClear?.();

        onFilter?.(
            attributes,
            emptyFilters
        );
    };

    // =====================================================
    // AUTO UPDATE WHEN ATTRIBUTES CHANGE
    // =====================================================

    useEffect(() => {

        if (!attributes.length) {
            onFilter?.([], filters);
        }

    }, [attributes]);

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
            }}
        >

            {/* =================================================
                HEADER
                ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                }}
            >

                <FilterAlt />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Product Attribute Filters
                </Typography>

            </Box>

            {/* =================================================
                FILTERS
                ================================================= */}

            <Grid
                container
                spacing={2}
            >

                {/* =============================================
                    PRODUCT ID
                    ============================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                >

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Product ID
                        </InputLabel>

                        <Select
                            name="productId"
                            value={filters.productId}
                            label="Product ID"
                            onChange={handleChange}
                        >

                            <MenuItem value="">
                                All Products
                            </MenuItem>

                            {productIds.map(
                                (id) => (
                                    <MenuItem
                                        key={id}
                                        value={id}
                                    >
                                        {id}
                                    </MenuItem>
                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>

                {/* =============================================
                    SELLER ID
                    ============================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                >

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Seller ID
                        </InputLabel>

                        <Select
                            name="sellerId"
                            value={filters.sellerId}
                            label="Seller ID"
                            onChange={handleChange}
                        >

                            <MenuItem value="">
                                All Sellers
                            </MenuItem>

                            {sellerIds.map(
                                (id) => (
                                    <MenuItem
                                        key={id}
                                        value={id}
                                    >
                                        {id}
                                    </MenuItem>
                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>

                {/* =============================================
                    CUSTOMER ID
                    ============================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2}
                >

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Customer ID
                        </InputLabel>

                        <Select
                            name="customerId"
                            value={filters.customerId}
                            label="Customer ID"
                            onChange={handleChange}
                        >

                            <MenuItem value="">
                                All Customers
                            </MenuItem>

                            {customerIds.map(
                                (id) => (
                                    <MenuItem
                                        key={id}
                                        value={id}
                                    >
                                        {id}
                                    </MenuItem>
                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>

                {/* =============================================
                    ATTRIBUTE NAME
                    ============================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Attribute Name
                        </InputLabel>

                        <Select
                            name="attributeName"
                            value={
                                filters.attributeName
                            }
                            label="Attribute Name"
                            onChange={handleChange}
                        >

                            <MenuItem value="">
                                All Attributes
                            </MenuItem>

                            {attributeNames.map(
                                (name) => (
                                    <MenuItem
                                        key={name}
                                        value={name}
                                    >
                                        {name}
                                    </MenuItem>
                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>

                {/* =============================================
                    STATUS
                    ============================================= */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select
                            name="status"
                            value={filters.status}
                            label="Status"
                            onChange={handleChange}
                        >

                            <MenuItem value="all">
                                All Status
                            </MenuItem>

                            <MenuItem value="active">
                                Active
                            </MenuItem>

                            <MenuItem value="inactive">
                                Inactive
                            </MenuItem>

                        </Select>

                    </FormControl>

                </Grid>

                {/* =============================================
                    ATTRIBUTE VALUE
                    ============================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField
                        fullWidth
                        size="small"
                        label="Attribute Value"
                        name="attributeValue"
                        value={
                            filters.attributeValue
                        }
                        onChange={handleChange}
                        placeholder="Search attribute value"
                    />

                </Grid>

                {/* =============================================
                    BUTTONS
                    ============================================= */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: {
                                xs: "flex-start",
                                md: "flex-end",
                            },
                            alignItems: "center",
                            gap: 2,
                            height: "100%",
                        }}
                    >

                        <Button
                            variant="contained"
                            startIcon={
                                <FilterAlt />
                            }
                            onClick={
                                handleApply
                            }
                        >
                            Apply Filters
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={
                                <Clear />
                            }
                            onClick={
                                handleClear
                            }
                        >
                            Clear
                        </Button>

                    </Box>

                </Grid>

            </Grid>

        </Paper>
    );
};

export default ProductAttributeFilters;

