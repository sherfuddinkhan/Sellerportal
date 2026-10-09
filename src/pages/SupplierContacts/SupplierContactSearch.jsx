import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear,
    FilterList,
    Refresh
} from "@mui/icons-material";

/* =========================================================
   SUPPLIER CONTACT SEARCH
========================================================= */

const SupplierContactSearch = ({
    searchTerm = "",
    onSearchChange,
    search,
    onSearch,
    statusFilter = "all",
    onStatusChange,
    supplierFilter = "all",
    onSupplierChange,
    suppliers = [],
    onClear,
    onRefresh,
    loading = false
}) => {
    const currentSearch = searchTerm ?? search ?? "";

    const handleSearchChange = (event) => {
        const value = event.target.value;

        if (onSearchChange) {
            onSearchChange(value);
        } else if (onSearch) {
            onSearch(value);
        }
    };

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

        if (onStatusChange) {
            onStatusChange("all");
        }

        if (onSupplierChange) {
            onSupplierChange("all");
        }
    };

    const getSupplierId = (supplier) =>
        supplier?.SupplierId ??
        supplier?.supplierId ??
        supplier?.Id ??
        supplier?.id ??
        "";

    const getSupplierName = (supplier) =>
        supplier?.SupplierName ??
        supplier?.supplierName ??
        supplier?.Name ??
        supplier?.name ??
        "Unnamed Supplier";

    return (
        <Box sx={{ width: "100%", mb: 2 }}>
            <Grid container spacing={2} alignItems="center">

                {/* SEARCH INPUT */}
                <Grid item xs={12} md={5}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Search Supplier Contacts"
                        placeholder="Search name, email, phone, designation..."
                        value={currentSearch}
                        onChange={handleSearchChange}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: currentSearch ? (
                                <InputAdornment position="end">
                                    <Tooltip title="Clear search">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                if (onSearchChange) {
                                                    onSearchChange("");
                                                } else if (onSearch) {
                                                    onSearch("");
                                                }
                                            }}
                                            edge="end"
                                            aria-label="Clear search"
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ) : null
                        }}
                    />
                </Grid>

                {/* STATUS FILTER */}
                <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="contact-status-filter-label">
                            Status
                        </InputLabel>

                        <Select
                            labelId="contact-status-filter-label"
                            value={statusFilter}
                            label="Status"
                            onChange={(event) =>
                                onStatusChange?.(event.target.value)
                            }
                            disabled={loading}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* SUPPLIER FILTER */}
                <Grid item xs={12} sm={6} md={2.5}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="contact-supplier-filter-label">
                            Supplier
                        </InputLabel>

                        <Select
                            labelId="contact-supplier-filter-label"
                            value={supplierFilter}
                            label="Supplier"
                            onChange={(event) =>
                                onSupplierChange?.(event.target.value)
                            }
                            disabled={loading}
                        >
                            <MenuItem value="all">
                                All Suppliers
                            </MenuItem>

                            {suppliers.map((supplier, index) => {
                                const id = getSupplierId(supplier);

                                if (id === "") {
                                    return null;
                                }

                                return (
                                    <MenuItem
                                        key={id || index}
                                        value={String(id)}
                                    >
                                        {getSupplierName(supplier)}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>

                {/* ACTIONS */}
                <Grid item xs={12} md={2}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <Tooltip title="Clear filters">
                            <span>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<FilterList />}
                                    onClick={handleClear}
                                    disabled={
                                        loading ||
                                        (
                                            !currentSearch &&
                                            statusFilter === "all" &&
                                            supplierFilter === "all"
                                        )
                                    }
                                >
                                    Clear
                                </Button>
                            </span>
                        </Tooltip>

                        {onRefresh && (
                            <Tooltip title="Refresh contacts">
                                <span>
                                    <IconButton
                                        color="primary"
                                        onClick={onRefresh}
                                        disabled={loading}
                                        aria-label="Refresh contacts"
                                    >
                                        <Refresh />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                </Grid>

            </Grid>
        </Box>
    );
};

export default SupplierContactSearch;

