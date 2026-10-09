import React from "react";

import {
    Box,
    Grid,
    TextField,
    InputAdornment,
    MenuItem,
    Button,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear,
    FilterList,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   VENDOR ITEM CUSTOM FIELD SEARCH
========================================================= */

const VendorItemCustomFieldSearch = ({
    searchTerm = "",
    searchValue,
    onSearchChange,
    onSearch,

    statusFilter = "all",
    onStatusFilterChange,

    requiredFilter = "all",
    onRequiredFilterChange,

    onClear,

    showStatusFilter = true,
    showRequiredFilter = true,
    showClearButton = true,

    loading = false,

    placeholder = "Search by field name, label, key, vendor or item..."
}) => {
    /* =====================================================
       SEARCH VALUE
    ===================================================== */

    const currentSearchValue =
        searchValue !== undefined
            ? searchValue
            : searchTerm;

    /* =====================================================
       SEARCH HANDLER
    ===================================================== */

    const handleSearchChange = (event) => {
        const value = event.target.value;

        if (onSearchChange) {
            onSearchChange(value);
        } else if (onSearch) {
            onSearch(value);
        }
    };

    /* =====================================================
       STATUS HANDLER
    ===================================================== */

    const handleStatusChange = (event) => {
        if (onStatusFilterChange) {
            onStatusFilterChange(event.target.value);
        }
    };

    /* =====================================================
       REQUIRED HANDLER
    ===================================================== */

    const handleRequiredChange = (event) => {
        if (onRequiredFilterChange) {
            onRequiredFilterChange(event.target.value);
        }
    };

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClear = () => {
        if (onClear) {
            onClear();
            return;
        }

        if (onSearchChange) {
            onSearchChange("");
        } else if (onSearch) {
            onSearch("");
        }

        if (onStatusFilterChange) {
            onStatusFilterChange("all");
        }

        if (onRequiredFilterChange) {
            onRequiredFilterChange("all");
        }
    };

    /* =====================================================
       CHECK ACTIVE FILTERS
    ===================================================== */

    const hasActiveFilters =
        Boolean(currentSearchValue) ||
        statusFilter !== "all" ||
        requiredFilter !== "all";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%" }}>
            <Grid
                container
                spacing={2}
                alignItems="center"
            >
                {/* =========================================
                    SEARCH INPUT
                ========================================= */}

                <Grid item xs={12} md={6} lg={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Search Custom Fields"
                        placeholder={placeholder}
                        value={currentSearchValue}
                        onChange={handleSearchChange}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),

                            endAdornment: currentSearchValue ? (
                                <InputAdornment position="end">
                                    <Tooltip title="Clear search">
                                        <span>
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    if (onSearchChange) {
                                                        onSearchChange("");
                                                    } else if (onSearch) {
                                                        onSearch("");
                                                    }
                                                }}
                                                disabled={loading}
                                                sx={{
                                                    minWidth: 0,
                                                    p: 0.5
                                                }}
                                                aria-label="Clear search"
                                            >
                                                <Clear fontSize="small" />
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </InputAdornment>
                            ) : null
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2
                            }
                        }}
                    />
                </Grid>

                {/* =========================================
                    STATUS FILTER
                ========================================= */}

                {showStatusFilter && (
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Status"
                            value={statusFilter}
                            onChange={handleStatusChange}
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterList fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2
                                }
                            }}
                        >
                            <MenuItem value="all">
                                All Statuses
                            </MenuItem>

                            <MenuItem value="active">
                                Active
                            </MenuItem>

                            <MenuItem value="inactive">
                                Inactive
                            </MenuItem>
                        </TextField>
                    </Grid>
                )}

                {/* =========================================
                    REQUIRED FILTER
                ========================================= */}

                {showRequiredFilter && (
                    <Grid item xs={12} sm={6} md={2}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Requirement"
                            value={requiredFilter}
                            onChange={handleRequiredChange}
                            disabled={loading}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2
                                }
                            }}
                        >
                            <MenuItem value="all">
                                All Fields
                            </MenuItem>

                            <MenuItem value="required">
                                Required
                            </MenuItem>

                            <MenuItem value="optional">
                                Optional
                            </MenuItem>
                        </TextField>
                    </Grid>
                )}

                {/* =========================================
                    CLEAR FILTERS BUTTON
                ========================================= */}

                {showClearButton && (
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="inherit"
                            startIcon={<RestartAlt />}
                            onClick={handleClear}
                            disabled={loading || !hasActiveFilters}
                            sx={{
                                minHeight: 40,
                                borderRadius: 2,
                                textTransform: "none",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default VendorItemCustomFieldSearch;

