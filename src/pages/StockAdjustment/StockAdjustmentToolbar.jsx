// =========================================================
// StockAdjustmentToolbar.jsx
// Stock Adjustment Toolbar
// =========================================================

import React from "react";

import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material";

import {
    Add,
    Refresh,
    Search,
    FilterList,
    Assessment
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentToolbar = ({
    onRefresh,
    onSearch,
    onFilter,
    onStatistics,
    loading = false
}) => {

    const navigate = useNavigate();

    // =========================================================
    // CREATE
    // =========================================================

    const handleCreate = () => {

        navigate("/stock-adjustments/create");
    };

    // =========================================================
    // REFRESH
    // =========================================================

    const handleRefresh = () => {

        if (loading) {
            return;
        }

        if (onRefresh) {
            onRefresh();
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = () => {

        if (onSearch) {
            onSearch();
        } else {
            navigate("/stock-adjustments/search");
        }
    };

    // =========================================================
    // FILTER
    // =========================================================

    const handleFilter = () => {

        if (onFilter) {
            onFilter();
        }
    };

    // =========================================================
    // STATISTICS
    // =========================================================

    const handleStatistics = () => {

        if (onStatistics) {
            onStatistics();
        } else {
            navigate("/stock-adjustments/statistics");
        }
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                mb: 2,
                flexWrap: "wrap"
            }}
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Box>

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Stock Adjustments
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 0.5
                    }}
                >
                    Manage inventory stock adjustments
                </Typography>

            </Box>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap"
                }}
            >

                {/* CREATE */}

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Add Adjustment
                </Button>


                {/* SEARCH */}

                <Tooltip title="Search Stock Adjustments">

                    <IconButton
                        color="primary"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        <Search />
                    </IconButton>

                </Tooltip>


                {/* FILTER */}

                <Tooltip title="Filter Stock Adjustments">

                    <IconButton
                        color="primary"
                        onClick={handleFilter}
                        disabled={loading}
                    >
                        <FilterList />
                    </IconButton>

                </Tooltip>


                {/* STATISTICS */}

                <Tooltip title="Stock Adjustment Statistics">

                    <IconButton
                        color="primary"
                        onClick={handleStatistics}
                        disabled={loading}
                    >
                        <Assessment />
                    </IconButton>

                </Tooltip>


                {/* REFRESH */}

                <Tooltip title="Refresh">

                    <span>

                        <IconButton
                            color="primary"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <Refresh />
                        </IconButton>

                    </span>

                </Tooltip>

            </Box>

        </Box>
    );
};

export default StockAdjustmentToolbar;