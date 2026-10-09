import React from "react";

import {
    Box,
    TablePagination,
    Typography
} from "@mui/material";

/* =========================================================
   SUPPLIER ADDRESS PAGINATION
========================================================= */

const SupplierAddressPagination = ({
    count = 0,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50],
    loading = false
}) => {

    /* =====================================================
       SAFE VALUES
    ===================================================== */

    const totalCount = Math.max(0, Number(count) || 0);

    const currentPage = Math.max(0, Number(page) || 0);

    const pageSize = Math.max(1, Number(rowsPerPage) || 10);

    /* =====================================================
       HANDLE PAGE CHANGE
    ===================================================== */

    const handlePageChange = (event, newPage) => {
        if (loading) return;

        onPageChange?.(event, newPage);
    };

    /* =====================================================
       HANDLE ROWS PER PAGE CHANGE
    ===================================================== */

    const handleRowsPerPageChange = (event) => {
        if (loading) return;

        onRowsPerPageChange?.(event);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={1}
            mt={2}
            px={1}
        >
            {/* =============================================
               RECORD COUNT
            ============================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Supplier Addresses: {totalCount.toLocaleString("en-IN")}
            </Typography>

            {/* =============================================
               PAGINATION CONTROLS
            ============================================= */}

            <TablePagination
                component="div"
                count={totalCount}
                page={
                    totalCount === 0
                        ? 0
                        : Math.min(
                            currentPage,
                            Math.max(
                                0,
                                Math.ceil(totalCount / pageSize) - 1
                            )
                        )
                }
                rowsPerPage={pageSize}
                rowsPerPageOptions={rowsPerPageOptions}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                disabled={loading}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count: total }) =>
                    `${from}–${to} of ${
                        total !== -1
                            ? total.toLocaleString("en-IN")
                            : "more than " + to
                    }`
                }
                sx={{
                    ".MuiTablePagination-toolbar": {
                        minHeight: 52,
                        pl: 0
                    },
                    ".MuiTablePagination-selectLabel": {
                        mb: 0
                    },
                    ".MuiTablePagination-displayedRows": {
                        mb: 0
                    }
                }}
            />
        </Box>
    );
};

export default SupplierAddressPagination;

