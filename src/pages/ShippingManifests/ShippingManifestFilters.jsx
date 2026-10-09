import React, { useMemo } from "react";

import {
    Box,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Stack,
    Chip,
    Divider
} from "@mui/material";

import {
    FilterList,
    FilterAltOff,
    CalendarMonth,
    LocalShipping
} from "@mui/icons-material";

/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS = [
    "Pending",
    "Processing",
    "Ready",
    "Packed",
    "Shipped",
    "In Transit",
    "Delivered",
    "Cancelled"
];

/* =========================================================
   DATE FORMATTER
========================================================= */

const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value).slice(0, 10);
    }

    return date.toISOString().slice(0, 10);
};

/* =========================================================
   FIELD HELPER
========================================================= */

const getField = (record, ...keys) => {
    if (!record) return "";

    for (const key of keys) {
        const value = record[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return "";
};

/* =========================================================
   COMPONENT
========================================================= */

const ShippingManifestFilters = ({
    manifests = [],
    data = [],
    filters = {},
    status = "all",
    carrier = "all",
    startDate = "",
    endDate = "",
    onFiltersChange,
    onStatusChange,
    onCarrierChange,
    onStartDateChange,
    onEndDateChange,
    onApply,
    onClear,
    onReset,
    loading = false,
    showTitle = true,
    compact = false
}) => {
    const records = Array.isArray(manifests)
        ? manifests
        : Array.isArray(data)
            ? data
            : [];

    /* =====================================================
       CURRENT FILTER VALUES
    ===================================================== */

    const currentStatus = filters.status ?? status;
    const currentCarrier = filters.carrier ?? carrier;
    const currentStartDate = filters.startDate ?? startDate;
    const currentEndDate = filters.endDate ?? endDate;

    /* =====================================================
       UNIQUE CARRIERS
    ===================================================== */

    const carrierOptions = useMemo(() => {
        const values = records
            .map((record) =>
                getField(
                    record,
                    "carrierName",
                    "CarrierName"
                )
            )
            .filter((value) => String(value).trim() !== "");

        return [...new Set(values.map((value) => String(value)))]
            .sort((a, b) => a.localeCompare(b));
    }, [records]);

    /* =====================================================
       ACTIVE FILTER COUNT
    ===================================================== */

    const activeFilterCount = [
        currentStatus !== "all",
        currentCarrier !== "all",
        Boolean(currentStartDate),
        Boolean(currentEndDate)
    ].filter(Boolean).length;

    /* =====================================================
       UPDATE FILTERS
    ===================================================== */

    const updateFilters = (nextFilters) => {
        if (typeof onFiltersChange === "function") {
            onFiltersChange({
                status: currentStatus,
                carrier: currentCarrier,
                startDate: currentStartDate,
                endDate: currentEndDate,
                ...nextFilters
            });
        }
    };

    const handleStatusChange = (event) => {
        const value = event.target.value;

        if (typeof onStatusChange === "function") {
            onStatusChange(value);
        }

        updateFilters({ status: value });
    };

    const handleCarrierChange = (event) => {
        const value = event.target.value;

        if (typeof onCarrierChange === "function") {
            onCarrierChange(value);
        }

        updateFilters({ carrier: value });
    };

    const handleStartDateChange = (event) => {
        const value = event.target.value;

        if (typeof onStartDateChange === "function") {
            onStartDateChange(value);
        }

        updateFilters({ startDate: value });
    };

    const handleEndDateChange = (event) => {
        const value = event.target.value;

        if (typeof onEndDateChange === "function") {
            onEndDateChange(value);
        }

        updateFilters({ endDate: value });
    };

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClear = () => {
        const clearedFilters = {
            status: "all",
            carrier: "all",
            startDate: "",
            endDate: ""
        };

        if (typeof onClear === "function") {
            onClear();
        } else if (typeof onReset === "function") {
            onReset();
        } else {
            if (typeof onStatusChange === "function") {
                onStatusChange("all");
            }

            if (typeof onCarrierChange === "function") {
                onCarrierChange("all");
            }

            if (typeof onStartDateChange === "function") {
                onStartDateChange("");
            }

            if (typeof onEndDateChange === "function") {
                onEndDateChange("");
            }
        }

        if (typeof onFiltersChange === "function") {
            onFiltersChange(clearedFilters);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden"
            }}
        >
            {/* HEADER */}

            {showTitle && (
                <>
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                        >
                            <FilterList color="primary" />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Shipping Manifest Filters
                            </Typography>

                            {activeFilterCount > 0 && (
                                <Chip
                                    size="small"
                                    color="primary"
                                    label={`${activeFilterCount} active`}
                                />
                            )}
                        </Stack>

                        <Button
                            size="small"
                            variant="text"
                            color="inherit"
                            startIcon={<FilterAltOff />}
                            onClick={handleClear}
                            disabled={loading || activeFilterCount === 0}
                        >
                            Clear Filters
                        </Button>
                    </Box>

                    <Divider />
                </>
            )}

            {/* FILTER FIELDS */}

            <Box sx={{ p: compact ? 1.5 : 2 }}>
                <Grid container spacing={2}>
                    {/* STATUS */}

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Manifest Status"
                            value={currentStatus}
                            onChange={handleStatusChange}
                            disabled={loading}
                        >
                            <MenuItem value="all">
                                All Statuses
                            </MenuItem>

                            {STATUS_OPTIONS.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* CARRIER */}

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            select
                            size="small"
                            label="Carrier"
                            value={currentCarrier}
                            onChange={handleCarrierChange}
                            disabled={loading}
                        >
                            <MenuItem value="all">
                                All Carriers
                            </MenuItem>

                            {carrierOptions.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    {/* START DATE */}

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Shipment Date From"
                            value={currentStartDate}
                            onChange={handleStartDateChange}
                            disabled={loading}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                max: currentEndDate || undefined
                            }}
                            InputProps={{
                                startAdornment: (
                                    <CalendarMonth
                                        fontSize="small"
                                        sx={{
                                            mr: 1,
                                            color: "text.secondary"
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>

                    {/* END DATE */}

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Shipment Date To"
                            value={currentEndDate}
                            onChange={handleEndDateChange}
                            disabled={loading}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                min: currentStartDate || undefined
                            }}
                            InputProps={{
                                startAdornment: (
                                    <CalendarMonth
                                        fontSize="small"
                                        sx={{
                                            mr: 1,
                                            color: "text.secondary"
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>
                </Grid>

                {/* FOOTER */}

                {(typeof onApply === "function" || !showTitle) && (
                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1
                        }}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            <LocalShipping
                                fontSize="inherit"
                                sx={{
                                    verticalAlign: "middle",
                                    mr: 0.5
                                }}
                            />
                            {records.length} manifests available for filtering
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                        >
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="small"
                                onClick={handleClear}
                                disabled={loading || activeFilterCount === 0}
                            >
                                Reset
                            </Button>

                            {typeof onApply === "function" && (
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<FilterList />}
                                    onClick={() => onApply({
                                        status: currentStatus,
                                        carrier: currentCarrier,
                                        startDate: currentStartDate,
                                        endDate: currentEndDate
                                    })}
                                    disabled={loading}
                                >
                                    Apply Filters
                                </Button>
                            )}
                        </Stack>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default ShippingManifestFilters;

