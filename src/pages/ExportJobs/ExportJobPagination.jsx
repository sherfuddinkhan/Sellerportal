import React from "react";

import {
    Box,
    TablePagination
} from "@mui/material";

/* =========================================================
   EXPORT JOBS PAGINATION
========================================================= */

const ExportJobsPagination = ({
    count = 0,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50],
    disabled = false
}) => {

    /* =====================================================
       HANDLE PAGE CHANGE
    ===================================================== */

    const handlePageChange = (event, newPage) => {

        if (typeof onPageChange === "function") {
            onPageChange(event, newPage);
        }
    };

    /* =====================================================
       HANDLE ROWS PER PAGE CHANGE
    ===================================================== */

    const handleRowsPerPageChange = (event) => {

        const newRowsPerPage = Number(event.target.value);

        if (
            Number.isFinite(newRowsPerPage) &&
            newRowsPerPage > 0 &&
            typeof onRowsPerPageChange === "function"
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
                justifyContent: "flex-end",
                borderTop: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                overflowX: "auto"
            }}
        >
            <TablePagination
                component="div"
                count={Math.max(0, Number(count) || 0)}
                page={Math.max(0, Number(page) || 0)}
                rowsPerPage={Math.max(
                    1,
                    Number(rowsPerPage) || 10
                )}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
                disabled={disabled}
                labelRowsPerPage="Rows per page:"
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} of ${
                        count !== -1
                            ? count
                            : `more than ${to}`
                    }`
                }
                sx={{
                    "& .MuiTablePagination-toolbar": {
                        minHeight: 56,
                        px: 2
                    },
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                        fontSize: "0.875rem",
                        color: "text.secondary"
                    },
                    "& .MuiTablePagination-select": {
                        fontSize: "0.875rem"
                    }
                }}
            />
        </Box>
    );
};

export default ExportJobsPagination;

