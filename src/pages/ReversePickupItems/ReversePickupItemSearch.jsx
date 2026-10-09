import React, { useCallback } from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    MenuItem,
    Button
} from "@mui/material";

import {
    Search,
    Clear,
    FilterAlt,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   REVERSE PICKUP ITEM SEARCH
========================================================= */

const ReversePickupItemSearch = ({
    search = "",
    searchTerm,
    onSearchChange,
    onSearch,
    status = "all",
    statusFilter,
    onStatusChange,
    onFilter,
    onReset,
    loading = false,
    showStatusFilter = true,
    showReset = true,
    showSearchButton = false,
    fullWidth = true,
    size = "small"
}) => {
    /* =====================================================
       CURRENT VALUES
    ===================================================== */

    const currentSearch =
        searchTerm !== undefined
            ? searchTerm
            : search;

    const currentStatus =
        statusFilter !== undefined
            ? statusFilter
            : status;

    /* =====================================================
       SEARCH CHANGE
    ===================================================== */

    const handleSearchChange = useCallback(
        (event) => {
            const value = event.target.value;

            if (typeof onSearchChange === "function") {
                onSearchChange(value);
            }
        },
        [onSearchChange]
    );

    /* =====================================================
       STATUS CHANGE
    ===================================================== */

    const handleStatusChange = useCallback(
        (event) => {
            const value = event.target.value;

            if (typeof onStatusChange === "function") {
                onStatusChange(value);
            }
        },
        [onStatusChange]
    );

    /* =====================================================
       SUBMIT SEARCH
    ===================================================== */

    const handleSearch = useCallback(
        (event) => {
            if (event) {
                event.preventDefault();
            }

            if (typeof onSearch === "function") {
                onSearch(currentSearch);
            }
        },
        [currentSearch, onSearch]
    );

    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    const handleClearSearch = useCallback(() => {
        if (typeof onSearchChange === "function") {
            onSearchChange("");
        }

        if (typeof onSearch === "function") {
            onSearch("");
        }
    }, [onSearchChange, onSearch]);

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const handleReset = useCallback(() => {
        if (typeof onSearchChange === "function") {
            onSearchChange("");
        }

        if (typeof onStatusChange === "function") {
            onStatusChange("all");
        }

        if (typeof onReset === "function") {
            onReset();
        }
    }, [onSearchChange, onStatusChange, onReset]);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
                width: fullWidth ? "100%" : "auto"
            }}
        >
            {/* SEARCH INPUT */}

            <TextField
                size={size}
                value={currentSearch}
                onChange={handleSearchChange}
                placeholder="Search items, SKU, order number..."
                variant="outlined"
                disabled={loading}
                fullWidth={fullWidth}
                sx={{
                    flex: "1 1 280px",
                    minWidth: { xs: "100%", sm: 240 },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "background.paper"
                    }
                }}
                inputProps={{
                    "aria-label": "Search reverse pickup items"
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search color="action" />
                        </InputAdornment>
                    ),
                    endAdornment: currentSearch ? (
                        <InputAdornment position="end">
                            <Tooltip title="Clear search">
                                <span>
                                    <IconButton
                                        size="small"
                                        onClick={handleClearSearch}
                                        disabled={loading}
                                        aria-label="Clear search"
                                        edge="end"
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </InputAdornment>
                    ) : null
                }}
            />

            {/* STATUS FILTER */}

            {showStatusFilter && (
                <TextField
                    select
                    size={size}
                    label="Status"
                    value={currentStatus || "all"}
                    onChange={handleStatusChange}
                    disabled={loading}
                    sx={{
                        minWidth: { xs: "100%", sm: 170 },
                        flex: "0 1 180px",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "background.paper"
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FilterAlt
                                    fontSize="small"
                                    color="action"
                                />
                            </InputAdornment>
                        )
                    }}
                >
                    <MenuItem value="all">
                        All Statuses
                    </MenuItem>

                    <MenuItem value="Pending">
                        Pending
                    </MenuItem>

                    <MenuItem value="Requested">
                        Requested
                    </MenuItem>

                    <MenuItem value="Scheduled">
                        Scheduled
                    </MenuItem>

                    <MenuItem value="In Progress">
                        In Progress
                    </MenuItem>

                    <MenuItem value="Processing">
                        Processing
                    </MenuItem>

                    <MenuItem value="Completed">
                        Completed
                    </MenuItem>

                    <MenuItem value="Picked Up">
                        Picked Up
                    </MenuItem>

                    <MenuItem value="Delivered">
                        Delivered
                    </MenuItem>

                    <MenuItem value="Cancelled">
                        Cancelled
                    </MenuItem>

                    <MenuItem value="Failed">
                        Failed
                    </MenuItem>

                    <MenuItem value="Rejected">
                        Rejected
                    </MenuItem>
                </TextField>
            )}

            {/* SEARCH BUTTON */}

            {showSearchButton && (
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Search />}
                    disabled={loading}
                    sx={{
                        minHeight: 40,
                        borderRadius: 2,
                        textTransform: "none",
                        whiteSpace: "nowrap"
                    }}
                >
                    Search
                </Button>
            )}

            {/* RESET BUTTON */}

            {showReset && (
                <Tooltip title="Reset search and filters">
                    <span>
                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<RestartAlt />}
                            onClick={handleReset}
                            disabled={
                                loading ||
                                (
                                    !currentSearch &&
                                    (!currentStatus ||
                                        currentStatus === "all")
                                )
                            }
                            sx={{
                                minHeight: 40,
                                borderRadius: 2,
                                textTransform: "none",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Reset
                        </Button>
                    </span>
                </Tooltip>
            )}
        </Box>
    );
};

export default ReversePickupItemSearch;

