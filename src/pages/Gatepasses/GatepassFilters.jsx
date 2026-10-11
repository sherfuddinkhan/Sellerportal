// =========================================================
// GatepassFilters.jsx
// =========================================================

import React, { useState, useEffect } from "react";

import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    Divider,
    Chip
} from "@mui/material";

import {
    FilterList,
    Clear,
    Search
} from "@mui/icons-material";

// =========================================================
// DEFAULT FILTER VALUES
// =========================================================

const defaultFilters = {
    status: "",
    vehicleNumber: "",
    driverName: "",
    fromDate: "",
    toDate: ""
};

// =========================================================
// GATEPASS FILTERS
// =========================================================

const GatepassFilters = ({
    filters: externalFilters,
    onFilterChange,
    onApplyFilters,
    onClearFilters,
    collapsible = false
}) => {

    // =====================================================
    // LOCAL FILTER STATE
    // =====================================================

    const [filters, setFilters] = useState({
        ...defaultFilters,
        ...(externalFilters || {})
    });

    const [expanded, setExpanded] = useState(!collapsible);

    // =====================================================
    // SYNC WITH PARENT FILTER STATE
    // =====================================================

    useEffect(() => {
        if (externalFilters) {
            setFilters({
                ...defaultFilters,
                ...externalFilters
            });
        }
    }, [externalFilters]);

    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (field, value) => {
        setFilters((previous) => ({
            ...previous,
            [field]: value
        }));
    };

    // =====================================================
    // APPLY FILTERS
    // =====================================================

    const handleApply = () => {
        if (filters.fromDate && filters.toDate &&
            filters.fromDate > filters.toDate) {
            return;
        }

        if (typeof onFilterChange === "function") {
            onFilterChange(filters);
        }

        if (typeof onApplyFilters === "function") {
            onApplyFilters(filters);
        }
    };

    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const handleClear = () => {
        setFilters({ ...defaultFilters });

        if (typeof onFilterChange === "function") {
            onFilterChange({ ...defaultFilters });
        }

        if (typeof onClearFilters === "function") {
            onClearFilters();
        }

        if (typeof onApplyFilters === "function") {
            onApplyFilters({ ...defaultFilters });
        }
    };

    // =====================================================
    // ACTIVE FILTER COUNT
    // =====================================================

    const activeFilterCount = Object.values(filters).filter(
        (value) => String(value ?? "").trim() !== ""
    ).length;

    const invalidDateRange =
        Boolean(filters.fromDate && filters.toDate) &&
        filters.fromDate > filters.toDate;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Paper
            elevation={1}
            sx={{
                p: { xs: 2, sm: 3 },
                mb: 3,
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
                    gap: 1,
                    mb: expanded ? 2 : 0
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
                        fontWeight={600}
                    >
                        Gatepass Filters
                    </Typography>

                    {activeFilterCount > 0 && (
                        <Chip
                            label={`${activeFilterCount} active`}
                            color="primary"
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Box>

                {collapsible && (
                    <Button
                        size="small"
                        onClick={() => setExpanded((previous) => !previous)}
                    >
                        {expanded ? "Hide Filters" : "Show Filters"}
                    </Button>
                )}
            </Box>

            {expanded && (
                <>
                    <Divider sx={{ mb: 2.5 }} />

                    {/* =================================================
                        FILTER FIELDS
                    ================================================= */}

                    <Grid container spacing={2}>

                        {/* STATUS */}

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                label="Gatepass Status"
                                value={filters.status}
                                onChange={(event) =>
                                    handleChange("status", event.target.value)
                                }
                            >
                                <MenuItem value="">
                                    All Statuses
                                </MenuItem>

                                <MenuItem value="Pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="Approved">
                                    Approved
                                </MenuItem>

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="Rejected">
                                    Rejected
                                </MenuItem>

                                <MenuItem value="Cancelled">
                                    Cancelled
                                </MenuItem>
                            </TextField>
                        </Grid>

                        {/* VEHICLE NUMBER */}

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Vehicle Number"
                                placeholder="Enter vehicle number"
                                value={filters.vehicleNumber}
                                onChange={(event) =>
                                    handleChange(
                                        "vehicleNumber",
                                        event.target.value
                                    )
                                }
                            />
                        </Grid>

                        {/* DRIVER NAME */}

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Driver Name"
                                placeholder="Enter driver name"
                                value={filters.driverName}
                                onChange={(event) =>
                                    handleChange(
                                        "driverName",
                                        event.target.value
                                    )
                                }
                            />
                        </Grid>

                        {/* FROM DATE */}

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                size="small"
                                label="From Date"
                                value={filters.fromDate}
                                onChange={(event) =>
                                    handleChange(
                                        "fromDate",
                                        event.target.value
                                    )
                                }
                                slotProps={{
                                    inputLabel: {
                                        shrink: true
                                    },
                                    htmlInput: {
                                        max: filters.toDate || undefined
                                    }
                                }}
                                error={invalidDateRange}
                            />
                        </Grid>

                        {/* TO DATE */}

                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                size="small"
                                label="To Date"
                                value={filters.toDate}
                                onChange={(event) =>
                                    handleChange(
                                        "toDate",
                                        event.target.value
                                    )
                                }
                                slotProps={{
                                    inputLabel: {
                                        shrink: true
                                    },
                                    htmlInput: {
                                        min: filters.fromDate || undefined
                                    }
                                }}
                                error={invalidDateRange}
                                helperText={
                                    invalidDateRange
                                        ? "To Date must be on or after From Date."
                                        : ""
                                }
                            />
                        </Grid>
                    </Grid>

                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            flexWrap: "wrap",
                            gap: 1.5,
                            mt: 3
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<Clear />}
                            onClick={handleClear}
                        >
                            Clear Filters
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<Search />}
                            onClick={handleApply}
                            disabled={invalidDateRange}
                        >
                            Apply Filters
                        </Button>
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default GatepassFilters;

