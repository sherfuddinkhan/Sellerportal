import React from "react";

import {
    Box,
    Pagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";


// =========================================================
// StockLedgerPagination
// =========================================================

const StockLedgerPagination = ({
    page = 1,
    totalPages = 1,
    pageSize = 10,
    totalRecords = 0,
    onPageChange,
    onPageSizeChange,
}) => {

    const pageSizes = [5, 10, 25, 50, 100];


    // =========================================================
    // PAGE CHANGE
    // =========================================================

    const handlePageChange = (event, value) => {

        if (onPageChange) {
            onPageChange(value);
        }

    };


    // =========================================================
    // PAGE SIZE CHANGE
    // =========================================================

    const handlePageSizeChange = (event) => {

        const newPageSize = Number(event.target.value);

        if (onPageSizeChange) {
            onPageSizeChange(newPageSize);
        }

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            className="stock-ledger-pagination"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 3,
                width: "100%",
            }}
        >

            {/* =====================================================
                TOTAL RECORDS
            ===================================================== */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Records: {totalRecords}
            </Typography>


            {/* =====================================================
                PAGINATION
            ===================================================== */}

            <Pagination
                count={Math.max(totalPages, 1)}
                page={Math.max(page, 1)}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
            />


            {/* =====================================================
                PAGE SIZE
            ===================================================== */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 100,
                }}
            >

                <InputLabel id="stock-ledger-rows-label">
                    Rows
                </InputLabel>

                <Select
                    labelId="stock-ledger-rows-label"
                    value={pageSize}
                    label="Rows"
                    onChange={handlePageSizeChange}
                >

                    {pageSizes.map((size) => (
                        <MenuItem
                            key={size}
                            value={size}
                        >
                            {size}
                        </MenuItem>
                    ))}

                </Select>

            </FormControl>

        </Box>
    );
};


export default StockLedgerPagination;
