import React from "react";

import {
    Box,
    Paper,
    TextField,
    MenuItem,
    Button,
    IconButton,
    Tooltip,
    InputAdornment,
    Stack,
    Typography,
    Chip
} from "@mui/material";

import {
    Search,
    Clear,
    FilterList,
    FilterListOff,
    LocalShipping
} from "@mui/icons-material";

/* =========================================================
   SEARCH FIELD OPTIONS
========================================================= */

const SEARCH_FIELDS = [
    { value: "all", label: "All Fields" },
    { value: "manifestNumber", label: "Manifest Number" },
    { value: "orderNumber", label: "Order Number" },
    { value: "customerName", label: "Customer / Consignee" },
    { value: "carrierName", label: "Carrier / Transporter" },
    { value: "trackingNumber", label: "Tracking Number" },
    { value: "vehicleNumber", label: "Vehicle Number" },
    { value: "driverName", label: "Driver Name" }
];

/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "ready", label: "Ready" },
    { value: "packed", label: "Packed" },
    { value: "shipped", label: "Shipped" },
    { value: "in transit", label: "In Transit" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
];

/* =========================================================
   SHIPPING MANIFEST SEARCH
========================================================= */

const ShippingManifestSearch = ({
    searchTerm = "",
    searchField = "all",
    status = "all",

    onSearchChange,
    onSearchFieldChange,
    onStatusChange,
    onClear,

    onToggleFilters,
    showFilters = false,

    loading = false,
    totalRecords,
    filteredRecords
}) => {
    /* =====================================================
       CLEAR SEARCH AND FILTERS
    ===================================================== */

    const handleClear = () => {
        onClear?.();
    };

    /* =====================================================
       SEARCH INPUT
    ===================================================== */

    const handleSearchChange = (event) => {
        onSearchChange?.(event.target.value);
    };

    /* =====================================================
       SEARCH FIELD CHANGE
    ===================================================== */

    const handleSearchFieldChange = (event) => {
        onSearchFieldChange?.(event.target.value);
    };

    /* =====================================================
       STATUS CHANGE
    ===================================================== */

    const handleStatusChange = (event) => {
        onStatusChange?.(event.target.value);
    };

    const hasActiveFilters =
        Boolean(searchTerm.trim()) ||
        searchField !== "all" ||
        status !== "all";

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 2.5 },
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    <Search color="primary" />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Search Shipping Manifests
                    </Typography>

                    {filteredRecords !== undefined && (
                        <Chip
                            size="small"
                            label={`${filteredRecords} results`}
                            variant="outlined"
                            color="primary"
                        />
                    )}
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >
                    <Tooltip
                        title={
                            showFilters
                                ? "Hide status filters"
                                : "Show status filters"
                        }
                    >
                        <IconButton
                            onClick={onToggleFilters}
                            disabled={loading}
                            color={showFilters ? "primary" : "default"}
                            aria-label={
                                showFilters
                                    ? "Hide filters"
                                    : "Show filters"
                            }
                            sx={{
                                border: "1px solid",
                                borderColor: showFilters
                                    ? "primary.main"
                                    : "divider",
                                borderRadius: 2
                            }}
                        >
                            {showFilters ? (
                                <FilterListOff />
                            ) : (
                                <FilterList />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Clear />}
                        onClick={handleClear}
                        disabled={loading || !hasActiveFilters}
                    >
                        Clear
                    </Button>
                </Stack>
            </Box>

            {/* =================================================
                SEARCH CONTROLS
            ================================================= */}

            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", md: "center" }}
            >
                <TextField
                    select
                    fullWidth
                    size="small"
                    label="Search By"
                    value={searchField}
                    onChange={handleSearchFieldChange}
                    disabled={loading}
                    sx={{
                        minWidth: { md: 190 },
                        maxWidth: { md: 240 }
                    }}
                >
                    {SEARCH_FIELDS.map((field) => (
                        <MenuItem
                            key={field.value}
                            value={field.value}
                        >
                            {field.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    size="small"
                    label="Search"
                    placeholder="Enter manifest, order, customer or tracking number..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    disabled={loading}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalShipping
                                        fontSize="small"
                                        color="action"
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm ? (
                                <InputAdornment position="end">
                                    <Tooltip title="Clear search text">
                                        <IconButton
                                            size="small"
                                            aria-label="Clear search text"
                                            onClick={() =>
                                                onSearchChange?.("")
                                            }
                                            edge="end"
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ) : null
                        }
                    }}
                />

                {showFilters && (
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Manifest Status"
                        value={status}
                        onChange={handleStatusChange}
                        disabled={loading}
                        sx={{ minWidth: { md: 190 } }}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            </Stack>

            {/* =================================================
                SEARCH SUMMARY
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 2
                }}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    {totalRecords !== undefined
                        ? `${totalRecords} total manifests`
                        : "Search by manifest details or tracking information"}
                </Typography>

                {hasActiveFilters && (
                    <Chip
                        size="small"
                        variant="outlined"
                        color="primary"
                        label="Filters applied"
                        onDelete={handleClear}
                    />
                )}
            </Box>
        </Paper>
    );
};

export default ShippingManifestSearch;

