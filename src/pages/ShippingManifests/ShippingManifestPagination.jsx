import React from "react";

import {
    Box,
    Paper,
    TablePagination,
    Typography
} from "@mui/material";

/* =========================================================
   SHIPPING MANIFEST PAGINATION
========================================================= */

const ShippingManifestPagination = ({
    count = 0,
    totalRecords,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    loading = false,
    rowsPerPageOptions = [5, 10, 25, 50, 100]
}) => {

    /* =====================================================
       NORMALIZE PROPS
    ===================================================== */

    const totalCount = Math.max(
        0,
        Number(totalRecords ?? count) || 0
    );

    const currentPage = Math.max(
        0,
        Number(page) || 0
    );

    const pageSize = Math.max(
        1,
        Number(rowsPerPage) || 10
    );

    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange = (event, newPage) => {
        if (loading || typeof onPageChange !== "function") {
            return;
        }

        onPageChange(event, newPage);
    };

    /* =====================================================
       ROWS PER PAGE CHANGE
    ===================================================== */

    const handleRowsPerPageChange = (event) => {
        if (
            loading ||
            typeof onRowsPerPageChange !== "function"
        ) {
            return;
        }

        onRowsPerPageChange(event);
    };

    /* =====================================================
       DISPLAY RANGE
    ===================================================== */

    const startRecord =
        totalCount === 0
            ? 0
            : currentPage * pageSize + 1;

    const endRecord =
        totalCount === 0
            ? 0
            : Math.min(
                (currentPage + 1) * pageSize,
                totalCount
            );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                    px: 2,
                    py: 0.5
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        minWidth: 150
                    }}
                >
                    {loading
                        ? "Loading shipping manifests..."
                        : totalCount === 0
                            ? "No shipping manifests found"
                            : `Showing ${startRecord}–${endRecord} of ${totalCount} shipping manifests`}
                </Typography>

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
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={
                        handleRowsPerPageChange
                    }
                    rowsPerPageOptions={rowsPerPageOptions}
                    disabled={loading}
                    labelRowsPerPage="Rows per page:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}–${to} of ${
                            count !== -1 ? count : `more than ${to}`
                        }`
                    }
                    sx={{
                        border: 0,

                        "& .MuiTablePagination-toolbar": {
                            minHeight: 52,
                            px: 0
                        },

                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                            fontSize: "0.8rem"
                        }
                    }}
                />
            </Box>
        </Paper>
    );
};

export default ShippingManifestPagination;

