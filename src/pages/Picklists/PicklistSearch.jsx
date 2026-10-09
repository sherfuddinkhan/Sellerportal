
// PicklistSearch.jsx

import React, { useEffect, useState } from "react";

import {
    Box,
    TextField,
    InputAdornment,
    MenuItem,
    Button,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear,
    FilterAlt,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   STATUS OPTIONS
========================================================= */

const DEFAULT_STATUS_OPTIONS = [
    { value: "All", label: "All Statuses" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" }
];

/* =========================================================
   PICKLIST SEARCH
========================================================= */

const PicklistSearch = ({
    searchTerm,
    search,
    onSearchChange,
    onSearch,
    statusFilter = "All",
    onStatusChange,
    onFilterChange,
    onReset,
    statusOptions = DEFAULT_STATUS_OPTIONS,
    disabled = false,
    placeholder = "Search picklist, order, or warehouse...",
    showResetButton = true,
    showStatusFilter = true
}) => {
    /*
     * Supports both searchTerm and search props.
     * Supports both onSearchChange and onSearch callbacks.
     */

    const initialSearch =
        searchTerm !== undefined
            ? searchTerm
            : search ?? "";

    const [localSearch, setLocalSearch] = useState(
        initialSearch
    );

    /* =====================================================
       SYNC SEARCH VALUE WITH PARENT
    ===================================================== */

    useEffect(() => {
        const value =
            searchTerm !== undefined
                ? searchTerm
                : search ?? "";

        setLocalSearch(value);
    }, [searchTerm, search]);

    /* =====================================================
       SEARCH HANDLER
    ===================================================== */

    const handleSearchChange = (event) => {
        const value = event.target.value;

        setLocalSearch(value);

        const callback =
            onSearchChange || onSearch;

        if (typeof callback === "function") {
            callback(value);
        }
    };

    /* =====================================================
       CLEAR SEARCH
    ===================================================== */

    const handleClearSearch = () => {
        setLocalSearch("");

        const callback =
            onSearchChange || onSearch;

        if (typeof callback === "function") {
            callback("");
        }
    };

    /* =====================================================
       STATUS HANDLER
    ===================================================== */

    const handleStatusChange = (event) => {
        const value = event.target.value;

        const callback =
            onStatusChange || onFilterChange;

        if (typeof callback === "function") {
            callback(value);
        }
    };

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const handleReset = () => {
        setLocalSearch("");

        if (typeof onReset === "function") {
            onReset();
        } else {
            const searchCallback =
                onSearchChange || onSearch;

            if (typeof searchCallback === "function") {
                searchCallback("");
            }

            const statusCallback =
                onStatusChange || onFilterChange;

            if (typeof statusCallback === "function") {
                statusCallback("All");
            }
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: {
                    xs: "stretch",
                    md: "center"
                },
                flexDirection: {
                    xs: "column",
                    md: "row"
                },
                gap: 1.5,
                p: 2,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                boxSizing: "border-box"
            }}
        >
            {/* SEARCH FIELD */}

            <TextField
                fullWidth
                size="small"
                value={localSearch}
                onChange={handleSearchChange}
                placeholder={placeholder}
                disabled={disabled}
                inputProps={{
                    "aria-label": "Search picklists"
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search
                                fontSize="small"
                                color="action"
                            />
                        </InputAdornment>
                    ),
                    endAdornment: localSearch ? (
                        <InputAdornment position="end">
                            <Tooltip title="Clear search">
                                <IconButton
                                    size="small"
                                    onClick={handleClearSearch}
                                    disabled={disabled}
                                    aria-label="Clear search"
                                    edge="end"
                                >
                                    <Clear fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ) : null
                }}
                sx={{
                    flex: 1,
                    minWidth: {
                        xs: "100%",
                        md: 240
                    },
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5
                    }
                }}
            />

            {/* STATUS FILTER */}

            {showStatusFilter && (
                <TextField
                    select
                    size="small"
                    label="Status"
                    value={statusFilter || "All"}
                    onChange={handleStatusChange}
                    disabled={disabled}
                    sx={{
                        minWidth: {
                            xs: "100%",
                            md: 180
                        },
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5
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
                    {statusOptions.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            )}

            {/* RESET BUTTON */}

            {showResetButton && (
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<RestartAlt />}
                    onClick={handleReset}
                    disabled={
                        disabled ||
                        (
                            !localSearch &&
                            (!statusFilter || statusFilter === "All")
                        )
                    }
                    sx={{
                        minHeight: 40,
                        minWidth: {
                            xs: "100%",
                            md: "auto"
                        },
                        textTransform: "none",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        borderRadius: 1.5,
                        px: 2
                    }}
                >
                    Reset
                </Button>
            )}
        </Box>
    );
};

export default PicklistSearch;

