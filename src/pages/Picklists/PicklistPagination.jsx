
// PicklistPagination.jsx

import React from "react";

import {
    Box,
    TablePagination,
    Typography
} from "@mui/material";

/* =========================================================
   PICKLIST PAGINATION
========================================================= */

const PicklistPagination = ({
    page = 0,
    count,
    totalCount,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50, 100],
    disabled = false,
    showRecordSummary = true
}) => {
    const totalRecords =
        Number.isFinite(Number(count))
            ? Math.max(0, Number(count))
            : Number.isFinite(Number(totalCount))
                ? Math.max(0, Number(totalCount))
                : 0;

    const safeRowsPerPage =
        Number.isFinite(Number(rowsPerPage)) &&
        Number(rowsPerPage) > 0
            ? Number(rowsPerPage)
            : 10;

    const lastPage = Math.max(
        0,
        Math.ceil(totalRecords / safeRowsPerPage) - 1
    );

    const safePage = Math.min(
        Math.max(0, Number(page) || 0),
        lastPage
    );

    const firstRecord =
        totalRecords === 0
            ? 0
            : safePage * safeRowsPerPage + 1;

    const lastRecord = Math.min(
        (safePage + 1) * safeRowsPerPage,
        totalRecords
    );

    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange = (event, newPage) => {
        if (
            typeof onPageChange === "function" &&
            !disabled
        ) {
            onPageChange(event, newPage);
        }
    };

    /* =====================================================
       ROWS PER PAGE CHANGE
    ===================================================== */

    const handleRowsPerPageChange = (event) => {
        if (
            typeof onRowsPerPageChange === "function" &&
            !disabled
        ) {
            onRowsPerPageChange(event);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: {
                    xs: "stretch",
                    sm: "center"
                },
                justifyContent: "space-between",
                flexDirection: {
                    xs: "column",
                    sm: "row"
                },
                gap: 1,
                px: {
                    xs: 1,
                    sm: 2
                },
                py: 1,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                boxSizing: "border-box"
            }}
        >
            {/* RECORD SUMMARY */}

            {showRecordSummary && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        px: 1,
                        whiteSpace: "nowrap"
                    }}
                >
                    {totalRecords === 0
                        ? "No records"
                        : `Showing ${firstRecord}–${lastRecord} of ${totalRecords} picklists`}
                </Typography>
            )}

            {/* PAGINATION CONTROLS */}

            <TablePagination
                component="div"
                count={totalRecords}
                page={safePage}
                rowsPerPage={safeRowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
                disabled={disabled}
                labelRowsPerPage="Rows:"
                labelDisplayedRows={({ from, to, count: total }) =>
                    `${from}–${to} of ${total !== -1 ? total : `more than ${to}`}`
                }
                sx={{
                    "& .MuiTablePagination-toolbar": {
                        minHeight: 48,
                        px: 1,
                        flexWrap: "wrap",
                        justifyContent: {
                            xs: "center",
                            sm: "flex-end"
                        },
                        gap: 0.5
                    },
                    "& .MuiTablePagination-selectLabel": {
                        mb: 0
                    },
                    "& .MuiTablePagination-displayedRows": {
                        mb: 0
                    },
                    "& .MuiTablePagination-actions": {
                        ml: 1
                    },
                    "& .MuiTablePagination-select": {
                        py: 0.5
                    }
                }}
            />
        </Box>
    );
};

export default PicklistPagination;

