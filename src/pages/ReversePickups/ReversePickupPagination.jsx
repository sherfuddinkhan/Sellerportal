// ReversePickupPagination.jsx

import React from "react";

import {
    Box,
    TablePagination,
    Typography
} from "@mui/material";

/* =========================================================
   REVERSE PICKUP PAGINATION
========================================================= */

const ReversePickupPagination = ({
    count = 0,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    loading = false,
    rowsPerPageOptions = [5, 10, 25, 50, 100],
    showSummary = true,
    totalRecords,
    filteredRecords,
    labelRowsPerPage = "Rows per page:",
    component = "div"
}) => {

    /* =====================================================
       NORMALIZE VALUES
    ===================================================== */

    const totalCount = Math.max(
        0,
        Number(
            filteredRecords ??
            count ??
            0
        ) || 0
    );

    const currentPage = Math.max(
        0,
        Number(page) || 0
    );

    const currentRowsPerPage = Math.max(
        1,
        Number(rowsPerPage) || 10
    );

    const overallCount = Math.max(
        0,
        Number(totalRecords ?? count ?? 0) || 0
    );

    /* =====================================================
       HANDLE PAGE CHANGE
    ===================================================== */

    const handlePageChange = (event, newPage) => {
        if (loading) return;

        if (typeof onPageChange === "function") {
            onPageChange(event, newPage);
        }
    };

    /* =====================================================
       HANDLE ROWS PER PAGE CHANGE
    ===================================================== */

    const handleRowsPerPageChange = (event) => {
        if (loading) return;

        if (typeof onRowsPerPageChange === "function") {
            onRowsPerPageChange(event);
        }
    };

    /* =====================================================
       SUMMARY RANGE
    ===================================================== */

    const startRecord =
        totalCount === 0
            ? 0
            : currentPage * currentRowsPerPage + 1;

    const endRecord =
        totalCount === 0
            ? 0
            : Math.min(
                (currentPage + 1) * currentRowsPerPage,
                totalCount
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
                px: {
                    xs: 1,
                    sm: 2
                },
                borderTop: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper"
            }}
        >
            {/* =============================================
                PAGINATION SUMMARY
            ============================================= */}

            {showSummary && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        py: 1,
                        minWidth: 0
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {totalCount === 0
                            ? "No reverse pickups to display"
                            : `Showing ${startRecord}-${endRecord} of ${totalCount} reverse pickups`}
                    </Typography>

                    {totalRecords !== undefined &&
                        filteredRecords !== undefined &&
                        overallCount !== totalCount && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {overallCount} total records
                                {" · "}
                                {totalCount} matching records
                            </Typography>
                        )}
                </Box>
            )}

            {/* =============================================
                TABLE PAGINATION
            ============================================= */}

            <TablePagination
                component={component}
                count={totalCount}
                page={
                    totalCount === 0
                        ? 0
                        : Math.min(
                            currentPage,
                            Math.max(
                                0,
                                Math.ceil(
                                    totalCount / currentRowsPerPage
                                ) - 1
                            )
                        )
                }
                rowsPerPage={currentRowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
                labelRowsPerPage={labelRowsPerPage}
                disabled={loading}
                sx={{
                    "& .MuiTablePagination-toolbar": {
                        minHeight: 52,
                        px: {
                            xs: 0,
                            sm: 1
                        },
                        flexWrap: "wrap"
                    },
                    "& .MuiTablePagination-selectLabel": {
                        mb: 0,
                        fontSize: "0.875rem"
                    },
                    "& .MuiTablePagination-displayedRows": {
                        mb: 0,
                        fontSize: "0.875rem"
                    },
                    "& .MuiTablePagination-actions": {
                        ml: 1
                    }
                }}
            />
        </Box>
    );
};

export default ReversePickupPagination;

