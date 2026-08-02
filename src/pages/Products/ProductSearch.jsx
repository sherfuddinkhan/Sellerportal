import React from "react";

import {
    Paper,
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

const ProductSearch = ({

    searchText,
    setSearchText,

    statusFilter,
    setStatusFilter

}) => {

    const handleClear = () => {

        setSearchText("");

        setStatusFilter("All");

    };

    return (

        <Paper sx={{ p: 2, mb: 3 }}>

            <Grid container spacing={2}>

                <Grid item xs={12} md={8}>

                    <TextField

                        fullWidth

                        size="small"

                        label="Search Products"

                        placeholder="Search by Product Name, SKU, Barcode, HSN Code..."

                        value={searchText}

                        onChange={(e) =>
                            setSearchText(e.target.value)
                        }

                        InputProps={{

                            startAdornment: (

                                <InputAdornment position="start">

                                    <Search />

                                </InputAdornment>

                            ),

                            endAdornment:

                                searchText && (

                                    <InputAdornment position="end">

                                        <IconButton

                                            size="small"

                                            onClick={() =>
                                                setSearchText("")
                                            }

                                        >

                                            <Clear />

                                        </IconButton>

                                    </InputAdornment>

                                )

                        }}

                    />

                </Grid>

                <Grid item xs={12} md={4}>

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

                <Grid item xs={12}>

                    <Grid

                        container

                        justifyContent="flex-end"

                    >

                        <IconButton

                            color="error"

                            onClick={handleClear}

                            title="Clear Filters"

                        >

                            <Clear />

                        </IconButton>

                    </Grid>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default ProductSearch;