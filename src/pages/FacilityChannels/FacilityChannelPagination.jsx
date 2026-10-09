import React from "react";

import {
    Box,
    TablePagination,
    Typography
} from "@mui/material";

/* =========================================================
   FACILITY CHANNEL PAGINATION
========================================================= */

const FacilityChannelPagination = ({
    count = 0,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    loading = false,
    rowsPerPageOptions = [5, 10, 25, 50, 100]
}) => {

    /* =====================================================
       HANDLE PAGE CHANGE
    ===================================================== */

    const handlePageChange = (event, newPage) => {

        if (typeof onPageChange === "function") {
            onPageChange(newPage);
        }

    };

    /* =====================================================
       HANDLE ROWS PER PAGE CHANGE
    ===================================================== */

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

    /* =====================================================
       NORMALIZE PAGINATION VALUES
    ===================================================== */

    const safeCount = Math.max(0, Number(count) || 0);

    const safeRowsPerPage = Math.max(
        1,
        Number(rowsPerPage) || 10
    );

    const safePage = Math.max(
        0,
        Math.min(
            Number(page) || 0,
            Math.max(
                0,
                Math.ceil(safeCount / safeRowsPerPage) - 1
            )
        )
    );

    /* =====================================================
       DISPLAY RANGE
    ===================================================== */

    const startRecord =
        safeCount === 0
            ? 0
            : safePage * safeRowsPerPage + 1;

    const endRecord =
        safeCount === 0
            ? 0
            : Math.min(
                (safePage + 1) * safeRowsPerPage,
                safeCount
            );

    /* =====================================================
       RENDER COMPONENT
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                mt: 1,
                borderTop: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper"
            }}
        >

            {/* =================================================
                PAGINATION SUMMARY
            ================================================= */}

            <Box
                sx={{
                    px: 2,
                    pt: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1
                }}
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {loading
                        ? "Loading facility channels..."
                        : `Showing ${startRecord}–${endRecord} of ${safeCount} facility channels`}
                </Typography>

            </Box>

            {/* =================================================
                PAGINATION CONTROLS
            ================================================= */}

            <TablePagination
                component="div"
                count={safeCount}
                page={safePage}
                rowsPerPage={safeRowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                disabled={loading}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count: total }) =>
                    `${from}–${to} of ${
                        total !== -1
                            ? total
                            : `more than ${to}`
                    }`
                }
                sx={{
                    borderTop: "none",

                    "& .MuiTablePagination-toolbar": {
                        minHeight: 56,
                        px: 2,
                        flexWrap: "wrap"
                    },

                    "& .MuiTablePagination-selectLabel": {
                        mb: 0
                    },

                    "& .MuiTablePagination-displayedRows": {
                        mb: 0
                    },

                    "& .MuiTablePagination-actions": {
                        ml: 1
                    }
                }}
            />

        </Box>
    );

};

export default FacilityChannelPagination;

