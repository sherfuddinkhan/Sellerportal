import React from "react";

import {
    Box,
    Grid,
    Paper,
    TextField,
    MenuItem,
    Button,
    Typography,
    InputAdornment,
    Chip
} from "@mui/material";

import {
    FilterList,
    Clear,
    Business,
    Hub
} from "@mui/icons-material";

/* =========================================================
   FACILITY CHANNEL FILTERS
========================================================= */

const FacilityChannelFilters = ({
    filters = {
        facilityName: "",
        channelName: "",
        status: "all"
    },

    onFilterChange,
    onClearFilters,

    loading = false,

    facilityNames = [],
    channelNames = [],

    showFacilityFilter = true,
    showChannelFilter = true,
    showStatusFilter = true
}) => {

    /* =====================================================
       DEFAULT FILTER VALUES
    ===================================================== */

    const currentFilters = {
        facilityName: filters?.facilityName ?? "",
        channelName: filters?.channelName ?? "",
        status: filters?.status ?? "all"
    };

    /* =====================================================
       HANDLE FILTER CHANGE
    ===================================================== */

    const handleFilterChange = (event) => {

        const {
            name,
            value
        } = event.target;

        if (typeof onFilterChange === "function") {
            onFilterChange({
                ...currentFilters,
                [name]: value
            });
        }

    };

    /* =====================================================
       CLEAR ALL FILTERS
    ===================================================== */

    const handleClearFilters = () => {

        if (typeof onClearFilters === "function") {

            onClearFilters();

            return;
        }

        if (typeof onFilterChange === "function") {

            onFilterChange({
                facilityName: "",
                channelName: "",
                status: "all"
            });

        }

    };

    /* =====================================================
       CHECK ACTIVE FILTERS
    ===================================================== */

    const activeFilterCount = [
        currentFilters.facilityName,
        currentFilters.channelName,
        currentFilters.status !== "all"
            ? currentFilters.status
            : ""
    ].filter(Boolean).length;

    /* =====================================================
       RENDER FILTERS
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2
            }}
        >

            {/* =================================================
                FILTER HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
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

                    <FilterList color="action" />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Facility Channel Filters
                    </Typography>

                    {activeFilterCount > 0 && (
                        <Chip
                            size="small"
                            label={`${activeFilterCount} active`}
                            color="primary"
                            variant="outlined"
                        />
                    )}

                </Box>

                <Button
                    size="small"
                    color="inherit"
                    startIcon={<Clear />}
                    onClick={handleClearFilters}
                    disabled={
                        loading ||
                        activeFilterCount === 0
                    }
                    sx={{
                        textTransform: "none"
                    }}
                >
                    Clear Filters
                </Button>

            </Box>

            {/* =================================================
                FILTER CONTROLS
            ================================================= */}

            <Grid
                container
                spacing={2}
            >

                {/* =============================================
                    FACILITY NAME FILTER
                ============================================= */}

                {showFacilityFilter && (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        {facilityNames.length > 0 ? (

                            <TextField
                                select
                                fullWidth
                                size="small"
                                name="facilityName"
                                label="Facility Name"
                                value={currentFilters.facilityName}
                                onChange={handleFilterChange}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Business
                                                fontSize="small"
                                                color="action"
                                            />
                                        </InputAdornment>
                                    )
                                }}
                            >

                                <MenuItem value="">
                                    All Facilities
                                </MenuItem>

                                {facilityNames.map((facility) => {

                                    const name =
                                        typeof facility === "string"
                                            ? facility
                                            : facility?.facilityName ??
                                              facility?.name ??
                                              "";

                                    if (!name) {
                                        return null;
                                    }

                                    return (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    );

                                })}

                            </TextField>

                        ) : (

                            <TextField
                                fullWidth
                                size="small"
                                name="facilityName"
                                label="Facility Name"
                                placeholder="Filter by facility"
                                value={currentFilters.facilityName}
                                onChange={handleFilterChange}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Business
                                                fontSize="small"
                                                color="action"
                                            />
                                        </InputAdornment>
                                    )
                                }}
                            />

                        )}

                    </Grid>
                )}

                {/* =============================================
                    CHANNEL NAME FILTER
                ============================================= */}

                {showChannelFilter && (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        {channelNames.length > 0 ? (

                            <TextField
                                select
                                fullWidth
                                size="small"
                                name="channelName"
                                label="Channel Name"
                                value={currentFilters.channelName}
                                onChange={handleFilterChange}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Hub
                                                fontSize="small"
                                                color="action"
                                            />
                                        </InputAdornment>
                                    )
                                }}
                            >

                                <MenuItem value="">
                                    All Channels
                                </MenuItem>

                                {channelNames.map((channel) => {

                                    const name =
                                        typeof channel === "string"
                                            ? channel
                                            : channel?.channelName ??
                                              channel?.name ??
                                              "";

                                    if (!name) {
                                        return null;
                                    }

                                    return (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                        >
                                            {name}
                                        </MenuItem>
                                    );

                                })}

                            </TextField>

                        ) : (

                            <TextField
                                fullWidth
                                size="small"
                                name="channelName"
                                label="Channel Name"
                                placeholder="Filter by channel"
                                value={currentFilters.channelName}
                                onChange={handleFilterChange}
                                disabled={loading}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Hub
                                                fontSize="small"
                                                color="action"
                                            />
                                        </InputAdornment>
                                    )
                                }}
                            />

                        )}

                    </Grid>
                )}

                {/* =============================================
                    STATUS FILTER
                ============================================= */}

                {showStatusFilter && (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                    >

                        <TextField
                            select
                            fullWidth
                            size="small"
                            name="status"
                            label="Status"
                            value={currentFilters.status}
                            onChange={handleFilterChange}
                            disabled={loading}
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
                )}

            </Grid>

        </Paper>
    );

};

export default FacilityChannelFilters;

