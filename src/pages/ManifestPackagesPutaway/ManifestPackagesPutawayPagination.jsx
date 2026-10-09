import React from "react";

import {
    Box,
    Paper,
    TablePagination,
    Typography
} from "@mui/material";

/* =========================================================
   MANIFEST PACKAGES PUTAWAY PAGINATION
========================================================= */

const ManifestPackagesPutawayPagination = ({
    page = 0,
    rowsPerPage = 10,
    totalRecords = 0,

    onPageChange,
    onRowsPerPageChange,

    loading = false,

    rowsPerPageOptions = [5, 10, 25, 50, 100],

    showSummary = true,
    component = "div"
}) => {
    /* -----------------------------------------------------
       NORMALIZE VALUES
    ----------------------------------------------------- */

    const safeTotalRecords = Math.max(
        0,
        Number.isFinite(Number(totalRecords))
            ? Number(totalRecords)
            : 0
    );

    const safeRowsPerPage = Math.max(
        1,
        Number.isFinite(Number(rowsPerPage))
            ? Number(rowsPerPage)
            : 10
    );

    const totalPages = Math.ceil(
        safeTotalRecords / safeRowsPerPage
    );

    const safePage = Math.max(
        0,
        Math.min(
            Number.isFinite(Number(page)) ? Number(page) : 0,
            Math.max(0, totalPages - 1)
        )
    );

    /* -----------------------------------------------------
       HANDLE PAGE CHANGE
    ----------------------------------------------------- */

    const handlePageChange = (_, newPage) => {
        if (
            typeof onPageChange === "function" &&
            !loading
        ) {
            onPageChange(newPage);
        }
    };

    /* -----------------------------------------------------
       HANDLE ROWS PER PAGE CHANGE
    ----------------------------------------------------- */

    const handleRowsPerPageChange = (event) => {
        const newRowsPerPage = Number(event.target.value);

        if (
            typeof onRowsPerPageChange === "function" &&
            Number.isFinite(newRowsPerPage) &&
            newRowsPerPage > 0 &&
            !loading
        ) {
            onRowsPerPageChange(newRowsPerPage);
        }

        if (typeof onPageChange === "function") {
            onPageChange(0);
        }
    };

    /* -----------------------------------------------------
       SUMMARY RANGE
    ----------------------------------------------------- */

    const startRecord =
        safeTotalRecords === 0
            ? 0
            : safePage * safeRowsPerPage + 1;

    const endRecord = Math.min(
        (safePage + 1) * safeRowsPerPage,
        safeTotalRecords
    );

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Paper
            elevation={1}
            sx={{
                width: "100%",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    px: 2,
                    py: 0.5,
                    flexWrap: "wrap"
                }}
            >
                {/* RECORD SUMMARY */}

                {showSummary && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            pl: 1,
                            py: 1
                        }}
                    >
                        Showing{" "}
                        <strong>{startRecord}</strong>
                        {" - "}
                        <strong>{endRecord}</strong>
                        {" of "}
                        <strong>
                            {safeTotalRecords.toLocaleString("en-IN")}
                        </strong>
                        {" putaway records"}
                    </Typography>
                )}

                {/* PAGINATION CONTROLS */}

                <TablePagination
                    component={component}
                    count={safeTotalRecords}
                    page={safePage}
                    rowsPerPage={safeRowsPerPage}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={rowsPerPageOptions}
                    disabled={loading}
                    showFirstButton
                    showLastButton
                    labelRowsPerPage="Rows per page:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} of ${
                            count === -1
                                ? `more than ${to}`
                                : count
                        }`
                    }
                    sx={{
                        flexShrink: 0,
                        ".MuiTablePagination-toolbar": {
                            minHeight: 52,
                            flexWrap: "wrap",
                            justifyContent: "flex-end"
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
        </Paper>
    );
};

export default ManifestPackagesPutawayPagination;

