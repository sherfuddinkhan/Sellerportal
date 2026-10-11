// =========================================================
// GatepassPagination.jsx
// =========================================================

import React from "react";

import {
    TablePagination,
    Box,
    Typography
} from "@mui/material";

// =========================================================
// GATEPASS PAGINATION
// =========================================================

const GatepassPagination = ({
    count = 0,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50, 100],
    disabled = false
}) => {

    // =====================================================
    // HANDLE PAGE CHANGE
    // Material UI page numbering starts at 0.
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
            onPageChange(0);
        }
    };

    // =====================================================
    // NORMALIZE VALUES
    // =====================================================

    const safeCount = Math.max(0, Number(count) || 0);
    const safePage = Math.max(0, Number(page) || 0);
    const safeRowsPerPage = Math.max(1, Number(rowsPerPage) || 10);

    const firstRecord =
        safeCount === 0
            ? 0
            : safePage * safeRowsPerPage + 1;

    const lastRecord = Math.min(
        (safePage + 1) * safeRowsPerPage,
        safeCount
    );

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
                borderTop: 1,
                borderColor: "divider",
                mt: 1
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    pl: { xs: 1, sm: 2 },
                    py: 1
                }}
            >
                Showing {firstRecord}–{lastRecord} of {safeCount} gatepasses
            </Typography>

            <TablePagination
                component="div"
                count={safeCount}
                page={safePage}
                rowsPerPage={safeRowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
                disabled={disabled}
                labelRowsPerPage="Rows:"
                labelDisplayedRows={({ from, to, count: total }) =>
                    `${from}–${to} of ${
                        total !== -1 ? total : `more than ${to}`
                    }`
                }
                sx={{
                    "& .MuiTablePagination-toolbar": {
                        minHeight: 56,
                        flexWrap: "wrap",
                        justifyContent: "flex-end"
                    },
                    "& .MuiTablePagination-selectLabel": {
                        mb: 0
                    },
                    "& .MuiTablePagination-displayedRows": {
                        mb: 0
                    }
                }}
            />
        </Box>
    );
};

export default GatepassPagination;

