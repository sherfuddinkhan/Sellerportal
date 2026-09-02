// =========================================================
// ProductPricePagination.jsx
// =========================================================

import React from "react";

import {
    Box,
    Pagination,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Stack,
} from "@mui/material";

// =========================================================
// Product Price Pagination
// =========================================================

const ProductPricePagination = ({
    page = 1,
    totalPages = 0,
    pageSize = 15,
    onPageChange,
    onPageSizeChange,
    totalRecords = 0,
}) => {

    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange = (event, value) => {
        if (onPageChange) {
            onPageChange(value);
        }
    };

    // =====================================================
    // PAGE SIZE CHANGE
    // =====================================================

    const handlePageSizeChange = (event) => {
        const newPageSize = Number(event.target.value);

        if (onPageSizeChange) {
            onPageSizeChange(newPageSize);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                mt: 3,
                px: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
            }}
        >

            {/* =================================================
                TOTAL RECORDS
            ================================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >
                Total Records: <b>{totalRecords}</b>
            </Typography>


            {/* =================================================
                PAGINATION CONTROLS
            ================================================= */}

            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
            >

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Rows Per Page
                </Typography>


                {/* =================================================
                    PAGE SIZE
                ================================================= */}

                <FormControl
                    size="small"
                    sx={{
                        minWidth: 80,
                    }}
                >
                    <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >

                        <MenuItem value={5}>
                            5
                        </MenuItem>

                        <MenuItem value={10}>
                            10
                        </MenuItem>

                        <MenuItem value={15}>
                            15
                        </MenuItem>

                        <MenuItem value={20}>
                            20
                        </MenuItem>

                        <MenuItem value={50}>
                            50
                        </MenuItem>

                        <MenuItem value={100}>
                            100
                        </MenuItem>

                    </Select>
                </FormControl>


                {/* =================================================
                    PAGE NAVIGATION
                ================================================= */}

                <Pagination
                    color="primary"
                    page={totalPages > 0 ? page : 1}
                    count={totalPages}
                    onChange={handlePageChange}
                    disabled={totalPages <= 1}
                    showFirstButton
                    showLastButton
                />

            </Stack>

        </Box>
    );
};

export default ProductPricePagination;
