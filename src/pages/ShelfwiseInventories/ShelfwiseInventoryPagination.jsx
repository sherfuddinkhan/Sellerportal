import React from "react";

import {
    Box,
    TablePagination,
    Typography
} from "@mui/material";

/* =========================================================
   SHELFWISE INVENTORY PAGINATION
========================================================= */

const ShelfwiseInventoryPagination = ({
    page = 0,
    rowsPerPage = 10,
    totalRecords = 0,
    count,
    onPageChange,
    onRowsPerPageChange,
    loading = false
}) => {

    /* =====================================================
       NORMALIZE TOTAL RECORDS
    ===================================================== */

    const total = Math.max(
        0,
        Number(count ?? totalRecords) || 0
    );

    /* =====================================================
       NORMALIZE PAGE
    ===================================================== */

    const currentPage = Math.max(
        0,
        Number(page) || 0
    );

    /* =====================================================
       NORMALIZE ROWS PER PAGE
    ===================================================== */

    const currentRowsPerPage = Math.max(
        1,
        Number(rowsPerPage) || 10
    );

    /* =====================================================
       HANDLE PAGE CHANGE
    ===================================================== */

    const handlePageChange = (event, newPage) => {
        if (loading || !onPageChange) {
            return;
        }

        onPageChange(newPage);
    };

    /* =====================================================
       HANDLE ROWS PER PAGE CHANGE
    ===================================================== */

    const handleRowsPerPageChange = (event) => {
        if (loading || !onRowsPerPageChange) {
            return;
        }

        const newRowsPerPage = Number(event.target.value);

        onRowsPerPageChange(newRowsPerPage);

        // Reset to the first page when page size changes.
        if (onPageChange) {
            onPageChange(0);
        }
    };

    /* =====================================================
       DISPLAY RANGE
    ===================================================== */

    const startRecord =
        total === 0
            ? 0
            : currentPage * currentRowsPerPage + 1;

    const endRecord =
        total === 0
            ? 0
            : Math.min(
                (currentPage + 1) * currentRowsPerPage,
                total
            );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
                width: "100%",
                borderTop: 1,
                borderColor: "divider",
                mt: 2
            }}
        >
            {/* RECORD SUMMARY */}

            <Box
                sx={{
                    pl: 2,
                    py: 1,
                    minWidth: 150
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Showing {startRecord}–{endRecord} of {total} records
                </Typography>
            </Box>

            {/* PAGINATION CONTROLS */}

            <TablePagination
                component="div"
                count={total}
                page={
                    total === 0
                        ? 0
                        : Math.min(
                            currentPage,
                            Math.max(
                                0,
                                Math.ceil(total / currentRowsPerPage) - 1
                            )
                        )
                }
                rowsPerPage={currentRowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} of ${
                        count !== -1 ? count : `more than ${to}`
                    }`
                }
                disabled={loading}
                sx={{
                    "& .MuiTablePagination-toolbar": {
                        minHeight: 56,
                        flexWrap: "wrap"
                    },
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                        fontSize: "0.875rem"
                    }
                }}
            />
        </Box>
    );
};

export default ShelfwiseInventoryPagination;

