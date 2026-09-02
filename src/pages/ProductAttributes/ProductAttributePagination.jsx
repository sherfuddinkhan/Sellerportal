// =========================================================
// ProductAttributePagination.jsx
// Product Attribute Pagination
// =========================================================

import React from "react";

import {
    Box,
    Pagination,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Stack
} from "@mui/material";


// =========================================================
// COMPONENT
// =========================================================

const ProductAttributePagination = ({
    page,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
    totalRecords
}) => {

    // =====================================================
    // HANDLE PAGE CHANGE
    // =====================================================

    const handlePageChange = (event, value) => {

        onPageChange(value);
    };


    // =====================================================
    // HANDLE PAGE SIZE CHANGE
    // =====================================================

    const handlePageSizeChange = (event) => {

        const size =
            Number(event.target.value);

        onPageSizeChange(size);
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Box
            sx={{
                mt: 3,

                display: "flex",

                justifyContent:
                    "space-between",

                alignItems:
                    "center",

                flexWrap:
                    "wrap",

                gap: 2
            }}
        >

            {/* =================================================
                TOTAL RECORDS
            ================================================= */}

            <Typography
                variant="body2"
                color="text.secondary"
            >

                Total Records:{" "}

                <Box
                    component="span"
                    sx={{
                        fontWeight: 700
                    }}
                >
                    {totalRecords}
                </Box>

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

                {/* =============================================
                    ROWS PER PAGE
                ============================================= */}

                <Typography
                    variant="body2"
                >
                    Rows Per Page
                </Typography>


                <FormControl
                    size="small"
                >

                    <Select
                        value={pageSize}
                        onChange={
                            handlePageSizeChange
                        }
                        inputProps={{
                            "aria-label":
                                "Rows per page"
                        }}
                    >

                        <MenuItem value={5}>
                            5
                        </MenuItem>

                        <MenuItem value={10}>
                            10
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


                {/* =============================================
                    PAGE NAVIGATION
                ============================================= */}

                <Pagination

                    color="primary"

                    page={
                        page > 0
                            ? page
                            : 1
                    }

                    count={
                        totalPages > 0
                            ? totalPages
                            : 1
                    }

                    onChange={
                        handlePageChange
                    }

                    showFirstButton

                    showLastButton

                />

            </Stack>

        </Box>
    );
};


export default ProductAttributePagination;
