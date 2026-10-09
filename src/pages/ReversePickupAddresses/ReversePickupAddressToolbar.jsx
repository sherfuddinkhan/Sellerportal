import React from "react";

import {
    Box,
    Button,
    Typography,
    Stack,
    Tooltip,
    IconButton,
    Chip,
    Divider
} from "@mui/material";

import {
    Add,
    Refresh,
    FileDownload,
    LocationOn,
    FilterList,
    ClearAll
} from "@mui/icons-material";

/* =========================================================
   REVERSE PICKUP ADDRESS TOOLBAR
========================================================= */

const ReversePickupAddressToolbar = ({
    totalAddresses = 0,
    filteredCount,
    loading = false,
    onCreate,
    onRefresh,
    onExport,
    onToggleFilters,
    onClearFilters,
    showFilters = false,
    title = "Reverse Pickup Addresses",
    subtitle = "Manage reverse pickup address information",
    createButtonText = "Add Address",
    exportButtonText = "Export",
    refreshButtonText = "Refresh",
    showCreateButton = true,
    showExportButton = true,
    showRefreshButton = true,
    showFilterButton = true,
    showClearFiltersButton = false
}) => {
    const total = Number.isFinite(Number(totalAddresses))
        ? Math.max(0, Number(totalAddresses))
        : 0;

    const filtered = Number.isFinite(Number(filteredCount))
        ? Math.max(0, Number(filteredCount))
        : total;

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Box
            sx={{
                width: "100%",
                mb: 3
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 48,
                            height: 48,
                            flexShrink: 0,
                            borderRadius: 2,
                            bgcolor: "primary.light",
                            color: "primary.contrastText"
                        }}
                    >
                        <LocationOn fontSize="medium" />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                color: "text.primary",
                                overflowWrap: "anywhere"
                            }}
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

                {/* PRIMARY ACTION */}

                {showCreateButton && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={onCreate}
                        disabled={loading || !onCreate}
                        sx={{
                            minHeight: 42,
                            borderRadius: 2,
                            px: 2.5,
                            fontWeight: 600,
                            textTransform: "none",
                            whiteSpace: "nowrap"
                        }}
                    >
                        {createButtonText}
                    </Button>
                )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* TOOLBAR ACTIONS */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: {
                        xs: "stretch",
                        sm: "center"
                    },
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    p: 2,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    boxShadow: "0 2px 6px rgba(15, 23, 42, 0.04)"
                }}
            >
                {/* COUNTS */}

                <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                >
                    <Chip
                        icon={<LocationOn />}
                        label={`${total} total ${total === 1 ? "address" : "addresses"}`}
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />

                    {filteredCount !== undefined &&
                        filtered !== total && (
                            <Chip
                                label={`${filtered} matching`}
                                color="info"
                                variant="outlined"
                                sx={{ fontWeight: 500 }}
                            />
                        )}
                </Stack>

                {/* ACTION BUTTONS */}

                <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                >
                    {showFilterButton && (
                        <Button
                            variant={showFilters ? "contained" : "outlined"}
                            color="primary"
                            startIcon={<FilterList />}
                            onClick={onToggleFilters}
                            disabled={!onToggleFilters}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                fontWeight: 600
                            }}
                        >
                            {showFilters ? "Hide Filters" : "Filters"}
                        </Button>
                    )}

                    {showClearFiltersButton && (
                        <Button
                            variant="text"
                            color="inherit"
                            startIcon={<ClearAll />}
                            onClick={onClearFilters}
                            disabled={!onClearFilters || loading}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}

                    {showExportButton && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<FileDownload />}
                            onClick={onExport}
                            disabled={!onExport || loading || total === 0}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                fontWeight: 600
                            }}
                        >
                            {exportButtonText}
                        </Button>
                    )}

                    {showRefreshButton && (
                        <Tooltip title="Refresh addresses">
                            <span>
                                <IconButton
                                    aria-label="Refresh reverse pickup addresses"
                                    onClick={onRefresh}
                                    disabled={!onRefresh || loading}
                                    color="primary"
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "divider",
                                        borderRadius: 2,
                                        width: 40,
                                        height: 40
                                    }}
                                >
                                    <Refresh />
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export default ReversePickupAddressToolbar;

