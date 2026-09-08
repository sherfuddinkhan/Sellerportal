// =========================================================
// MarketplaceOrderPagination.jsx
// =========================================================

import React from "react";

import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Typography
} from "@mui/material";


const MarketplaceOrderPagination = ({
    page = 1,
    rowsPerPage = 10,
    totalItems = 0,
    onPageChange,
    onRowsPerPageChange
}) => {

    // =====================================================
    // CALCULATE TOTAL PAGES
    // =====================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalItems / rowsPerPage
            )
        );


    // =====================================================
    // HANDLE PAGE CHANGE
    // =====================================================

    const handlePageChange = (
        event,
        newPage
    ) => {

        if (onPageChange) {
            onPageChange(newPage);
        }
    };


    // =====================================================
    // HANDLE ROWS PER PAGE
    // =====================================================

    const handleRowsPerPageChange = (
        event
    ) => {

        const newRowsPerPage =
            Number(event.target.value);


        if (onRowsPerPageChange) {
            onRowsPerPageChange(
                newRowsPerPage
            );
        }
    };


    // =====================================================
    // DISPLAY RANGE
    // =====================================================

    const startItem =
        totalItems === 0
            ? 0
            : (page - 1) *
                rowsPerPage +
                1;


    const endItem =
        totalItems === 0
            ? 0
            : Math.min(
                page * rowsPerPage,
                totalItems
            );


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                mt: 3,
                px: 1,
                py: 2
            }}
        >

            {/* =================================================
                ITEM COUNT
            ================================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                {totalItems === 0
                    ? "No orders"
                    : `Showing ${startItem}-${endItem} of ${totalItems} orders`}
            </Typography>


            {/* =================================================
                PAGINATION
            ================================================= */}

            <Pagination
                count={totalPages}
                page={Math.min(
                    page,
                    totalPages
                )}
                onChange={
                    handlePageChange
                }
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                disabled={
                    totalItems === 0
                }
            />


            {/* =================================================
                ROWS PER PAGE
            ================================================= */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 120
                }}
            >

                <InputLabel>
                    Per Page
                </InputLabel>


                <Select
                    value={rowsPerPage}
                    label="Per Page"
                    onChange={
                        handleRowsPerPageChange
                    }
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

        </Box>
    );
};


export default MarketplaceOrderPagination;

