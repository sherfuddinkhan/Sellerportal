// =========================================================
// ProductPriceSearch.jsx
// =========================================================

import React, { useMemo } from "react";

import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Stack,
} from "@mui/material";

import {
    Clear,
} from "@mui/icons-material";

// =========================================================
// Product Price Search
// =========================================================

const ProductPriceSearch = ({
    searchText = "",
    setSearchText,

    statusFilter = "All",
    setStatusFilter,

    priceTypeFilter = "",
    setPriceTypeFilter,

    currencyFilter = "",
    setCurrencyFilter,

    productPrices = [],
}) => {

    // =====================================================
    // GET VALUE SUPPORTING BOTH JSON CASINGS
    // =====================================================

    const getValue = (item, pascalName, camelName) => {
        return item?.[pascalName] ?? item?.[camelName];
    };

    // =====================================================
    // PRICE TYPES
    // =====================================================

    const priceTypes = useMemo(() => {

        const values = productPrices
            .map((item) =>
                getValue(item, "PriceType", "priceType")
            )
            .filter(Boolean);

        return [...new Set(values)].sort();

    }, [productPrices]);

    // =====================================================
    // CURRENCIES
    // =====================================================

    const currencies = useMemo(() => {

        const values = productPrices
            .map((item) =>
                getValue(item, "Currency", "currency")
            )
            .filter(Boolean);

        return [...new Set(values)].sort();

    }, [productPrices]);

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const handleClear = () => {

        if (setSearchText) {
            setSearchText("");
        }

        if (setStatusFilter) {
            setStatusFilter("All");
        }

        if (setPriceTypeFilter) {
            setPriceTypeFilter("");
        }

        if (setCurrencyFilter) {
            setCurrencyFilter("");
        }
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
                alignItems="center"
            >

                {/* =================================================
                    SEARCH
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <TextField
                        fullWidth
                        size="small"
                        label="Search Product Prices"
                        placeholder="Price Type, Product ID, Seller ID..."
                        value={searchText}
                        onChange={(e) =>
                            setSearchText?.(e.target.value)
                        }
                    />
                </Grid>


                {/* =================================================
                    STATUS
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={2.5}
                >
                    <FormControl
                        fullWidth
                        size="small"
                    >
                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) =>
                                setStatusFilter?.(e.target.value)
                            }
                        >

                            <MenuItem value="All">
                                All
                            </MenuItem>

                            <MenuItem value="Active">
                                Active
                            </MenuItem>

                            <MenuItem value="Inactive">
                                Inactive
                            </MenuItem>

                        </Select>
                    </FormControl>
                </Grid>


                {/* =================================================
                    PRICE TYPE
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={2.5}
                >
                    <FormControl
                        fullWidth
                        size="small"
                    >
                        <InputLabel>
                            Price Type
                        </InputLabel>

                        <Select
                            value={priceTypeFilter}
                            label="Price Type"
                            onChange={(e) =>
                                setPriceTypeFilter?.(e.target.value)
                            }
                        >

                            <MenuItem value="">
                                All
                            </MenuItem>

                            {priceTypes.map((type) => (
                                <MenuItem
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Grid>


                {/* =================================================
                    CURRENCY
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={2}
                >
                    <FormControl
                        fullWidth
                        size="small"
                    >
                        <InputLabel>
                            Currency
                        </InputLabel>

                        <Select
                            value={currencyFilter}
                            label="Currency"
                            onChange={(e) =>
                                setCurrencyFilter?.(e.target.value)
                            }
                        >

                            <MenuItem value="">
                                All
                            </MenuItem>

                            {currencies.map((currency) => (
                                <MenuItem
                                    key={currency}
                                    value={currency}
                                >
                                    {currency}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Grid>


                {/* =================================================
                    CLEAR
                ================================================= */}

                <Grid
                    item
                    xs={12}
                    md={1}
                >
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Clear />}
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                    </Stack>
                </Grid>

            </Grid>

        </Paper>
    );
};

export default ProductPriceSearch;
