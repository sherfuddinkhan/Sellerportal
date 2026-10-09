import React from "react";

import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Tooltip,
    TextField,
    InputAdornment,
    MenuItem,
    Stack
} from "@mui/material";

import {
    Inventory2,
    Add,
    Refresh,
    Search,
    Clear,
    FilterList
} from "@mui/icons-material";

/* =========================================================
   MANIFEST PACKAGES PUTAWAY TOOLBAR
========================================================= */

const ManifestPackagesPutawayToolbar = ({
    searchTerm = "",
    onSearchChange,
    statusFilter = "all",
    onStatusChange,
    onCreate,
    onRefresh,
    onReset,
    loading = false,
    refreshing = false,
    totalRecords = 0,
    title = "Manifest Packages Putaway",
    subtitle = "Manage and monitor package putaway records."
}) => {
    /* =====================================================
       SEARCH CHANGE
    ===================================================== */

    const handleSearchChange = (event) => {
        if (onSearchChange) {
            onSearchChange(event.target.value);
        }
    };

    /* =====================================================
       STATUS CHANGE
    ===================================================== */

    const handleStatusChange = (event) => {
        if (onStatusChange) {
            onStatusChange(event.target.value);
        }
    };

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const handleReset = () => {
        if (onReset) {
            onReset();
            return;
        }

        if (onSearchChange) {
            onSearchChange("");
        }

        if (onStatusChange) {
            onStatusChange("all");
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", mb: 3 }}>
            {/* PAGE HEADER */}

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 2,
                    borderRadius: 3
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1.5}
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 2,
                                bgcolor: "primary.light",
                                color: "primary.dark",
                                flexShrink: 0
                            }}
                        >
                            <Inventory2 fontSize="large" />
                        </Box>

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                {title}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                {subtitle}
                            </Typography>
                        </Box>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                    >
                        <Tooltip title="Refresh records">
                            <span>
                                <IconButton
                                    color="primary"
                                    onClick={onRefresh}
                                    disabled={
                                        loading ||
                                        refreshing ||
                                        !onRefresh
                                    }
                                    aria-label="Refresh records"
                                >
                                    <Refresh />
                                </IconButton>
                            </span>
                        </Tooltip>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={onCreate}
                            disabled={!onCreate || loading}
                        >
                            Add Putaway
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* SEARCH AND FILTER BAR */}

            <Paper
                elevation={1}
                sx={{
                    p: { xs: 2, md: 2.5 },
                    borderRadius: 3
                }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    alignItems={{ xs: "stretch", md: "center" }}
                    spacing={2}
                >
                    {/* SEARCH */}

                    <TextField
                        fullWidth
                        size="small"
                        label="Search putaway records"
                        placeholder="Search ID, manifest, package, location..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={loading}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        aria-label="Clear search"
                                        onClick={() =>
                                            onSearchChange?.("")
                                        }
                                        disabled={loading}
                                    >
                                        <Clear fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ) : null
                        }}
                    />

                    {/* STATUS FILTER */}

                    <TextField
                        select
                        size="small"
                        label="Status"
                        value={statusFilter}
                        onChange={handleStatusChange}
                        disabled={loading}
                        sx={{
                            minWidth: { xs: "100%", md: 190 }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FilterList color="action" />
                                </InputAdornment>
                            )
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

                    {/* RESET */}

                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Clear />}
                        onClick={handleReset}
                        disabled={
                            loading ||
                            (!searchTerm && statusFilter === "all")
                        }
                        sx={{ minWidth: { xs: "100%", md: 110 } }}
                    >
                        Reset
                    </Button>
                </Stack>

                {/* FOOTER */}

                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ mt: 2 }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Total records:{" "}
                        <Typography
                            component="span"
                            variant="body2"
                            fontWeight={700}
                            color="text.primary"
                        >
                            {Number.isFinite(Number(totalRecords))
                                ? Number(totalRecords).toLocaleString("en-IN")
                                : 0}
                        </Typography>
                    </Typography>

                    {(loading || refreshing) && (
                        <Typography
                            variant="caption"
                            color="primary.main"
                        >
                            {refreshing
                                ? "Refreshing records..."
                                : "Loading records..."}
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default ManifestPackagesPutawayToolbar;

