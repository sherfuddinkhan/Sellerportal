// =========================================================
// VendorItemMasterToolbar.jsx
// =========================================================

import React from "react";

import {
    Box,
    Button,
    Typography,
    Tooltip
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";

// =========================================================
// VENDOR ITEM MASTER TOOLBAR
// =========================================================

const VendorItemMasterToolbar = ({
    title = "Vendor Item Masters",
    subtitle = "Manage vendor items, prices, units, and status.",
    onCreate,
    onRefresh,
    loading = false,
    createLabel = "Add Vendor Item",
    showCreateButton = true,
    showRefreshButton = true,
    createDisabled = false
}) => {

    // =====================================================
    // HANDLE CREATE
    // =====================================================

    const handleCreate = () => {
        if (
            typeof onCreate === "function" &&
            !createDisabled
        ) {
            onCreate();
        }
    };

    // =====================================================
    // HANDLE REFRESH
    // =====================================================

    const handleRefresh = () => {
        if (
            typeof onRefresh === "function" &&
            !loading
        ) {
            onRefresh();
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 3
            }}
        >
            {/* ============================================= */}
            {/* TITLE AND DESCRIPTION */}
            {/* ============================================= */}

            <Box sx={{ flex: "1 1 250px" }}>
                <Typography
                    variant="h5"
                    component="h1"
                    fontWeight={700}
                >
                    {title}
                </Typography>

                {subtitle && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>

            {/* ============================================= */}
            {/* TOOLBAR ACTIONS */}
            {/* ============================================= */}

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1
                }}
            >
                {showRefreshButton && (
                    <Tooltip title="Refresh vendor items">
                        <span>
                            <Button
                                variant="outlined"
                                startIcon={<Refresh />}
                                onClick={handleRefresh}
                                disabled={loading}
                            >
                                Refresh
                            </Button>
                        </span>
                    </Tooltip>
                )}

                {showCreateButton && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                        disabled={createDisabled || loading}
                    >
                        {createLabel}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default VendorItemMasterToolbar;

