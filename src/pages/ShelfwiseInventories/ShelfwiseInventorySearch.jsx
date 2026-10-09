import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    MenuItem,
    Button,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear,
    FilterList
} from "@mui/icons-material";

/* =========================================================
   SHELFWISE INVENTORY SEARCH
========================================================= */

const ShelfwiseInventorySearch = ({
    searchTerm = "",
    onSearchChange,
    searchField = "all",
    onSearchFieldChange,
    status = "all",
    onStatusChange,
    onClear,
    onToggleFilters,
    showFilters = false,
    loading = false
}) => {

    /* =====================================================
       HANDLE SEARCH INPUT
    ===================================================== */

    const handleSearchChange = (event) => {
        if (onSearchChange) {
            onSearchChange(event.target.value);
        }
    };

    /* =====================================================
       HANDLE SEARCH FIELD
    ===================================================== */

    const handleSearchFieldChange = (event) => {
        if (onSearchFieldChange) {
            onSearchFieldChange(event.target.value);
        }
    };

    /* =====================================================
       HANDLE STATUS CHANGE
    ===================================================== */

    const handleStatusChange = (event) => {
        if (onStatusChange) {
            onStatusChange(event.target.value);
        }
    };

    /* =====================================================
       CLEAR SEARCH AND STATUS
    ===================================================== */

    const handleClear = () => {
        if (onClear) {
            onClear();
            return;
        }

        if (onSearchChange) {
            onSearchChange("");
        }

        if (onSearchFieldChange) {
            onSearchFieldChange("all");
        }

        if (onStatusChange) {
            onStatusChange("all");
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                width: "100%",
                mb: 2
            }}
        >
            {/* SEARCH FIELD */}

            <TextField
                label="Search Inventory"
                placeholder="Search item, shelf, warehouse..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                disabled={loading}
                sx={{
                    flex: "1 1 280px",
                    minWidth: 220
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm ? (
                        <InputAdornment position="end">
                            <Tooltip title="Clear search">
                                <IconButton
                                    size="small"
                                    onClick={handleClear}
                                    disabled={loading}
                                    aria-label="Clear inventory search"
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ) : null
                }}
            />

            {/* SEARCH BY */}

            <TextField
                select
                label="Search By"
                value={searchField}
                onChange={handleSearchFieldChange}
                size="small"
                disabled={loading}
                sx={{
                    flex: "0 1 180px",
                    minWidth: 150
                }}
            >
                <MenuItem value="all">All Fields</MenuItem>
                <MenuItem value="itemName">Item Name</MenuItem>
                <MenuItem value="itemCode">Item Code</MenuItem>
                <MenuItem value="shelfName">Shelf Name</MenuItem>
                <MenuItem value="shelfCode">Shelf Code</MenuItem>
                <MenuItem value="warehouseName">
                    Warehouse
                </MenuItem>
                <MenuItem value="categoryName">
                    Category
                </MenuItem>
            </TextField>

            {/* INVENTORY STATUS */}

            <TextField
                select
                label="Inventory Status"
                value={status}
                onChange={handleStatusChange}
                size="small"
                disabled={loading}
                sx={{
                    flex: "0 1 180px",
                    minWidth: 150
                }}
            >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="low-stock">Low Stock</MenuItem>
                <MenuItem value="out-of-stock">
                    Out of Stock
                </MenuItem>
                <MenuItem value="reserved">Reserved</MenuItem>
            </TextField>

            {/* ADVANCED FILTERS */}

            {onToggleFilters && (
                <Tooltip title="Toggle advanced filters">
                    <Button
                        variant={showFilters ? "contained" : "outlined"}
                        color="primary"
                        startIcon={<FilterList />}
                        onClick={onToggleFilters}
                        disabled={loading}
                        sx={{
                            whiteSpace: "nowrap",
                            minHeight: 40
                        }}
                    >
                        Filters
                    </Button>
                </Tooltip>
            )}

            {/* CLEAR ALL */}

            {(searchTerm ||
                searchField !== "all" ||
                status !== "all") && (
                <Button
                    variant="text"
                    color="inherit"
                    onClick={handleClear}
                    disabled={loading}
                    startIcon={<Clear />}
                    sx={{
                        whiteSpace: "nowrap"
                    }}
                >
                    Clear All
                </Button>
            )}
        </Box>
    );
};

export default ShelfwiseInventorySearch;

