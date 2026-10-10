// =========================================================
// VendorItemMasterFilters.jsx
// =========================================================

import React from "react";

import {
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    TextField,
    InputAdornment
} from "@mui/material";

import {
    Search,
    RestartAlt,
    FilterList
} from "@mui/icons-material";

// =========================================================
// INITIAL FILTERS
// =========================================================

export const INITIAL_VENDOR_ITEM_FILTERS = {
    search: "",
    status: "All",
    vendorId: ""
};

// =========================================================
// VENDOR ITEM MASTER FILTERS
// =========================================================

const VendorItemMasterFilters = ({
    filters = INITIAL_VENDOR_ITEM_FILTERS,
    onFilterChange,
    onReset,
    loading = false
}) => {

    // =====================================================
    // HANDLE FILTER CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (typeof onFilterChange === "function") {
            onFilterChange(name, value);
        }
    };

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const handleReset = () => {
        if (typeof onReset === "function") {
            onReset();
        } else if (typeof onFilterChange === "function") {
            onFilterChange("search", "");
            onFilterChange("status", "All");
            onFilterChange("vendorId", "");
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
                mb: 2,
                borderRadius: 2
            }}
        >
            {/* ============================================= */}
            {/* FILTER HEADER */}
            {/* ============================================= */}

            <Box
                display="flex"
                alignItems="center"
                gap={1}
                mb={2}
            >
                <FilterList color="primary" />

                <Box
                    component="span"
                    sx={{
                        fontWeight: 600,
                        fontSize: "1rem"
                    }}
                >
                    Filter Vendor Items
                </Box>
            </Box>

            {/* ============================================= */}
            {/* FILTER FIELDS */}
            {/* ============================================= */}

            <Grid container spacing={2} alignItems="center">

                {/* SEARCH */}

                <Grid item xs={12} md={5}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Search Items"
                        name="search"
                        value={filters.search ?? ""}
                        onChange={handleChange}
                        placeholder="Search code, name, or description"
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>

                {/* VENDOR ID */}

                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Vendor ID"
                        name="vendorId"
                        value={filters.vendorId ?? ""}
                        onChange={handleChange}
                        placeholder="Enter vendor ID"
                        disabled={loading}
                        inputProps={{
                            min: 1,
                            step: 1
                        }}
                    />
                </Grid>

                {/* STATUS */}

                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        label="Status"
                        name="status"
                        value={filters.status ?? "All"}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <MenuItem value="All">
                            All Statuses
                        </MenuItem>

                        <MenuItem value="Active">
                            Active
                        </MenuItem>

                        <MenuItem value="Inactive">
                            Inactive
                        </MenuItem>
                    </TextField>
                </Grid>

                {/* RESET */}

                <Grid item xs={12} md={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="inherit"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </Button>
                </Grid>

            </Grid>
        </Paper>
    );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default VendorItemMasterFilters;

