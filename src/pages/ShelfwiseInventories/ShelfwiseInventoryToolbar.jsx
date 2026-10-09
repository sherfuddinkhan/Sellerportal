import React from "react";

import {
    Box,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Stack,
    Chip,
    Paper,
    Divider
} from "@mui/material";

import {
    Inventory2,
    Add,
    Refresh,
    FileDownload,
    FilterList,
    ViewModule,
    Warehouse
} from "@mui/icons-material";

/* =========================================================
   SHELFWISE INVENTORY TOOLBAR
========================================================= */

const ShelfwiseInventoryToolbar = ({
    totalRecords = 0,
    totalQuantity = 0,
    loading = false,

    onAdd,
    onRefresh,
    onExport,
    onToggleFilters,
    onToggleView,

    showFilters = false,
    viewMode = "table",

    addButtonLabel = "Add Inventory",
    title = "Shelf-wise Inventory",
    subtitle = "Manage stock quantities by shelf and warehouse"
}) => {
    /* =====================================================
       FORMAT NUMBER
    ===================================================== */

    const formatNumber = (value) => {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "0";
        }

        return number.toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });
    };

    /* =====================================================
       RENDER TOOLBAR
    ===================================================== */

    return (
        <Paper
            elevation={1}
            sx={{
                p: { xs: 2, sm: 2.5 },
                mb: 2.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider"
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        md: "row"
                    },
                    alignItems: {
                        xs: "stretch",
                        md: "center"
                    },
                    justifyContent: "space-between",
                    gap: 2
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                    >
                        <Inventory2 fontSize="medium" />
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
                        >
                            {subtitle}
                        </Typography>
                    </Box>
                </Stack>

                {/* ACTION BUTTONS */}

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    alignItems="center"
                >
                    <Tooltip title="Refresh inventory">
                        <span>
                            <IconButton
                                color="primary"
                                onClick={onRefresh}
                                disabled={loading}
                                aria-label="Refresh inventory"
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2
                                }}
                            >
                                <Refresh />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Button
                        variant={showFilters ? "contained" : "outlined"}
                        color="inherit"
                        startIcon={<FilterList />}
                        onClick={onToggleFilters}
                    >
                        Filters
                    </Button>

                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<FileDownload />}
                        onClick={onExport}
                        disabled={loading || totalRecords === 0}
                    >
                        Export
                    </Button>

                    {onToggleView && (
                        <Tooltip
                            title={
                                viewMode === "table"
                                    ? "Switch to card view"
                                    : "Switch to table view"
                            }
                        >
                            <IconButton
                                color="primary"
                                onClick={onToggleView}
                                aria-label="Toggle inventory view"
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2
                                }}
                            >
                                {viewMode === "table"
                                    ? <ViewModule />
                                    : <Warehouse />}
                            </IconButton>
                        </Tooltip>
                    )}

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={onAdd}
                    >
                        {addButtonLabel}
                    </Button>
                </Stack>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* SUMMARY */}

            <Stack
                direction="row"
                spacing={1.5}
                flexWrap="wrap"
                useFlexGap
            >
                <Chip
                    icon={<Inventory2 />}
                    label={`Records: ${formatNumber(totalRecords)}`}
                    variant="outlined"
                    color="primary"
                />

                <Chip
                    icon={<Warehouse />}
                    label={`Total Quantity: ${formatNumber(totalQuantity)}`}
                    variant="outlined"
                    color="success"
                />

                {loading && (
                    <Chip
                        label="Refreshing..."
                        size="small"
                        variant="outlined"
                    />
                )}
            </Stack>
        </Paper>
    );
};

export default ShelfwiseInventoryToolbar;

