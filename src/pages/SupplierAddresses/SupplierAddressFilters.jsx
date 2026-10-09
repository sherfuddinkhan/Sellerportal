import React from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    InputAdornment,
    Typography
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";

/* =========================================================
   SUPPLIER ADDRESS FILTERS
========================================================= */

const SupplierAddressFilters = ({
    searchTerm = "",
    onSearchChange,

    statusFilter = "all",
    onStatusChange,

    addressTypeFilter = "all",
    onAddressTypeChange,

    cityFilter = "",
    onCityChange,

    stateFilter = "",
    onStateChange,

    countryFilter = "",
    onCountryChange,

    supplierFilter = "all",
    onSupplierChange,

    suppliers = [],
    supplierAddresses = [],

    onClear,
    loading = false
}) => {

    /* =====================================================
       GET UNIQUE VALUES
    ===================================================== */

    const getUniqueValues = (field) => {
        const values = supplierAddresses
            .map((item) => {
                return (
                    item?.[field] ??
                    item?.[
                        field.charAt(0).toUpperCase() +
                        field.slice(1)
                    ]
                );
            })
            .filter((value) => {
                return (
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
                );
            });

        return [...new Set(values.map(String))].sort(
            (a, b) => a.localeCompare(b)
        );
    };

    /* =====================================================
       SUPPLIER OPTIONS
    ===================================================== */

    const supplierOptions = suppliers.length > 0
        ? suppliers
        : supplierAddresses
            .map((item) => ({
                supplierId:
                    item?.supplierId ??
                    item?.SupplierId,

                supplierName:
                    item?.supplierName ??
                    item?.SupplierName ??
                    item?.supplier?.supplierName ??
                    item?.Supplier?.SupplierName
            }))
            .filter((item) => item.supplierId !== undefined)
            .filter((item, index, array) => {
                return (
                    array.findIndex(
                        (supplier) =>
                            String(supplier.supplierId) ===
                            String(item.supplierId)
                    ) === index
                );
            });

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClear = () => {
        if (onClear) {
            onClear();
            return;
        }

        onSearchChange?.("");
        onStatusChange?.("all");
        onAddressTypeChange?.("all");
        onCityChange?.("");
        onStateChange?.("");
        onCountryChange?.("");
        onSupplierChange?.("all");
    };

    /* =====================================================
       CHECK ACTIVE FILTERS
    ===================================================== */

    const hasActiveFilters =
        searchTerm !== "" ||
        statusFilter !== "all" ||
        addressTypeFilter !== "all" ||
        cityFilter !== "" ||
        stateFilter !== "" ||
        countryFilter !== "" ||
        supplierFilter !== "all";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                p: 2,
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper"
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                    mb: 2
                }}
            >
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                >
                    Supplier Address Filters
                </Typography>

                <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    startIcon={<Clear />}
                    onClick={handleClear}
                    disabled={loading || !hasActiveFilters}
                >
                    Clear Filters
                </Button>
            </Box>

            {/* FILTER FIELDS */}

            <Grid container spacing={2}>

                {/* SEARCH */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Search"
                        placeholder="Search supplier, address..."
                        value={searchTerm}
                        onChange={(event) =>
                            onSearchChange?.(event.target.value)
                        }
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>

                {/* SUPPLIER */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Supplier"
                        value={supplierFilter}
                        onChange={(event) =>
                            onSupplierChange?.(event.target.value)
                        }
                        disabled={loading}
                    >
                        <MenuItem value="all">
                            All Suppliers
                        </MenuItem>

                        {supplierOptions.map((supplier, index) => {
                            const id =
                                supplier?.supplierId ??
                                supplier?.SupplierId ??
                                supplier?.id ??
                                supplier?.Id;

                            const name =
                                supplier?.supplierName ??
                                supplier?.SupplierName ??
                                supplier?.name ??
                                supplier?.Name ??
                                `Supplier ${id}`;

                            return (
                                <MenuItem
                                    key={id ?? index}
                                    value={String(id)}
                                >
                                    {name}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Grid>

                {/* ADDRESS TYPE */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Address Type"
                        value={addressTypeFilter}
                        onChange={(event) =>
                            onAddressTypeChange?.(event.target.value)
                        }
                        disabled={loading}
                    >
                        <MenuItem value="all">
                            All Address Types
                        </MenuItem>

                        <MenuItem value="Billing">
                            Billing
                        </MenuItem>

                        <MenuItem value="Shipping">
                            Shipping
                        </MenuItem>

                        <MenuItem value="Office">
                            Office
                        </MenuItem>

                        <MenuItem value="Warehouse">
                            Warehouse
                        </MenuItem>

                        <MenuItem value="Registered">
                            Registered
                        </MenuItem>

                        {getUniqueValues("addressType")
                            .filter((type) =>
                                ![
                                    "Billing",
                                    "Shipping",
                                    "Office",
                                    "Warehouse",
                                    "Registered"
                                ].some(
                                    (knownType) =>
                                        knownType.toLowerCase() ===
                                        type.toLowerCase()
                                )
                            )
                            .map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                    </TextField>
                </Grid>

                {/* STATUS */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Status"
                        value={statusFilter}
                        onChange={(event) =>
                            onStatusChange?.(event.target.value)
                        }
                        disabled={loading}
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

                {/* CITY */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="City"
                        value={cityFilter}
                        onChange={(event) =>
                            onCityChange?.(event.target.value)
                        }
                        disabled={loading}
                    >
                        <MenuItem value="">
                            All Cities
                        </MenuItem>

                        {getUniqueValues("city").map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* STATE */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="State"
                        value={stateFilter}
                        onChange={(event) =>
                            onStateChange?.(event.target.value)
                        }
                        disabled={loading}
                    >
                        <MenuItem value="">
                            All States
                        </MenuItem>

                        {getUniqueValues("state").map((state) => (
                            <MenuItem key={state} value={state}>
                                {state}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* COUNTRY */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Country"
                        value={countryFilter}
                        onChange={(event) =>
                            onCountryChange?.(event.target.value)
                        }
                        disabled={loading}
                    >
                        <MenuItem value="">
                            All Countries
                        </MenuItem>

                        {getUniqueValues("country").map((country) => (
                            <MenuItem key={country} value={country}>
                                {country}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

            </Grid>
        </Box>
    );
};

export default SupplierAddressFilters;

