import React from "react";

import {
    Paper,
    Grid,
    TextField,
    InputAdornment,
    MenuItem,
    IconButton
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

const ProductPriceSearch = ({

    searchText,
    setSearchText,

    statusFilter,
    setStatusFilter,

    priceTypeFilter,
    setPriceTypeFilter

}) => {

    const clearFilters = () => {

        setSearchText("");

        setStatusFilter("All");

        setPriceTypeFilter("");

    };

    return (

        <Paper sx={{ p: 2, mb: 3 }}>

            <Grid container spacing={2}>

                <Grid item xs={12} md={6}>

                    <TextField

                        fullWidth

                        size="small"

                        label="Search"

                        placeholder="Product Name, SKU, Currency..."

                        value={searchText}

                        onChange={(e) =>

                            setSearchText(e.target.value)

                        }

                        InputProps={{

                            startAdornment: (

                                <InputAdornment position="start">

                                    <Search />

                                </InputAdornment>

                            )

                        }}

                    />

                </Grid>

                <Grid item xs={12} md={3}>

                    <TextField

                        select

                        fullWidth

                        size="small"

                        label="Status"

                        value={statusFilter}

                        onChange={(e) =>

                            setStatusFilter(e.target.value)

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

                <Grid item xs={12} md={3}>

                    <TextField

                        select

                        fullWidth

                        size="small"

                        label="Price Type"

                        value={priceTypeFilter}

                        onChange={(e) =>

                            setPriceTypeFilter(e.target.value)

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

                <Grid item xs={12}>

                    <Grid

                        container

                        justifyContent="flex-end"

                    >

                        <IconButton

                            color="error"

                            onClick={clearFilters}

                        >

                            <Clear />

                        </IconButton>

                    </Grid>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default ProductPriceSearch;