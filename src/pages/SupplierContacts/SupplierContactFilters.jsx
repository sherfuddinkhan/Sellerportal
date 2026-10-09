
import React from "react";

import {
    Box,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    InputAdornment,
    IconButton,
    Typography,
    Chip
} from "@mui/material";

import {
    Search,
    Clear,
    FilterAlt,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   SUPPLIER FIELD HELPERS
========================================================= */

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

/* =========================================================
   SUPPLIER CONTACT FILTERS
========================================================= */

const SupplierContactFilters = ({
    searchTerm = "",
    onSearchChange,

    supplierFilter = "all",
    onSupplierChange,

    statusFilter = "all",
    onStatusChange,

    primaryFilter = "all",
    onPrimaryChange,

    departmentFilter = "all",
    onDepartmentChange,

    suppliers = [],
    departments = [],

    onApplyFilters,
    onClearFilters,
    onRefresh,

    loading = false,
    totalContacts = 0,
    filteredContacts = 0
}) => {
    /* =====================================================
       SEARCH
    ===================================================== */

    const handleSearchChange = (event) => {
        onSearchChange?.(event.target.value);
    };

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClearFilters = () => {
        onSearchChange?.("");
        onSupplierChange?.("all");
        onStatusChange?.("all");
        onPrimaryChange?.("all");
        onDepartmentChange?.("all");
        onClearFilters?.();
    };

    /* =====================================================
       DEPARTMENT OPTIONS
    ===================================================== */

    const departmentOptions = [
        ...new Set(
            departments
                .map((department) => {
                    if (typeof department === "string") {
                        return department.trim();
                    }

                    return (
                        department?.Department ??
                        department?.department ??
                        department?.DepartmentName ??
                        department?.departmentName ??
                        ""
                    ).trim();
                })
                .filter(Boolean)
        )
    ];

    const hasActiveFilters =
        Boolean(searchTerm.trim()) ||
        supplierFilter !== "all" ||
        statusFilter !== "all" ||
        primaryFilter !== "all" ||
        departmentFilter !== "all";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                mb: 2.5
            }}
        >
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
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    <FilterAlt color="primary" />

                    <Typography variant="h6" fontWeight={600}>
                        Contact Filters
                    </Typography>

                    {hasActiveFilters && (
                        <Chip
                            label="Filters Applied"
                            color="primary"
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Showing {filteredContacts} of {totalContacts} contacts
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {/* SEARCH */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Search Contacts"
                        placeholder="Name, email, phone, designation..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        aria-label="Clear search"
                                        onClick={() =>
                                            onSearchChange?.("")
                                        }
                                        disabled={loading}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }}
                    />
                </Grid>

                {/* SUPPLIER */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl
                        fullWidth
                        size="small"
                        disabled={loading}
                    >
                        <InputLabel id="supplier-contact-filter-supplier">
                            Supplier
                        </InputLabel>

                        <Select
                            labelId="supplier-contact-filter-supplier"
                            value={supplierFilter}
                            label="Supplier"
                            onChange={(event) =>
                                onSupplierChange?.(event.target.value)
                            }
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

                {/* STATUS */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl
                        fullWidth
                        size="small"
                        disabled={loading}
                    >
                        <InputLabel id="supplier-contact-filter-status">
                            Status
                        </InputLabel>

                        <Select
                            labelId="supplier-contact-filter-status"
                            value={statusFilter}
                            label="Status"
                            onChange={(event) =>
                                onStatusChange?.(event.target.value)
                            }
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
                        </Select>
                    </FormControl>
                </Grid>

                {/* PRIMARY CONTACT */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl
                        fullWidth
                        size="small"
                        disabled={loading}
                    >
                        <InputLabel id="supplier-contact-filter-primary">
                            Primary Contact
                        </InputLabel>

                        <Select
                            labelId="supplier-contact-filter-primary"
                            value={primaryFilter}
                            label="Primary Contact"
                            onChange={(event) =>
                                onPrimaryChange?.(event.target.value)
                            }
                        >
                            <MenuItem value="all">
                                All Contacts
                            </MenuItem>

                            <MenuItem value="primary">
                                Primary Only
                            </MenuItem>

                            <MenuItem value="non-primary">
                                Non-Primary
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* DEPARTMENT */}
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl
                        fullWidth
                        size="small"
                        disabled={loading}
                    >
                        <InputLabel id="supplier-contact-filter-department">
                            Department
                        </InputLabel>

                        <Select
                            labelId="supplier-contact-filter-department"
                            value={departmentFilter}
                            label="Department"
                            onChange={(event) =>
                                onDepartmentChange?.(event.target.value)
                            }
                        >
                            <MenuItem value="all">
                                All Departments
                            </MenuItem>

                            {departmentOptions.map((department) => (
                                <MenuItem
                                    key={department}
                                    value={department}
                                >
                                    {department}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* ACTION BUTTONS */}
                <Grid item xs={12} sm={6} md={6}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                            height: "100%"
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<FilterAlt />}
                            onClick={onApplyFilters}
                            disabled={loading}
                        >
                            Apply Filters
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<RestartAlt />}
                            onClick={handleClearFilters}
                            disabled={loading || !hasActiveFilters}
                        >
                            Reset
                        </Button>

                        {onRefresh && (
                            <Button
                                variant="text"
                                onClick={onRefresh}
                                disabled={loading}
                            >
                                Refresh
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SupplierContactFilters;

