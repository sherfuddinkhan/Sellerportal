import React from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Stack,
    InputAdornment,
    IconButton,
    Chip,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear,
    FilterList,
    FilterAltOff,
    Refresh
} from "@mui/icons-material";

/* =========================================================
   REVERSE PICKUP SEARCH
========================================================= */

const ReversePickupSearch = ({
    searchTerm = "",
    searchField = "all",
    status = "all",

    onSearchChange,
    onSearchFieldChange,
    onStatusChange,
    onClear,
    onToggleFilters,
    onRefresh,

    showFilters = true,
    loading = false,

    totalRecords,
    filteredRecords,

    title = "Search Reverse Pickups",
    showTitle = false,
    showRefreshButton = false,
    compact = false
}) => {
    /* =====================================================
       HANDLERS
    ===================================================== */

    const handleSearchChange = (event) => {
        onSearchChange?.(event.target.value);
    };

    const handleSearchFieldChange = (event) => {
        onSearchFieldChange?.(event.target.value);
    };

    const handleStatusChange = (event) => {
        onStatusChange?.(event.target.value);
    };

    const handleClear = () => {
        onClear?.();
    };

    const hasActiveFilters =
        Boolean(searchTerm.trim()) ||
        searchField !== "all" ||
        status !== "all";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%" }}>
            {/* HEADER */}

            {showTitle && (
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Find and filter reverse pickup records.
                    </Typography>
                </Box>
            )}

            {/* SEARCH CONTROLS */}

            <Grid container spacing={2} alignItems="center">
                {/* SEARCH INPUT */}

                <Grid item xs={12} md={compact ? 6 : 5}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Search"
                        placeholder="Pickup number, order, customer..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            ),

                            endAdornment: searchTerm ? (
                                <InputAdornment position="end">
                                    <Tooltip title="Clear search">
                                        <span>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    onSearchChange?.("")
                                                }
                                                disabled={loading}
                                                aria-label="Clear search text"
                                            >
                                                <Clear fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </InputAdornment>
                            ) : null
                        }}
                    />
                </Grid>

                {/* SEARCH FIELD */}

                {showFilters && (
                    <Grid item xs={12} sm={6} md={compact ? 3 : 3}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Search By"
                            value={searchField}
                            onChange={handleSearchFieldChange}
                            disabled={loading}
                        >
                            <MenuItem value="all">
                                All Fields
                            </MenuItem>

                            <MenuItem value="pickupNumber">
                                Pickup Number
                            </MenuItem>

                            <MenuItem value="orderNumber">
                                Order Number
                            </MenuItem>

                            <MenuItem value="customerName">
                                Customer Name
                            </MenuItem>

                            <MenuItem value="itemName">
                                Return Item
                            </MenuItem>

                            <MenuItem value="carrierName">
                                Carrier
                            </MenuItem>

                            <MenuItem value="trackingNumber">
                                Tracking Number
                            </MenuItem>
                        </TextField>
                    </Grid>
                )}

                {/* STATUS FILTER */}

                {showFilters && (
                    <Grid item xs={12} sm={6} md={compact ? 3 : 2}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Status"
                            value={status}
                            onChange={handleStatusChange}
                            disabled={loading}
                        >
                            <MenuItem value="all">
                                All Statuses
                            </MenuItem>

                            <MenuItem value="pending">
                                Pending
                            </MenuItem>

                            <MenuItem value="scheduled">
                                Scheduled
                            </MenuItem>

                            <MenuItem value="in progress">
                                In Progress
                            </MenuItem>

                            <MenuItem value="completed">
                                Completed
                            </MenuItem>

                            <MenuItem value="cancelled">
                                Cancelled
                            </MenuItem>
                        </TextField>
                    </Grid>
                )}

                {/* ACTION BUTTONS */}

                <Grid item xs={12}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                        spacing={1}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                        >
                            {onToggleFilters && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={
                                        showFilters
                                            ? <FilterAltOff />
                                            : <FilterList />
                                    }
                                    onClick={onToggleFilters}
                                    disabled={loading}
                                >
                                    {showFilters
                                        ? "Hide Filters"
                                        : "Show Filters"}
                                </Button>
                            )}

                            {hasActiveFilters && (
                                <Button
                                    variant="text"
                                    size="small"
                                    startIcon={<Clear />}
                                    onClick={handleClear}
                                    disabled={loading}
                                >
                                    Clear Filters
                                </Button>
                            )}

                            {showRefreshButton && onRefresh && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Refresh />}
                                    onClick={onRefresh}
                                    disabled={loading}
                                >
                                    Refresh
                                </Button>
                            )}
                        </Stack>

                        {/* RESULT COUNTS */}

                        {(totalRecords !== undefined ||
                            filteredRecords !== undefined) && (
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >
                                {filteredRecords !== undefined && (
                                    <Chip
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                        label={`Showing ${Number(
                                            filteredRecords
                                        ).toLocaleString("en-IN")}`}
                                    />
                                )}

                                {totalRecords !== undefined && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        of {Number(totalRecords).toLocaleString("en-IN")} records
                                    </Typography>
                                )}
                            </Stack>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReversePickupSearch;

