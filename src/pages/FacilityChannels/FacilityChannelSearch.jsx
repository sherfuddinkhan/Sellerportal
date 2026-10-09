import React from "react";

import {
    Box,
    Grid,
    TextField,
    InputAdornment,
    MenuItem,
    Button,
    Paper,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear,
    FilterList
} from "@mui/icons-material";

/* =========================================================
   FACILITY CHANNEL SEARCH
========================================================= */

const FacilityChannelSearch = ({
    searchTerm = "",
    onSearchChange,
    statusFilter = "all",
    onStatusChange,
    onClear,
    loading = false
}) => {

    /* =====================================================
       HANDLE SEARCH INPUT
    ===================================================== */

    const handleSearchChange = (event) => {

        if (typeof onSearchChange === "function") {
            onSearchChange(event.target.value);
        }

    };

    /* =====================================================
       HANDLE STATUS FILTER
    ===================================================== */

    const handleStatusChange = (event) => {

        if (typeof onStatusChange === "function") {
            onStatusChange(event.target.value);
        }

    };

    /* =====================================================
       CLEAR ALL FILTERS
    ===================================================== */

    const handleClear = () => {

        if (typeof onClear === "function") {
            onClear();
            return;
        }

        if (typeof onSearchChange === "function") {
            onSearchChange("");
        }

        if (typeof onStatusChange === "function") {
            onStatusChange("all");
        }

    };

    /* =====================================================
       CHECK ACTIVE FILTERS
    ===================================================== */

    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        statusFilter !== "all";

    /* =====================================================
       RENDER COMPONENT
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper"
            }}
        >

            {/* =================================================
                SEARCH AND FILTER CONTROLS
            ================================================= */}

            <Grid
                container
                spacing={2}
                alignItems="center"
            >

                {/* =============================================
                    SEARCH INPUT
                ============================================= */}

                <Grid item xs={12} md={6} lg={7}>

                    <TextField
                        fullWidth
                        size="small"
                        label="Search Facility Channels"
                        placeholder="Search facility, channel, code..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            )
                        }}
                    />

                </Grid>

                {/* =============================================
                    STATUS FILTER
                ============================================= */}

                <Grid item xs={12} sm={6} md={3}>

                    <TextField
                        select
                        fullWidth
                        size="small"
                        label="Filter by Status"
                        value={statusFilter}
                        onChange={handleStatusChange}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FilterList
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

                        <MenuItem value="active">
                            Active
                        </MenuItem>

                        <MenuItem value="inactive">
                            Inactive
                        </MenuItem>

                        <MenuItem value="pending">
                            Pending
                        </MenuItem>

                    </TextField>

                </Grid>

                {/* =============================================
                    CLEAR FILTERS BUTTON
                ============================================= */}

                <Grid item xs={12} sm={6} md={3}>

                    <Tooltip title="Clear search and status filters">

                        <span>

                            <Button
                                fullWidth
                                variant="outlined"
                                color="inherit"
                                startIcon={<Clear />}
                                onClick={handleClear}
                                disabled={
                                    loading ||
                                    !hasActiveFilters
                                }
                                sx={{
                                    minHeight: 40,
                                    textTransform: "none",
                                    borderColor: "divider"
                                }}
                            >
                                Clear Filters
                            </Button>

                        </span>

                    </Tooltip>

                </Grid>

            </Grid>

        </Paper>
    );

};

export default FacilityChannelSearch;

