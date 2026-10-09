import React from "react";

import {
    Box,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip,
    MenuItem,
    Button,
    Stack
} from "@mui/material";

import {
    Search,
    Clear,
    FilterAlt,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   MANIFEST PACKAGES PUTAWAY SEARCH
========================================================= */

const ManifestPackagesPutawaySearch = ({
    searchTerm = "",
    onSearchChange,

    statusFilter = "all",
    onStatusChange,

    onReset,

    loading = false,

    showStatusFilter = true,
    showResetButton = true,

    placeholder = "Search by Putaway ID, Manifest ID, Package ID, or Location..."
}) => {
    /* -----------------------------------------------------
       HANDLE SEARCH CHANGE
    ----------------------------------------------------- */

    const handleSearchChange = (event) => {
        if (onSearchChange) {
            onSearchChange(event.target.value);
        }
    };

    /* -----------------------------------------------------
       CLEAR SEARCH
    ----------------------------------------------------- */

    const handleClearSearch = () => {
        if (onSearchChange) {
            onSearchChange("");
        }
    };

    /* -----------------------------------------------------
       HANDLE STATUS CHANGE
    ----------------------------------------------------- */

    const handleStatusChange = (event) => {
        if (onStatusChange) {
            onStatusChange(event.target.value);
        }
    };

    /* -----------------------------------------------------
       RESET FILTERS
    ----------------------------------------------------- */

    const handleReset = () => {
        if (onSearchChange) {
            onSearchChange("");
        }

        if (onStatusChange) {
            onStatusChange("all");
        }

        if (onReset) {
            onReset();
        }
    };

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                width: "100%",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", md: "center" }}
            >
                {/* SEARCH INPUT */}

                <TextField
                    fullWidth
                    size="small"
                    label="Search Putaway Records"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    disabled={loading}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm ? (
                                <InputAdornment position="end">
                                    <Tooltip title="Clear search">
                                        <IconButton
                                            size="small"
                                            onClick={handleClearSearch}
                                            edge="end"
                                            aria-label="Clear search"
                                            disabled={loading}
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ) : null
                        }
                    }}
                />

                {/* STATUS FILTER */}

                {showStatusFilter && (
                    <TextField
                        select
                        size="small"
                        label="Filter by Status"
                        value={statusFilter}
                        onChange={handleStatusChange}
                        disabled={loading}
                        sx={{
                            minWidth: {
                                xs: "100%",
                                md: 210
                            }
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FilterAlt
                                            fontSize="small"
                                            color="action"
                                        />
                                    </InputAdornment>
                                )
                            }
                        }}
                    >
                        <MenuItem value="all">
                            All Statuses
                        </MenuItem>

                        <MenuItem value="pending">
                            Pending
                        </MenuItem>

                        <MenuItem value="completed">
                            Completed
                        </MenuItem>

                        <MenuItem value="putaway">
                            Putaway
                        </MenuItem>

                        <MenuItem value="cancelled">
                            Cancelled
                        </MenuItem>
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
                            loading ||
                            (
                                !searchTerm &&
                                statusFilter === "all"
                            )
                        }
                        sx={{
                            minWidth: 115,
                            whiteSpace: "nowrap",
                            height: 40
                        }}
                    >
                        Reset
                    </Button>
                )}
            </Stack>
        </Paper>
    );
};

export default ManifestPackagesPutawaySearch;

