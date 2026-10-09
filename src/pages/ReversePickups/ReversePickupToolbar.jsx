import React from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Stack,
    Divider,
    Tooltip,
    CircularProgress
} from "@mui/material";

import {
    Add,
    Refresh,
    Download,
    FilterList,
    FilterAltOff,
    Inventory2,
    PendingActions,
    CheckCircle,
    LocalShipping,
    Cancel,
    AssignmentReturn
} from "@mui/icons-material";

/* =========================================================
   REVERSE PICKUP TOOLBAR
========================================================= */

const ReversePickupToolbar = ({
    title = "Reverse Pickups",
    subtitle = "Manage return pickups, collection status, and reverse logistics.",

    totalRecords = 0,
    totalPickups,
    pendingPickups = 0,
    scheduledPickups = 0,
    completedPickups = 0,
    cancelledPickups = 0,

    loading = false,
    exporting = false,
    showFilters = false,

    onAdd,
    onCreate,
    onRefresh,
    onExport,
    onToggleFilters,

    addButtonLabel = "Create Reverse Pickup",
    showStatistics = true,
    showAddButton = true,
    showRefreshButton = true,
    showExportButton = true,
    showFilterButton = true
}) => {
    /* =====================================================
       NORMALIZE STATISTICS
    ===================================================== */

    const total = Number(totalPickups ?? totalRecords) || 0;
    const pending = Number(pendingPickups) || 0;
    const scheduled = Number(scheduledPickups) || 0;
    const completed = Number(completedPickups) || 0;
    const cancelled = Number(cancelledPickups) || 0;

    const handleCreate = onAdd || onCreate;

    /* =====================================================
       STATISTIC CARD
    ===================================================== */

    const StatisticCard = ({
        label,
        value,
        icon,
        color = "primary"
    }) => (
        <Grid item xs={12} sm={6} md={2.4}>
            <Card
                variant="outlined"
                sx={{
                    height: "100%",
                    borderRadius: 2,
                    transition: "0.2s ease",
                    "&:hover": {
                        boxShadow: 2,
                        transform: "translateY(-2px)"
                    }
                }}
            >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                    >
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                {label}
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{ lineHeight: 1.2 }}
                            >
                                {loading ? "—" : value.toLocaleString("en-IN")}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 42,
                                height: 42,
                                borderRadius: 2,
                                bgcolor: `${color}.light`,
                                color: `${color}.dark`,
                                flexShrink: 0
                            }}
                        >
                            {icon}
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </Grid>
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", mb: 3 }}>
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", md: "center" },
                    gap: 2,
                    mb: 2
                }}
            >
                <Box>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 0.5 }}
                    >
                        <AssignmentReturn color="primary" />

                        <Typography
                            variant="h5"
                            component="h1"
                            fontWeight={700}
                        >
                            {title}
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {subtitle}
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1, flexWrap: "wrap", rowGap: 1 }}
                    >
                        <Chip
                            size="small"
                            label={`Total: ${total.toLocaleString("en-IN")}`}
                            variant="outlined"
                        />

                        {loading && (
                            <Chip
                                size="small"
                                label="Loading..."
                                icon={<CircularProgress size={12} />}
                            />
                        )}
                    </Stack>
                </Box>

                {/* ACTION BUTTONS */}

                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    alignItems="center"
                    sx={{
                        justifyContent: { xs: "flex-start", md: "flex-end" }
                    }}
                >
                    {showFilterButton && (
                        <Tooltip
                            title={
                                showFilters
                                    ? "Hide filters"
                                    : "Show filters"
                            }
                        >
                            <Button
                                variant={showFilters ? "contained" : "outlined"}
                                color="primary"
                                startIcon={
                                    showFilters
                                        ? <FilterAltOff />
                                        : <FilterList />
                                }
                                onClick={onToggleFilters}
                                disabled={loading}
                            >
                                {showFilters ? "Hide Filters" : "Filters"}
                            </Button>
                        </Tooltip>
                    )}

                    {showRefreshButton && (
                        <Tooltip title="Refresh reverse pickups">
                            <span>
                                <Button
                                    variant="outlined"
                                    startIcon={
                                        loading
                                            ? <CircularProgress size={16} />
                                            : <Refresh />
                                    }
                                    onClick={onRefresh}
                                    disabled={loading}
                                >
                                    Refresh
                                </Button>
                            </span>
                        </Tooltip>
                    )}

                    {showExportButton && (
                        <Tooltip title="Export reverse pickup records">
                            <span>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    startIcon={
                                        exporting
                                            ? <CircularProgress size={16} />
                                            : <Download />
                                    }
                                    onClick={onExport}
                                    disabled={loading || exporting}
                                >
                                    {exporting ? "Exporting..." : "Export"}
                                </Button>
                            </span>
                        </Tooltip>
                    )}

                    {showAddButton && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleCreate}
                            disabled={loading}
                        >
                            {addButtonLabel}
                        </Button>
                    )}
                </Stack>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* STATISTICS */}

            {showStatistics && (
                <Grid container spacing={2}>
                    <StatisticCard
                        label="Total Pickups"
                        value={total}
                        icon={<Inventory2 />}
                        color="primary"
                    />

                    <StatisticCard
                        label="Pending"
                        value={pending}
                        icon={<PendingActions />}
                        color="warning"
                    />

                    <StatisticCard
                        label="Scheduled"
                        value={scheduled}
                        icon={<LocalShipping />}
                        color="info"
                    />

                    <StatisticCard
                        label="Completed"
                        value={completed}
                        icon={<CheckCircle />}
                        color="success"
                    />

                    <StatisticCard
                        label="Cancelled"
                        value={cancelled}
                        icon={<Cancel />}
                        color="error"
                    />
                </Grid>
            )}
        </Box>
    );
};

export default ReversePickupToolbar;

