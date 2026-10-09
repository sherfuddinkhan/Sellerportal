import React from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Paper,
    Typography,
    Divider,
    Chip
} from "@mui/material";

import {
    FilterList,
    RestartAlt,
    Check
} from "@mui/icons-material";

/* =========================================================
   SHELFWISE INVENTORY FILTERS
========================================================= */

const ShelfwiseInventoryFilters = ({
    filters = {},
    onFilterChange,
    onApplyFilters,
    onResetFilters,

    warehouses = [],
    shelves = [],
    categories = [],

    loading = false,
    showFilters = true
}) => {

    /* =====================================================
       DEFAULT FILTER VALUES
    ===================================================== */

    const defaultFilters = {
        warehouseId: "all",
        shelfId: "all",
        categoryName: "all",
        status: "all",
        stockLevel: "all"
    };

    const currentFilters = {
        ...defaultFilters,
        ...filters
    };

    /* =====================================================
       HANDLE FILTER CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (onFilterChange) {
            onFilterChange(name, value);
        }
    };

    /* =====================================================
       HANDLE RESET
    ===================================================== */

    const handleReset = () => {
        if (onResetFilters) {
            onResetFilters();
            return;
        }

        if (onFilterChange) {
            Object.entries(defaultFilters).forEach(
                ([name, value]) => {
                    onFilterChange(name, value);
                }
            );
        }
    };

    /* =====================================================
       COUNT ACTIVE FILTERS
    ===================================================== */

    const activeFilterCount = Object.entries(currentFilters)
        .filter(([key, value]) => {
            return (
                value !== "all" &&
                value !== "" &&
                value !== null &&
                value !== undefined
            );
        }).length;

    /* =====================================================
       NORMALIZE OPTION LABEL
    ===================================================== */

    const getOptionLabel = (option, ...keys) => {
        if (
            typeof option === "string" ||
            typeof option === "number"
        ) {
            return String(option);
        }

        for (const key of keys) {
            if (
                option?.[key] !== undefined &&
                option?.[key] !== null
            ) {
                return String(option[key]);
            }
        }

        return "";
    };

    /* =====================================================
       NORMALIZE OPTION VALUE
    ===================================================== */

    const getOptionValue = (option, ...keys) => {
        if (
            typeof option === "string" ||
            typeof option === "number"
        ) {
            return option;
        }

        for (const key of keys) {
            if (
                option?.[key] !== undefined &&
                option?.[key] !== null
            ) {
                return option[key];
            }
        }

        return "";
    };

    /* =====================================================
       RENDER
    ===================================================== */

    if (!showFilters) {
        return null;
    }

    return (
        <Paper
            elevation={0}
            variant="outlined"
            sx={{
                p: { xs: 2, sm: 3 },
                mb: 2,
                borderRadius: 2
            }}
        >
            {/* FILTER HEADER */}

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
                    <FilterList color="primary" />

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Inventory Filters
                    </Typography>

                    {activeFilterCount > 0 && (
                        <Chip
                            size="small"
                            color="primary"
                            label={`${activeFilterCount} active`}
                        />
                    )}
                </Box>

                <Button
                    size="small"
                    color="inherit"
                    startIcon={<RestartAlt />}
                    onClick={handleReset}
                    disabled={loading}
                >
                    Reset
                </Button>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {/* FILTER FIELDS */}

            <Grid container spacing={2}>
                {/* WAREHOUSE */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        name="warehouseId"
                        label="Warehouse"
                        value={currentFilters.warehouseId}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <MenuItem value="all">
                            All Warehouses
                        </MenuItem>

                        {warehouses.map((warehouse, index) => {
                            const value = getOptionValue(
                                warehouse,
                                "warehouseId",
                                "WarehouseId",
                                "id",
                                "Id",
                                "value"
                            );

                            const label = getOptionLabel(
                                warehouse,
                                "warehouseName",
                                "WarehouseName",
                                "name",
                                "Name",
                                "label"
                            );

                            return (
                                <MenuItem
                                    key={value || index}
                                    value={value}
                                >
                                    {label || "Unnamed Warehouse"}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Grid>

                {/* SHELF */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        name="shelfId"
                        label="Shelf"
                        value={currentFilters.shelfId}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <MenuItem value="all">
                            All Shelves
                        </MenuItem>

                        {shelves.map((shelf, index) => {
                            const value = getOptionValue(
                                shelf,
                                "shelfId",
                                "ShelfId",
                                "id",
                                "Id",
                                "value"
                            );

                            const label = getOptionLabel(
                                shelf,
                                "shelfName",
                                "ShelfName",
                                "shelfCode",
                                "ShelfCode",
                                "name",
                                "Name",
                                "label"
                            );

                            return (
                                <MenuItem
                                    key={value || index}
                                    value={value}
                                >
                                    {label || "Unnamed Shelf"}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Grid>

                {/* CATEGORY */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        name="categoryName"
                        label="Category"
                        value={currentFilters.categoryName}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <MenuItem value="all">
                            All Categories
                        </MenuItem>

                        {categories.map((category, index) => {
                            const value = getOptionValue(
                                category,
                                "categoryName",
                                "CategoryName",
                                "name",
                                "Name",
                                "value"
                            );

                            const label = getOptionLabel(
                                category,
                                "categoryName",
                                "CategoryName",
                                "name",
                                "Name",
                                "label"
                            );

                            return (
                                <MenuItem
                                    key={value || index}
                                    value={value}
                                >
                                    {label || "Unnamed Category"}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Grid>

                {/* STATUS */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        name="status"
                        label="Inventory Status"
                        value={currentFilters.status}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <MenuItem value="all">
                            All Statuses
                        </MenuItem>

                        <MenuItem value="Available">
                            Available
                        </MenuItem>

                        <MenuItem value="Reserved">
                            Reserved
                        </MenuItem>

                        <MenuItem value="Low Stock">
                            Low Stock
                        </MenuItem>

                        <MenuItem value="Out of Stock">
                            Out of Stock
                        </MenuItem>

                        <MenuItem value="Inactive">
                            Inactive
                        </MenuItem>
                    </TextField>
                </Grid>

                {/* STOCK LEVEL */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        name="stockLevel"
                        label="Stock Level"
                        value={currentFilters.stockLevel}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <MenuItem value="all">
                            All Stock Levels
                        </MenuItem>

                        <MenuItem value="in-stock">
                            In Stock
                        </MenuItem>

                        <MenuItem value="low-stock">
                            Low Stock
                        </MenuItem>

                        <MenuItem value="out-of-stock">
                            Out of Stock
                        </MenuItem>
                    </TextField>
                </Grid>

                {/* ACTIONS */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    sx={{
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Check />}
                        onClick={onApplyFilters}
                        disabled={loading}
                        sx={{ minHeight: 40 }}
                    >
                        Apply Filters
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ShelfwiseInventoryFilters;

