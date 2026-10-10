
// =========================================================
// SupplierContactPagination.jsx
// =========================================================

import React from "react";

import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Typography
} from "@mui/material";

// =========================================================
// SUPPLIER CONTACT PAGINATION
// =========================================================

const SupplierContactPagination = ({
    page = 1,
    rowsPerPage = 10,
    totalItems = 0,
    onPageChange,
    onRowsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50, 100],
    loading = false
}) => {

    // =====================================================
    // NORMALIZE VALUES
    // =====================================================

    const safePage = Math.max(
        1,
        Number(page) || 1
    );

    const safeRowsPerPage = Math.max(
        1,
        Number(rowsPerPage) || 10
    );

    const safeTotalItems = Math.max(
        0,
        Number(totalItems) || 0
    );

    // =====================================================
    // TOTAL PAGES
    // =====================================================

    const totalPages = Math.max(
        1,
        Math.ceil(safeTotalItems / safeRowsPerPage)
    );

    // =====================================================
    // DISPLAY RANGE
    // =====================================================

    const startItem =
        safeTotalItems === 0
            ? 0
            : (safePage - 1) * safeRowsPerPage + 1;

    const endItem = Math.min(
        safePage * safeRowsPerPage,
        safeTotalItems
    );

    // =====================================================
    // HANDLE PAGE CHANGE
    // =====================================================

    const handlePageChange = (event, newPage) => {
        if (loading) return;

        if (typeof onPageChange === "function") {
            onPageChange(newPage);
        }
    };

    // =====================================================
    // HANDLE ROWS PER PAGE CHANGE
    // =====================================================

    const handleRowsPerPageChange = (event) => {
        if (loading) return;

        const newRowsPerPage = Number(event.target.value);

        if (
            !Number.isFinite(newRowsPerPage) ||
            newRowsPerPage <= 0
        ) {
            return;
        }

        if (typeof onRowsPerPageChange === "function") {
            onRowsPerPageChange(newRowsPerPage);
        }

        // Reset pagination to the first page.
        if (typeof onPageChange === "function") {
            onPageChange(1);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                width: "100%",
                mt: 2,
                px: { xs: 1, sm: 2 },
                py: 2,
                borderTop: "1px solid",
                borderColor: "divider"
            }}
        >
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
            >
                {/* ========================================= */}
                {/* DISPLAY RANGE */}
                {/* ========================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        textAlign: { xs: "center", md: "left" }
                    }}
                >
                    Showing{" "}
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 700,
                            color: "text.primary"
                        }}
                    >
                        {startItem}–{endItem}
                    </Box>
                    {" "}of{" "}
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 700,
                            color: "text.primary"
                        }}
                    >
                        {safeTotalItems}
                    </Box>
                    {" "}supplier contacts
                </Typography>

                {/* ========================================= */}
                {/* PAGINATION CONTROLS */}
                {/* ========================================= */}

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    flexWrap="wrap"
                >
                    {/* ROWS PER PAGE */}

                    <FormControl
                        size="small"
                        sx={{ minWidth: 110 }}
                    >
                        <InputLabel id="supplier-contact-rows-label">
                            Rows
                        </InputLabel>

                        <Select
                            labelId="supplier-contact-rows-label"
                            id="supplier-contact-rows"
                            value={safeRowsPerPage}
                            label="Rows"
                            onChange={handleRowsPerPageChange}
                            disabled={loading}
                        >
                            {rowsPerPageOptions.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}
                                >
                                    {option} / page
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* PAGE NAVIGATION */}

                    <Pagination
                        count={totalPages}
                        page={Math.min(safePage, totalPages)}
                        onChange={handlePageChange}
                        disabled={loading || safeTotalItems === 0}
                        color="primary"
                        shape="rounded"
                        size="medium"
                        showFirstButton
                        showLastButton
                    />
                </Stack>
            </Stack>
        </Box>
    );
};

export default SupplierContactPagination;

