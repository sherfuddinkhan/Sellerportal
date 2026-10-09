import React, { useEffect, useState } from "react";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    Button,
    Chip,
    Grid,
    MenuItem,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ExpandMore,
    FilterAlt,
    RestartAlt,
    Search
} from "@mui/icons-material";

/* =========================================================
   DEFAULT OPTIONS
========================================================= */

const DEFAULT_STATUSES = [
    "All",
    "Pending",
    "In Progress",
    "Completed",
    "Cancelled"
];

/* =========================================================
   HELPERS
========================================================= */

const getField = (object, fields, fallback = "") => {
    if (!object || typeof object !== "object") {
        return fallback;
    }

    for (const field of fields) {
        if (
            object[field] !== undefined &&
            object[field] !== null
        ) {
            return object[field];
        }
    }

    return fallback;
};

const getWarehouseId = (warehouse) =>
    getField(warehouse, [
        "warehouseId",
        "WarehouseId",
        "locationId",
        "LocationId",
        "id",
        "Id"
    ], "");

const getWarehouseName = (warehouse) => {
    if (typeof warehouse === "string") {
        return warehouse;
    }

    return getField(warehouse, [
        "warehouseName",
        "WarehouseName",
        "name",
        "Name",
        "locationName",
        "LocationName"
    ], "");
};

const normalizeStatus = (value) =>
    String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[\s_-]/g, "");

/* =========================================================
   INITIAL FILTER VALUES
========================================================= */

const EMPTY_FILTERS = {
    status: "All",
    warehouseId: "",
    orderNumber: "",
    dateFrom: "",
    dateTo: ""
};

/* =========================================================
   PICKLIST FILTERS
========================================================= */

const PicklistFilters = ({
    filters,
    initialFilters,

    onApply,
    onFilterChange,
    onReset,

    warehouses = [],
    statuses = DEFAULT_STATUSES,

    loading = false,
    disabled = false,

    defaultExpanded = false,
    showApplyButton = true,
    showResetButton = true,

    resultCount,
    totalCount,

    title = "Advanced Filters"
}) => {
    const externalFilters = filters || initialFilters;

    const [localFilters, setLocalFilters] = useState({
        ...EMPTY_FILTERS,
        ...(externalFilters || {})
    });

    const [expanded, setExpanded] = useState(defaultExpanded);

    /* =====================================================
       SYNC EXTERNAL FILTERS
    ===================================================== */

    useEffect(() => {
        if (externalFilters) {
            setLocalFilters({
                ...EMPTY_FILTERS,
                ...externalFilters
            });
        }
    }, [externalFilters]);

    /* =====================================================
       HANDLE FIELD CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setLocalFilters((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    const handleApply = () => {
        const payload = {
            ...localFilters,
            status: localFilters.status || "All",
            warehouseId: localFilters.warehouseId || "",
            orderNumber: String(
                localFilters.orderNumber || ""
            ).trim()
        };

        if (
            typeof onApply === "function"
        ) {
            onApply(payload);
        } else if (
            typeof onFilterChange === "function"
        ) {
            onFilterChange(payload);
        }
    };

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const handleReset = () => {
        const resetFilters = {
            ...EMPTY_FILTERS
        };

        setLocalFilters(resetFilters);

        if (typeof onReset === "function") {
            onReset(resetFilters);
        } else if (typeof onApply === "function") {
            onApply(resetFilters);
        } else if (typeof onFilterChange === "function") {
            onFilterChange(resetFilters);
        }
    };

    /* =====================================================
       ACTIVE FILTER COUNT
    ===================================================== */

    const activeFilterCount = [
        normalizeStatus(localFilters.status) !== "all" &&
            Boolean(localFilters.status),
        Boolean(localFilters.warehouseId),
        Boolean(String(localFilters.orderNumber || "").trim()),
        Boolean(localFilters.dateFrom),
        Boolean(localFilters.dateTo)
    ].filter(Boolean).length;

    const isBusy = loading || disabled;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Accordion
            expanded={expanded}
            onChange={(_, isExpanded) => setExpanded(isExpanded)}
            disableGutters
            elevation={0}
            sx={{
                mb: 2.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "8px !important",
                overflow: "hidden",
                "&::before": {
                    display: "none"
                }
            }}
        >
            {/* HEADER */}

            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="picklist-filter-content"
                id="picklist-filter-header"
                sx={{
                    px: 2.5,
                    py: 0.5,
                    "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                        gap: 1.5
                    }
                }}
            >
                <FilterAlt color="primary" />

                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Filter by status, warehouse, order, or date.
                    </Typography>
                </Box>

                {activeFilterCount > 0 && (
                    <Chip
                        size="small"
                        color="primary"
                        label={`${activeFilterCount} active`}
                    />
                )}
            </AccordionSummary>

            {/* FILTER CONTENT */}

            <AccordionDetails
                id="picklist-filter-content"
                sx={{ px: 2.5, pb: 2.5 }}
            >
                <Grid container spacing={2}>
                    {/* STATUS */}

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Picklist Status"
                            name="status"
                            value={localFilters.status || "All"}
                            onChange={handleChange}
                            disabled={isBusy}
                        >
                            {statuses.map((item) => {
                                const value =
                                    typeof item === "string"
                                        ? item
                                        : item.value;

                                const label =
                                    typeof item === "string"
                                        ? item
                                        : item.label;

                                return (
                                    <MenuItem
                                        key={value}
                                        value={value}
                                    >
                                        {label}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </Grid>

                    {/* WAREHOUSE */}

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Warehouse"
                            name="warehouseId"
                            value={localFilters.warehouseId ?? ""}
                            onChange={handleChange}
                            disabled={isBusy}
                        >
                            <MenuItem value="">
                                All Warehouses
                            </MenuItem>

                            {warehouses.map((warehouse, index) => {
                                const id =
                                    typeof warehouse === "string"
                                        ? warehouse
                                        : getWarehouseId(warehouse);

                                const name = getWarehouseName(warehouse);

                                return (
                                    <MenuItem
                                        key={String(id || index)}
                                        value={id}
                                    >
                                        {name || String(id)}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
                    </Grid>

                    {/* ORDER NUMBER */}

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Order Number"
                            name="orderNumber"
                            placeholder="Enter order number"
                            value={localFilters.orderNumber ?? ""}
                            onChange={handleChange}
                            disabled={isBusy}
                        />
                    </Grid>

                    {/* DATE FROM */}

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="From Date"
                            name="dateFrom"
                            value={localFilters.dateFrom ?? ""}
                            onChange={handleChange}
                            disabled={isBusy}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                max: localFilters.dateTo || undefined
                            }}
                        />
                    </Grid>

                    {/* DATE TO */}

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="To Date"
                            name="dateTo"
                            value={localFilters.dateTo ?? ""}
                            onChange={handleChange}
                            disabled={isBusy}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                min: localFilters.dateFrom || undefined
                            }}
                        />
                    </Grid>
                </Grid>

                {/* ACTIONS */}

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={2}
                    sx={{ mt: 3 }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {resultCount !== undefined
                            ? `${resultCount} matching picklists`
                            : totalCount !== undefined
                                ? `${totalCount} total picklists`
                                : "Set your filters and apply them."}
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                    >
                        {showResetButton && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<RestartAlt />}
                                onClick={handleReset}
                                disabled={isBusy || activeFilterCount === 0}
                            >
                                Reset Filters
                            </Button>
                        )}

                        {showApplyButton && (
                            <Button
                                variant="contained"
                                startIcon={<Search />}
                                onClick={handleApply}
                                disabled={isBusy}
                            >
                                Apply Filters
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
};

export default PicklistFilters;

