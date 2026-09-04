import React from "react";

import {
    Box,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography
} from "@mui/material";

// =========================================================
// SALES ORDER ITEM PAGINATION
// =========================================================

const SalesOrderItemPagination = ({
    page = 1,
    totalPages = 1,
    pageSize = 10,
    totalRecords = 0,
    onPageChange,
    onPageSizeChange
}) => {

    // =====================================================
    // CALCULATE RECORD RANGE
    // =====================================================

    const startRecord =
        totalRecords === 0
            ? 0
            : (page - 1) * pageSize + 1;

    const endRecord =
        Math.min(
            page * pageSize,
            totalRecords
        );

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (_, value) => {

        if (onPageChange) {

            onPageChange(value);

        }

    };

    // =====================================================
    // PAGE SIZE CHANGE
    // =====================================================

    const handlePageSizeChange = (event) => {

        const newPageSize =
            Number(event.target.value);

        if (onPageSizeChange) {

            onPageSizeChange(newPageSize);

        }

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            className="sales-order-item-pagination"
            sx={{
                mt: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2
            }}
        >

            {/* ============================================
                RECORD INFORMATION
            ============================================ */}

            <Typography
                variant="body2"
                color="text.secondary"
            >

                {totalRecords > 0
                    ? `Showing ${startRecord}-${endRecord} of ${totalRecords} records`
                    : "No records found"}

            </Typography>

            {/* ============================================
                PAGINATION CONTROLS
            ============================================ */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap"
                }}
            >

                {/* ========================================
                    PAGE SIZE
                ======================================== */}

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 120
                    }}
                >

                    <InputLabel id="sales-order-item-rows-label">
                        Rows
                    </InputLabel>

                    <Select
                        labelId="sales-order-item-rows-label"
                        value={pageSize}
                        label="Rows"
                        onChange={handlePageSizeChange}
                    >

                        <MenuItem value={5}>
                            5
                        </MenuItem>

                        <MenuItem value={10}>
                            10
                        </MenuItem>

                        <MenuItem value={25}>
                            25
                        </MenuItem>

                        <MenuItem value={50}>
                            50
                        </MenuItem>

                        <MenuItem value={100}>
                            100
                        </MenuItem>

                    </Select>

                </FormControl>

                {/* ========================================
                    PAGINATION
                ======================================== */}

                <Pagination
                    page={page}
                    count={Math.max(totalPages, 1)}
                    color="primary"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                    onChange={handlePageChange}
                    disabled={totalRecords === 0}
                />

            </Box>

        </Box>

    );

};

export default SalesOrderItemPagination;
