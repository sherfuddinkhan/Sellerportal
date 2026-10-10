
// =========================================================
// VendorItemMasterPagination.jsx
// =========================================================

import React from "react";

import {
    Box,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography
} from "@mui/material";

// =========================================================
// VENDOR ITEM MASTER PAGINATION
// =========================================================

const VendorItemMasterPagination = ({
    page = 1,
    rowsPerPage = 10,
    totalItems = 0,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50],
    loading = false
}) => {

    // =====================================================
    // CALCULATE TOTAL PAGES
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            Number(totalItems) / Number(rowsPerPage)
        )
    );

    // =====================================================
    // HANDLE PAGE CHANGE
    // =====================================================

    const handlePageChange = (event, newPage) => {
        if (typeof onPageChange === "function") {
            onPageChange(newPage);
        }
    };

    // =====================================================
    // HANDLE ROWS PER PAGE CHANGE
    // =====================================================

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = Number(event.target.value);

        if (typeof onRowsPerPageChange === "function") {
            onRowsPerPageChange(newRowsPerPage);
        }

        // Reset to first page when page size changes.
        if (typeof onPageChange === "function") {
            onPageChange(1);
        }
    };

    // =====================================================
    // DISPLAY RANGE
    // =====================================================

    const startItem =
        totalItems === 0
            ? 0
            : (page - 1) * rowsPerPage + 1;

    const endItem = Math.min(
        page * rowsPerPage,
        totalItems
    );

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
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper"
            }}
        >
            {/* ============================================= */}
            {/* RECORD RANGE */}
            {/* ============================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Showing {startItem}–{endItem} of {totalItems} items
            </Typography>

            {/* ============================================= */}
            {/* ROWS PER PAGE */}
            {/* ============================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Rows per page:
                </Typography>

                <FormControl
                    size="small"
                    sx={{ minWidth: 85 }}
                >
                    <InputLabel id="vendor-item-rows-label">
                        Rows
                    </InputLabel>

                    <Select
                        labelId="vendor-item-rows-label"
                        value={rowsPerPage}
                        label="Rows"
                        disabled={loading}
                        onChange={handleRowsPerPageChange}
                    >
                        {rowsPerPageOptions.map((option) => (
                            <MenuItem
                                key={option}
                                value={option}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* ============================================= */}
            {/* PAGE NAVIGATION */}
            {/* ============================================= */}

            <Pagination
                count={totalPages}
                page={Math.min(Math.max(1, page), totalPages)}
                onChange={handlePageChange}
                disabled={loading || totalItems === 0}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
                size="medium"
            />
        </Box>
    );
};

export default VendorItemMasterPagination;

