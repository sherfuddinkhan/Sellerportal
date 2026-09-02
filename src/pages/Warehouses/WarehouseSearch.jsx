// =========================================================
// WarehouseSearch.jsx
// Frontend Only
// =========================================================

import React from "react";

import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment
} from "@mui/material";

import {
    Search
} from "@mui/icons-material";


// =========================================================
// WarehouseSearch
// =========================================================

const WarehouseSearch = ({
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter
}) => {

    return (

        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 3
            }}
        >

            <Grid
                container
                spacing={2}
            >

                {/* =============================================
                    SEARCH
                ============================================= */}

                <Grid
                    item
                    xs={12}
                    md={8}
                >

                    <TextField

                        fullWidth

                        label="Search Warehouses"

                        placeholder={
                            "Search by Code, Name, City, State, " +
                            "Country, Contact, Phone or Email"
                        }

                        value={searchText}

                        onChange={(event) => {

                            setSearchText(
                                event.target.value
                            );

                        }}

                        InputProps={{

                            startAdornment: (

                                <InputAdornment
                                    position="start"
                                >

                                    <Search />

                                </InputAdornment>

                            )

                        }}

                    />

                </Grid>


                {/* =============================================
                    STATUS FILTER
                ============================================= */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <FormControl
                        fullWidth
                    >

                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select

                            value={statusFilter}

                            label="Status"

                            onChange={(event) => {

                                setStatusFilter(
                                    event.target.value
                                );

                            }}

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

            </Grid>

        </Paper>

    );

};

export default WarehouseSearch;