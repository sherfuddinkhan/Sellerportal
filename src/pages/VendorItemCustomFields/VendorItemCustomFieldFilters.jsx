import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Chip,
    Collapse,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography
} from "@mui/material";

import {
    FilterAlt,
    ClearAll,
    ExpandLess,
    ExpandMore
} from "@mui/icons-material";

/* =========================================================
   FIELD HELPER
   Supports camelCase and PascalCase API fields
========================================================= */

const getField = (object, camelCase, pascalCase) => {
    if (!object) return "";

    return object[camelCase] ??
        object[pascalCase] ??
        "";
};

/* =========================================================
   FILTER OPTIONS
========================================================= */

const FIELD_TYPES = [
    "Text",
    "Number",
    "Decimal",
    "Date",
    "DateTime",
    "Boolean",
    "Checkbox",
    "Dropdown",
    "Select",
    "Textarea",
    "Email",
    "URL"
];

/* =========================================================
   VENDOR ITEM CUSTOM FIELD FILTERS
========================================================= */

const VendorItemCustomFieldFilters = ({
    filters = {},
    onFilterChange,
    onApplyFilters,
    onClearFilters,
    onReset,
    vendors = [],
    items = [],
    loading = false,
    showVendorFilter = true,
    showItemFilter = true,
    showTypeFilter = true,
    showStatusFilter = true,
    showRequiredFilter = true,
    defaultExpanded = true
}) => {
    const initialFilters = {
        vendorId: "",
        itemId: "",
        fieldType: "",
        status: "",
        isRequired: "",
        ...filters
    };

    const [localFilters, setLocalFilters] = useState(initialFilters);
    const [expanded, setExpanded] = useState(defaultExpanded);

    /* =====================================================
       SYNC EXTERNAL FILTERS
    ===================================================== */

    useEffect(() => {
        setLocalFilters({
            vendorId: "",
            itemId: "",
            fieldType: "",
            status: "",
            isRequired: "",
            ...filters
        });
    }, [filters]);

    /* =====================================================
       UPDATE FILTER
    ===================================================== */

    const handleChange = (name, value) => {
        const updatedFilters = {
            ...localFilters,
            [name]: value
        };

        setLocalFilters(updatedFilters);

        if (onFilterChange) {
            onFilterChange(name, value, updatedFilters);
        }
    };

    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    const handleApply = () => {
        if (onApplyFilters) {
            onApplyFilters({ ...localFilters });
        }
    };

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClear = () => {
        const clearedFilters = {
            vendorId: "",
            itemId: "",
            fieldType: "",
            status: "",
            isRequired: ""
        };

        setLocalFilters(clearedFilters);

        if (onClearFilters) {
            onClearFilters(clearedFilters);
        } else if (onReset) {
            onReset(clearedFilters);
        } else if (onApplyFilters) {
            onApplyFilters(clearedFilters);
        }
    };

    /* =====================================================
       ACTIVE FILTER COUNT
    ===================================================== */

    const activeFilterCount = Object.values(localFilters).filter(
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
                borderRadius: 2,
                width: "100%"
            }}
        >
            {/* HEADER */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <FilterAlt color="primary" />

                    <Typography variant="h6" fontWeight={600}>
                        Custom Field Filters
                    </Typography>

                    {activeFilterCount > 0 && (
                        <Chip
                            label={`${activeFilterCount} active`}
                            color="primary"
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Stack>

                <Button
                    size="small"
                    onClick={() => setExpanded((previous) => !previous)}
                    endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
                >
                    {expanded ? "Hide Filters" : "Show Filters"}
                </Button>
            </Box>

            <Collapse in={expanded}>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        {/* VENDOR FILTER */}

                        {showVendorFilter && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="filter-vendor-label">
                                        Vendor
                                    </InputLabel>

                                    <Select
                                        labelId="filter-vendor-label"
                                        value={localFilters.vendorId}
                                        label="Vendor"
                                        disabled={loading}
                                        onChange={(event) =>
                                            handleChange(
                                                "vendorId",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <MenuItem value="">
                                            All Vendors
                                        </MenuItem>

                                        {vendors.map((vendor) => {
                                            const id =
                                                getField(
                                                    vendor,
                                                    "vendorId",
                                                    "VendorId"
                                                ) ||
                                                getField(
                                                    vendor,
                                                    "supplierId",
                                                    "SupplierId"
                                                ) ||
                                                getField(vendor, "id", "Id");

                                            const name =
                                                getField(
                                                    vendor,
                                                    "vendorName",
                                                    "VendorName"
                                                ) ||
                                                getField(
                                                    vendor,
                                                    "supplierName",
                                                    "SupplierName"
                                                ) ||
                                                getField(vendor, "name", "Name");

                                            if (id === "") return null;

                                            return (
                                                <MenuItem
                                                    key={id}
                                                    value={String(id)}
                                                >
                                                    {name || `Vendor ${id}`}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {/* ITEM FILTER */}

                        {showItemFilter && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="filter-item-label">
                                        Item
                                    </InputLabel>

                                    <Select
                                        labelId="filter-item-label"
                                        value={localFilters.itemId}
                                        label="Item"
                                        disabled={loading}
                                        onChange={(event) =>
                                            handleChange(
                                                "itemId",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <MenuItem value="">
                                            All Items
                                        </MenuItem>

                                        {items.map((item) => {
                                            const id =
                                                getField(
                                                    item,
                                                    "itemId",
                                                    "ItemId"
                                                ) ||
                                                getField(item, "id", "Id");

                                            const name =
                                                getField(
                                                    item,
                                                    "itemName",
                                                    "ItemName"
                                                ) ||
                                                getField(item, "name", "Name");

                                            if (id === "") return null;

                                            return (
                                                <MenuItem
                                                    key={id}
                                                    value={String(id)}
                                                >
                                                    {name || `Item ${id}`}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {/* FIELD TYPE FILTER */}

                        {showTypeFilter && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="filter-type-label">
                                        Field Type
                                    </InputLabel>

                                    <Select
                                        labelId="filter-type-label"
                                        value={localFilters.fieldType}
                                        label="Field Type"
                                        disabled={loading}
                                        onChange={(event) =>
                                            handleChange(
                                                "fieldType",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <MenuItem value="">
                                            All Types
                                        </MenuItem>

                                        {FIELD_TYPES.map((type) => (
                                            <MenuItem
                                                key={type}
                                                value={type}
                                            >
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {/* STATUS FILTER */}

                        {showStatusFilter && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="filter-status-label">
                                        Status
                                    </InputLabel>

                                    <Select
                                        labelId="filter-status-label"
                                        value={localFilters.status}
                                        label="Status"
                                        disabled={loading}
                                        onChange={(event) =>
                                            handleChange(
                                                "status",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <MenuItem value="">
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
                        )}

                        {/* REQUIRED FILTER */}

                        {showRequiredFilter && (
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="filter-required-label">
                                        Required Field
                                    </InputLabel>

                                    <Select
                                        labelId="filter-required-label"
                                        value={localFilters.isRequired}
                                        label="Required Field"
                                        disabled={loading}
                                        onChange={(event) =>
                                            handleChange(
                                                "isRequired",
                                                event.target.value
                                            )
                                        }
                                    >
                                        <MenuItem value="">
                                            All Fields
                                        </MenuItem>

                                        <MenuItem value="true">
                                            Required
                                        </MenuItem>

                                        <MenuItem value="false">
                                            Optional
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                    </Grid>

                    {/* ACTION BUTTONS */}

                    <Stack
                        direction="row"
                        spacing={1.5}
                        justifyContent="flex-end"
                        flexWrap="wrap"
                        sx={{ mt: 2.5 }}
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<ClearAll />}
                            onClick={handleClear}
                            disabled={loading || activeFilterCount === 0}
                        >
                            Clear Filters
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<FilterAlt />}
                            onClick={handleApply}
                            disabled={loading}
                        >
                            Apply Filters
                        </Button>
                    </Stack>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default VendorItemCustomFieldFilters;

