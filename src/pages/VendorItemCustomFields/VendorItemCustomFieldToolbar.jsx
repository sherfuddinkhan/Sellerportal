import React from "react";

import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    Chip,
    Tooltip,
    CircularProgress,
    Divider
} from "@mui/material";

import {
    Add,
    Refresh,
    FileDownload,
    Tune,
    Inventory2,
    CheckCircle,
    Cancel,
    FilterList
} from "@mui/icons-material";

/* =========================================================
   VENDOR ITEM CUSTOM FIELD TOOLBAR
========================================================= */

const VendorItemCustomFieldToolbar = ({
    onAdd,
    onRefresh,
    onExport,
    onFilter,
    onManageFields,

    totalFields = 0,
    activeFields = 0,
    inactiveFields = 0,

    loading = false,
    exporting = false,

    title = "Vendor Item Custom Fields",
    subtitle = "Manage custom fields and item-specific attributes.",

    showStatistics = true,
    showExport = true,
    showFilter = false,
    showManageFields = false,

    addButtonLabel = "Add Custom Field"
}) => {
    /* =====================================================
       SAFE NUMBER FORMAT
    ===================================================== */

    const formatNumber = (value) => {
        const number = Number(value);

        return Number.isFinite(number)
            ? number.toLocaleString("en-IN")
            : "0";
    };

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleAdd = () => {
        if (onAdd) {
            onAdd();
        }
    };

    const handleRefresh = () => {
        if (onRefresh && !loading) {
            onRefresh();
        }
    };

    const handleExport = () => {
        if (onExport && !exporting) {
            onExport();
        }
    };

    const handleFilter = () => {
        if (onFilter) {
            onFilter();
        }
    };

    const handleManageFields = () => {
        if (onManageFields) {
            onManageFields();
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={1}
            sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                mb: 3,
                borderRadius: 2
            }}
        >
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row"
                    },
                    gap: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
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
                            borderRadius: 2,
                            bgcolor: "primary.light",
                            color: "primary.dark",
                            flexShrink: 0
                        }}
                    >
                        <Inventory2 fontSize="medium" />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
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

                {/* PRIMARY ACTIONS */}

                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    alignItems="center"
                >
                    {showFilter && onFilter && (
                        <Button
                            variant="outlined"
                            startIcon={<FilterList />}
                            onClick={handleFilter}
                            disabled={loading}
                        >
                            Filters
                        </Button>
                    )}

                    {showManageFields && onManageFields && (
                        <Button
                            variant="outlined"
                            startIcon={<Tune />}
                            onClick={handleManageFields}
                            disabled={loading}
                        >
                            Manage Fields
                        </Button>
                    )}

                    {showExport && onExport && (
                        <Button
                            variant="outlined"
                            startIcon={
                                exporting ? (
                                    <CircularProgress size={18} />
                                ) : (
                                    <FileDownload />
                                )
                            }
                            onClick={handleExport}
                            disabled={
                                loading || exporting
                            }
                        >
                            {exporting
                                ? "Exporting..."
                                : "Export"}
                        </Button>
                    )}

                    {onRefresh && (
                        <Tooltip title="Refresh custom fields">
                            <span>
                                <Button
                                    variant="outlined"
                                    startIcon={
                                        loading ? (
                                            <CircularProgress
                                                size={18}
                                            />
                                        ) : (
                                            <Refresh />
                                        )
                                    }
                                    onClick={handleRefresh}
                                    disabled={loading}
                                >
                                    Refresh
                                </Button>
                            </span>
                        </Tooltip>
                    )}

                    {onAdd && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAdd}
                            disabled={loading}
                        >
                            {addButtonLabel}
                        </Button>
                    )}
                </Stack>
            </Box>

            {/* STATISTICS */}

            {showStatistics && (
                <>
                    <Divider sx={{ my: 2.5 }} />

                    <Stack
                        direction="row"
                        spacing={1.5}
                        useFlexGap
                        flexWrap="wrap"
                        alignItems="center"
                    >
                        <Chip
                            icon={<Inventory2 />}
                            label={`Total Fields: ${formatNumber(
                                totalFields
                            )}`}
                            variant="outlined"
                        />

                        <Chip
                            icon={<CheckCircle />}
                            label={`Active: ${formatNumber(
                                activeFields
                            )}`}
                            color="success"
                            variant="outlined"
                        />

                        <Chip
                            icon={<Cancel />}
                            label={`Inactive: ${formatNumber(
                                inactiveFields
                            )}`}
                            color="default"
                            variant="outlined"
                        />
                    </Stack>
                </>
            )}
        </Paper>
    );
};

export default VendorItemCustomFieldToolbar;

