import React, { useCallback } from "react";

import {
    Box,
    TablePagination,
    Typography
} from "@mui/material";

/* =========================================================
   REVERSE PICKUP ITEM PAGINATION
========================================================= */

const ReversePickupItemPagination = ({
    count = 0,
    totalCount,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    loading = false,
    rowsPerPageOptions = [5, 10, 25, 50, 100],
    showFirstButton = true,
    showLastButton = true,
    labelRowsPerPage = "Rows per page:",
    emptyLabel = "No reverse pickup items found",
    showSummary = true
}) => {
    /* =====================================================
       NORMALIZE VALUES
    ===================================================== */

    const total = Math.max(
        0,
        Number(
            totalCount !== undefined
                ? totalCount
                : count
        ) || 0
    );

    const safeRowsPerPage = Math.max(
        1,
        Number(rowsPerPage) || 10
    );

    const lastPage = Math.max(
        0,
        Math.ceil(total / safeRowsPerPage) - 1
    );

    const safePage = Math.min(
        Math.max(0, Number(page) || 0),
        lastPage
    );

    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange = useCallback(
        (event, newPage) => {
            if (
                loading ||
                typeof onPageChange !== "function"
            ) {
                return;
            }

            onPageChange(event, newPage);
        },
        [loading, onPageChange]
    );

    /* =====================================================
       ROWS PER PAGE CHANGE
    ===================================================== */

    const handleRowsPerPageChange = useCallback(
        (event) => {
            if (
                loading ||
                typeof onRowsPerPageChange !== "function"
            ) {
                return;
            }

            onRowsPerPageChange(event);
        },
        [loading, onRowsPerPageChange]
    );

    /* =====================================================
       SUMMARY
    ===================================================== */

    const startRecord =
        total === 0
            ? 0
            : safePage * safeRowsPerPage + 1;

    const endRecord =
        total === 0
            ? 0
            : Math.min(
                (safePage + 1) * safeRowsPerPage,
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
                mt: 1,
                borderTop: 1,
                borderColor: "divider",
                backgroundColor: "background.paper",
                borderRadius: 1
            }}
        >
            {/* RECORD SUMMARY */}

            {showSummary && (
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        minWidth: 180
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {total === 0
                            ? emptyLabel
                            : `Showing ${startRecord}-${endRecord} of ${total} items`}
                    </Typography>
                </Box>
            )}

            {/* PAGINATION CONTROLS */}

            <TablePagination
                component="div"
                count={total}
                page={safePage}
                rowsPerPage={safeRowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
                labelRowsPerPage={labelRowsPerPage}
                showFirstButton={showFirstButton}
                showLastButton={showLastButton}
                disabled={loading}
                labelDisplayedRows={({ from, to, count: totalCountValue }) =>
                    totalCountValue === 0
                        ? "0-0 of 0"
                        : `${from}-${to} of ${totalCountValue}`
                }
                sx={{
                    overflow: "auto",
                    "& .MuiTablePagination-toolbar": {
                        minHeight: 56,
                        px: 2
                    },
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                        fontSize: "0.875rem"
                    }
                }}
            />
        </Box>
    );
};

export default ReversePickupItemPagination;

