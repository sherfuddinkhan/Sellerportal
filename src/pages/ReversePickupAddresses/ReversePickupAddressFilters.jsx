import React from "react";

import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    MenuItem,
    Button,
    Chip,
    Stack,
    Divider
} from "@mui/material";

import {
    FilterList,
    Clear,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   DEFAULT FILTER VALUES
========================================================= */

export const initialReversePickupAddressFilters = {
    city: "",
    state: "",
    country: "",
    addressType: "",
    status: "",
    isDefault: ""
};

/* =========================================================
   REVERSE PICKUP ADDRESS FILTERS
========================================================= */

const ReversePickupAddressFilters = ({
    filters = initialReversePickupAddressFilters,

    onFilterChange,
    onApplyFilters,
    onClearFilters,
    onResetFilters,

    loading = false,
    disabled = false,

    showTitle = true,
    showApplyButton = false,
    showClearButton = true,
    showResetButton = false,

    activeFilterCount,

    cities = [],
    states = [],
    countries = [
        "India",
        "United States",
        "United Kingdom",
        "Canada",
        "Australia",
        "Other"
    ],

    addressTypes = [
        "Home",
        "Office",
        "Warehouse",
        "Other"
    ]
}) => {

    /* =====================================================
       NORMALIZE FILTER VALUES
    ===================================================== */

    const currentFilters = {
        ...initialReversePickupAddressFilters,
        ...(filters || {})
    };

    const isDisabled = loading || disabled;

    /* =====================================================
       HANDLE FILTER CHANGE
    ===================================================== */

    const handleChange = (field, value) => {
        if (isDisabled) {
            return;
        }

        if (typeof onFilterChange === "function") {
            onFilterChange(field, value);
        }
    };

    /* =====================================================
       COUNT ACTIVE FILTERS
    ===================================================== */

    const calculatedFilterCount = Object.entries(
        currentFilters
    ).filter(([key, value]) => {
        if (
            key === "page" ||
            key === "pageSize" ||
            key === "rowsPerPage"
        ) {
            return false;
        }

        return (
            value !== "" &&
            value !== null &&
            value !== undefined
        );
    }).length;

    const resolvedFilterCount =
        activeFilterCount !== undefined &&
        activeFilterCount !== null
            ? activeFilterCount
            : calculatedFilterCount;

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClear = () => {
        if (isDisabled) {
            return;
        }

        if (typeof onClearFilters === "function") {
            onClearFilters();
            return;
        }

        Object.keys(initialReversePickupAddressFilters).forEach(
            (field) => {
                handleChange(field, "");
            }
        );
    };

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const handleReset = () => {
        if (isDisabled) {
            return;
        }

        if (typeof onResetFilters === "function") {
            onResetFilters();
            return;
        }

        handleClear();
    };

    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    const handleApply = () => {
        if (isDisabled) {
            return;
        }

        if (typeof onApplyFilters === "function") {
            onApplyFilters(currentFilters);
        }
    };

    /* =====================================================
       REUSABLE SELECT FIELD
    ===================================================== */

    const renderSelect = ({
        name,
        label,
        options,
        allLabel = "All",
        optionValue,
        optionLabel
    }) => (
        <TextField
            select
            fullWidth
            size="small"
            name={name}
            label={label}
            value={currentFilters[name] ?? ""}
            onChange={(event) =>
                handleChange(name, event.target.value)
            }
            disabled={isDisabled}
        >
            <MenuItem value="">
                {allLabel}
            </MenuItem>

            {options.map((option, index) => {
                const value = optionValue
                    ? optionValue(option)
                    : option;

                const labelText = optionLabel
                    ? optionLabel(option)
                    : option;

                return (
                    <MenuItem
                        key={`${name}-${value}-${index}`}
                        value={value}
                    >
                        {labelText}
                    </MenuItem>
                );
            })}
        </TextField>
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2.5,
                mb: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            {/* HEADER */}

            {showTitle && (
                <>
                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row"
                        }}
                        justifyContent="space-between"
                        alignItems={{
                            xs: "flex-start",
                            sm: "center"
                        }}
                        spacing={1}
                        sx={{ mb: 2 }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                        >
                            <FilterList color="primary" />

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Address Filters
                            </Typography>
                        </Stack>

                        <Chip
                            size="small"
                            color={
                                resolvedFilterCount > 0
                                    ? "primary"
                                    : "default"
                            }
                            variant={
                                resolvedFilterCount > 0
                                    ? "filled"
                                    : "outlined"
                            }
                            label={`${resolvedFilterCount} active filter${
                                resolvedFilterCount === 1
                                    ? ""
                                    : "s"
                            }`}
                        />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />
                </>
            )}

            {/* FILTER FIELDS */}

            <Grid container spacing={2}>
                {/* CITY */}

                <Grid item xs={12} sm={6} md={4}>
                    {cities.length > 0
                        ? renderSelect({
                            name: "city",
                            label: "City",
                            options: cities,
                            allLabel: "All Cities"
                        })
                        : (
                            <TextField
                                fullWidth
                                size="small"
                                label="City"
                                name="city"
                                placeholder="Enter city"
                                value={currentFilters.city ?? ""}
                                onChange={(event) =>
                                    handleChange(
                                        "city",
                                        event.target.value
                                    )
                                }
                                disabled={isDisabled}
                            />
                        )
                    }
                </Grid>

                {/* STATE */}

                <Grid item xs={12} sm={6} md={4}>
                    {states.length > 0
                        ? renderSelect({
                            name: "state",
                            label: "State",
                            options: states,
                            allLabel: "All States"
                        })
                        : (
                            <TextField
                                fullWidth
                                size="small"
                                label="State"
                                name="state"
                                placeholder="Enter state"
                                value={currentFilters.state ?? ""}
                                onChange={(event) =>
                                    handleChange(
                                        "state",
                                        event.target.value
                                    )
                                }
                                disabled={isDisabled}
                            />
                        )
                    }
                </Grid>

                {/* COUNTRY */}

                <Grid item xs={12} sm={6} md={4}>
                    {renderSelect({
                        name: "country",
                        label: "Country",
                        options: countries,
                        allLabel: "All Countries"
                    })}
                </Grid>

                {/* ADDRESS TYPE */}

                <Grid item xs={12} sm={6} md={4}>
                    {renderSelect({
                        name: "addressType",
                        label: "Address Type",
                        options: addressTypes,
                        allLabel: "All Address Types"
                    })}
                </Grid>

                {/* STATUS */}

                <Grid item xs={12} sm={6} md={4}>
                    {renderSelect({
                        name: "status",
                        label: "Address Status",
                        allLabel: "All Statuses",
                        options: [
                            {
                                value: "Active",
                                label: "Active"
                            },
                            {
                                value: "Inactive",
                                label: "Inactive"
                            }
                        ],
                        optionValue: (option) => option.value,
                        optionLabel: (option) => option.label
                    })}
                </Grid>

                {/* DEFAULT ADDRESS */}

                <Grid item xs={12} sm={6} md={4}>
                    {renderSelect({
                        name: "isDefault",
                        label: "Default Address",
                        allLabel: "All Addresses",
                        options: [
                            {
                                value: "true",
                                label: "Default Only"
                            },
                            {
                                value: "false",
                                label: "Non-default Only"
                            }
                        ],
                        optionValue: (option) => option.value,
                        optionLabel: (option) => option.label
                    })}
                </Grid>
            </Grid>

            {/* ACTION BUTTONS */}

            {(showApplyButton ||
                showClearButton ||
                showResetButton) && (
                <>
                    <Divider sx={{ my: 2 }} />

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                            gap: 1
                        }}
                    >
                        {showResetButton && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<RestartAlt />}
                                onClick={handleReset}
                                disabled={isDisabled}
                            >
                                Reset
                            </Button>
                        )}

                        {showClearButton && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<Clear />}
                                onClick={handleClear}
                                disabled={
                                    isDisabled ||
                                    resolvedFilterCount === 0
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
                                disabled={isDisabled}
                            >
                                Apply Filters
                            </Button>
                        )}
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default ReversePickupAddressFilters;

