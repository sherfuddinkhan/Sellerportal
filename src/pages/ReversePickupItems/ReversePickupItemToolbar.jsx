import React from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    InputAdornment,
    MenuItem,
    Stack,
    Chip,
    Tooltip,
    IconButton,
    Divider
} from "@mui/material";

import {
    Add,
    Search,
    Refresh,
    FileDownload,
    LocalShipping,
    Inventory2,
    Payments,
    CheckCircle,
    PendingActions,
    Cancel,
    FilterAltOff
} from "@mui/icons-material";

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === "" ||
        !Number.isFinite(number)
    ) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
    const amount = Number(value);

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === "" ||
        !Number.isFinite(amount)
    ) {
        return "₹ 0.00";
    }

    return `₹ ${amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

/* =========================================================
   STATISTIC CARD
========================================================= */

const StatisticCard = ({
    title,
    value,
    icon,
    color = "primary.main",
    subtitle
}) => (
    <Card
        elevation={0}
        sx={{
            height: "100%",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            transition: "0.2s",
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
                        {title}
                    </Typography>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                            color,
                            overflowWrap: "anywhere",
                            fontSize: {
                                xs: "1.15rem",
                                sm: "1.4rem"
                            }
                        }}
                    >
                        {value}
                    </Typography>

                    {subtitle && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        borderRadius: 2,
                        bgcolor: `${color.split(".")[0]}.50`,
                        color
                    }}
                >
                    {icon}
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

/* =========================================================
   REVERSE PICKUP ITEM TOOLBAR
========================================================= */

const ReversePickupItemToolbar = ({
    reversePickups = [],
    pickups,
    items,
    totalCount,
    totalPickups,
    totalCost,
    pendingCount,
    completedCount,
    cancelledCount,
    search = "",
    searchTerm,
    status = "all",
    statusFilter,
    onSearchChange,
    onSearch,
    onStatusChange,
    onRefresh,
    onExport,
    onCreate,
    onClearFilters,
    loading = false,
    showStatistics = true,
    showSearch = true,
    showStatusFilter = true,
    showExport = true,
    showCreate = true,
    title = "Reverse Pickup Items",
    subtitle = "Manage and track reverse pickup records"
}) => {
    /* =====================================================
       DATA NORMALIZATION
    ===================================================== */

    const records =
        reversePickups ||
        pickups ||
        items ||
        [];

    const safeRecords = Array.isArray(records)
        ? records
        : [];

    const currentSearch = searchTerm ?? search;
    const currentStatus = statusFilter ?? status;

    /* =====================================================
       FIELD ACCESS
    ===================================================== */

    const getField = (record, ...keys) => {
        for (const key of keys) {
            const value = record?.[key];

            if (
                value !== undefined &&
                value !== null
            ) {
                return value;
            }
        }

        return undefined;
    };

    /* =====================================================
       STATISTICS
    ===================================================== */

    const computedTotal = totalCount ?? totalPickups ??
        safeRecords.length;

    const computedPending = pendingCount ??
        safeRecords.filter((record) => {
            const value = getField(
                record,
                "status",
                "Status"
            );

            return [
                "pending",
                "requested",
                "scheduled"
            ].includes(
                String(value || "").trim().toLowerCase()
            );
        }).length;

    const computedCompleted = completedCount ??
        safeRecords.filter((record) => {
            const value = getField(
                record,
                "status",
                "Status"
            );

            return [
                "completed",
                "delivered",
                "picked up",
                "pickedup"
            ].includes(
                String(value || "").trim().toLowerCase()
            );
        }).length;

    const computedCancelled = cancelledCount ??
        safeRecords.filter((record) => {
            const value = getField(
                record,
                "status",
                "Status"
            );

            return [
                "cancelled",
                "canceled",
                "failed"
            ].includes(
                String(value || "").trim().toLowerCase()
            );
        }).length;

    const computedCost = totalCost ??
        safeRecords.reduce((sum, record) => {
            const value = Number(
                getField(
                    record,
                    "pickupCost",
                    "PickupCost"
                )
            );

            return sum + (
                Number.isFinite(value) ? value : 0
            );
        }, 0);

    /* =====================================================
       HANDLERS
    ===================================================== */

    const handleSearchChange = (event) => {
        onSearchChange?.(event.target.value);
    };

    const handleStatusChange = (event) => {
        onStatusChange?.(event.target.value);
    };

    const handleClearFilters = () => {
        onSearchChange?.("");
        onStatusChange?.("all");
        onClearFilters?.();
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", mb: 3 }}>
            {/* =============================================
                HEADER
            ============================================= */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mb: 0.5 }}
                    >
                        <LocalShipping
                            color="primary"
                            sx={{ fontSize: 30 }}
                        />

                        <Typography
                            variant="h5"
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
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                >
                    <Tooltip title="Refresh reverse pickup records">
                        <span>
                            <IconButton
                                onClick={onRefresh}
                                disabled={loading}
                                color="primary"
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

                    {showExport && (
                        <Button
                            variant="outlined"
                            startIcon={<FileDownload />}
                            onClick={onExport}
                            disabled={loading}
                            sx={{ borderRadius: 2 }}
                        >
                            Export
                        </Button>
                    )}

                    {showCreate && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={onCreate}
                            disabled={loading}
                            sx={{
                                borderRadius: 2,
                                fontWeight: 600
                            }}
                        >
                            Create Reverse Pickup
                        </Button>
                    )}
                </Stack>
            </Stack>

            {/* =============================================
                STATISTICS
            ============================================= */}

            {showStatistics && (
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatisticCard
                            title="Total Reverse Pickups"
                            value={formatNumber(computedTotal)}
                            icon={<Inventory2 />}
                            color="primary.main"
                            subtitle="Total records"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatisticCard
                            title="Pending"
                            value={formatNumber(computedPending)}
                            icon={<PendingActions />}
                            color="warning.main"
                            subtitle="Awaiting completion"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatisticCard
                            title="Completed"
                            value={formatNumber(computedCompleted)}
                            icon={<CheckCircle />}
                            color="success.main"
                            subtitle="Successfully processed"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <StatisticCard
                            title="Total Pickup Cost"
                            value={formatCurrency(computedCost)}
                            icon={<Payments />}
                            color="info.main"
                            subtitle="Combined pickup cost"
                        />
                    </Grid>
                </Grid>
            )}

            {/* =============================================
                FILTER TOOLBAR
            ============================================= */}

            {(showSearch || showStatusFilter) && (
                <Card
                    elevation={0}
                    sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2
                    }}
                >
                    <CardContent
                        sx={{
                            p: 2,
                            "&:last-child": { pb: 2 }
                        }}
                    >
                        <Stack
                            direction={{
                                xs: "column",
                                md: "row"
                            }}
                            spacing={2}
                            alignItems={{
                                xs: "stretch",
                                md: "center"
                            }}
                        >
                            {showSearch && (
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Search pickup number, order, customer, SKU..."
                                    value={currentSearch}
                                    onChange={handleSearchChange}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter"
                                        ) {
                                            onSearch?.(currentSearch);
                                        }
                                    }}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search color="action" />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}

                            {showStatusFilter && (
                                <TextField
                                    select
                                    size="small"
                                    label="Filter by status"
                                    value={currentStatus}
                                    onChange={handleStatusChange}
                                    disabled={loading}
                                    sx={{
                                        minWidth: {
                                            xs: "100%",
                                            md: 200
                                        }
                                    }}
                                >
                                    <MenuItem value="all">
                                        All Statuses
                                    </MenuItem>

                                    <MenuItem value="pending">
                                        Pending
                                    </MenuItem>

                                    <MenuItem value="scheduled">
                                        Scheduled
                                    </MenuItem>

                                    <MenuItem value="processing">
                                        Processing
                                    </MenuItem>

                                    <MenuItem value="in transit">
                                        In Transit
                                    </MenuItem>

                                    <MenuItem value="completed">
                                        Completed
                                    </MenuItem>

                                    <MenuItem value="cancelled">
                                        Cancelled
                                    </MenuItem>

                                    <MenuItem value="failed">
                                        Failed
                                    </MenuItem>
                                </TextField>
                            )}

                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<FilterAltOff />}
                                onClick={handleClearFilters}
                                disabled={
                                    loading ||
                                    (
                                        !currentSearch &&
                                        currentStatus === "all"
                                    )
                                }
                                sx={{
                                    whiteSpace: "nowrap",
                                    minWidth: "fit-content"
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Stack>

                        <Divider sx={{ my: 1.5 }} />

                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            flexWrap="wrap"
                            useFlexGap
                            spacing={1}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {formatNumber(computedTotal)} total records
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                            >
                                <Chip
                                    size="small"
                                    label={`Pending: ${formatNumber(computedPending)}`}
                                    color="warning"
                                    variant="outlined"
                                />

                                <Chip
                                    size="small"
                                    label={`Completed: ${formatNumber(computedCompleted)}`}
                                    color="success"
                                    variant="outlined"
                                />

                                <Chip
                                    size="small"
                                    label={`Cancelled: ${formatNumber(computedCancelled)}`}
                                    color="error"
                                    variant="outlined"
                                />
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default ReversePickupItemToolbar;

