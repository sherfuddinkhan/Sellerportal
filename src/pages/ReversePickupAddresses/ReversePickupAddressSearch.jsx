import React from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    InputAdornment,
    Button,
    Paper,
    Typography,
    Chip,
    Stack,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear,
    FilterList,
    LocationOn
} from "@mui/icons-material";

/* =========================================================
   REVERSE PICKUP ADDRESS SEARCH
========================================================= */

const ReversePickupAddressSearch = ({
    searchTerm = "",
    onSearchChange,

    filters = {},
    onFilterChange,

    onClearFilters,

    showFilters = true,
    totalCount = 0,
    filteredCount = 0,

    loading = false,

    addressTypes = [
        "Home",
        "Office",
        "Warehouse",
        "Other"
    ]
}) => {

    /* =====================================================
       HANDLE SEARCH
    ===================================================== */

    const handleSearchChange = (event) => {
        const value = event.target.value;

        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    /* =====================================================
       HANDLE FILTER CHANGE
    ===================================================== */

    const handleFilterChange = (field, value) => {
        if (onFilterChange) {
            onFilterChange(field, value);
        }
    };

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClearFilters = () => {
        if (onClearFilters) {
            onClearFilters();
            return;
        }

        if (onSearchChange) {
            onSearchChange("");
        }

        if (onFilterChange) {
            onFilterChange("city", "");
            onFilterChange("state", "");
            onFilterChange("addressType", "");
            onFilterChange("status", "");
            onFilterChange("isDefault", "");
        }
    };

    /* =====================================================
       ACTIVE FILTER COUNT
    ===================================================== */

    const activeFilterCount = [
        filters.city,
        filters.state,
        filters.addressType,
        filters.status,
        filters.isDefault
    ].filter(
        (value) => value !== "" && value !== null && value !== undefined
    ).length;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            {/* HEADER */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <LocationOn color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        Search Pickup Addresses
                    </Typography>
                </Stack>

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <Chip
                        size="small"
                        variant="outlined"
                        label={`Total: ${totalCount}`}
                    />

                    <Chip
                        size="small"
                        color="primary"
                        label={`Filtered: ${filteredCount}`}
                    />

                    {activeFilterCount > 0 && (
                        <Chip
                            size="small"
                            color="secondary"
                            label={`${activeFilterCount} filter${
                                activeFilterCount === 1 ? "" : "s"
                            }`}
                        />
                    )}
                </Stack>
            </Stack>

            {/* SEARCH FIELD */}

            <Grid container spacing={2} alignItems="center">

                <Grid item xs={12} md={showFilters ? 6 : 10}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Search addresses"
                        placeholder="Search name, phone, address, city or postal code"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={loading}
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
                                            aria-label="Clear search"
                                            onClick={() =>
                                                onSearchChange?.("")
                                            }
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ) : null
                        }}
                    />
                </Grid>

                {/* CITY */}

                {showFilters && (
                    <>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="City"
                                placeholder="Filter by city"
                                value={filters.city ?? ""}
                                onChange={(event) =>
                                    handleFilterChange(
                                        "city",
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            />
                        </Grid>

                        {/* STATE */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="State"
                                placeholder="Filter by state"
                                value={filters.state ?? ""}
                                onChange={(event) =>
                                    handleFilterChange(
                                        "state",
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            />
                        </Grid>

                        {/* ADDRESS TYPE */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Address Type"
                                value={filters.addressType ?? ""}
                                onChange={(event) =>
                                    handleFilterChange(
                                        "addressType",
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            >
                                <MenuItem value="">
                                    All Types
                                </MenuItem>

                                {addressTypes.map((type) => (
                                    <MenuItem
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* STATUS */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Status"
                                value={filters.status ?? ""}
                                onChange={(event) =>
                                    handleFilterChange(
                                        "status",
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            >
                                <MenuItem value="">
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

                        {/* DEFAULT ADDRESS */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Default Address"
                                value={filters.isDefault ?? ""}
                                onChange={(event) =>
                                    handleFilterChange(
                                        "isDefault",
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            >
                                <MenuItem value="">
                                    All Addresses
                                </MenuItem>

                                <MenuItem value="true">
                                    Default Only
                                </MenuItem>

                                <MenuItem value="false">
                                    Non-default Only
                                </MenuItem>
                            </TextField>
                        </Grid>
                    </>
                )}

                {/* ACTIONS */}

                <Grid item xs={12} md={showFilters ? 6 : 2}>
                    <Stack
                        direction="row"
                        justifyContent={{ xs: "flex-start", md: "flex-end" }}
                        spacing={1}
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<Clear />}
                            onClick={handleClearFilters}
                            disabled={
                                loading ||
                                (
                                    !searchTerm &&
                                    activeFilterCount === 0
                                )
                            }
                        >
                            Clear
                        </Button>

                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<FilterList />}
                            onClick={() => {
                                if (onFilterChange) {
                                    onFilterChange(
                                        "toggleFilters",
                                        !showFilters
                                    );
                                }
                            }}
                            disabled={loading}
                        >
                            Filters
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            {/* FOOTER */}

            <Box
                sx={{
                    mt: 2,
                    pt: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider"
                }}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Search across available address fields. Filters are
                    applied by the parent component.
                </Typography>
            </Box>
        </Paper>
    );
};

export default ReversePickupAddressSearch;

