// ReversePickupFilters.jsx

import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Divider,
    Chip,
    Collapse
} from "@mui/material";

import {
    FilterList,
    FilterAltOff,
    RestartAlt,
    ExpandLess,
    ExpandMore
} from "@mui/icons-material";

/* =========================================================
   DEFAULT FILTER VALUES
========================================================= */

const initialFilters = {
    status: "all",
    carrierName: "all",
    pickupDateFrom: "",
    pickupDateTo: "",
    minQuantity: "",
    maxQuantity: "",
    minPickupCost: "",
    maxPickupCost: ""
};

/* =========================================================
   REVERSE PICKUP FILTERS
========================================================= */

const ReversePickupFilters = ({
    filters = {},
    onApply,
    onFilterChange,
    onClear,
    onReset,

    loading = false,
    disabled = false,

    expanded: expandedProp,
    defaultExpanded = true,
    onToggle,

    title = "Advanced Filters",
    showTitle = true,
    showToggle = true,
    showApplyButton = true,
    showClearButton = true,
    showActiveCount = true,

    carriers = [],
    availableCarriers,

    totalRecords,
    filteredRecords,

    compact = false
}) => {

    const [localFilters, setLocalFilters] = useState({
        ...initialFilters,
        ...filters
    });

    const [internalExpanded, setInternalExpanded] =
        useState(defaultExpanded);

    const isControlled =
        expandedProp !== undefined;

    const expanded = isControlled
        ? expandedProp
        : internalExpanded;

    const isDisabled = loading || disabled;

    /* =====================================================
       SYNC EXTERNAL FILTER VALUES
    ===================================================== */

    useEffect(() => {
        setLocalFilters({
            ...initialFilters,
            ...filters
        });
    }, [filters]);

    /* =====================================================
       NORMALIZE CARRIER OPTIONS
    ===================================================== */

    const carrierOptions = (
        availableCarriers || carriers
    )
        .map((carrier) => {
            if (typeof carrier === "string") {
                return {
                    value: carrier,
                    label: carrier
                };
            }

            const value =
                carrier.value ??
                carrier.carrierName ??
                carrier.CarrierName ??
                carrier.name ??
                carrier.Name ??
                "";

            const label =
                carrier.label ??
                carrier.carrierName ??
                carrier.CarrierName ??
                carrier.name ??
                carrier.Name ??
                value;

            return {
                value: String(value),
                label: String(label)
            };
        })
        .filter((carrier) => carrier.value);

    /* =====================================================
       ACTIVE FILTER COUNT
    ===================================================== */

    const activeFilterCount = Object.entries(
        localFilters
    ).filter(([key, value]) => {
        if (
            key === "status" ||
            key === "carrierName"
        ) {
            return (
                value !== "" &&
                value !== "all" &&
                value !== undefined &&
                value !== null
            );
        }

        return (
            value !== "" &&
            value !== undefined &&
            value !== null
        );
    }).length;

    /* =====================================================
       HANDLE FILTER CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        const updatedFilters = {
            ...localFilters,
            [name]: value
        };

        setLocalFilters(updatedFilters);

        if (typeof onFilterChange === "function") {
            onFilterChange(name, value, updatedFilters);
        }
    };

    /* =====================================================
       HANDLE APPLY
    ===================================================== */

    const handleApply = () => {
        if (isDisabled) return;

        if (
            localFilters.pickupDateFrom &&
            localFilters.pickupDateTo &&
            localFilters.pickupDateFrom >
                localFilters.pickupDateTo
        ) {
            return;
        }

        if (typeof onApply === "function") {
            onApply({ ...localFilters });
        } else if (
            typeof onFilterChange === "function"
        ) {
            onFilterChange({ ...localFilters });
        }
    };

    /* =====================================================
       HANDLE CLEAR
    ===================================================== */

    const handleClear = () => {
        if (isDisabled) return;

        const clearedFilters = {
            ...initialFilters
        };

        setLocalFilters(clearedFilters);

        if (typeof onClear === "function") {
            onClear(clearedFilters);
        } else if (typeof onReset === "function") {
            onReset(clearedFilters);
        } else if (
            typeof onApply === "function"
        ) {
            onApply(clearedFilters);
        } else if (
            typeof onFilterChange === "function"
        ) {
            onFilterChange(clearedFilters);
        }
    };

    /* =====================================================
       HANDLE EXPAND / COLLAPSE
    ===================================================== */

    const handleToggle = () => {
        const nextExpanded = !expanded;

        if (!isControlled) {
            setInternalExpanded(nextExpanded);
        }

        if (typeof onToggle === "function") {
            onToggle(nextExpanded);
        }
    };

    /* =====================================================
       VALIDATION
    ===================================================== */

    const invalidDateRange =
        Boolean(
            localFilters.pickupDateFrom &&
            localFilters.pickupDateTo &&
            localFilters.pickupDateFrom >
                localFilters.pickupDateTo
        );

    const invalidQuantityRange =
        localFilters.minQuantity !== "" &&
        localFilters.maxQuantity !== "" &&
        Number(localFilters.minQuantity) >
            Number(localFilters.maxQuantity);

    const invalidCostRange =
        localFilters.minPickupCost !== "" &&
        localFilters.maxPickupCost !== "" &&
        Number(localFilters.minPickupCost) >
            Number(localFilters.maxPickupCost);

    const hasInvalidRange =
        invalidDateRange ||
        invalidQuantityRange ||
        invalidCostRange;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            variant="outlined"
            sx={{
                width: "100%",
                borderRadius: 2,
                overflow: "hidden"
            }}
        >
            {/* =============================================
                FILTER HEADER
            ============================================= */}

            {(showTitle || showToggle) && (
                <Box
                    sx={{
                        px: compact ? 1.5 : 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        flexWrap: "wrap"
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

                        {showTitle && (
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                {title}
                            </Typography>
                        )}

                        {showActiveCount &&
                            activeFilterCount > 0 && (
                                <Chip
                                    size="small"
                                    color="primary"
                                    label={`${activeFilterCount} active`}
                                />
                            )}
                    </Box>

                    {showToggle && (
                        <Button
                            size="small"
                            color="inherit"
                            onClick={handleToggle}
                            disabled={isDisabled}
                            endIcon={
                                expanded
                                    ? <ExpandLess />
                                    : <ExpandMore />
                            }
                        >
                            {expanded ? "Hide" : "Show"}
                        </Button>
                    )}
                </Box>
            )}

            {showTitle && showToggle && <Divider />}

            {/* =============================================
                FILTER FIELDS
            ============================================= */}

            <Collapse in={expanded}>
                <Box
                    sx={{
                        p: compact ? 1.5 : 2
                    }}
                >
                    <Grid container spacing={2}>
                        {/* STATUS */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                label="Pickup Status"
                                name="status"
                                value={localFilters.status}
                                onChange={handleChange}
                                disabled={isDisabled}
                            >
                                <MenuItem value="all">
                                    All Statuses
                                </MenuItem>

                                <MenuItem value="Pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="Scheduled">
                                    Scheduled
                                </MenuItem>

                                <MenuItem value="In Progress">
                                    In Progress
                                </MenuItem>

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="Cancelled">
                                    Cancelled
                                </MenuItem>
                            </TextField>
                        </Grid>

                        {/* CARRIER */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                label="Carrier"
                                name="carrierName"
                                value={localFilters.carrierName}
                                onChange={handleChange}
                                disabled={isDisabled}
                            >
                                <MenuItem value="all">
                                    All Carriers
                                </MenuItem>

                                {carrierOptions.map((carrier) => (
                                    <MenuItem
                                        key={carrier.value}
                                        value={carrier.value}
                                    >
                                        {carrier.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* PICKUP DATE FROM */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="Pickup Date From"
                                name="pickupDateFrom"
                                value={localFilters.pickupDateFrom}
                                onChange={handleChange}
                                disabled={isDisabled}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                inputProps={{
                                    max: localFilters.pickupDateTo || undefined
                                }}
                            />
                        </Grid>

                        {/* PICKUP DATE TO */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                type="date"
                                label="Pickup Date To"
                                name="pickupDateTo"
                                value={localFilters.pickupDateTo}
                                onChange={handleChange}
                                disabled={isDisabled}
                                error={invalidDateRange}
                                helperText={
                                    invalidDateRange
                                        ? "End date must be on or after start date"
                                        : ""
                                }
                                InputLabelProps={{
                                    shrink: true
                                }}
                                inputProps={{
                                    min: localFilters.pickupDateFrom || undefined
                                }}
                            />
                        </Grid>

                        {/* MIN QUANTITY */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Minimum Quantity"
                                name="minQuantity"
                                value={localFilters.minQuantity}
                                onChange={handleChange}
                                disabled={isDisabled}
                                error={invalidQuantityRange}
                                inputProps={{
                                    min: 0,
                                    step: 1
                                }}
                            />
                        </Grid>

                        {/* MAX QUANTITY */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Maximum Quantity"
                                name="maxQuantity"
                                value={localFilters.maxQuantity}
                                onChange={handleChange}
                                disabled={isDisabled}
                                error={invalidQuantityRange}
                                inputProps={{
                                    min: 0,
                                    step: 1
                                }}
                            />
                        </Grid>

                        {/* MIN COST */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Minimum Pickup Cost (₹)"
                                name="minPickupCost"
                                value={localFilters.minPickupCost}
                                onChange={handleChange}
                                disabled={isDisabled}
                                error={invalidCostRange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>

                        {/* MAX COST */}

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                label="Maximum Pickup Cost (₹)"
                                name="maxPickupCost"
                                value={localFilters.maxPickupCost}
                                onChange={handleChange}
                                disabled={isDisabled}
                                error={invalidCostRange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* RECORD SUMMARY */}

                    {(totalRecords !== undefined ||
                        filteredRecords !== undefined) && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                        >
                            Showing {filteredRecords ?? totalRecords ?? 0}
                            {" of "}
                            {totalRecords ?? filteredRecords ?? 0}
                            {" reverse pickups"}
                        </Typography>
                    )}

                    {/* FILTER ACTIONS */}

                    <Divider sx={{ my: 2 }} />

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 1,
                            flexWrap: "wrap"
                        }}
                    >
                        {showClearButton && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<FilterAltOff />}
                                onClick={handleClear}
                                disabled={
                                    isDisabled ||
                                    activeFilterCount === 0
                                }
                            >
                                Clear Filters
                            </Button>
                        )}

                        {showApplyButton && (
                            <Button
                                variant="contained"
                                startIcon={<FilterList />}
                                onClick={handleApply}
                                disabled={isDisabled || hasInvalidRange}
                            >
                                Apply Filters
                            </Button>
                        )}
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
};

export default ReversePickupFilters;

