// =========================================================
// WishlistToolbar.jsx
// =========================================================

import React from "react";

import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Divider,
    Badge,
} from "@mui/material";

import {
    Favorite,
    Refresh,
    Add,
    DeleteSweep,
    DoneAll,
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const WishlistToolbar = ({
    totalItems = 0,
    selectedCount = 0,
    onRefresh,
    onAdd,
    onRemoveSelected,
    onClearAll,
    loading = false,
}) => {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                {/* =====================================================
                    LEFT SIDE
                   ===================================================== */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <Badge
                        badgeContent={totalItems}
                        color="error"
                    >
                        <Favorite color="error" />
                    </Badge>

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Wishlist
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {totalItems === 0
                                ? "No wishlist items"
                                : `${totalItems} item${
                                      totalItems === 1
                                          ? ""
                                          : "s"
                                  } in wishlist`}
                        </Typography>
                    </Box>
                </Box>

                {/* =====================================================
                    RIGHT SIDE
                   ===================================================== */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        flexWrap: "wrap",
                    }}
                >
                    {/* REFRESH */}

                    <Tooltip title="Refresh Wishlist">
                        <span>
                            <IconButton
                                onClick={onRefresh}
                                disabled={loading}
                            >
                                <Refresh />
                            </IconButton>
                        </span>
                    </Tooltip>

                    {/* ADD */}

                    {onAdd && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={onAdd}
                        >
                            Add to Wishlist
                        </Button>
                    )}

                    {/* SELECTED ACTIONS */}

                    {selectedCount > 0 && (
                        <>
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ mx: 0.5 }}
                            />

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteSweep />}
                                onClick={onRemoveSelected}
                            >
                                Remove Selected (
                                {selectedCount})
                            </Button>
                        </>
                    )}

                    {/* CLEAR ALL */}

                    {totalItems > 0 && (
                        <Tooltip title="Clear all wishlist items">
                            <span>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteSweep />}
                                    onClick={onClearAll}
                                    disabled={loading}
                                >
                                    Clear All
                                </Button>
                            </span>
                        </Tooltip>
                    )}
                </Box>
            </Box>

            {/* =========================================================
                SELECTED INFORMATION
               ========================================================= */}

            {selectedCount > 0 && (
                <>
                    <Divider sx={{ my: 2 }} />

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <DoneAll color="primary" />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {selectedCount} item
                            {selectedCount === 1
                                ? ""
                                : "s"} selected
                        </Typography>
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default WishlistToolbar;