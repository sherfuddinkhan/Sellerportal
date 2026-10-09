import React from "react";

import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Chip,
    Stack,
    Divider,
    CircularProgress
} from "@mui/material";

import {
    LocalShipping,
    Add,
    Refresh,
    FileDownload,
    FilterList,
    FilterListOff,
    Inventory2,
    PendingActions,
    CheckCircle,
    Cancel
} from "@mui/icons-material";

/* =========================================================
   SHIPPING MANIFEST TOOLBAR
========================================================= */

const ShippingManifestToolbar = ({
    totalRecords = 0,
    totalManifests,
    pendingManifests = 0,
    shippedManifests = 0,
    deliveredManifests = 0,
    cancelledManifests = 0,
    loading = false,
    exporting = false,
    showFilters = false,
    onAdd,
    onCreate,
    onRefresh,
    onExport,
    onToggleFilters,
    title = "Shipping Manifests",
    subtitle = "Manage and track shipping manifests"
}) => {
    const total = Number(totalManifests ?? totalRecords) || 0;

    const safePending = Number(pendingManifests) || 0;
    const safeShipped = Number(shippedManifests) || 0;
    const safeDelivered = Number(deliveredManifests) || 0;
    const safeCancelled = Number(cancelledManifests) || 0;

    const handleCreate = onAdd || onCreate;

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 3 },
                mb: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3
            }}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    mb: 2.5
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            flexShrink: 0
                        }}
                    >
                        <LocalShipping fontSize="medium" />
                    </Box>

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ lineHeight: 1.3 }}
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

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    alignItems="center"
                >
                    <Tooltip
                        title={
                            showFilters
                                ? "Hide filters"
                                : "Show filters"
                        }
                    >
                        <IconButton
                            onClick={onToggleFilters}
                            disabled={loading}
                            color={showFilters ? "primary" : "default"}
                            aria-label={
                                showFilters
                                    ? "Hide filters"
                                    : "Show filters"
                            }
                            sx={{
                                border: "1px solid",
                                borderColor: showFilters
                                    ? "primary.main"
                                    : "divider",
                                borderRadius: 2
                            }}
                        >
                            {showFilters ? (
                                <FilterListOff />
                            ) : (
                                <FilterList />
                            )}
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Refresh shipping manifests">
                        <span>
                            <IconButton
                                onClick={onRefresh}
                                disabled={loading}
                                aria-label="Refresh shipping manifests"
                                sx={{
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <Refresh />
                                )}
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Button
                        variant="outlined"
                        startIcon={
                            exporting ? (
                                <CircularProgress size={16} />
                            ) : (
                                <FileDownload />
                            )
                        }
                        onClick={onExport}
                        disabled={loading || exporting || total === 0}
                    >
                        {exporting ? "Exporting..." : "Export"}
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                        disabled={loading || !handleCreate}
                    >
                        Create Manifest
                    </Button>
                </Stack>
            </Box>

            <Divider sx={{ mb: 2.5 }} />

            {/* =================================================
                SUMMARY CHIPS
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap"
                }}
            >
                <Chip
                    icon={<Inventory2 />}
                    label={`Total: ${total}`}
                    variant="outlined"
                    color="primary"
                />

                <Chip
                    icon={<PendingActions />}
                    label={`Pending: ${safePending}`}
                    variant="outlined"
                    color="warning"
                />

                <Chip
                    icon={<LocalShipping />}
                    label={`Shipped: ${safeShipped}`}
                    variant="outlined"
                    color="info"
                />

                <Chip
                    icon={<CheckCircle />}
                    label={`Delivered: ${safeDelivered}`}
                    variant="outlined"
                    color="success"
                />

                <Chip
                    icon={<Cancel />}
                    label={`Cancelled: ${safeCancelled}`}
                    variant="outlined"
                    color="error"
                />
            </Box>
        </Paper>
    );
};

export default ShippingManifestToolbar;

