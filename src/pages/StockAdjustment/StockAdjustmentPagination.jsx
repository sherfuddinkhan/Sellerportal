// =========================================================
// StockAdjustmentPagination.jsx
// Stock Adjustment Pagination
// =========================================================

import React from "react";

import {
    Box,
    Pagination,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentPagination = ({
    page = 1,
    totalPages = 1,
    totalItems = 0,
    limit = 15,
    onPageChange,
    onLimitChange,
    loading = false
}) => {

    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (event, value) => {

        if (loading) {
            return;
        }

        if (onPageChange) {
            onPageChange(value);
        }
    };

    // =========================================================
    // LIMIT CHANGE
    // =========================================================

    const handleLimitChange = (event) => {

        const newLimit = Number(event.target.value);

        if (onLimitChange) {
            onLimitChange(newLimit);
        }
    };

    // =========================================================
    // SAFE VALUES
    // =========================================================

    const safePage = Math.max(1, Number(page) || 1);

    const safeTotalPages = Math.max(
        1,
        Number(totalPages) || 1
    );

    const safeTotalItems = Math.max(
        0,
        Number(totalItems) || 0
    );

    const safeLimit = Math.max(
        1,
        Number(limit) || 15
    );

    // =========================================================
    // ITEM RANGE
    // =========================================================

    const startItem =
        safeTotalItems === 0
            ? 0
            : (safePage - 1) * safeLimit + 1;

    const endItem =
        safeTotalItems === 0
            ? 0
            : Math.min(
                safePage * safeLimit,
                safeTotalItems
            );

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
                flexWrap: "wrap",
                mt: 2,
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider"
            }}
        >

            {/* =================================================
                ITEMS INFORMATION
            ================================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                {safeTotalItems === 0
                    ? "No records found"
                    : `Showing ${startItem}-${endItem} of ${safeTotalItems} records`
                }
            </Typography>


            {/* =================================================
                PAGINATION
            ================================================= */}

            <Pagination
                count={safeTotalPages}
                page={Math.min(
                    safePage,
                    safeTotalPages
                )}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                disabled={loading}
                showFirstButton
                showLastButton
            />


            {/* =================================================
                ITEMS PER PAGE
            ================================================= */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 120
                }}
            >

                <InputLabel id="stock-adjustment-limit-label">
                    Per Page
                </InputLabel>

                <Select
                    labelId="stock-adjustment-limit-label"
                    value={safeLimit}
                    label="Per Page"
                    onChange={handleLimitChange}
                    disabled={loading}
                >

                    <MenuItem value={10}>
                        10
                    </MenuItem>

                    <MenuItem value={15}>
                        15
                    </MenuItem>

                    <MenuItem value={25}>
                        25
                    </MenuItem>

                    <MenuItem value={50}>
                        50
                    </MenuItem>

                    <MenuItem value={100}>
                        100
                    </MenuItem>

                </Select>

            </FormControl>

        </Box>
    );
};

export default StockAdjustmentPagination;