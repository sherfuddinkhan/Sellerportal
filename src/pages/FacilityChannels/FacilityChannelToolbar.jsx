import React from "react";

import {
    Box,
    Typography,
    Button,
    Stack,
    Tooltip,
    IconButton,
    CircularProgress
} from "@mui/material";

import {
    Add,
    Refresh,
    FileDownload,
    Apartment
} from "@mui/icons-material";

/* =========================================================
   FACILITY CHANNEL TOOLBAR
========================================================= */

const FacilityChannelToolbar = ({
    title = "Facility Channels",
    subtitle = "Manage and view facility channel information",

    onCreate,
    onRefresh,
    onExport,

    loading = false,
    exporting = false,

    showCreate = true,
    showRefresh = true,
    showExport = false
}) => {

    /* =====================================================
       HANDLE REFRESH
    ===================================================== */

    const handleRefresh = () => {
        if (loading) {
            return;
        }

        onRefresh?.();
    };

    /* =====================================================
       HANDLE CREATE
    ===================================================== */

    const handleCreate = () => {
        if (loading) {
            return;
        }

        onCreate?.();
    };

    /* =====================================================
       HANDLE EXPORT
    ===================================================== */

    const handleExport = () => {
        if (loading || exporting) {
            return;
        }

        onExport?.();
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            className="facility-channel-toolbar"
            sx={{
                display: "flex",
                alignItems: {
                    xs: "stretch",
                    sm: "center"
                },
                justifyContent: "space-between",
                flexDirection: {
                    xs: "column",
                    sm: "row"
                },
                gap: 2,
                width: "100%",
                mb: 2
            }}
        >
            {/* =================================================
                LEFT SECTION
            ================================================= */}

            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ minWidth: 0 }}
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
                        color: "primary.contrastText",
                        flexShrink: 0
                    }}
                >
                    <Apartment fontSize="medium" />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="h5"
                        component="h1"
                        fontWeight={700}
                        sx={{
                            lineHeight: 1.3,
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
            </Stack>

            {/* =================================================
                RIGHT SECTION - ACTIONS
            ================================================= */}

            <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent={{
                    xs: "flex-start",
                    sm: "flex-end"
                }}
                flexWrap="wrap"
                useFlexGap
            >
                {/* REFRESH BUTTON */}

                {showRefresh && (
                    <Tooltip title="Refresh facility channels">
                        <span>
                            <IconButton
                                onClick={handleRefresh}
                                disabled={loading}
                                color="primary"
                                aria-label="Refresh facility channels"
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
                )}

                {/* EXPORT BUTTON */}

                {showExport && (
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={
                            exporting ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <FileDownload />
                            )
                        }
                        onClick={handleExport}
                        disabled={loading || exporting}
                    >
                        {exporting ? "Exporting..." : "Export"}
                    </Button>
                )}

                {/* CREATE BUTTON */}

                {showCreate && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleCreate}
                        disabled={loading}
                        sx={{
                            minHeight: 40,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            px: 2
                        }}
                    >
                        Add Facility Channel
                    </Button>
                )}
            </Stack>
        </Box>
    );
};

export default FacilityChannelToolbar;

