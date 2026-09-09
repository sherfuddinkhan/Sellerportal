// =========================================================
// ProductPriceSearch.jsx
// Marketplace Seller Portal
// Product Price Management
// =========================================================

import React from "react";

import {
    Paper,
    Grid,
    TextField,
    InputAdornment,
    MenuItem,
    IconButton,
} from "@mui/material";

import {
    Search,
    Clear,
} from "@mui/icons-material";


// =========================================================
// COMPONENT
// =========================================================

const ProductPriceSearch = ({

    searchText,
    setSearchText,

    statusFilter,
    setStatusFilter,

    priceTypeFilter,
    setPriceTypeFilter,

}) => {


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setSearchText("");

        setStatusFilter("All");

        setPriceTypeFilter("");

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Paper
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
                    SEARCH
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={6}
                >

                    <TextField

                        fullWidth

                        size="small"

                        label="Search"

                        placeholder="Product Name, SKU, Currency..."

                        value={
                            searchText || ""
                        }

                        onChange={
                            (event) =>
                                setSearchText(
                                    event.target.value
                                )
                        }

                        InputProps={{

                            startAdornment: (

                                <InputAdornment
                                    position="start"
                                >

                                    <Search />

                                </InputAdornment>

                            ),

                        }}

                    />

                </Grid>


                {/* =================================================
                    STATUS
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <TextField

                        select

                        fullWidth

                        size="small"

                        label="Status"

                        value={
                            statusFilter || "All"
                        }

                        onChange={
                            (event) =>
                                setStatusFilter(
                                    event.target.value
                                )
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

                    </TextField>

                </Grid>


                {/* =================================================
                    PRICE TYPE
                ================================================== */}

                <Grid
                    item
                    xs={12}
                    md={3}
                >

                    <TextField

                        select

                        fullWidth

                        size="small"

                        label="Price Type"

                        value={
                            priceTypeFilter || ""
                        }

                        onChange={
                            (event) =>
                                setPriceTypeFilter(
                                    event.target.value
                                )
                        }

                    >

                        <MenuItem value="">
                            All
                        </MenuItem>

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


                {/* =================================================
                    CLEAR FILTERS
                ================================================== */}

                <Grid
                    item
                    xs={12}
                >

                    <Grid
                        container
                        justifyContent="flex-end"
                    >

                        <IconButton

                            color="error"

                            title="Clear Filters"

                            onClick={
                                clearFilters
                            }

                        >

                            <Clear />

                        </IconButton>

                    </Grid>

                </Grid>

            </Grid>

        </Paper>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default ProductPriceSearch;
