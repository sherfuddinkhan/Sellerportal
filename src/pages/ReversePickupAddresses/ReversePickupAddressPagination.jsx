import React from "react";

import {
    Box,
    TablePagination,
    Typography
} from "@mui/material";

/* =========================================================
   REVERSE PICKUP ADDRESS PAGINATION
========================================================= */

const ReversePickupAddressPagination = ({
    page = 0,
    rowsPerPage = 10,
    totalCount = 0,

    onPageChange,
    onRowsPerPageChange,

    loading = false,

    rowsPerPageOptions = [5, 10, 25, 50, 100],

    showFirstButton = true,
    showLastButton = true,

    component = "div"
}) => {

    /* =====================================================
       NORMALIZE VALUES
    ===================================================== */

    const safePage = Math.max(
        0,
        Number.isFinite(Number(page))
            ? Number(page)
            : 0
    );

    const safeRowsPerPage = Math.max(
        1,
        Number.isFinite(Number(rowsPerPage))
            ? Number(rowsPerPage)
            : 10
    );

    const safeTotalCount = Math.max(
        0,
        Number.isFinite(Number(totalCount))
            ? Number(totalCount)
            : 0
    );

    /* =====================================================
       CALCULATE PAGE COUNT
    ===================================================== */

    const pageCount = Math.ceil(
        safeTotalCount / safeRowsPerPage
    );

    const lastValidPage = Math.max(0, pageCount - 1);

    const currentPage = Math.min(
        safePage,
        lastValidPage
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

        const value = Number(event.target.value);

        if (!Number.isFinite(value) || value <= 0) {
            return;
        }

        onRowsPerPageChange(value);

        // Reset to the first page when page size changes.
        if (onPageChange) {
            onPageChange(0);
        }
    };

    /* =====================================================
       DISPLAY RANGE
    ===================================================== */

    const from = safeTotalCount === 0
        ? 0
        : currentPage * safeRowsPerPage + 1;

    const to = safeTotalCount === 0
        ? 0
        : Math.min(
            (currentPage + 1) * safeRowsPerPage,
            safeTotalCount
        );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: {
                    xs: "column",
                    sm: "row"
                },
                alignItems: {
                    xs: "stretch",
                    sm: "center"
                },
                justifyContent: "space-between",
                gap: 1,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper"
            }}
        >
            {/* RECORD SUMMARY */}

            <Box
                sx={{
                    px: 2,
                    py: 1,
                    minWidth: 150
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Showing{" "}
                    <strong>{from}</strong>
                    {" - "}
                    <strong>{to}</strong>
                    {" of "}
                    <strong>{safeTotalCount}</strong>
                    {" addresses"}
                </Typography>
            </Box>

            {/* PAGINATION CONTROLS */}

            <TablePagination
                component={component}
                count={safeTotalCount}
                page={currentPage}
                rowsPerPage={safeRowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
                disabled={loading}
                showFirstButton={showFirstButton}
                showLastButton={showLastButton}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} of ${
                        count !== -1
                            ? count
                            : `more than ${to}`
                    }`
                }
                slotProps={{
                    select: {
                        disabled: loading
                    },
                    actions: {
                        nextButton: {
                            disabled:
                                loading ||
                                currentPage >= lastValidPage
                        },
                        previousButton: {
                            disabled:
                                loading ||
                                currentPage <= 0
                        },
                        firstButton: {
                            disabled:
                                loading ||
                                currentPage <= 0
                        },
                        lastButton: {
                            disabled:
                                loading ||
                                currentPage >= lastValidPage
                        }
                    }
                }}
                sx={{
                    border: 0,
                    overflow: "hidden",

                    "& .MuiTablePagination-toolbar": {
                        minHeight: 56,
                        flexWrap: "wrap",
                        justifyContent: {
                            xs: "center",
                            sm: "flex-end"
                        }
                    },

                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                        fontSize: "0.875rem"
                    }
                }}
            />
        </Box>
    );
};

export default ReversePickupAddressPagination;

