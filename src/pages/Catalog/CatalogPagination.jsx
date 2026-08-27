// =========================================================
// CatalogPagination.jsx
// =========================================================

import React from "react";

import {
    Box,
    TablePagination,
    Typography,
} from "@mui/material";

// =========================================================
// COMPONENT
// =========================================================

const CatalogPagination = ({
    count = 0,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50],
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid",
                borderColor: "divider",
                px: 2,
            }}
        >
            {/* =====================================================
                TOTAL RECORDS
               ===================================================== */}

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    display: {
                        xs: "none",
                        md: "block",
                    },
                }}
            >
                Total Products: {count}
            </Typography>

            {/* =====================================================
                PAGINATION
               ===================================================== */}

            <TablePagination
                component="div"
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={rowsPerPageOptions}
                labelRowsPerPage="Products per page"
                labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} of ${
                        count !== -1 ? count : `more than ${to}`
                    }`
                }
            />
        </Box>
    );
};

export default CatalogPagination;