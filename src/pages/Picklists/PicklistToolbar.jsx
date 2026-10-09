
// PicklistToolbar.jsx

import React from "react";

import {
    Box,
    Button,
    Tooltip,
    Typography,
    CircularProgress
} from "@mui/material";

import {
    Add,
    Refresh,
    PlaylistAddCheck
} from "@mui/icons-material";

/* =========================================================
   PICKLIST TOOLBAR
========================================================= */

const PicklistToolbar = ({
    title = "Picklists",
    subtitle = "Manage and monitor warehouse picking operations.",
    onRefresh,
    onAdd,
    loading = false,
    refreshing,
    showAddButton = true,
    showRefreshButton = true,
    addButtonText = "Create Picklist",
    refreshButtonText = "Refresh",
    disabled = false
}) => {
    const isRefreshing =
        refreshing !== undefined ? refreshing : loading;

    const handleRefresh = () => {
        if (typeof onRefresh === "function" && !isRefreshing) {
            onRefresh();
        }
    };

    const handleAdd = () => {
        if (typeof onAdd === "function" && !disabled) {
            onAdd();
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
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
                p: {
                    xs: 2,
                    sm: 2.5
                },
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                boxSizing: "border-box"
            }}
        >
            {/* =================================================
                TITLE SECTION
            ================================================= */}

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
                        width: 46,
                        height: 46,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        backgroundColor: "primary.main",
                        color: "primary.contrastText"
                    }}
                >
                    <PlaylistAddCheck fontSize="medium" />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="h6"
                        component="h2"
                        fontWeight={700}
                        sx={{
                            lineHeight: 1.4,
                            overflowWrap: "anywhere"
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.25,
                            overflowWrap: "anywhere"
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </Box>

            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: {
                        xs: "flex-start",
                        sm: "flex-end"
                    },
                    flexWrap: "wrap",
                    gap: 1.25,
                    flexShrink: 0
                }}
            >
                {showRefreshButton && (
                    <Tooltip title="Reload picklist data">
                        <span>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={
                                    isRefreshing ? (
                                        <CircularProgress
                                            size={16}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Refresh />
                                    )
                                }
                                onClick={handleRefresh}
                                disabled={
                                    isRefreshing || disabled
                                }
                                sx={{
                                    minHeight: 40,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: 1.5,
                                    px: 2
                                }}
                            >
                                {isRefreshing
                                    ? "Refreshing..."
                                    : refreshButtonText}
                            </Button>
                        </span>
                    </Tooltip>
                )}

                {showAddButton && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAdd}
                        disabled={disabled}
                        sx={{
                            minHeight: 40,
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 1.5,
                            px: 2,
                            boxShadow: "none",
                            "&:hover": {
                                boxShadow: 1
                            }
                        }}
                    >
                        {addButtonText}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default PicklistToolbar;

