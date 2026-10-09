import React from "react";

import {
Box,
TablePagination,
Typography
} from "@mui/material";

/* =========================================================
INVOICE TAX DETAIL PAGINATION
========================================================= */

const InvoiceTaxDetailPagination = ({
page = 0,
rowsPerPage = 10,
totalCount = 0,
onPageChange,
onRowsPerPageChange,
rowsPerPageOptions = [5, 10, 25, 50, 100]
}) => {
const safeTotalCount = Math.max(
0,
Number(totalCount) || 0
);
const safeRowsPerPage = Math.max(
    1,
    Number(rowsPerPage) || 10
);

const totalPages = Math.ceil(
    safeTotalCount / safeRowsPerPage
);

const safePage = Math.min(
    Math.max(0, Number(page) || 0),
    Math.max(0, totalPages - 1)
);

/* =====================================================
   PAGE CHANGE
===================================================== */

const handlePageChange = (event, newPage) => {
    if (onPageChange) {
        onPageChange(event, newPage);
    }
};

/* =====================================================
   ROWS PER PAGE CHANGE
===================================================== */

const handleRowsPerPageChange = (event) => {
    if (onRowsPerPageChange) {
        onRowsPerPageChange(event);
    }
};

/* =====================================================
   DISPLAY RANGE
===================================================== */

const startRecord = safeTotalCount === 0
    ? 0
    : safePage * safeRowsPerPage + 1;

const endRecord = Math.min(
    (safePage + 1) * safeRowsPerPage,
    safeTotalCount
);

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
        sx={{
            width: "100%",
            borderTop: 1,
            borderColor: "divider",
            mt: 1
        }}
    >
        <Typography
            variant="body2"
            color="text.secondary"
            sx={{
                pl: 2,
                py: 1,
                whiteSpace: "nowrap"
            }}
        >
            Showing {startRecord}–{endRecord} of{" "}
            {safeTotalCount} invoice tax details
        </Typography>

        <TablePagination
            component="div"
            count={safeTotalCount}
            page={safePage}
            rowsPerPage={safeRowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={rowsPerPageOptions}
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
                    flexWrap: "wrap",
                    minHeight: 52,
                    px: 1
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                        mb: 0,
                        fontSize: "0.875rem"
                    }
            }}
        />
    </Box>
);
};

export default InvoiceTaxDetailPagination;
