import React, {
    useCallback,
    useMemo
} from "react";

import {
    Box,
    Button,
    TextField,
    MenuItem,
    Grid,
    Paper,
    Typography,
    Divider,
    Chip
} from "@mui/material";

import {
    FilterAlt,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS = [
    { value: "all", label: "All Statuses" },
    { value: "Pending", label: "Pending" },
    { value: "Requested", label: "Requested" },
    { value: "Scheduled", label: "Scheduled" },
    { value: "In Progress", label: "In Progress" },
    { value: "Processing", label: "Processing" },
    { value: "Completed", label: "Completed" },
    { value: "Picked Up", label: "Picked Up" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Failed", label: "Failed" },
    { value: "Rejected", label: "Rejected" }
];

/* =========================================================
   FILTER HELPERS
========================================================= */

const getField = (record, ...fieldNames) => {
    if (!record || typeof record !== "object") {
        return undefined;
    }

    for (const fieldName of fieldNames) {
        if (
            record[fieldName] !== undefined &&
            record[fieldName] !== null
        ) {
            return record[fieldName];
        }

        const pascalCase =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1);

        if (
            record[pascalCase] !== undefined &&
            record[pascalCase] !== null
        ) {
            return record[pascalCase];
        }
    }

    return undefined;
};

const normalizeText = (value) =>
    String(value ?? "")
        .trim()
        .toLowerCase();

const normalizeStatus = (value) =>
    normalizeText(value).replace(/[\s_-]+/g, "");

const toNumber = (value) => {
    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
};

/* =========================================================
   DEFAULT FILTER VALUES
========================================================= */

const DEFAULT_FILTERS = {
    status: "all",
    minQuantity: "",
    maxQuantity: "",
    minPickupCost: "",
    maxPickupCost: "",
    reason: ""
};

/* =========================================================
   COMPONENT
========================================================= */

const ReversePickupItemFilters = ({
    filters = {},
    onFilterChange,
    onChange,
    onApply,
    onReset,
    items = [],
    reversePickupItems,
    loading = false,
    showApplyButton = false,
    showHeader = true,
    showQuantityFilters = true,
    showCostFilters = true,
    showReasonFilter = true,
    variant = "outlined"
}) => {
    /* =====================================================
       CURRENT FILTER VALUES
    ===================================================== */

    const currentFilters = useMemo(
        () => ({
            ...DEFAULT_FILTERS,
            ...filters
        }),
        [filters]
    );

    const records = Array.isArray(reversePickupItems)
        ? reversePickupItems
        : Array.isArray(items)
            ? items
            : [];

    /* =====================================================
       FILTER CHANGE HANDLER
    ===================================================== */

    const handleFilterChange = useCallback(
        (field, value) => {
            const nextFilters = {
                ...currentFilters,
                [field]: value
            };

            if (typeof onFilterChange === "function") {
                onFilterChange(nextFilters);
            }

            if (typeof onChange === "function") {
                onChange(nextFilters);
            }
        },
        [
            currentFilters,
            onFilterChange,
            onChange
        ]
    );

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const handleReset = useCallback(() => {
        const resetFilters = {
            ...DEFAULT_FILTERS
        };

        if (typeof onFilterChange === "function") {
            onFilterChange(resetFilters);
        }

        if (typeof onChange === "function") {
            onChange(resetFilters);
        }

        if (typeof onReset === "function") {
            onReset(resetFilters);
        }
    }, [
        onFilterChange,
        onChange,
        onReset
    ]);

    /* =====================================================
       APPLY FILTERS
    ===================================================== */

    const handleApply = useCallback(() => {
        if (typeof onApply === "function") {
            onApply(currentFilters);
        }
    }, [currentFilters, onApply]);

    /* =====================================================
       ACTIVE FILTER COUNT
    ===================================================== */

    const activeFilterCount = useMemo(() => {
        return Object.entries(currentFilters).filter(
            ([key, value]) => {
                if (key === "status") {
                    return value && value !== "all";
                }

                return (
                    value !== "" &&
                    value !== null &&
                    value !== undefined
                );
            }
        ).length;
    }, [currentFilters]);

    /* =====================================================
       FILTER RECORDS
       Useful when the parent does not filter separately.
    ===================================================== */

    const filteredItems = useMemo(() => {
        const minQuantity =
            toNumber(currentFilters.minQuantity);

        const maxQuantity =
            toNumber(currentFilters.maxQuantity);

        const minPickupCost =
            toNumber(currentFilters.minPickupCost);

        const maxPickupCost =
            toNumber(currentFilters.maxPickupCost);

        return records.filter((item) => {
            const itemStatus = normalizeStatus(
                getField(item, "status", "pickupStatus")
            );

            const selectedStatus = normalizeStatus(
                currentFilters.status
            );

            if (
                selectedStatus &&
                selectedStatus !== "all" &&
                itemStatus !== selectedStatus
            ) {
                return false;
            }

            const quantity = toNumber(
                getField(item, "quantity", "itemQuantity")
            );

            if (
                minQuantity !== null &&
                (quantity === null || quantity < minQuantity)
            ) {
                return false;
            }

            if (
                maxQuantity !== null &&
                (quantity === null || quantity > maxQuantity)
            ) {
                return false;
            }

            const pickupCost = toNumber(
                getField(
                    item,
                    "pickupCost",
                    "returnCost",
                    "totalCost"
                )
            );

            if (
                minPickupCost !== null &&
                (pickupCost === null || pickupCost < minPickupCost)
            ) {
                return false;
            }

            if (
                maxPickupCost !== null &&
                (pickupCost === null || pickupCost > maxPickupCost)
            ) {
                return false;
            }

            const reasonFilter = normalizeText(
                currentFilters.reason
            );

            if (reasonFilter) {
                const reason = normalizeText(
                    getField(
                        item,
                        "reason",
                        "returnReason",
                        "notes",
                        "remarks"
                    )
                );

                if (!reason.includes(reasonFilter)) {
                    return false;
                }
            }

            return true;
        });
    }, [records, currentFilters]);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            variant={variant}
            sx={{
                width: "100%",
                p: { xs: 2, sm: 2.5 },
                borderRadius: 2
            }}
        >
            {/* FILTER HEADER */}

            {showHeader && (
                <>
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

                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Item Filters
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

                        <Button
                            variant="text"
                            color="inherit"
                            size="small"
                            startIcon={<RestartAlt />}
                            onClick={handleReset}
                            disabled={
                                loading ||
                                activeFilterCount === 0
                            }
                        >
                            Reset Filters
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />
                </>
            )}

            {/* FILTER FIELDS */}

            <Grid container spacing={2}>
                {/* STATUS */}

                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Pickup Status"
                        value={currentFilters.status || "all"}
                        onChange={(event) =>
                            handleFilterChange(
                                "status",
                                event.target.value
                            )
                        }
                        disabled={loading}
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* MINIMUM QUANTITY */}

                {showQuantityFilters && (
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Minimum Quantity"
                            value={currentFilters.minQuantity}
                            onChange={(event) =>
                                handleFilterChange(
                                    "minQuantity",
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            inputProps={{ min: 0, step: 1 }}
                        />
                    </Grid>
                )}

                {/* MAXIMUM QUANTITY */}

                {showQuantityFilters && (
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Maximum Quantity"
                            value={currentFilters.maxQuantity}
                            onChange={(event) =>
                                handleFilterChange(
                                    "maxQuantity",
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            inputProps={{ min: 0, step: 1 }}
                        />
                    </Grid>
                )}

                {/* MINIMUM PICKUP COST */}

                {showCostFilters && (
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Minimum Pickup Cost"
                            value={currentFilters.minPickupCost}
                            onChange={(event) =>
                                handleFilterChange(
                                    "minPickupCost",
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        ₹
                                    </InputAdornment>
                                )
                            }}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />
                    </Grid>
                )}

                {/* MAXIMUM PICKUP COST */}

                {showCostFilters && (
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Maximum Pickup Cost"
                            value={currentFilters.maxPickupCost}
                            onChange={(event) =>
                                handleFilterChange(
                                    "maxPickupCost",
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        ₹
                                    </InputAdornment>
                                )
                            }}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />
                    </Grid>
                )}

                {/* REASON FILTER */}

                {showReasonFilter && (
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Reason / Notes"
                            placeholder="Search pickup reason..."
                            value={currentFilters.reason}
                            onChange={(event) =>
                                handleFilterChange(
                                    "reason",
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        />
                    </Grid>
                )}
            </Grid>

            {/* FILTER FOOTER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mt: 2.5
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Matching items: {filteredItems.length}
                </Typography>

                {showApplyButton && (
                    <Button
                        variant="contained"
                        startIcon={<FilterAlt />}
                        onClick={handleApply}
                        disabled={loading}
                    >
                        Apply Filters
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default ReversePickupItemFilters;

